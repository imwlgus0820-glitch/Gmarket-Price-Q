export interface Product {
  id: string;
  rank: string;
  name: string;
  myPrice: number;
  compPrice: number;
  gmvEst: number; // Est. GMV in KRW
  status: '최저가 유지' | '경쟁 밀림' | '가격 우위';
  category: string;
  marginRate: number; // Current margin rate (e.g. 0.25 for 25%)
  salesCount: number; // units sold last month
}

export interface Task {
  id: string;
  title: string;
  target: string;
  metric: string;
  status: string; // '그래프 생성 중' | '그래프 생성 완료' | '대기 중' | '완료'
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  tableData?: {
    rank: string;
    name: string;
    price: number;
    gmv: string;
    status?: string;
  }[];
  task?: Task;
  suggestedActions?: string[];
}

export interface CompetitorPriceHistory {
  date: string;
  myPrice: number;
  marketAvg: number;
  competitorLowest: number;
}

export interface GmarketStats {
  totalGmv: number;
  totalProfit: number;
  lowestPriceRatio: number; // Percentage of matched lowest prices (e.g. 70%)
  averageMargin: number; // e.g. 24%
}
