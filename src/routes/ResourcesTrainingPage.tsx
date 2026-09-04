'use client';

import React, { useState } from 'react';
import { GraduationCap, Book, Award } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ProfileSidebar } from '../features/profile/ProfileSidebar';
import { TRAINING_COURSES, COMPANY_MANUALS } from '../features/resources/data/coursesData';
import { TrainingCourseCard } from '../features/resources/TrainingCourseCard';
import { CompanyManualCard } from '../features/resources/CompanyManualCard';
import { DepartmentQuizCard } from '../features/resources/DepartmentQuizCard';

export const ResourcesTrainingPage: React.FC = () => {
  const [quizAlert, setQuizAlert] = useState(false);
  const { user, logout } = useAuth();

  const handleStartQuiz = () => {
    setQuizAlert(true);
    setTimeout(() => setQuizAlert(false), 4000);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      <Navbar isAuthenticated={true} user={user} onLogout={logout} notificationCount={2} />

      <div className="flex min-h-[calc(100vh-65px)] bg-black">
        <ProfileSidebar activeTab="training" />

        <main className="flex-1 min-w-0 bg-black px-4 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="animate-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Resources & Training
            </h1>

            {quizAlert && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm text-center">
                🎉 Quiz session initialized! Department questions loaded successfully.
              </div>
            )}

            {/* Training Courses Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Training Courses</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TRAINING_COURSES.map((course) => (
                  <TrainingCourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* Company Manuals Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Book className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Company Manuals</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COMPANY_MANUALS.map((manual) => (
                  <CompanyManualCard key={manual.id} manual={manual} />
                ))}
              </div>
            </section>

            {/* Educational Materials / Quiz Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Educational Materials</h2>
              </div>
              <DepartmentQuizCard onStartQuiz={handleStartQuiz} />
            </section>
          </div>
        </main>
      </div>

      <footer className="border-t border-neutral-800 bg-[#0f0f0f] py-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Firehouse Movers Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ResourcesTrainingPage;
