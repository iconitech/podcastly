import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, Headphones } from "lucide-react";
import { useNavigate} from "react-router-dom";



export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-500 text-transparent bg-clip-text">
          Your AI Podcast Assistant
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 mb-8 max-w-2xl mx-auto">
          Get instant summaries of your favorite NFL podcasts. Save time while staying informed.
        </p>
        
        <Button onClick={() => navigate('/navigate')} className="bg-green-500 hover:bg-green-600 text-black text-lg px-8 py-6 rounded-full">
          Try for free <ArrowRight className="ml-2" />
        </Button>

        <div id="features" className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl bg-neutral-900/50 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Summaries</h3>
            <p className="text-neutral-400">Get the key points from any episode in seconds</p>
          </div>
          
          <div className="p-6 rounded-xl bg-neutral-900/50 backdrop-blur-sm">
            <Clock className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save Time</h3>
            <p className="text-neutral-400">Perfect for busy fans who want to stay updated</p>
          </div>
          
          <div className="p-6 rounded-xl bg-neutral-900/50 backdrop-blur-sm">
            <Headphones className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Top NFL Podcasts</h3>
            <p className="text-neutral-400">Access summaries from the best NFL shows</p>
          </div>
        </div>
      </div>
    </section>
  );
}