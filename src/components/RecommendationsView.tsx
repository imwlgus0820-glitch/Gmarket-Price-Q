import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Zap, 
  TrendingUp, 
  ArrowRight,
  RefreshCw,
  Award,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Percent,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Product } from '../types';

interface RecommendationsViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Custom design specifications for each recommended product
const RECOMMENDATION_METADATA: Record<string, {
  image: string;
  tag: string;
  tagColor: 'red' | 'green' | 'orange';
  analysisTemplate: string;
  insightTemplate: string;
  potentialLabel: string;
  percentage: number;
}> = {
  p1: {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    tag: "낮은 경쟁력",
    tagColor: "red",
    analysisTemplate: "현재 Gmarket 판매 가격(₩{myPrice})이 타사 오픈마켓 최저 경쟁 가격인 ₩{compPrice} 대비 타사 최저 경쟁가가 더 비싸거나 저렴하게 변동 중입니다. 가격 격차가 벌어지고 있어 베스트 랭킹 알고리즘 점수 하락 위험이 존재합니다.",
    insightTemplate: "가격을 ₩{myPrice}에서 타사 최저가인 ₩{compPrice}으로 조정하여 즉시 경쟁 전선을 복구하거나, 최적 한계 마진선인 ₩{ownLowest} 선까지 추가 할인해 공격적 특가 노출을 전개하십시오.",
    potentialLabel: "75% Conversion Potential Boost",
    percentage: 75
  },
  p2: {
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    tag: "마진 알림",
    tagColor: "green",
    analysisTemplate: "마진 확보가 충분히 가능한 상태입니다. 최저가 동등 경쟁을 충족하면서 브랜드 가치를 보호하고 단가를 안정적으로 유지하거나, 자사 기준 8% 한계 마진선(₩{ownLowest})까지 가격 조정을 적극 제안합니다.",
    insightTemplate: "현재 최저가 수평 매칭 상태인 ₩{compPrice} 원을 고정하여 안정 마진을 유지할 것을 적극 제안하며, 6월 기획전 기간 세일즈 탄력성이 필요할 경우 한계마진 마지노선인 ₩{ownLowest} 원까지 할인 폭을 설계하십시오.",
    potentialLabel: "경쟁사 모니터링 활성화 (+12)",
    percentage: 100
  },
  p5: {
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80",
    tag: "낮은 경쟁력",
    tagColor: "red",
    analysisTemplate: "현재 Gmarket 판매가(₩{myPrice}) 대비 경쟁 타사가 파격 세일(₩{compPrice}원)을 진행하고 있어 점유 지표가 둔화되고 있습니다. 상위 검색 필터 가중치가 하락할 위험이 매우 높습니다.",
    insightTemplate: "가격을 경쟁사 동등 레벨인 ₩{compPrice} 원으로 신속하게 동기화하여 검색 노출 순위 점수를 복구하거나, 가전/카테고리 마진 한계치인 ₩{ownLowest} 원 미만으로 가격을 할인해 트래픽을 선점하십시오.",
    potentialLabel: "이탈률 극복 예상 지수 높은 대응성",
    percentage: 40
  },
  p3: {
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
    tag: "기회 선점",
    tagColor: "green",
    analysisTemplate: "시그니처 워크스페이스 체어의 수요가 가속화되고 있습니다. 마진율이 ₩{myPrice} 원 기준 40%로 매우 탄탄하여 추가 할인 완충 영역이 넉넉히 마련되어 있습니다.",
    insightTemplate: "타사 최저가 ₩{compPrice} 원에 대비해 추가 고객 유입을 유도하기 위해 자사 최저 한계 안전선 ₩{ownLowest} 원으로 공격적 단가 인하 경쟁력을 확보할 수 있습니다.",
    potentialLabel: "62% Conversion Potential Boost",
    percentage: 62
  },
  p6: {
    image: "https://images.unsplash.com/photo-1627124768121-6453664fa85c?auto=format&fit=crop&w=600&q=80",
    tag: "경쟁 경보",
    tagColor: "red",
    analysisTemplate: "현재 경쟁 타사가 ₩{compPrice} 원으로 특가 할인 판매 중이나 자사 가격은 ₩{myPrice} 원으로 경쟁 배제 위험군에 해당합니다.",
    insightTemplate: "한계 안전 마진선인 ₩{ownLowest} 원에 맞춰 특가 가중치를 취득하여 트래픽 부스팅 효과를 설계하고 고객 이탈을 사전 방조할 것을 추천드립니다.",
    potentialLabel: "80% Traffic Defense Ratio",
    percentage: 80
  },
  p8: {
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    tag: "경쟁 경보",
    tagColor: "red",
    analysisTemplate: "익스트림 액션캠의 타사 초저가 프로모션(₩{compPrice}원)으로 인해 고객 클릭 점유 비율이 24% 급감하고 있어 빠른 조치가 요구됩니다.",
    insightTemplate: "즉각 타사 최저가와 일치 및 한계 마진에 임박한 최적 제안가인 ₩{ownLowest} 원 할인으로 Gmarket 검색 가독성을 극대화해 복수 유입량을 선점하세요.",
    potentialLabel: "55% Traffic Restoration Estimate",
    percentage: 55
  },
  p10: {
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
    tag: "마진 알림",
    tagColor: "green",
    analysisTemplate: "요가매트 카테고리 내 타사 평균가 대비 안정적인 마진을 구축하고 있으며 점유 순위 유지 효과를 발휘하고 있습니다.",
    insightTemplate: "여유로운 ₩{ownLowest} 원 한계 마진 가격으로 추가 유입 프로모션을 기동하거나, 현재 최저 경쟁 상태 유지를 추천합니다.",
    potentialLabel: "최상위 노출 안정화 지수 88%",
    percentage: 88
  }
};

export default function RecommendationsView({ products, setProducts }: RecommendationsViewProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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

  const handleApplySinglePrice = (productId: string, targetPrice: number, textLabel: string) => {
    setProducts((prev) => 
      prev.map((p) => {
        if (p.id === productId) {
          const status = targetPrice <= p.compPrice 
            ? (targetPrice < p.compPrice ? '가격 우위' : '최저가 유지') 
            : '경쟁 밀림';
          return {
            ...p,
            myPrice: targetPrice,
            status,
          };
        }
        return p;
      })
    );

    setSuccessMessage(`✓ [${textLabel}] 추천 가격 ₩${targetPrice.toLocaleString()}원이 상품에 즉시 적용되었습니다!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  // Divide keys into Primary (always visible) vs Secondary (toggled via 더보기)
  const primaryKeys = ['p1', 'p2', 'p5'];
  const secondaryKeys = ['p3', 'p6', 'p8', 'p10'];

  const renderProductCard = (productId: string, index: number) => {
    const product = products.find((p) => p.id === productId);
    const metadata = RECOMMENDATION_METADATA[productId];
    if (!product || !metadata) return null;

    const currentPrice = product.myPrice;
    const competitorPrice = product.compPrice;
    const targetOwnLowest = getOwnLowestPrice(productId, competitorPrice);
    
    // Status metrics calculation dynamically
    const priceDiff = currentPrice - competitorPrice;
    const diffPercent = competitorPrice > 0 ? ((priceDiff / competitorPrice) * 100).toFixed(1) : '0';

    // Format template strings dynamically
    const analysisText = metadata.analysisTemplate
      .replace('{myPrice}', currentPrice.toLocaleString())
      .replace('{compPrice}', competitorPrice.toLocaleString())
      .replace('{ownLowest}', targetOwnLowest.toLocaleString())
      .replace('{diffPercent}', diffPercent);

    const insightText = metadata.insightTemplate
      .replace('{myPrice}', currentPrice.toLocaleString())
      .replace('{compPrice}', competitorPrice.toLocaleString())
      .replace('{ownLowest}', targetOwnLowest.toLocaleString());

    const isMatchComp = currentPrice === competitorPrice;
    const isMatchOwn = currentPrice === targetOwnLowest;

    return (
      <div 
        key={productId}
        className={`bg-white rounded-[24px] border-l-4 ${
          metadata.tagColor === 'red' ? 'border-l-red-500' : 'border-l-[#32B33A]'
        } border border-gray-150 p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 shadow-sm hover:shadow-md align-start text-left`}
      >
        {/* Product Thumbnail on the Left */}
        <div className="w-full md:w-44 h-44 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-gray-100 flex-shrink-0 relative">
          <img 
            src={metadata.image} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          <span className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-md font-bold">
            {product.category}
          </span>
        </div>

        {/* Info and Actions on the Right */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded ${
                metadata.tagColor === 'red' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#32B33A]'
              }`}>
                {metadata.tag}
              </span>
              <span className="text-[10px] font-bold text-gray-400 font-mono">RANK #{product.rank}</span>
            </div>

            <h3 className="text-lg font-black text-gray-800 tracking-tight leading-snug">
              {product.name}
            </h3>

            {/* 분석 결과 section */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">분석 결과</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                {analysisText}
              </p>
            </div>

            {/* AI Insight banner */}
            <div className="bg-green-50/75 rounded-2xl p-4 border border-green-100 flex items-start gap-2.5 mt-3">
              <Sparkles className="w-4 h-4 text-[#32B33A] shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-gray-600 leading-relaxed font-semibold">
                <span className="text-[#32B33A] font-extrabold mr-1">AI Insight:</span> 
                {insightText}
              </div>
            </div>
          </div>

          {/* Actions & Conversion Boost Slider Indicator */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2">
              {productId === 'p2' ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[10px] flex items-center justify-center font-bold text-blue-600 border border-white">G</span>
                    <span className="w-5 h-5 rounded-full bg-red-100 text-[10px] flex items-center justify-center font-bold text-red-600 border border-white">N</span>
                    <span className="w-5 h-5 rounded-full bg-yellow-100 text-[10px] flex items-center justify-center font-bold text-yellow-600 border border-white">C</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-black tracking-wider">+12 경쟁사 모니터링 활성화</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-150 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#32B33A] h-full" style={{ width: `${metadata.percentage}%` }}></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-black tracking-wider">{metadata.potentialLabel}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => handleApplySinglePrice(productId, competitorPrice, '타사 최저가')}
                disabled={isMatchComp}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isMatchComp 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150' 
                    : 'bg-red-50 hover:bg-red-500 hover:text-white text-red-500 border border-red-200'
                }`}
              >
                {isMatchComp ? '최저가 적용됨' : '타사 최저가 맞추기'}
              </button>
              <button
                onClick={() => handleApplySinglePrice(productId, targetOwnLowest, '자사 최저 마진가')}
                disabled={isMatchOwn}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isMatchOwn 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150' 
                    : 'bg-green-50 hover:bg-[#32B33A] hover:text-white text-[#32B33A] border border-green-200'
                }`}
              >
                {isMatchOwn ? '자사 최저가 일치' : '자사 최저가 적용'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8 bg-slate-50 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Breadcrumb & Title exact like mockup design */}
        <div className="text-left border-b border-gray-150 pb-5">
          <span className="text-xs font-black text-gray-400 font-mono uppercase tracking-widest block mb-1">Gmarket</span>
          <h2 className="text-2xl font-black text-gray-800 leading-tight">PriceQ Recommendation</h2>
          
          <div className="flex items-center gap-2 mt-3 text-[#32B33A] font-bold text-xs border-l-3 border-[#32B33A] pl-3 py-0.5 bg-green-50/50 rounded-r-xl max-w-lg">
            AI 실시간 시장 데이터 분석 기반 최적 가격 제안
          </div>
        </div>

        {/* Global Toast Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-[#32B33A] text-[#32B33A] p-4 rounded-xl text-xs font-black flex items-center justify-between shadow-sm animate-bounce text-left">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-[#32B33A] hover:opacity-80 font-bold ml-2">닫기</button>
          </div>
        )}

        {/* Recommendation Cards Flow */}
        <div className="space-y-6">
          {/* Render 3 Primary Cards */}
          {primaryKeys.map((key, i) => renderProductCard(key, i))}

          {/* Expanded Cards Area with Transition */}
          {isExpanded && (
            <div className="space-y-6 pt-2 border-t border-dashed border-gray-200 animate-fadeIn">
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-left mb-2">
                추가 AI 분석 추천 상품군
              </div>
              {secondaryKeys.map((key, i) => renderProductCard(key, i + 3))}
            </div>
          )}

          {/* 더보기 / 접기 Toggle Button styled beautifully */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-8 py-3.5 bg-white border border-gray-200 hover:border-[#32B33A] text-gray-700 hover:text-[#32B33A] rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <span>{isExpanded ? '추천 항목 접기' : '더 많은 추천 항목 보기 (더보기)'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0 animate-bounce" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
