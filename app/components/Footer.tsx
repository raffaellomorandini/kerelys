"use client"

import { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";
import { addEmail } from "../actions";
import { toast } from "sonner";
import Logo from "./Logo";

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const honeypot = formData.get('website') as string; // Honeypot field
      const source = formData.get('source') as string;
 
      const res = await addEmail(email, honeypot, source);
      if (res.success) {
        toast.success("Successfully subscribed to our newsletter!");
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(res.error || "Error adding email");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="w-full bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo variant="footer" showBadges={false} />
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Premium Minoxidil Solutions for real hair regrowth results. Trusted by thousands of customers worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                <FaFacebook className="text-white" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                <FaTwitter className="text-white" />
              </a>
              <a href="mailto:support@klys.store" aria-label="Email" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                <FaEnvelope className="text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <a href="#products" className="block text-slate-400 hover:text-white transition-colors">Products</a>
              <a href="#why" className="block text-slate-400 hover:text-white transition-colors">Why Klys?</a>
              <a href="#faq" className="block text-slate-400 hover:text-white transition-colors">FAQ</a>
              <a href="#testimonials" className="block text-slate-400 hover:text-white transition-colors">Reviews</a>
            </nav>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-slate-400 mb-4 text-sm">
              Stay updated with the latest hair care tips and exclusive offers.
            </p>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Hidden honeypot field */}
              <input 
                type="text" 
                name="website" 
                className="absolute left-[-9999px] opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
              />
              <input 
                type="hidden" 
                name="source" 
                value="footer"
              />
              
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  required 
                  name="email"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Joining...
                    </>
                  ) : (
                    'Join'
                  )}
                </button>
              </div>
              
              <p className="text-xs text-slate-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Klys. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 