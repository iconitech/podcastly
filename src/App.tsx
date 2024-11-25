import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PodcastShowcase from './components/PodcastShowcase';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import Episodes from './pages/Episodes';
import Podcasts from './pages/Podcasts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import ScrollToTop from './components/ScrollToTop';

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
      <AuthProvider>
        <div className="min-h-screen bg-black text-white flex flex-col">
          <ScrollToTop />
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
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;