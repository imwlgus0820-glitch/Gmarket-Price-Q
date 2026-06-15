import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatView from './components/ChatView';
import TasksView from './components/TasksView';
import DashboardView from './components/DashboardView';
// 1. 수정한 컴포넌트 이름과 경로로 정확히 매핑 (경로가 다르면 파일 위치에 맞게 수정해줘!)
import RecommendationsView from './components/RecommendationsView'; 
import { Product, Task, ChatMessage } from './types';
import { INITIAL_PRODUCTS, INITIAL_TASKS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        setProducts(prodData);

        const taskRes = await fetch('/api/tasks');
        const taskData = await taskRes.json();
        setTasks(taskData);
      } catch (err) {
        console.error('Failed to connect to PriceQ API backend server, falling back to static structures:', err);
        setProducts(INITIAL_PRODUCTS);
        setTasks(INITIAL_TASKS);
      }
    };
    fetchInitialData();
  }, []);

  const handleNewChat = () => {
    setChatHistory([
      {
        id: 'm-reset-' + Date.now(),
        role: 'assistant',
        text: '안녕하세요! PriceQ 입니다. 가격 관리나 데이터 분석 등 무엇이든 물어보세요. 어떤 것을 도와드릴까요?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'GMV 상위 상품 분석',
          '최저가 경쟁 상품 확인',
          '할인 쿠폰 효율 시뮬레이션'
        ]
      }
    ]);
    setActiveTab('chat');
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      text: '안녕하세요! PriceQ 입니다. 실적 분석, 가격 최적화, 경쟁사 동향 등 어떤 전략적 인사이트가 필요하신가요? 아래 추천 항목을 선택하거나 궁금한 점을 입력해 주세요.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        '최근 GMV 상위 품목 분석해줘',
        '이번 5월 BSD에서 가장 잘 팔린 상품 리스트 100개와 가격 그리고 GMV 알려줘.',
        '경쟁사 가격 변동 리포트'
      ]
    }
  ]);

  return (
    <div className="bg-white text-gray-600 flex h-screen overflow-hidden font-sans">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNewChat={handleNewChat}
        darkMode={false}
        setDarkMode={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        <Header activeTab={activeTab} products={products} />

        <div className="flex-1 flex flex-col min-h-0">
          {activeTab === 'chat' && (
            <ChatView 
              chatHistory={chatHistory} 
              setChatHistory={setChatHistory}
              products={products}
              setProducts={setProducts}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setTasks={setTasks}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView 
              tasks={tasks} 
              setTasks={setTasks} 
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView 
              products={products} 
            />
          )}

          {/* 2. 사이드바 탭 키 이름 유연하게 매핑 및 올바른 컴포넌트 연결 */}
          {(activeTab === 'price-management' || activeTab === 'recommendations') && (
            <RecommendationsView 
              products={products} 
              setProducts={setProducts} 
            />
          )}
        </div>

      </div>
    </div>
  );
}
