import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  TrendingUp,
  Coins
} from 'lucide-react';
import { Product } from '../types';

// Deterministic, secure baseline lowest price calculator representing cost + minimum sustainable buffer (approx 8% margin retention)
const getOwnLowestPrice = (id: string, compPrice: number): number => {
  switch (id) {
    case 'p1': return 119000;
    case 'p2': return 79000;
    case 'p3': return 219000;
    case 'p4': return 21900;
    case 'p5': return 39800;
    case 'p6': return 17500;
    case 'p7': return 289000;
    case 'p8': return 139000;
    case 'p9': return 169000;
    case 'p10': return 29900;
    case 'p11': return 24900;
    default: return Math.round((compPrice * 0.9) / 100) * 100;
  }
};

interface PriceManagementViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function PriceManagementView({ products, setProducts }: PriceManagementViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [temporaryPrices, setTemporaryPrices] = useState<{ [key: string]: number }>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  // 💡 [추가] 현재 화면에 보여줄 상품 개수 상태 (기본 3개)
const [visibleCount, setVisibleCount] = useState(3);

  // Filter products catalog and search matches
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === '전체') return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  // Action: Modify specific product price in backend database
  const handleUpdatePrice = async (id: string, newPrice: number) => {
    try {
      const response = await fetch(`/api/products/${id}/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });

      const updatedItem = await response.json();
      
      setProducts((prev) => 
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    } catch (err) {
      console.error(err);
      alert('가격을 반영하는 동안 통신 오류가 발생했습니다. 로컬 대체 계산을 시작합니다.');
      
      // Fallback manual updater
      setProducts((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const updatedPrice = Number(newPrice);
          let newStatus: '가격 우위' | '최저가 유지' | '경쟁 밀림' = '최저가 유지';
          let gmv = item.gmvEst;

          if (updatedPrice < item.compPrice) {
            newStatus = '가격 우위';
            gmv = Math.round(item.salesCount * updatedPrice * 1.35);
          } else if (updatedPrice === item.compPrice) {
            newStatus = '최저가 유지';
            gmv = Math.round(item.salesCount * updatedPrice * 1.15);
          } else {
            newStatus = '경쟁 밀림';
            gmv = Math.round(item.salesCount * updatedPrice * 0.45);
          }

          return { ...item, myPrice: updatedPrice, status: newStatus, gmvEst: gmv };
        })
      );
    }
  };

  // Action: Instant all competitor match optimizer trigger
  const handleOptimizeAll = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch('/api/products/optimize-all', {
        method: 'POST',
      });
      const optimizedList = await response.json();
      setProducts(optimizedList);
      
      setTimeout(() => {
        setIsOptimizing(false);
        alert('최적화 완료!\n\n전체 "경쟁 밀림" 상태의 상품들이 경쟁사 최저 판매가로 일괄 조정되었습니다.\n검색 노출 지수가 최대 75% 복원되며 예상 총 GMV가 상승합니다.');
      }, 600);
    } catch (err) {
      console.error(err);
      // fallback
      setProducts((prev) => 
        prev.map((item) => ({
          ...item,
          myPrice: item.compPrice,
          status: '최저가 유지',
          gmvEst: Math.round(item.salesCount * item.compPrice * 1.15)
        }))
      );
      setIsOptimizing(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '최저가 유지':
        return 'text-[#32B33A] bg-green-50 justify-center border border-green-100';
      case '가격 우위':
        return 'text-blue-600 bg-blue-50 justify-center border border-blue-100';
      case '경쟁 밀림':
      default:
        return 'text-red-500 bg-red-50 justify-center border border-red-100';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8 bg-white select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Control Settings Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#32B33A] bg-white font-bold text-gray-700"
              placeholder="상품명 또는 카테고리로 검색..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['전체', '최저가 유지', '가격 우위', '경쟁 밀림'].map((tab) => (
              <button
                key={tab}
                onClick={() => {setStatusFilter(tab);
                setVisibleCount(3);}}
                className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                  statusFilter === tab
                    ? 'bg-[#32B33A] text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
            
            <button
              onClick={handleOptimizeAll}
              disabled={isOptimizing}
              className="bg-[#32B33A] hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ml-2"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
              {isOptimizing ? '최적화 중...' : '최저가 일괄 자동 매칭'}
            </button>
          </div>
        </div>

        {/* Dynamic products list */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border">
              <p className="text-sm text-gray-400 font-semibold italic">조회 조건에 부합하는 판매 상품 정보가 존재하지 않습니다.</p>
            </div>
          ) : (
            {filteredProducts.slice(0, visibleCount).map((p) => {
              const currentTempPrice = temporaryPrices[p.id] !== undefined ? temporaryPrices[p.id] : p.myPrice;
              const hasChanged = currentTempPrice !== p.myPrice;
              const ownLowest = getOwnLowestPrice(p.id, p.compPrice);
              const compLowest = p.compPrice;

              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col lg:grid lg:grid-cols-12 gap-6 items-center hover:shadow-sm transition-shadow relative"
                >
                  {/* Part 1: Product Identifications */}
                  <div className="lg:col-span-4 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-gray-400 font-mono">RANK {p.rank}</span>
                      <span className="text-[10px] bg-slate-50 border px-2 py-0.5 rounded text-gray-500 font-bold">{p.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 tracking-tight leading-snug">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>월간 판매량: {p.salesCount.toLocaleString()}개</span>
                      <span>•</span>
                      <span>원가 비율: {Math.round((1 - p.marginRate) * 100)}%</span>
                    </div>
                  </div>

                  {/* Part 2: Interactive pricing matching status indicators */}
                  <div className="lg:col-span-4 w-full flex flex-col sm:flex-row items-center justify-around gap-4 bg-gray-50 p-4 rounded-xl border border-gray-50">
                    <div className="text-center">
                      <span className="block text-[10px] text-gray-400 font-bold mb-1">내 판매 단가</span>
                      <strong className="text-sm font-extrabold text-gray-800">
                        ₩{p.myPrice.toLocaleString()}
                      </strong>
                    </div>

                    <div className="text-center">
                      <span className="block text-[10px] text-gray-400 font-bold mb-1">타사 최저 지수</span>
                      <strong className="text-sm font-extrabold text-gray-500">
                        ₩{p.compPrice.toLocaleString()}
                      </strong>
                    </div>

                    <div className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0 ${getStatusStyle(p.status)}`}>
                      {p.status === '경쟁 밀림' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{p.status}</span>
                    </div>
                  </div>

                  {/* Part 3: Slider interaction controllers */}
                  <div className="lg:col-span-4 w-full space-y-3 pt-2 lg:pt-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-semibold">단가 수동 최적화</span>
                      <span className={`${hasChanged ? 'text-red-500 font-extrabold animate-pulse' : 'text-gray-700 font-bold'}`}>
                        ₩{currentTempPrice.toLocaleString()} 
                        {hasChanged && ' (반영 대기)'}
                      </span>
                    </div>

                    {/* Interactive pricing slider */}
                    <input
                      type="range"
                      min={Math.round(p.compPrice * 0.7)}
                      max={Math.round(p.compPrice * 1.3)}
                      step={100}
                      value={currentTempPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTemporaryPrices({ ...temporaryPrices, [p.id]: val });
                      }}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#32B33A]"
                    />

                    <div className="flex gap-2">
                      {hasChanged && (
                        <>
                          <button
                            onClick={() => {
                              const resetTemp = { ...temporaryPrices };
                              delete resetTemp[p.id];
                              setTemporaryPrices(resetTemp);
                            }}
                            className="flex-1 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[11px] font-bold hover:bg-gray-200 transition-colors"
                          >
                            초기화
                          </button>
                          <button
                            onClick={() => handleUpdatePrice(p.id, currentTempPrice)}
                            className="flex-2 py-1.5 bg-[#32B33A] text-white rounded-lg text-[11px] font-black hover:bg-green-600 transition-all shadow-sm"
                          >
                            가격 반영
                          </button>
                        </>
                      )}

                      {!hasChanged && p.status === '경쟁 밀림' && (
                        <button
                          onClick={() => {
                            setTemporaryPrices({ ...temporaryPrices, [p.id]: p.compPrice });
                          }}
                          className="w-full py-2 bg-[#32B33A]/15 text-[#32B33A] rounded-xl text-[11px] font-black hover:bg-[#32B33A] hover:text-white transition-all flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          AI 최저가 ₩{p.compPrice.toLocaleString()} 매칭 제안
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 2: 자사/타사 최저가 매칭 및 예상 효과 분석 */}
                  <div className="lg:col-span-12 w-full mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {/* 타사 최저가 대응 카드 */}
                    <div className="bg-gray-50/50 hover:bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-gray-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            타사 최저가 (경쟁 최저 지수)
                          </span>
                          <strong className="text-sm font-black text-red-500 font-mono">
                            ₩{compLowest.toLocaleString()}
                          </strong>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-black">
                            <span>🎯 타사 최저가 매칭 예상 효과</span>
                            <span className="text-red-500 bg-red-50 px-1.5 rounded text-[9px]">Gmarket 최저가 유지</span>
                          </div>
                          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                            경쟁사의 최저가 판매 전선과 수평 일치시킴으로써 Gmarket 최적 노출 알고리즘 수혜. 
                            <strong> Gmarket 검색 지수 즉시 복원</strong> 및 <strong>월간 판매량 약 1.25배 상승</strong>으로 월 예상 판매량 <strong className="text-gray-800">{Math.round(p.salesCount * 1.25).toLocaleString()}개</strong> 및 예상 월 GMV <strong className="text-gray-800">₩{Math.round(p.salesCount * 1.25 * compLowest).toLocaleString()}원</strong>수호 전망.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const resetTemp = { ...temporaryPrices };
                          delete resetTemp[p.id];
                          setTemporaryPrices(resetTemp);
                          handleUpdatePrice(p.id, compLowest);
                        }}
                        disabled={p.myPrice === compLowest}
                        className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                          p.myPrice === compLowest
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150'
                            : 'bg-red-50 hover:bg-red-500 hover:text-white text-red-500 border border-red-200'
                        }`}
                      >
                        {p.myPrice === compLowest ? '현재 타사 최저가 일치함' : '타사 최저가 만들기'}
                      </button>
                    </div>

                    {/* 자사 최저가 대응 카드 */}
                    <div className="bg-gray-50/50 hover:bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-gray-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-[#32B33A] rounded-full"></span>
                            자사 최저가 (한계마진 8% 적용)
                          </span>
                          <strong className="text-sm font-black text-[#32B33A] font-mono">
                            ₩{ownLowest.toLocaleString()}
                          </strong>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-black">
                            <span>⚡ 자사 최저가 매칭 예상 효과</span>
                            <span className="text-blue-600 bg-blue-50 px-1.5 rounded text-[9px]">시장 우위 세일즈</span>
                          </div>
                          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                            매출 순수익 방어를 위한 최소 안전선(마진 8%)까지 대폭 하향 조정. Gmarket 특가 노출 가중치로 
                            <strong> 트래픽 폭발 및 월간 판매량 약 1.6배 폭증</strong>하여 월 예상 판매량 <strong className="text-gray-800">{Math.round(p.salesCount * 1.6).toLocaleString()}개</strong> 및 예상 월 GMV <strong className="text-[#32B33A]">₩{Math.round(p.salesCount * 1.6 * ownLowest).toLocaleString()}원</strong> 기록 예상.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const resetTemp = { ...temporaryPrices };
                          delete resetTemp[p.id];
                          setTemporaryPrices(resetTemp);
                          handleUpdatePrice(p.id, ownLowest);
                        }}
                        disabled={p.myPrice === ownLowest}
                        className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                          p.myPrice === ownLowest
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150'
                            : 'bg-green-50 hover:bg-[#32B33A] hover:text-white text-[#32B33A] border border-green-200'
                        }`}
                      >
                        {p.myPrice === ownLowest ? '현재 자사 최저가 일치함' : '자사 최저가 만들기'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          }
       {filteredProducts.length > visibleCount && (
            <div className="pt-4 flex justify-center w-full">
              <button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                더보기 ({visibleCount} / {filteredProducts.length})
              </button>
            </div>
          )}
        </> // 👈 전체를 감싸는 React Fragment 닫기 태그
      )}
    </div> // 👈 원래 있던 <div className="space-y-4">의 닫기 태그
