import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PodcastShowcase from './components/PodcastShowcase';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import Episodes from './pages/Episodes';
import Podcasts from './pages/Podcasts';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <ScrollToSection />
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <PodcastShowcase />
                <PricingSection />
              </main>
            } />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/podcasts/:podcastId" element={<Episodes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;