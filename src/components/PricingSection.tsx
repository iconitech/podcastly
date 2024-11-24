import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 px-4 bg-neutral-900">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-neutral-800 border border-neutral-700">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-neutral-400">/month</span></p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>2 podcast summaries per month</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to top NFL podcasts</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Basic summary format</span>
              </li>
            </ul>
            
            <Button className="w-full bg-neutral-700 hover:bg-neutral-600">
              Get Started
            </Button>
          </div>
          
          {/* Premium Plan */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-neutral-800 border border-green-500/20">
            <div className="inline-block px-4 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4">
              RECOMMENDED
            </div>
            <h3 className="text-2xl font-bold mb-4">Premium</h3>
            <p className="text-4xl font-bold mb-6">$29.99<span className="text-lg text-neutral-400">/month</span></p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Unlimited summaries</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to all NFL podcasts</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Advanced summary with key highlights</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Early access to new features</span>
              </li>
            </ul>
            
            <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
              Get Premium
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}