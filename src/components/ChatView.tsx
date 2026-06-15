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
      // 🛠️ 여기서부터 복사해서 try { ... } 내부에 붙여넣으세요!
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, chatHistory: chatHistory }),
      });

      const data = await response.json();
      
      // [해결 핵심] 사용자의 질문 키워드에 따라 AI의 답변 텍스트를 다이나믹하게 변경
      let dynamicAiText = data.text || '요청하신 데이터를 분석 중입니다.';

      if (textToSend.includes('5월 BSD') || textToSend.includes('상위 100개')) {
        dynamicAiText = '지난 5월 BSD 프로모션 기간 동안의 매출(GMV) 상위 품목 리스트입니다. 일부 가전 상품군이 가격 우위를 점하며 매출 성장을 견인했습니다. 상세 내역은 아래 표와 다운로드 파일을 참고하세요.';
      } else if (textToSend.includes('라이브') || textToSend.includes('상위 10개')) {
        dynamicAiText = '현재 스토어에서 실시간 판매(라이브) 중인 상품 중 GMV 스코어가 높은 상위 10개 품목군 현황입니다. 2번 상품의 경우 현재 경쟁사 특가로 인해 점유율이 둔화되고 있어 모니터링이 시급합니다.';
      } else if (textToSend.includes('대시보드') || textToSend.includes('그래프')) {
        dynamicAiText = '알겠습니다! 요청하신 BSD 실적 데이터를 시각화할 수 있도록 대시보드 리포트 생성 작업을 스케줄러에 할당했습니다. 작업이 완료되었으니 대시보드 메뉴로 이동해 확인해 보세요.';
      } else if (textToSend.includes('최저가') || textToSend.includes('경쟁사')) {
        dynamicAiText = '현재 타사 오픈마켓 대비 가격 경쟁력이 밀리고 있는 상품 목록을 추려냈습니다. 마진 확보가 가능한 안전선 내에서 즉시 최저가 맞춤을 전개하는 것을 추천합니다.';
      } else {
        dynamicAiText = `문의하신 "${textToSend}"에 대한 시장 데이터 분석 결과입니다. 현재 카테고리 내 점유율 유지를 위해 지속적인 가격 모니터링 룸 연동을 권장합니다.`;
      }
      
      const assistantMsg: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        role: 'assistant',
        text: dynamicAiText, // 👈 백엔드가 주는 고정값 대신 방금 만든 다이나믹 문구를 꽂음!
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // 테이블 및 태스크 생성 조건문 (기존에 있던 로직 그대로 유지)
      if (textToSend.includes('5월 BSD') || textToSend.includes('상위 100개')) {
        assistantMsg.tableData = [
          { rank: '01', name: 'Ultra-Light Mesh Runner Pro 2', price: 129000, gmv: '₩842.5M', status: '가격 우위' },
          { rank: '02', name: 'Tech-Series Wireless Earbuds X', price: 89000, gmv: '₩615.2M', status: '최저가 유지' },
          { rank: '03', name: 'Ergo-Comfort Workspace Chair', price: 245000, gmv: '₩588.1M', status: '가격 우위' },
        ];
        assistantMsg.suggestedActions = ['대시보드에서 그래프로 볼 수 있게 해줘.'];
      } else if (textToSend.includes('라이브') || textToSend.includes('상위 10개')) {
        assistantMsg.tableData = [
          { rank: '1', name: '울트라 가벼운 맥북 에어 파우치 13인치', price: 24900, gmv: '₩12,450,000', status: '최저가 유지' },
          { rank: '2', name: '고해상도 C-Type 허브 7-in-1', price: 45000, gmv: '₩8,920,000', status: '경쟁 밀림' },
        ];
        assistantMsg.suggestedActions = ['타사 최저가를 맞춰야 하는 상품 리스트 전달해줘'];
      } else if (textToSend.includes('대시보드') || textToSend.includes('그래프')) {
        const newTrackTask: Task = {
          id: `t-${Date.now()}`,
          title: 'BSD 실적 분석 시각화 리포트 생성',
          target: 'Top 100 Products',
          metric: 'GMV & Price Trend',
          status: '그래프 생성 완료',
          date: new Date().toISOString().split('T')[0],
        };

        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTrackTask),
        });

        setTasks((prev) => {
          const filtered = prev.filter((t) => t.title !== 'BSD 실적 분석 시각화 리포트 생성');
          return [newTrackTask, ...filtered];
        });

        assistantMsg.task = newTrackTask;
      }

      setChatHistory((prev) => [...prev, assistantMsg]);
    }
    } catch (err) {
      console.error(err);
      const assistantMsg: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        role: 'assistant',
        text: '죄송합니다. 네트워크 통신 오류 또는 Gemini API 엔진에 도달할 수 없습니다. 모킹된 데이터베이스 분석 결과를 대신 반환합니다.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

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
