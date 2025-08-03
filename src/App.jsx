import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import COAPage from './pages/COAPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import Sidebar from './components/Sidebar.jsx';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coa" element={<COAPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/reports" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
