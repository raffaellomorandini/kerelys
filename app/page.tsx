"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaShippingFast, FaLock, FaStar, FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaLeaf, FaFlask, FaBoxOpen, FaTruck, FaShieldAlt, FaCcVisa, FaCcMastercard, FaCcPaypal, FaRegCommentDots, FaGift, FaAward, FaHeart, FaUsers } from "react-icons/fa";
import { addEmail } from "./actions";
import { toast } from "sonner";
import NewsletterDialog from "./components/NewsletterDialog";
import Cart from "./components/Cart";
import CartIcon from "./components/CartIcon";
import { useCart } from "./contexts/CartContext";
import FastPaymentButtons from "./components/FastPaymentButtons";
import Link from "next/link";
import { packages, PackageType, calculateSavings, calculateTotalPrice } from "./lib/products";

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const { addItem } = useCart();

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  // Sticky bar logic
  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Newsletter dialog logic
  useEffect(() => {
    // Check if user has already seen the dialog today
    const lastShown = localStorage.getItem('newsletterDialogLastShown');
    const today = new Date().toDateString();
    
    if (lastShown !== today) {
      // Show dialog after 30 seconds or when user scrolls 50% down the page
      const timer = setTimeout(() => {
        setShowNewsletterDialog(true);
        localStorage.setItem('newsletterDialogLastShown', today);
      }, 30000); // 30 seconds

      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50 && !showNewsletterDialog) {
          setShowNewsletterDialog(true);
          localStorage.setItem('newsletterDialogLastShown', today);
          clearTimeout(timer);
        }
      };

      window.addEventListener('scroll', handleScroll);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showNewsletterDialog]);
 

  return (
    <div className="flex flex-col items-center justify-start w-full font-sans">
      {/* Hero Section */}
      <section className="relative w-full gradient-hero-enhanced py-20 overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-blue-200/40 rounded-full opacity-60 blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-amber-100/40 to-yellow-200/40 rounded-full opacity-60 blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/30 to-amber-50/30 rounded-full blur-3xl"></div>
          
          {/* Particle effects */}
          <div className="particle" style={{left: '10%', top: '20%', animationDelay: '0s'}}></div>
          <div className="particle" style={{left: '20%', top: '60%', animationDelay: '1s'}}></div>
          <div className="particle" style={{left: '80%', top: '30%', animationDelay: '2s'}}></div>
          <div className="particle" style={{left: '90%', top: '70%', animationDelay: '0.5s'}}></div>
          <div className="particle" style={{left: '50%', top: '10%', animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-soft badge-float">
                <FaFlask className="text-blue-600" />
                Clinically Proven Formula
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Regrow Your Confidence with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 block animate-pulse">Klys Minoxidil</span>
            </h1>
            <p className="text-slate-600 text-xl leading-relaxed mb-8">
              Experience real, visible hair regrowth with our advanced, dermatologist-recommended formula. Trusted by thousands, Klys Minoxidil is your path to fuller, thicker hair and renewed self-assurance.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button 
                className="btn-primary text-lg px-8 py-4 shadow-elegant hover:scale-105 transition-transform duration-200 btn-enhanced"
                onClick={() => scrollToSection('products')}
              >
                Shop Now
              </button>
              <button 
                className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200 btn-enhanced"
                onClick={() => scrollToSection('why')}
              >
                Learn More
              </button>
              <button 
                className="btn-gold text-lg px-6 py-4 flex items-center gap-2 shadow-elegant hover:scale-105 transition-transform duration-200 btn-enhanced"
                onClick={() => setShowNewsletterDialog(true)}
              >
                <FaGift className="w-5 h-5" />
                Get Discount
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FaShieldAlt className="text-emerald-500" />
                <span className="font-medium">100% Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FaShippingFast className="text-blue-500" />
                <span className="font-medium">Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FaLeaf className="text-emerald-500" />
                <span className="font-medium">FDA Approved</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Right Content - Product Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Multiple layered backgrounds for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-amber-100/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
              
              {/* Main product container with enhanced styling */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-elegant p-8 border border-white/50 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 hover-lift">
                {/* Product image with enhanced presentation */}
                <div className="relative">
                  {/* Floating elements around the product */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '0.5s'}}>
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1s'}}>
                    <FaFlask className="text-white text-sm" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1.5s'}}>
                    <FaStar className="text-white text-sm" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '2s'}}>
                    <FaHeart className="text-white text-sm" />
                  </div>
                  
                  {/* Main product image with enhanced styling */}
                  <div className="relative ">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-amber-50/30 rounded-2xl"></div>
                    <div className="relative z-10">
                      <Image
                        src="/product.png"
                        alt="Klys Minoxidil Solution"
                        width={400}
                        height={500}
                        className="object-contain w-full h-auto product-glow drop-shadow-2xl"
                        priority
                      />
                    </div>
                    {/* Subtle reflection effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-200/20 to-transparent rounded-b-2xl"></div>
                  </div>
                  
                  {/* Product label overlay */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg badge-float">
                    NEW
                  </div>
                </div>
                
                {/* Bottom info strip */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Premium Quality</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-amber-400 text-xs" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating testimonial card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-elegant p-4 border border-slate-200 max-w-xs animate-float glass">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">J</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">John D.</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-amber-400 text-xs" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">"Amazing results in just 3 months!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications & Why Klys */}
      <section id="why" className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-blue-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-emerald-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-soft badge-float">
                <FaAward className="text-blue-600" />
                Trusted by Thousands
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Choose
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 block animate-pulse">Klys?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our commitment to quality, science, and customer satisfaction sets us apart in the hair care industry.
              <span className="block mt-2 text-lg font-medium text-emerald-700">Join thousands of satisfied customers worldwide!</span>
            </p>
          </div>
          
          {/* Main Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift">
              {/* Floating elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float">
                <FaCheckCircle className="text-white text-xs" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1s'}}>
                <FaStar className="text-white text-xs" />
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                  <FaCheckCircle className="text-emerald-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">Clinically Proven Results</h3>
                <p className="text-slate-600 leading-relaxed">Our formula has been extensively tested and proven to deliver real, measurable hair regrowth results in clinical studies.</p>
              </div>
            </div>
            
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift">
              {/* Floating elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '0.5s'}}>
                <FaCheckCircle className="text-white text-xs" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1.5s'}}>
                <FaStar className="text-white text-xs" />
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                  <FaFlask className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">Dermatologist Recommended</h3>
                <p className="text-slate-600 leading-relaxed">Trusted by healthcare professionals worldwide for its safety and effectiveness in treating hair loss.</p>
              </div>
            </div>
            
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift">
              {/* Floating elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1s'}}>
                <FaCheckCircle className="text-white text-xs" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '2s'}}>
                <FaStar className="text-white text-xs" />
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                  <FaShieldAlt className="text-amber-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-700 transition-colors">100% Money Back Guarantee</h3>
                <p className="text-slate-600 leading-relaxed">We're confident in our product. If you're not satisfied within 90 days, we'll refund your purchase—no questions asked.</p>
              </div>
            </div>
          </div>
          
          {/* Additional Features Grid */}
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200/50 shadow-soft transition-all duration-300 hover:shadow-elegant hover:scale-105 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                <FaFlask className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">5% Minoxidil</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Clinically tested concentration for optimal results</p>
            </div>
            
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200/50 shadow-soft transition-all duration-300 hover:shadow-elegant hover:scale-105 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                <FaTruck className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">Free Delivery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Express shipping worldwide included</p>
            </div>
            
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200/50 shadow-soft transition-all duration-300 hover:shadow-elegant hover:scale-105 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                <FaLeaf className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">FDA Approved</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Safe, effective ingredients you can trust</p>
            </div>
            
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200/50 shadow-soft transition-all duration-300 hover:shadow-elegant hover:scale-105 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                <FaBoxOpen className="text-amber-600 text-2xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">3 Package Options</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Flexible solutions for your needs</p>
            </div>
          </div>
          
          {/* Bottom CTA for Why Choose section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-3xl p-8 border border-blue-200/50 shadow-soft">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Experience the Klys Difference?</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have already transformed their hair and confidence with our clinically proven formula.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  className="btn-primary text-lg px-8 py-4 shadow-elegant hover:scale-105 transition-transform duration-200 btn-enhanced"
                  onClick={() => scrollToSection('products')}
                >
                  Shop Now
                </button>
                <button 
                  className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200 btn-enhanced"
                  onClick={() => setShowNewsletterDialog(true)}
                >
                  Get Expert Tips
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Packages Section */}
      <section id="products" className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-blue-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-amber-100/30 to-yellow-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-soft badge-float">
                <FaGift className="text-blue-600" />
                Special Offers Available
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Choose Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 block animate-pulse">Perfect Package</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              All packages include free express shipping and our comprehensive money-back guarantee. 
              <span className="block mt-2 text-lg font-medium text-emerald-700">Start your hair transformation journey today!</span>
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`relative group bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift flex flex-col min-h-[800px] ${
                  selectedPackage?.id === pkg.id 
                    ? 'ring-2 ring-blue-500/30 border-blue-300 shadow-elegant' 
                    : 'hover:border-blue-300'
                } ${pkg.popular ? 'ring-2 ring-blue-500/20 border-blue-200' : ''}`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-elegant badge-float">
                    Most Popular
                  </div>
                )}
                
                {/* Value Badge */}
                {pkg.id === 6 && (
                  <div className="absolute -top-4 right-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-elegant badge-float">
                    Best Value
                  </div>
                )}
                
                {/* Floating elements around the card */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '0.5s'}}>
                  <FaCheckCircle className="text-white text-xs" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1s'}}>
                  <FaFlask className="text-white text-xs" />
                </div>
                
                {/* Product Image Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-amber-100/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-2xl p-6 border border-slate-200 shadow-soft group-hover:shadow-elegant transition-all duration-300">
                      <Image
                        src="/product.png"
                        alt={`${pkg.name} - Klys Minoxidil`}
                        width={120}
                        height={150}
                        className="object-contain w-full h-auto product-glow drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                      />
                      {/* Product label overlay */}
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        {pkg.id === 1 ? 'STARTER' : pkg.id === 2 ? 'POPULAR' : 'PREMIUM'}
                      </div>
                      {/* Floating rating stars */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-amber-400 text-xs" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Package Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-slate-600">{pkg.desc}</p>
                </div>
                
                {/* Price Section with enhanced styling */}
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-soft">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">
                        ${pkg.id === 1 ? '49.97' : pkg.id === 3 ? '119.91' : '203.82'}
                      </span>
                      <span className="text-slate-500 text-lg">total</span>
                    </div>
                    
                    {/* Per bottle price */}
                    <div className="text-sm text-slate-600 mb-3">
                      {pkg.id === 1 ? '$49.97' : pkg.id === 3 ? '$39.97' : '$33.97'} per bottle
                    </div>
                    
                    {/* Savings display */}
                    {pkg.id !== 1 && (
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-200">
                        <FaGift className="text-emerald-500" />
                        Save ${calculateSavings(pkg.id).toFixed(0)}
                      </div>
                    )}
                    
                    {/* Original price for comparison */}
                    {pkg.id !== 1 && (
                      <div className="text-sm text-slate-500 mt-2">
                        <span className="line-through">${(49.97 * (pkg.id === 3 ? 3 : 6)).toFixed(2)}</span>
                        <span className="text-emerald-600 font-semibold ml-2">-${calculateSavings(pkg.id).toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Features List with enhanced styling */}
                <div className="flex-grow">
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 group-hover/item:bg-emerald-200 transition-colors">
                          <FaCheckCircle className="text-emerald-600 text-xs" />
                        </div>
                        <span className="text-slate-700 group-hover/item:text-slate-900 transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Action Buttons with enhanced styling */}
                <div className="space-y-3">
                  <Link
                    href={`/products/${pkg.id}`}
                    className="w-full py-4 px-4 border-2 border-blue-800 text-blue-800 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center group-hover:scale-105"
                  >
                    View Details
                  </Link>
                  
                  <button
                    className="w-full py-4 px-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-elegant shadow-lg flex items-center justify-center group-hover:scale-105"
                    onClick={() => { 
                      addItem({
                        id: pkg.id,
                        name: pkg.name,
                        price: pkg.price,
                        stripeProductId: pkg.stripeProductId,
                        image: "/product.png"
                      });
                      toast.success(`${pkg.name} added to cart!`);
                    }}
                    aria-label={`Add ${pkg.name} to cart`}
                  >
                    Add to Cart - ${calculateTotalPrice(pkg.id).toFixed(2)}
                  </button>
                  
                  {/* Fast Payment Buttons with enhanced styling */}
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600 mb-3 text-center font-medium">Or pay instantly with:</p>
                    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl p-4 border border-slate-200 shadow-soft">
                      <FastPaymentButtons 
                        variant="secondary" 
                        size="sm" 
                        product={{
                          id: pkg.id,
                          name: pkg.name,
                          price: pkg.price,
                          stripeProductId: pkg.stripeProductId,
                          image: "/product.png"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-3xl p-8 border border-blue-200/50 shadow-soft">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Not Sure Which Package to Choose?</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Start with our 1-month supply to experience the Klys difference, or choose our most popular 3-month package for optimal results.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  className="btn-primary text-lg px-8 py-4 shadow-elegant hover:scale-105 transition-transform duration-200 btn-enhanced"
                  onClick={() => scrollToSection('why')}
                >
                  Learn More
                </button>
                <button 
                  className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200 btn-enhanced"
                  onClick={() => setShowNewsletterDialog(true)}
                >
                  Get Expert Advice
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-blue-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-100/30 to-yellow-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-soft badge-float">
                <FaStar className="text-blue-600" />
                Customer Success Stories
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              What Our Customers
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 block animate-pulse">Say About Us</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Real stories from people who have transformed their hair and confidence with Klys. 
              <span className="block mt-2 text-lg font-medium text-emerald-700">Join thousands of satisfied customers!</span>
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift">
              {/* Floating elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float">
                <FaCheckCircle className="text-white text-xs" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1s'}}>
                <FaStar className="text-white text-xs" />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_,i) => <FaStar key={i} className="text-amber-400" />)}
                  <span className="text-xs text-emerald-700 ml-2 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">Verified Buyer</span>
                </div>
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                  "Klys Minoxidil changed my life! My hair is fuller and I feel so much more confident. The results were visible within just a few months."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-blue-800 font-semibold">AR</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Alex Rodriguez</div>
                  <div className="text-sm text-slate-600">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift">
              {/* Floating elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '0.5s'}}>
                <FaCheckCircle className="text-white text-xs" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1.5s'}}>
                <FaStar className="text-white text-xs" />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_,i) => <FaStar key={i} className="text-amber-400" />)}
                  <span className="text-xs text-emerald-700 ml-2 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">Verified Buyer</span>
                </div>
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                  "I saw real results in just 3 months. The best investment I've made for myself. The customer service is exceptional too."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-emerald-800 font-semibold">JL</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Jamie Lee</div>
                  <div className="text-sm text-slate-600">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift">
              {/* Floating elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1s'}}>
                <FaCheckCircle className="text-white text-xs" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '2s'}}>
                <FaStar className="text-white text-xs" />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_,i) => <FaStar key={i} className="text-amber-400" />)}
                  <span className="text-xs text-emerald-700 ml-2 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">Verified Buyer</span>
                </div>
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                  "Easy to use, fast shipping, and the customer support is amazing! I've been using it for 6 months and the results are incredible."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-amber-800 font-semibold">MS</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Morgan Smith</div>
                  <div className="text-sm text-slate-600">Verified Customer</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA for testimonials */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-3xl p-8 border border-blue-200/50 shadow-soft">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Join Our Success Stories?</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Start your hair transformation journey today and become the next success story. Join thousands of satisfied customers who have already experienced the Klys difference.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  className="btn-primary text-lg px-8 py-4 shadow-elegant hover:scale-105 transition-transform duration-200 btn-enhanced"
                  onClick={() => scrollToSection('products')}
                >
                  Start Your Journey
                </button>
                <button 
                  className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200 btn-enhanced"
                  onClick={() => setShowNewsletterDialog(true)}
                >
                  Get Expert Tips
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative w-full bg-white py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-blue-200/20 rounded-full opacity-30 blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-emerald-100/20 to-emerald-200/20 rounded-full opacity-30 blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-soft badge-float">
                <FaRegCommentDots className="text-blue-600" />
                Got Questions?
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 block animate-pulse">Questions</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Get answers to the most common questions about Klys Minoxidil.
              <span className="block mt-2 text-lg font-medium text-emerald-700">Everything you need to know to get started!</span>
            </p>
          </div>
          
          <div className="space-y-6">
            <details className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-elegant transition-all duration-300" open>
              <summary className="font-semibold text-xl text-slate-900 cursor-pointer group-open:text-blue-800 transition-colors flex items-center justify-between">
                <span>How soon will I see results?</span>
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-open:bg-blue-200 transition-colors">
                  <svg className="w-4 h-4 text-blue-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Most users see visible results within 3-6 months of consistent use. Individual results may vary based on factors such as age, genetics, and the extent of hair loss.
              </p>
            </details>
            
            <details className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-elegant transition-all duration-300">
              <summary className="font-semibold text-xl text-slate-900 cursor-pointer group-open:text-blue-800 transition-colors flex items-center justify-between">
                <span>Is Klys Minoxidil safe?</span>
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-open:bg-blue-200 transition-colors">
                  <svg className="w-4 h-4 text-blue-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Yes! Our formula is FDA-approved and clinically tested for safety and effectiveness. We use only the highest quality ingredients that meet strict pharmaceutical standards.
              </p>
            </details>
            
            <details className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-elegant transition-all duration-300">
              <summary className="font-semibold text-xl text-slate-900 cursor-pointer group-open:text-blue-800 transition-colors flex items-center justify-between">
                <span>Do you offer a money-back guarantee?</span>
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-open:bg-blue-200 transition-colors">
                  <svg className="w-4 h-4 text-blue-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Absolutely. We stand behind our product with a comprehensive money-back guarantee. If you're not satisfied within 90 days, we'll refund your purchase—no questions asked.
              </p>
            </details>
            
            <details className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-elegant transition-all duration-300">
              <summary className="font-semibold text-xl text-slate-900 cursor-pointer group-open:text-blue-800 transition-colors flex items-center justify-between">
                <span>How do I use the product?</span>
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-open:bg-blue-200 transition-colors">
                  <svg className="w-4 h-4 text-blue-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Apply the solution to your scalp twice daily as directed. Full instructions are included with your order, and our customer support team is always available to help.
              </p>
            </details>
          </div>
          
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-3xl p-8 border border-blue-200/50 shadow-soft">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Our expert support team is here to help you with any questions about Klys Minoxidil. We're committed to your success and satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#contact" className="btn-primary text-lg px-8 py-4 shadow-elegant hover:scale-105 transition-transform duration-200 btn-enhanced inline-flex items-center gap-2">
                  Contact Support Team
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <button 
                  className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200 btn-enhanced"
                  onClick={() => setShowNewsletterDialog(true)}
                >
                  Get Expert Advice
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Dialog */}
      <NewsletterDialog 
        isOpen={showNewsletterDialog} 
        onClose={() => setShowNewsletterDialog(false)} 
      />

      {/* Cart */}
      <Cart />
    </div>
  );
}
