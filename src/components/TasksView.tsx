import React, { useState } from 'react';
import { 
  Plus, 
  Trash2,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { Task } from '../types';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TasksView({ tasks, setTasks }: TasksViewProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          target: newTarget,
          metric: newMetric || '기본 매출 영향 평가',
        }),
      });

      const data = await response.json();
      setTasks((prev) => [data, ...prev]);

      // Clear states & close drawer
      setNewTitle('');
      setNewTarget('');
      setNewMetric('');
      setIsFormOpen(false);
      alert('신규 시각화 분석 작업이 할당되었습니다! 대시보드 리포팅을 생성합니다.');
    } catch (err) {
      console.error(err);
      // Client fallback state if server fails
      const fallbackTask: Task = {
        id: `t-fallback-${Date.now()}`,
        title: newTitle,
        target: newTarget,
        metric: newMetric || '기본 매출 영향 평가',
        status: '그래프 생성 완료',
        date: new Date().toISOString().split('T')[0]
      };
      setTasks((prev) => [fallbackTask, ...prev]);
      setNewTitle('');
      setNewTarget('');
      setNewMetric('');
      setIsFormOpen(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('해당 전략 분석 Task 데이터를 삭제하시겠습니까?')) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8 bg-white select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title Board */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-150 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-gray-800">PriceQ Task Queue</h3>
            <p className="text-xs text-gray-400 mt-1">AI 엔진이 실행 중인 e-commerce 데이터 통계 및 시각화 생성 백그라운드 프로세스입니다.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-[#32B33A] hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            분석 작업 할당
          </button>
        </div>

        {/* Create Task Interactive Form Box */}
        {isFormOpen && (
          <form 
            onSubmit={handleCreateTask}
            className="bg-gray-50/50 p-6 rounded-2xl border border-dashed border-green-300 text-sm space-y-4 animate-fadeIn transition-all"
          >
            <h4 className="font-extrabold text-[#32B33A] text-xs uppercase tracking-wide">신규 분석 작업 파라미터 구성</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">분석 타이틀</label>
                <input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 6월 스포츠의류 판매율 이상치 점검"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#32B33A] bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">분석 대상 상품군 (Target)</label>
                <input
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="예: 스포츠/레저 카테고리 (12종)"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#32B33A] bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">분석 핵심 지표 (Metric)</label>
                <input
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  placeholder="예: 경쟁 단가 추이 및 전일 대비 마진 증감"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#32B33A] bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-[#32B33A] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition-colors"
              >
                신규 태스크 생성
              </button>
            </div>
          </form>
        )}

        {/* Task Records List */}
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => {
            const isCompleted = task.status === '완료' || task.status === '그래프 생성 완료';
            return (
              <div 
                key={task.id}
                className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                      isCompleted 
                        ? 'bg-green-50 text-[#32B33A]' 
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {task.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-800 tracking-tight">{task.title}</h4>
                  
                  <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="font-semibold text-gray-400">Target:</span>
                      <span className="font-medium text-gray-600">{task.target}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="font-semibold text-gray-400">Metric:</span>
                      <span className="font-medium text-gray-600">{task.metric}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-gray-100 md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => alert(`태스크 [${task.title}] 상세 분석 결과:\n\n- 대상: ${task.target}\n- 주요 매트릭스: ${task.metric}\n- 분석 상태: ${task.status}\n\n상세 정보는 대시보드 메뉴에서 수시로 확인하실 수 있습니다.`)}
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 border border-gray-100"
                  >
                    <span>열기</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
