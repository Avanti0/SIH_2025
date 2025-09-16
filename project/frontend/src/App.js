import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BiosecurityChecklist from './pages/BiosecurityChecklist';
import DatabaseSchema from './pages/DatabaseSchema';
import HealthRecords from './pages/HealthRecords';
import FeedManagement from './pages/FeedManagement';
import ProductionReports from './pages/ProductionReports';
import VideoUpload from './pages/VideoUpload';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checklist" element={<BiosecurityChecklist />} />
          <Route path="/database" element={<DatabaseSchema />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/feed-management" element={<FeedManagement />} />
          <Route path="/production-reports" element={<ProductionReports />} />
          <Route path="/video-upload" element={<VideoUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
