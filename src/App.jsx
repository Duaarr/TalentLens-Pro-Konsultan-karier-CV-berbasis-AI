import React from 'react';
import { AppProvider, useApp } from './frontend/context/AppContext';
import Navbar from './frontend/components/layout/Navbar';
import ChatContainer from './frontend/components/chat/ChatContainer';
import ATSAnalysisView from './frontend/components/ats/ATSAnalysisView';
import CareerMatchView from './frontend/components/career/CareerMatchView';
import MockInterviewView from './frontend/components/interview/MockInterviewView';
import CoverLetterView from './frontend/components/coverletter/CoverLetterView';
import CVUploaderModal from './frontend/components/modals/CVUploaderModal';
import ApiSettingsModal from './frontend/components/modals/ApiSettingsModal';
import RAGExplorerModal from './frontend/components/rag/RAGExplorerModal';

function MainLayout() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-light-pattern dark:bg-dark-pattern text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col relative w-full">
        {activeTab === 'chat' && <ChatContainer />}
        {activeTab === 'ats' && <ATSAnalysisView />}
        {activeTab === 'career' && <CareerMatchView />}
        {activeTab === 'interview' && <MockInterviewView />}
        {activeTab === 'coverletter' && <CoverLetterView />}
      </main>

      {/* System Modals */}
      <CVUploaderModal />
      <ApiSettingsModal />
      <RAGExplorerModal />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
