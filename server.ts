import express from 'express';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_TASKS } from './src/data/mockData';
import { Product, Task } from './src/types';

// Load environment variables
dotenv.config();

// In-memory databases for simulating live pricing updates
let products: Product[] = [...INITIAL_PRODUCTS];
let tasks: Task[] = [...INITIAL_TASKS];

// Initialize Google GenAI client
let hasGeminiKey = !!process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (hasGeminiKey) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('WARN: GEMINI_API_KEY is not defined. Falling back to heuristic/AI-simulated answers.');
}

function getLocalNetworkUrls(port: number): string[] {
  const urls: string[] = [];
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (entry.family === 'IPv4' && !entry.internal) {
        urls.push(`http://${entry.address}:${port}`);
      }
    }
  }

  return urls;
}

function startPublicTunnel(port: number) {
  const child = spawn(
    'npx',
    ['--yes', 'cloudflared', 'tunnel', '--protocol', 'http2', '--url', `http://127.0.0.1:${port}`],
    { shell: true, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }
  );

  let printed = false;
  const handleOutput = (data: Buffer) => {
    const match = data.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match && !printed) {
      printed = true;
      console.log('  외부 공유:  ' + match[0]);
      console.log('  (다른 사람에게 전달할 URL · 본인은 localhost 사용 권장)');
      console.log('  ※ 터미널을 닫으면 외부 URL도 함께 종료됩니다');
      console.log('========================================\n');
    }
  };

  child.stdout?.on('data', handleOutput);
  child.stderr?.on('data', handleOutput);

  child.on('error', (err) => {
    console.error('  터널 생성 실패:', err.message);
    console.log('  npx cloudflared tunnel --url http://localhost:' + port);
    console.log('========================================\n');
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isCloudDeploy = !!process.env.RENDER_EXTERNAL_URL || !!process.env.RAILWAY_PUBLIC_DOMAIN;

  app.use(express.json());

  // API 1: Get live product catalogs
  app.get('/api/products', (req, res) => {
    res.json(products);
  });

  // API 2: Update product price & recalculate positions
  app.post('/api/products/:id/price', (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
       res.status(404).json({ error: 'Product not found' });
       return;
    }

    const item = products[productIndex];
    item.myPrice = Number(price);

    // Recalculate status and estimated GMV based on competitive price matching
    if (item.myPrice < item.compPrice) {
      item.status = '가격 우위';
      item.gmvEst = Math.round(item.salesCount * item.myPrice * 1.35);
    } else if (item.myPrice === item.compPrice) {
      item.status = '최저가 유지';
      item.gmvEst = Math.round(item.salesCount * item.myPrice * 1.15);
    } else {
      item.status = '경쟁 밀림';
      item.gmvEst = Math.round(item.salesCount * item.myPrice * 0.45);
    }

    res.json(item);
  });

  // API 3: Optimize prices automatic matching
  app.post('/api/products/optimize-all', (req, res) => {
    products = products.map((item) => {
      // Set to match competitor lowest price exactly
      const oldPrice = item.myPrice;
      const targetPrice = item.compPrice;
      
      const updatedItem: Product = {
        ...item,
        myPrice: targetPrice,
        status: '최저가 유지' as const,
        gmvEst: Math.round(item.salesCount * targetPrice * 1.15)
      };
      return updatedItem;
    });

    res.json(products);
  });

  // API 4: Get strategic tasks
  app.get('/api/tasks', (req, res) => {
    res.json(tasks);
  });

  // API 5: Add a strategic task
  app.post('/api/tasks', (req, res) => {
    const { title, target, metric } = req.body;
    const newTask: Task = {
      id: `t${tasks.length + 1}`,
      title,
      target,
      metric,
      status: '그래프 생성 완료',
      date: new Date().toISOString().split('T')[0]
    };
    tasks.push(newTask);
    res.json(newTask);
  });

  // API 6: Strategic chat endpoint
  app.post('/api/chat', async (req, res) => {
    const { message, chatHistory } = req.body;

    if (!message) {
       res.status(400).json({ error: 'Message is required' });
       return;
    }

    // Build the system description anchored around current active catalog state
    const productSummaries = products.map((p) => 
      `- [${p.rank}] ${p.name}: 내 판매가 ₩${p.myPrice.toLocaleString()} VS 경쟁가 ₩${p.compPrice.toLocaleString()} -> 상태 [${p.status}], 추정 GMV: ₩${p.gmvEst.toLocaleString()}`
    ).join('\n');

    const systemInstruction = `You are Gmarket PriceQ, Gmarket's premium, institutional AI pricing assistant and business intelligence analyst.
Your target audience is an e-commerce seller who wants data-driven suggestions on how to maximize revenue (GMV) and maintain competitive prices.
Translate complex analytical data into crisp, highly strategic Korean business advice.

Current store inventory catalog state:
${productSummaries}

Specific rule for queries:
1. When the user asks "이번 5월 BSD에서 가장 잘 팔린 상품 리스트 100개와 가격 그리고 GMV 알려줘." or mentions "5월 BSD 실적", you MUST give a clear breakdown of the top 3 items:
   - Rank 01: Ultra-Light Mesh Runner Pro 2 (Price: ₩129,000, Est. GMV: ₩842.5M)
   - Rank 02: Tech-Series Wireless Earbuds X (Price: ₩89,000, Est. GMV: ₩615.2M)
   - Rank 03: Ergo-Comfort Workspace Chair (Price: ₩245,000, Est. GMV: ₩588.1M)
   Write a professional analytical text in Korean first, then offer a "Download Full List (CSV)" button or describe how it can be downloaded. Give brief strategic insights regarding these items (e.g., Ultra-Light Runner has a ₩5,000 price advantage which drove high conversion!). Recommend checking the Visualized Report on the Dashboard.

2. When the user asks for "대시보드에서 그래프로 볼 수 있게 해줘." (Show it as a graph on the dashboard), reply warmly that:
   - You have created a visualized report task under the title "BSD 실적 분석 시각화 리포트 생성".
   - Confirm status is "그래프 생성 완료" (Graph completed).
   - Advise them to click the "대시보드 메뉴로 이동" (Go to Dashboard) action to view the beautiful interactive graphs.

3. When the user asks "지금 라이브 중인 나의 상품 중에서 GMV 상위 10개 상품 알려줘." or mentions "라이브 상품 GMV 상위 10개", give a breakdown of the top live items highlighting Rank 01 ("울트라 가벼운 맥북 에어 파우치 13인치") with ₩12,450,000 GMV maintaining minimum lowest price, and Rank 02 ("고해상도 C-Type 허브 7-in-1") with ₩8,920,000 GMV which is currently "경쟁 밀림" (Competitor price is lower: ₩42,800). Suggest matching the lowest competitor rates immediately.

4. When the user asks "타사 최저가를 맞춰야 하는 상품 리스트 전달해줘" or "최저가 매칭", explain that there are competitive risks in "경쟁 밀림" items (like C-Type Hub, Card Wallet, Action Cam, Yoga Mat). Recommend clicking the "최저가 자동 최적화" button or matching their specific lowest prices on the Price Management panel.

Be professional, structured with clean Markdown, and highly pragmatic. Avoid flowery self-praise. Use bullet points.`;

    if (ai) {
      try {
        console.log(`Sending message to Gemini 3.5 Flash: ${message}`);
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: message,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });

        res.json({ text: response.text });
      } catch (err: any) {
        console.error('Gemini API Error:', err);
        res.status(500).json({ 
          error: 'Gemini API Error occurred.', 
          details: err.message,
          fallback: true
        });
      }
    } else {
      // Fallback AI simulation if API key is not present or failed
      setTimeout(() => {
        let text = '';
        if (message.includes('5월 BSD') || message.includes('실적') || message.includes('상위 100개')) {
          text = `네, 5월 BSD 실적을 분석하여 상위 100개 상품 리스트를 추출했습니다. 주요 지표 요약은 다음과 같습니다.

특히 **Ultra-Light Mesh Runner Pro 2** 상품은 경쟁사 대비 ₩5,000의 가격 우위(₩129,000)를 기반으로 고전환을 기록하며 총 ₩842.5M의 압도적인 GMV를 달성했습니다.

아래 표 분석을 통해 상세 판매 현황을 확인하실 수 있습니다. 데이터의 시각적인 상세 분석이 필요한 경우, 언제든지 대시보드 시각화 생성을 요청해주세요.`;
        } else if (message.includes('대시보드') || message.includes('그래프')) {
          text = `네, 요청하신 대시보드 시각화 리포트 작성을 완료했습니다. 

**[BSD 실적 분석 시각화 리포트 생성]**
* **분석 대상:** 상위 100개 제품 실적 및 GMV 분포
* **추출 지표:** 제품별 평균 단가 대비 GMV 매트릭스
* **처리 결과:** 그래프 생성 완료 

아래 '대시보드 메뉴로 이동' 버튼을 통해 새로 생성된 실적 시각화 리포트와 분석 그래프를 바로 확인해보세요.`;
        } else if (message.includes('라이브') || message.includes('나의 상품') || message.includes('GMV 상위 10개')) {
          text = `현재 라이브 중인 상품의 최근 24시간 GMV 기준 상위 10개 리스트를 추출해드렸습니다.

현재 **울트라 가벼운 맥북 에어 파우치 13인치** 제품은 ₩12,450,000의 실적을 올리며 최저가 방어에 성공(최저가 유지) 중입니다. 반면, **고해상도 C-Type 허브 7-in-1**의 경우 경쟁사가 ₩42,800으로 가격을 낮춤에 따라 '경쟁 밀림' 상태가 되었으며, 단기 전환율 하락이 관찰됩니다.

이외에 경쟁사 가격 변동에 따른 긴급 조치가 필요한 상품이 4종 더 식별되었습니다.`;
        } else {
          text = `안녕하세요! Gmarket PriceQ AI 분석 엔진입니다. 

현재 귀하의 스토어에서 판매 중인 총 ${products.length}개의 라이브 상품을 모니터링 중입니다. 
- **최저가 유지 상품:** ${products.filter(p => p.status === '최저가 유지').length}개
- **가격 우위 상품:** ${products.filter(p => p.status === '가격 우위').length}개
- **경쟁 밀림 상품:** ${products.filter(p => p.status === '경쟁 밀림').length}개 (즉시 가격 최적화 권장!)

어떤 전략적 의사결정을 도와드릴까요? "최근 GMV 상위 품목 분석", "타사 최저가 일치", "대시보드 시각화 기능" 등에 대해 물어보세요!`;
        }
        res.json({ text });
      }, 800);
    }
  });

  // Serve static assets in production, otherwise mount Vite in development
  if (process.env.NODE_ENV !== 'production') {
    // 터널(Cloudflare 등) 경유 요청도 Vite dev 서버가 처리하도록 Host 정규화
    app.use((req, _res, next) => {
      const host = req.headers.host ?? '';
      if (!host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
        req.headers.host = `localhost:${PORT}`;
        req.headers['x-forwarded-host'] = host;
      }
      next();
    });

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: true,
        allowedHosts: 'all',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n========================================');
    console.log('  Gmarket PriceQ 서버가 실행되었습니다');
    console.log('========================================');

    if (isCloudDeploy) {
      const publicUrl = process.env.RENDER_EXTERNAL_URL
        || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
      console.log(`  공개 URL:  ${publicUrl}`);
      console.log('  (문서에 이 주소를 넣으세요 · PC 꺼져도 접속 가능)');
    } else {
      console.log(`  내 PC:     http://localhost:${PORT}  ← 본인은 이 주소 사용`);

      const networkUrls = getLocalNetworkUrls(PORT);
      if (networkUrls.length > 0) {
        console.log('  같은 사내망:');
        networkUrls.forEach((url) => console.log(`             ${url}`));
        console.log('  ※ 이더넷/와이파이마다 IP가 다를 수 있습니다');
      }

      if (process.env.TUNNEL === 'true') {
        console.log('  외부 공유:  터널 생성 중...');
        startPublicTunnel(PORT);
      } else {
        console.log('  PC 종료 후에도 접속: 클라우드 배포 필요 (render.yaml 참고)');
      }
    }

    console.log('========================================\n');
  });
}

startServer();
