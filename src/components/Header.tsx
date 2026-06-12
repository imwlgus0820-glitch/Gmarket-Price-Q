import React from 'react';
import { Bell, User, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface HeaderProps {
  activeTab: string;
  products: Product[];
}

export default function Header({ activeTab, products }: HeaderProps) {
  // Translate activeTab id to human-readable Korean page titles
  const getPageTitle = () => {
    switch (activeTab) {
      case 'chat':
        return 'Gmarket PriceQ';
      case 'tasks':
        return 'Strategic Analytics Tasks';
      case 'dashboard':
        return 'Realtime Performance Dashboard';
      case 'price-management':
        return 'Gmarket Price & Position Optimizer';
      default:
        return 'Gmarket PriceQ';
    }
  };

  const matchedCount = products.filter((p) => p.status === '최저가 유지').length;
  const advantageCount = products.filter((p) => p.status === '가격 우위').length;
  const slidingCount = products.filter((p) => p.status === '경쟁 밀림').length;

  return (
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white z-10 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">{getPageTitle()}</h2>
        
        {/* Real-time Status Pills shown across the Header */}
        <div className="hidden md:flex items-center gap-1.5 ml-4">
          <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-medium">
            총 품목 {products.length}종
          </span>
          <span className="text-[11px] text-[#32B33A] bg-green-50 px-2.5 py-1 rounded-lg font-bold">
            최저가 수호 {matchedCount + advantageCount}
          </span>
          {slidingCount > 0 && (
            <span className="text-[11px] text-red-500 bg-red-50 px-2.5 py-1 rounded-lg font-bold animate-pulse">
              경쟁 대응 시급 {slidingCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button 
          onClick={() => alert('새로운 가격 최적화 알림: 경쟁사 "고해상도 C-Type 허브"의 판매가가 인하되었습니다.')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Account Account */}
        <button 
          onClick={() => alert(`Gmarket ESM+ 연동 정보\n- 판매자 계정: imwlgus0820\n- 최근 정산일: 2026-06-11`)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <User className="w-5 h-5" />
        </button>

        {/* Esm+ External Portal Link Button */}
        <button
          onClick={() => {
            if (confirm('Gmarket ESM+ (Gmarket-Auction Seller Portal) 사이트로 이동하시겠습니까?')) {
              window.open('https://esmplus.com', '_blank');
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Go to Esm+</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
