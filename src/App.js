import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
