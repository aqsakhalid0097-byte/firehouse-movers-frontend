import React from 'react';
import { HelpCircle, Play } from 'lucide-react';

export interface DepartmentQuizCardProps {
  departmentName?: string;
  hasQuiz?: boolean;
  questionCount?: number;
  isManager?: boolean;
  onStartQuiz?: () => void;
}

export const DepartmentQuizCard: React.FC<DepartmentQuizCardProps> = ({
  departmentName = 'Operations & Logistics',
  hasQuiz = true,
  questionCount = 10,
  isManager = false,
  onStartQuiz,
}) => {
  return (
    <div className="bg-[#1c1c1e] border border-neutral-800 rounded-2xl p-8 text-center max-w-3xl mx-auto shadow-2xl">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
        <HelpCircle className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        Department Quiz — {departmentName}
      </h3>

      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
        Test your knowledge with department-specific questions{isManager ? ' (Manager Level)' : ' (Crew Level)'}.
      </p>

      {hasQuiz ? (
        <button
          onClick={onStartQuiz}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-600/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start {isManager ? 'Manager ' : ''}Quiz ({questionCount} questions)</span>
        </button>
      ) : (
        <button
          disabled
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-neutral-800 text-gray-500 font-semibold text-sm rounded-xl opacity-50 cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>No Quiz Assigned</span>
        </button>
      )}
    </div>
  );
};
