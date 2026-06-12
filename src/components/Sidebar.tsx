import React from 'react';
import { 
  MessageSquare, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  Plus, 
  HelpCircle, 
  Moon, 
  Sun,
  LayoutGrid,
  TrendingDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewChat: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onNewChat,
  darkMode,
  setDarkMode,
}: SidebarProps) {
  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'price-management', label: 'Price Management', icon: LayoutGrid },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col h-full z-20">
      {/* Brand Logo Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#32B33A] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-2xl tracking-tighter">Q</span>
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-none text-gray-800 tracking-tight">PriceQ</h1>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">AI Strategy Engine</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1.5 mt-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all relative ${
                isActive
                  ? 'bg-green-50 text-[#32B33A]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#32B33A] rounded-l-full" />
              )}
              <IconComponent className={`w-[20px] h-[20px] ${isActive ? 'text-[#32B33A]' : 'text-gray-400'}`} />
              <span className="font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Triggers & Info Bar */}
      <div className="p-4 space-y-3 border-t border-gray-100">
        <button
          onClick={onNewChat}
          className="w-full bg-[#32B33A] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        <div className="space-y-0.5 pt-2">
          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); alert("PriceQ 헬프 데스크로 연결합니다. (Gmarket Seller Center 지원팀)"); }}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
            Support
          </a>
        </div>
      </div>
    </aside>
  );
}
