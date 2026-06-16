import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Mic, 
  Send, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  Bot
} from 'lucide-react';
import { ChatMessage, Product, Task } from '../types';

interface ChatViewProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function ChatView({
  chatHistory,
  setChatHistory,
  products,
  setProducts,
  activeTab,
  setActiveTab,
  setTasks,
}: ChatViewProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to let sellers see incoming live strategic comments
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const quickActionQuestions = [
    '최근 GMV 상위 품목 분석해줘',
    '이번 5월 BSD에서 가장 잘 팔린 상품 리스트 100개와 가격 그리고 GMV 알려줘.',
    '대시보드에서 그래프로 볼 수 있게 해줘.',
    '지금 라이브 중인 나의 상품 중에서 GMV 상위 10개 상품 알려줘.',
    '타사 최저가를 맞춰야 하는 상품 리스트 전달해줘'
  ];

 // Primary messaging function to talk with server-side proxy
// Primary messaging function to talk with server-side proxy
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Append user's text message
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}-user`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      let serverText = '';
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend, chatHistory: chatHistory }),
        });
        const data = await response.json();
        serverText = data.text;
      } catch (e) {
        console.log("Mocking mode active");
      }
      
      let dynamicAiText = serverText || '요청하신 데이터를 분석 중입니다.';
      const upperText = textToSend.toUpperCase();

      // [1. AI 본문 텍스트 풍성하게 확장]
      if (upperText.includes('5월 BSD') || upperText.includes('5월BSD') || upperText.includes('상위 100개')) {
        dynamicAiText = '지난 5월 Gmarket Big Smile Day(BSD) 프로모션 기간 동안 발생한 매출(GMV) 기여도 상위 품목 리스트를 정밀 분석한 결과입니다.\n\n해당 기간 동안 가전/디지털 카테고리의 일부 주력 품목이 최저가 가중치 스코어를 획득하며 전월 대비 매출이 평균 34% 증가했습니다. 검색 상위 노출 필터 점수가 안정적으로 확보되었던 구간입니다. 상세 매출 내역은 아래 분석 표를 참고해 주시기 바랍니다.';
      } 
      else if (upperText.includes('라이브') || upperText.includes('상위 10개')) {
        dynamicAiText = '현재 스토어에서 실시간으로 연동되어 판매 중인 라이브 상품 중에서 GMV 지표가 가장 높은 상위 품목 현황입니다.\n\n전반적으로 안정적인 매출 흐름을 유지하고 있으나, 현재 일부 오픈마켓 채널에서 파격 세일을 진행함에 따라 2번 상품(고해상도 C-Type 허브)의 경우 실시간 검색 점유 지표가 둔화되고 있어 모니터링이 시급합니다.';
      } 
      else if (upperText.includes('대시보드') || upperText.includes('그래프')) {
        dynamicAiText = '요청하신 대시보드 시각화 연동을 완벽히 접수했습니다!\n\n과거 BSD 실적 트렌드 및 주력 SKU의 가격 변동 추이를 한눈에 직관적으로 파악하실 수 있도록 시각화 리포트 생성 작업을 시스템 스케줄러에 최우선 할당했습니다. 대시보드 빌드가 즉시 완료되었으니, 아래 바로가기 버튼을 통해 이동하여 입체적인 그래프 분석 환경을 활용해 보세요.';
      } 
      else if (upperText.includes('최저가') || upperText.includes('경쟁사') || upperText.includes('가격 경쟁')) {
        dynamicAiText = '현재 타사 오픈마켓 채널 대비 Gmarket 판매 가격 경쟁력이 밀리고 있는 위험군 상품 목록을 정밀 필터링했습니다.\n\n해당 상품들은 타사의 기습 가격 인하로 인해 현재 Gmarket 검색 랭킹 점수가 하락할 위험이 존재합니다. 자사 기준 안전 마진 한계선 내에서 타사 가격과 동등 매칭하거나, 추가 할인을 전개하여 유입 트래픽을 긴급히 선점하는 전략을 권장합니다.';
      } 
      else if (upperText.includes('마진') || upperText.includes('수수료') || upperText.includes('원가')) {
        dynamicAiText = '현재 등록된 전체 상품군의 평균 정산 마진율은 Gmarket 카테고리별 표준 수수료 및 배송 완충 비용을 제외하고 약 22.4%로 탄탄하게 집계됩니다.\n\n다만 아래 표에 정리된 일부 디지털 부속품 군의 경우 현재 공급 원가 상승 압박이 있어, 추가로 3% 이상 단가를 인하할 경우 한계 마진 마지노선을 이탈하여 적자 구간에 진입할 위험이 있습니다. 가격 조정 시 아래 시뮬레이션 데이터를 필수 확인하십시오.';
      }
      else if (upperText.includes('추천') || upperText.includes('소싱') || upperText.includes('잘 팔릴')) {
        dynamicAiText = '최근 오픈마켓 통합 검색 쿼리 및 소셜 커머스 소비 트렌드 빅데이터를 교차 분석한 결과입니다.\n\n다음 주부터 계절성 요인이 강한 [여름 시즌 리빙 기획 특가 상품] 및 고마진 [디지털/가전 부속 스크린 팩]의 글로벌 수요가 약 2.5배 급증할 것으로 예측됩니다. 현재 경쟁사들의 재고가 일시적으로 품절되거나 단가가 높아진 틈새 영역을 선점할 수 있도록 고효율 소싱 후보군을 추천해 드립니다.';
      }
      else if (upperText.includes('광고') || upperText.includes('노출') || upperText.includes('순위')) {
        dynamicAiText = '셀러님의 스토어 주력 핵심 상품군의 Gmarket 모바일/PC 검색 엔진 노출 순위 변동 모니터링 리포트입니다.\n\n현재 일부 카테고리에서 경쟁 타사가 검색 키워드 광고 입찰가를 공격적으로 인상했거나, 가격 비교 매칭 점수에서 밀려 전일 대비 순위가 하락한 위험 항목이 포착되었습니다. 검색 첫 페이지 노출 가독성을 복구하기 위한 즉각적인 입찰가 최적화 및 랭킹 부스팅 광고 연동 시나리오를 제안합니다.';
      }
      // ➕ 가격 조정 키워드 감지 시 안내 문구
      else if (upperText.includes('가격 조정') || upperText.includes('가격조정') || upperText.includes('가격 고치고') || upperText.includes('가격 수정')) {
        dynamicAiText = '알겠습니다! 확인된 가격 경쟁력 밀림 위험 상품 및 마진 우수 상품군의 단가 최적화 이행 작업을 스케줄러에 등록했습니다.\n\n한 번의 클릭으로 스마트 스토어 및 마켓 가격을 일괄 매칭할 수 있는 툴을 활성화합니다. 아래 Task 생성 요약을 확인하신 후, 가격 관리(Price Management) 전용 메뉴 페이지로 즉시 이동하십시오.';
      }
      else if (upperText.includes('안녕') || upperText.includes('HI') || upperText.includes('ㅎㅇ')) {
        dynamicAiText = '안녕하세요! Gmarket 판매 전략 파트너 PriceQ AI 분석 엔진입니다. 🖐️\n\n실시간 오픈마켓 최저가 트래픽 수집, 마진율 시뮬레이션, GMV 성과 리포트 분석 등 원하시는 셀러 대응 전략을 척척 도와드릴 수 있습니다. 하단의 추천 질문을 클릭하시거나 궁금한 상품 현황을 입력해 주세요!';
      }
      else {
        dynamicAiText = `문의하신 "${textToSend}" 영역에 대한 실시간 마켓 인텔리전스 데이터 분석 결과입니다.\n\n현재 카테고리 내 경쟁 밀림 현상을 선제 방어하고 클릭 점유율 지표를 우상향하기 위해, 왼쪽 메뉴의 'PriceQ Recommendation(추천 가격 방)' 메뉴로 이동하셔서 AI가 실시간으로 설계한 최적 제안 단가 카드를 검토 및 즉시 적용해 보시는 것을 강력히 권장합니다.`;
      }
      
      const assistantMsg: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        role: 'assistant',
        text: dynamicAiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // [2. 답변 조건에 맞춰 표(Table) 데이터와 추천 액션 버튼 연결]
      if (upperText.includes('5월 BSD') || upperText.includes('5월BSD') || upperText.includes('상위 100개')) {
        assistantMsg.tableData = [
          { rank: '01', name: 'Ultra-Light Mesh Runner Pro 2', price: 129000, gmv: '₩842.5M', status: '가격 우위' },
          { rank: '02', name: 'Tech-Series Wireless Earbuds X', price: 89000, gmv: '₩615.2M', status: '최저가 유지' },
          { rank: '03', name: 'Ergo-Comfort Workspace Chair', price: 245000, gmv: '₩588.1M', status: '가격 우위' },
        ];
        assistantMsg.suggestedActions = ['가격 조정하고 싶어', '대시보드에서 그래프로 볼 수 있게 해줘.'];
      } 
      else if (upperText.includes('라이브') || upperText.includes('상위 10개')) {
        assistantMsg.tableData = [
          { rank: '1', name: '울트라 가벼운 맥북 에어 파우치 13인치', price: 24900, gmv: '₩12,450,000', status: '최저가 유지' },
          { rank: '2', name: '고해상도 C-Type 허브 7-in-1', price: 45000, gmv: '₩8,920,000', status: '경쟁 밀림' },
          { rank: '3', name: '시그니처 미니 무선 키보드 K4', price: 39800, gmv: '₩5,110,000', status: '가격 우위' },
        ];
        assistantMsg.suggestedActions = ['가격 조정하고 싶어', '이 상품들 마진 분석해줘'];
      } 
      else if (upperText.includes('최저가') || upperText.includes('경쟁사') || upperText.includes('가격 경쟁')) {
        assistantMsg.tableData = [
          { rank: '⚠️ 밀림', name: '고해상도 C-Type 허브 7-in-1 (현재가 ₩45,000 / 타사 최저가 ₩39,800)', price: 39800, gmv: '손실 위험 고', status: '경쟁 밀림' },
          { rank: '⚠️ 경보', name: '익스트림 액션캠 4K 프리미엄 (현재가 ₩159,000 / 타사 최저가 ₩145,000)', price: 145000, gmv: '이탈률 24%', status: '경쟁 밀림' },
        ];
        assistantMsg.suggestedActions = ['가격 조정하고 싶어'];
      }
      else if (upperText.includes('마진') || upperText.includes('수수료') || upperText.includes('원가')) {
        assistantMsg.tableData = [
          { rank: '우수', name: 'Ergo-Comfort Workspace Chair (원가: ₩130,000)', price: 245000, gmv: '마진율 41.2%', status: '가격 우위' },
          { rank: '안정', name: 'Ultra-Light Mesh Runner Pro 2 (원가: ₩85,000)', price: 129000, gmv: '마진율 27.5%', status: '가격 우위' },
          { rank: '위험', name: '고해상도 C-Type 허브 7-in-1 (원가: ₩35,000)', price: 45000, gmv: '한계마진 8.4%', status: '경쟁 밀림' },
        ];
        assistantMsg.suggestedActions = ['가격 조정하고 싶어', '요즘 어떤 아이템 소싱하는 게 좋아?'];
      }
      else if (upperText.includes('추천') || upperText.includes('소싱') || upperText.includes('잘 팔릴')) {
        assistantMsg.tableData = [
          { rank: '추천 1', name: '[소싱 후보] 아이스 아쿠아 쿨링 시트 (여름 시즌 가전)', price: 19800, gmv: '예상 마진 35%', status: '수요 급증' },
          { rank: '추천 2', name: '[소싱 후보] 프리미엄 논글레어 모니터 보호 필름', price: 12500, gmv: '예상 마진 48%', status: '틈새 블루오션' },
        ];
        assistantMsg.suggestedActions = ['이 상품들 마진 분석해줘', '가격 조정하고 싶어'];
      }
      else if (upperText.includes('광고') || upperText.includes('노출') || upperText.includes('순위')) {
        assistantMsg.tableData = [
          { rank: 'DOWN', name: '고해상도 C-Type 허브 7-in-1 (모바일 검색 기준)', price: 45000, gmv: '4계단 하락(8위)', status: '경쟁 밀림' },
          { rank: 'KEEP', name: 'Ultra-Light Mesh Runner Pro 2 (메인 키워드)', price: 129000, gmv: '1위 유지', status: '가격 우위' },
        ];
        assistantMsg.suggestedActions = ['가격 조정하고 싶어', '대시보드에서 그래프로 볼 수 있게 해줘.'];
      }
      
      // [3. 태스크 생성 및 메뉴 자동 탭 이동 분기]
      if (upperText.includes('가격 조정') || upperText.includes('가격조정') || upperText.includes('가격 고치고') || upperText.includes('가격 수정')) {
        const newTrackTask: Task = {
          id: `t-${Date.now()}`,
          title: '위험군 및 최적화 품목 원클릭 가격 매칭 이행',
          target: 'Gmarket Live Products',
          metric: 'Competitor Equal Matching',
          status: '스케줄러 할당 완료',
          date: new Date().toISOString().split('T')[0],
        };

        try {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTrackTask),
          });
        } catch(e){}

        setTasks((prev) => {
          const filtered = prev.filter((t) => t.title !== '위험군 및 최적화 품목 원클릭 가격 매칭 이행');
          return [newTrackTask, ...filtered];
        });

        // 카드 생성 및 1.5초 후 가격 관리 탭으로 화면 강제 연동
        assistantMsg.task = newTrackTask;
        
        setTimeout(() => {
          setActiveTab('price-management');
        }, 1500);
      }
      else if (upperText.includes('대시보드') || upperText.includes('그래프')) {
        const newTrackTask: Task = {
          id: `t-${Date.now()}`,
          title: 'BSD 실적 분석 시각화 리포트 생성',
          target: 'Top 100 Products',
          metric: 'GMV & Price Trend',
          status: '그래프 생성 완료',
          date: new Date().toISOString().split('T')[0],
        };

        try {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTrackTask),
          });
        } catch(e){}

        setTasks((prev) => {
          const filtered = prev.filter((t) => t.title !== 'BSD 실적 분석 시각화 리포트 생성');
          return [newTrackTask, ...filtered];
        });

        assistantMsg.task = newTrackTask;
      }

      setChatHistory((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const assistantMsg: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        role: 'assistant',
        text: '죄송합니다. 처리 중 에러가 발생했습니다. 모킹된 데이터베이스 분석 결과를 대신 반환합니다.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

      // [테이블 및 태스크 UI 컴포넌트 매칭 영역]
      if (upperText.includes('5월 BSD') || upperText.

  // Real CSV Download trigger handler
  const handleDownloadCSV = (tableData: any[], filename: string) => {
    const headers = ['Rank', 'Product Name', 'Price (KRW)', 'GMV (Est.)'];
    const rows = tableData.map((item) => [
      item.rank,
      `"${item.name.replace(/"/g, '""')}"`,
      item.price,
      item.gmv,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\ufeff' + 
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white relative">
      
      {/* Scrollable Chat Message Canvas */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-36 space-y-8 select-text w-full">
        {chatHistory.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-4 w-full ${isUser ? 'justify-end' : ''}`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-150">
                  <Bot className="w-5 h-5 text-[#32B33A]" />
                </div>
              )}

              <div className={`flex flex-col gap-3 ${isUser ? 'max-w-[55%] min-w-0' : 'flex-1 min-w-0 w-full'}`}>
                {/* Standard Message Card */}
                <div
                  className={`p-6 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-[#32B33A] text-white rounded-tr-none font-medium'
                      : 'border-l-[3.5px] border-[#32B33A] bg-gray-50 text-gray-700 rounded-tl-none border-y border-r border-gray-150'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                </div>

                {/* If AI generates an analytical list table */}
                {!isUser && msg.tableData && (
                  <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-5 py-3 w-16 text-center font-bold">Rank</th>
                          <th className="px-4 py-3 font-semibold">Product Name</th>
                          <th className="px-4 py-3 font-semibold text-right">Price</th>
                          <th className="px-4 py-3 font-semibold text-right">GMV (Est.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {msg.tableData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50/70">
                            <td className="px-5 py-4 text-center font-bold text-gray-800">{row.rank}</td>
                            <td className="px-4 py-4 font-semibold text-gray-600">{row.name}</td>
                            <td className="px-4 py-4 text-right font-bold text-gray-800">₩{row.price.toLocaleString()}</td>
                            <td className="px-4 py-4 text-right font-black text-[#32B33A]">₩{row.gmv}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      onClick={() => handleDownloadCSV(msg.tableData!, 'priceq-analysis-report.csv')}
                      className="w-full py-3.5 text-[#32B33A] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-green-50 border-t border-gray-150 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Full List (CSV)
                    </button>
                  </div>
                )}

                {/* Loading status card and redirection prompt for chart assignments */}
                {!isUser && msg.task && (
                  <div className="max-w-md bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-150">
                    <div className="bg-[#32B33A] px-5 py-2.5 flex justify-between items-center">
                      <span className="text-white font-bold text-xs uppercase tracking-wider">Analytics Task Assigned</span>
                      <span className="bg-white/20 text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold">Real-time</span>
                    </div>
                    <div className="p-5 space-y-4">
                      <h3 className="font-bold text-gray-800 text-sm">{msg.task.title}</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Target</span>
                          <span className="font-semibold text-gray-600">{msg.task.target}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Metric</span>
                          <span className="font-semibold text-gray-600">{msg.task.metric}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Status</span>
                          <span className="font-bold text-[#32B33A] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#32B33A]" />
                            {msg.task.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="w-full py-2.5 bg-gray-50 hover:bg-[#32B33A] hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all text-gray-700 border border-gray-150"
                      >
                        Go to Dashboard Menu
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Floating helpful action suggestions */}
                {!isUser && msg.suggestedActions && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.suggestedActions.map((action, actionId) => (
                      <button
                        key={actionId}
                        onClick={() => handleSendMessage(action)}
                        className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#32B33A] hover:text-[#32B33A] transition-all bg-white shadow-sm"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Loading indicator matching screenshots */}
        {isLoading && (
          <div className="flex items-start gap-4 w-full">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 animate-pulse border border-gray-150">
              <Bot className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-6 rounded-3xl rounded-tl-none border-l-[3.5px] border-[#32B33A] bg-gray-50 shadow-sm flex items-center gap-3 w-xl border border-gray-150">
              <span className="w-2.5 h-2.5 bg-[#32B33A] rounded-full animate-ping" />
              <p className="text-sm text-gray-500 font-semibold italic">작업을 할당하여 그래프 및 분석 결과를 생성 중입니다...</p>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Floating Input Panel area */}
      <div className="px-6 md:px-8 pb-6 bg-transparent absolute bottom-0 left-0 right-0 w-full">
        <div className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="relative bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-200 rounded-full flex items-center px-6 py-3.5 gap-4"
          >
            <button
              type="button"
              onClick={() => alert('파일 첨부 기능: 상품 명세서나 ESM+ 정산 CSV 파일을 첨부하여 종합 분석을 요청하실 수 있습니다.')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400 text-gray-700 font-bold bg-transparent"
              placeholder="분석하고 싶은 상품 정보나 가격 전략을 물어보세요..."
              type="text"
              disabled={isLoading}
            />

            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => alert('음성 인식 마이크를 켭니다.')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="bg-[#32B33A] text-white w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-sm"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
          
          <p className="text-center text-[11px] text-gray-400 mt-3 tracking-tight font-medium">
            PriceQ AI는 실시간 마켓 데이터를 바탕으로 최적의 전략을 제안하지만, 최종 가격 결정 책임은 판매자에게 있습니다.
          </p>
        </div>
      </div>

    </div>
  );
}
