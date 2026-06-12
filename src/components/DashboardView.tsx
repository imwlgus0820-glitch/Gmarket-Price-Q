import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  Cell 
} from 'recharts';
import { 
  Coins, 
  Percent, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Product } from '../types';
import { HISTORICAL_CHART_DATA } from '../data/mockData';

interface DashboardViewProps {
  products: Product[];
}

export default function DashboardView({ products }: DashboardViewProps) {
  const [selectedRange, setSelectedRange] = useState('7d');

  // Programmatic metrics calculated directly from active products
  const totalVolumeGmv = products.reduce((acc, p) => acc + p.gmvEst, 0);
  const totalProfitSum = products.reduce((acc, p) => acc + (p.salesCount * p.myPrice * p.marginRate), 0);
  
  const totalItems = products.length;
  const matchedLowestCount = products.filter((p) => p.status === '최저가 유지' || p.status === '가격 우위').length;
  const matchRatio = Math.round((matchedLowestCount / totalItems) * 100) || 0;
  
  const deficitItemsCount = products.filter((p) => p.status === '경쟁 밀림').length;

  // Prepare dynamic recharts data from live products catalog state
  const barChartData = products.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    GMV: Number((p.gmvEst / 1000000).toFixed(1)), // in Millions KRW
    status: p.status,
  }));

  // Simulated coupon efficiency data
  const couponData = [
    { discount: '0%', salesVolume: 100, cost: 0, netMargin: 320000 },
    { discount: '5%', salesVolume: 140, cost: 7000, netMargin: 406000 },
    { discount: '10%', salesVolume: 210, cost: 21000, netMargin: 510000 },
    { discount: '15%', salesVolume: 290, cost: 43500, netMargin: 462500 },
    { discount: '20%', salesVolume: 340, cost: 68000, netMargin: 382000 },
  ];

  const handleDownloadStats = () => {
    alert('상세 실적 대시보드 리포팅 엑셀 출력을 요청하였습니다.\n\n출력 데이터:\n- 총 추정 GMV: ₩' + totalVolumeGmv.toLocaleString() + '원\n- 예상 순수익: ₩' + Math.round(totalProfitSum).toLocaleString() + '원\n- 최저가 매칭 수호율: ' + matchRatio + '%\n- 분석 시점: ' + new Date().toISOString());
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8 bg-white select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Quad Column Key Stat Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Estimated GMV */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400">총 추정 GMV</span>
              <h3 className="text-xl font-black text-gray-850 tracking-tight">
                ₩{(totalVolumeGmv / 1000000).toFixed(1)}M
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">₩{totalVolumeGmv.toLocaleString()}원</p>
            </div>
            <div className="p-2 bg-green-50 text-[#32B33A] rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Combined Profit Margin */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400">예상 순마진 수익</span>
              <h3 className="text-xl font-black text-[#32B33A] tracking-tight">
                ₩{(totalProfitSum / 1000000).toFixed(1)}M
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">평균 마진율 약 32.5% 적용</p>
            </div>
            <div className="p-2 bg-green-50 text-[#32B33A] rounded-xl">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Price Match Deficits */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400">최저가 수호율</span>
              <h3 className="text-xl font-black text-gray-850 tracking-tight">
                {matchRatio}%
              </h3>
              <p className="text-[10px] text-[#32B33A] font-extrabold">{matchedLowestCount} / {totalItems} 종 수호 유지</p>
            </div>
            <div className="p-2 bg-green-50 text-[#32B33A] rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Deficit Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400">경쟁 이탈 심각 상품</span>
              <h3 className={`text-xl font-black tracking-tight ${deficitItemsCount > 0 ? 'text-red-500 font-bold' : 'text-gray-850'}`}>
                {deficitItemsCount}개
              </h3>
              {deficitItemsCount > 0 ? (
                <p className="text-[10px] text-red-500 font-bold animate-pulse">노출 지수 점진 하락 우려</p>
              ) : (
                <p className="text-[10px] text-[#32B33A] font-bold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" />
                  전체 품목 대응 일치 완벽
                </p>
              )}
            </div>
            <div className={`p-2 rounded-xl ${deficitItemsCount > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Dual Chart Block Grid layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart Section A: Product GMV Allocation in Bar graph */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm lg:col-span-12 xl:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-gray-800">품목별 주요 GMV 실적 분포</h4>
                <p className="text-xs text-gray-400">최근 한달 기준 환산 GMV 성과 지표 (단위: 백만 원)</p>
              </div>
              <button 
                onClick={handleDownloadStats}
                className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 border border-gray-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="h-64 select-text">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 10 }}
                    formatter={(value: any) => [`${value}M ₩`, '추정 매출 (Est. GMV)']}
                  />
                  <Bar dataKey="GMV" radius={[4, 4, 0, 0]}>
                    {barChartData.map((entry, index) => {
                      const color = entry.status === '경쟁 밀림' ? '#ef4444' : '#32B33A';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Section B: Competitor Lowest Track Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm lg:col-span-12 xl:col-span-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-gray-800">매칭 가격 변동 모니터링 추이</h4>
                <p className="text-xs text-gray-400">핵심 Runner Pro 2 상품의 마이너스 피드백 추이</p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setSelectedRange('7d')}
                  className={`text-[9px] px-2.5 py-1 rounded-md font-bold ${selectedRange === '7d' ? 'bg-[#32B33A] text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  7일
                </button>
                <button 
                  onClick={() => alert('조회 가능한 마켓 과거 로그 데이터가 부족합니다.')}
                  className="text-[9px] px-2.5 py-1 rounded-md font-bold bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  30일
                </button>
              </div>
            </div>

            <div className="h-64 select-text">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HISTORICAL_CHART_DATA} margin={{ top: 10, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 10 }}
                    formatter={(value: any) => [`₩${value.toLocaleString()}`, '']}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="myPrice" name="내 가격" stroke="#32B33A" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="competitorLowest" name="타사 최저가" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="marketAvg" name="시장 평균가" stroke="#94a3b8" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Dynamic Widget Section: Coupon Effectiveness Elasticity Simulator */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#32B33A]" />
              <div>
                <h4 className="text-sm font-extrabold text-gray-805">
                  PriceQ AI 쿠폰 할인 탄력성 시뮬레이션
                </h4>
                <p className="text-xs text-gray-400">쿠폰 할인율 적용 단계별 판매 지표 및 추정 순수익 분석 곡선</p>
              </div>
            </div>
            <span className="text-[10px] text-[#32B33A] bg-green-50 px-2.5 py-1 rounded-lg font-bold">인공지능 추천: 10% 쿠폰</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* The area chart */}
            <div className="h-56 md:col-span-8 select-text">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={couponData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                  <XAxis dataKey="discount" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 10 }}
                    formatter={(value: any, name: any) => [
                      name === 'netMargin' ? `₩${value.toLocaleString()}` : `${value}개`,
                      name === 'netMargin' ? '예상 순수익' : '예상 판매 수량'
                    ]}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                  <Area type="monotone" dataKey="salesVolume" name="예상 판매량" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" />
                  <Area type="monotone" dataKey="netMargin" name="예상 순수익" stroke="#32B33A" fill="rgba(50, 179, 58, 0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Strategic suggestions bullets card */}
            <div className="md:col-span-4 bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-3.5">
              <h5 className="text-xs font-black text-gray-800">PriceQ 가격 탄성 소견</h5>
              <ul className="text-xs text-gray-500 space-y-2.5 list-disc pl-4">
                <li><strong className="text-gray-700">효율 극대화점:</strong> 10% 쿠폰 적용 시 판매량이 110% 급증하며 총 ₩510,000의 최고 마진 도출.</li>
                <li><strong className="text-gray-700">한계점 유의:</strong> 15% 이상 쿠폰 인하 시 소모 비용이 판매 상승분을 초과하여 마진 잠식 우려.</li>
                <li><strong className="text-gray-700">Gmarket 노출:</strong> 10% 할인 설정 시 Gmarket 베스트 딜 랭킹 노출 지수 가중치 증가!</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
