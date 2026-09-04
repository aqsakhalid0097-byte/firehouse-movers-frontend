import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { TrainingCourse } from './data/coursesData';

export interface TrainingCourseCardProps {
  course: TrainingCourse;
}

export const TrainingCourseCard: React.FC<TrainingCourseCardProps> = ({ course }) => {
  return (
    <div className="resource-card bg-[#1a1a1a] border border-gray-700/80 rounded-xl p-6 hover:border-red-500 transition-all duration-300 flex flex-col justify-between h-full shadow-lg">
      <div className="card-content flex-1 flex flex-col mb-3">
        <div className="flex items-start gap-3.5">
          <svg className="w-7 h-7 text-[#ef4444] fill-current shrink-0 mt-0.5 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 4.5C8.8 3.2 6.2 3.1 3.8 4.2C3.3 4.4 3 4.9 3 5.5V18.8C3 19.5 3.7 20 4.4 19.7C6.4 18.8 8.7 18.9 10.6 19.9C10.8 20 11 20 11 19.8V4.5Z" />
            <path d="M13 4.5V19.8C13 20 13.2 20 13.4 19.9C15.3 18.9 17.6 18.8 19.6 19.7C20.3 20 21 19.5 21 18.8V5.5C21 4.9 20.7 4.4 20.2 4.2C17.8 3.1 15.2 3.2 13 4.5Z" />
          </svg>
          <div>
            <h3 className="text-[1.125rem] font-bold text-white mb-1.5 leading-snug tracking-wide">
              {course.title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-[0.8125rem] leading-snug font-normal">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      <div className="card-action mt-auto pt-3 flex justify-center">
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#ef4444] hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-md"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Start Course</span>
        </a>
      </div>
    </div>
  );
};
