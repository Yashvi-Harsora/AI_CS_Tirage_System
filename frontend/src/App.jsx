import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import BulkAnalyzePage from './pages/BulkAnalyzePage';
import ApiDocsPage from './pages/ApiDocsPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"        element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/bulk"    element={<BulkAnalyzePage />} />
            <Route path="/docs"    element={<ApiDocsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*"        element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer
          className="border-t text-center py-4 text-xs"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          TriageAI · Pipe &amp; Filter Architecture · Powered by Gemini 2.5 Flash
        </footer>
      </div>
    </BrowserRouter>
  );
}
