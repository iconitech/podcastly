import { Mic2, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Mic2 className="h-6 w-6 text-green-500" />
              <span className="text-xl font-bold">PodcastAI</span>
            </div>
            <p className="text-neutral-400">
              Making podcast consumption smarter and faster.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-green-500">Features</a></li>
              <li><a href="#" className="hover:text-green-500">Pricing</a></li>
              <li><a href="#" className="hover:text-green-500">FAQ</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-green-500">About</a></li>
              <li><a href="#" className="hover:text-green-500">Blog</a></li>
              <li><a href="#" className="hover:text-green-500">Careers</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-green-500">Privacy</a></li>
              <li><a href="#" className="hover:text-green-500">Terms</a></li>
              <li><a href="#" className="hover:text-green-500">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-neutral-800">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            © 2024 PodcastAI. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-400 hover:text-green-500">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-green-500">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-green-500">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}