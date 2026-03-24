import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AnalysisTool } from './components/AnalysisTool';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalysisTool />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
