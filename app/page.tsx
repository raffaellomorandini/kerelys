"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaShippingFast, FaLock, FaStar, FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaLeaf, FaFlask, FaBoxOpen, FaTruck, FaShieldAlt, FaCcVisa, FaCcMastercard, FaCcPaypal, FaRegCommentDots, FaGift, FaAward, FaHeart, FaUsers, FaDownload, FaPlay, FaClock, FaUser, FaTimes } from "react-icons/fa";
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { addEmail } from "./actions";
import { toast } from "sonner";
import NewsletterDialog from "./components/NewsletterDialog";
import Cart from "./components/Cart";
import CartIcon from "./components/CartIcon";
import { useCart } from "./contexts/CartContext";
import FastPaymentButtons from "./components/FastPaymentButtons";
import Link from "next/link";
import { packages, PackageType, calculateSavings, calculateTotalPrice } from "./lib/products";
import ProductImageSlider from "./components/ProductImageSlider";

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(packages[1]); // Default to the popular package
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
      {/* Modern Hero Section */}
      <section className="relative w-full min-h-screen bg-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-emerald-600/3 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Premium Hair Care Solution</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 
                  className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tight"
                  style={{ fontFamily: 'var(--font-code-bold)' }}
                >
                  Transform Your
                  <span className="block text-emerald-600">Hair Journey</span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 max-w-lg leading-relaxed">
                  Clinically proven minoxidil formula that delivers visible results in weeks, not months.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 py-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">95%</div>
                  <div className="text-sm text-slate-500">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">4-8</div>
                  <div className="text-sm text-slate-500">Weeks to Results</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">50K+</div>
                  <div className="text-sm text-slate-500">Happy Customers</div>
                </div>
              </div>
              
              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-300"
                  onClick={() => scrollToSection('products')}
                >
                  <span className="relative z-10">Shop Now - $49.97</span>
                </button>
                <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300">
                  Learn More
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">FDA Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">30-Day Guarantee</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Product Display */}
            <div className="relative">
              {/* Main Product Card */}
              <div className="relative bg-white rounded-3xl border border-slate-200 p-8">
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                  #1 Best Seller
                </div>
                
                {/* Product Image */}
                <div className="relative mb-6">
                  <div className="relative bg-white rounded-xl p-6 border border-slate-100">
                    <img
                      src="/product.png"
                      alt="Klys Minoxidil"
                      className="w-full h-64 object-contain"
                    />
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Klys 5% Minoxidil</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">$49.97</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-1">Save ${calculateSavings(1)}</div>
                    </div>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FaLeaf className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">100% Organic</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FaFlask className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Food Grade</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FaBoxOpen className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">60ml Volume</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FaTruck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Free Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section id="tutorial" className="relative w-full bg-slate-50 py-20 lg:py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-600/5 to-transparent rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-emerald-600/4 to-transparent rounded-full opacity-40 blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                <FaPlay className="text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Step-by-Step Tutorial</span>
              </span>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-code-bold)' }}
            >
              How to Use
              <span className="block text-emerald-600">Klys Minoxidil</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Follow our simple step-by-step guide to achieve optimal results with Klys Minoxidil.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Column: Step-by-Step Instructions */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Application Steps</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Clean Your Scalp</h4>
                      <p className="text-slate-600">Wash your hair with a mild shampoo and towel dry until slightly damp.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Apply the Solution</h4>
                      <p className="text-slate-600">Use the dropper to apply 1ml (20 drops) to the affected areas of your scalp.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Massage Gently</h4>
                      <p className="text-slate-600">Gently massage the solution into your scalp with your fingertips.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Let It Dry</h4>
                      <p className="text-slate-600">Allow the solution to dry completely before styling your hair.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-2xl border border-slate-200">
                  <FaClock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900">Twice Daily</div>
                  <div className="text-sm text-slate-600">Morning & Evening</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl border border-slate-200">
                  <FaUser className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900">1ml Per Use</div>
                  <div className="text-sm text-slate-600">20 Drops</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl border border-slate-200">
                  <FaCheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900">4+ Months</div>
                  <div className="text-sm text-slate-600">For Best Results</div>
                </div>
              </div>
            </div>

            {/* Right Column: Before/After Slider */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">See the Results</h3>
                <div className="relative h-96 rounded-2xl overflow-hidden border border-slate-200">
                  <ReactCompareSlider
                    itemOne={
                      <ReactCompareSliderImage
                        src="/rand1.png"
                        alt="Before Treatment"
                        className="w-full h-full object-cover"
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src="/rand2.png"
                        alt="After Treatment"
                        className="w-full h-full object-cover"
                      />
                    }
                    handle={
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                      </div>
                    }
                    className="w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Before
                  </div>
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    After
                  </div>
                </div>
                <p className="text-center text-slate-600 mt-4 text-sm">
                  Drag the slider to see the transformation
                </p>
              </div>
            </div>
          </div>

          {/* PDF Download Button */}
          <div className="text-center">
            <div className="relative bg-white rounded-3xl p-12 border border-slate-200">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm">
                Download Complete Guide
              </div>
              <div className="pt-4">
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-6">Get Your Complete Tutorial Guide</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Download our comprehensive PDF guide with detailed instructions, tips, and best practices for optimal results.
                </p>
                <a
                  href="/tutorial.pdf"
                  download="Klys_Minoxidil_Tutorial.pdf"
                  className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-300 inline-flex items-center gap-3"
                >
                  <FaDownload className="w-5 h-5" />
                  <span>Download PDF Guide</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications & Why Klys */}
      <section id="why" className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.03),transparent_50%)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[emerald-600]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-[emerald-600]/8 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 ">
                <FaAward className="text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Scientifically Proven Results</span>
              </span>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-code-bold)' }}
            >
              Why Choose
              <span className="block text-emerald-600">Klys?</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Our advanced formula works at the cellular level to transform your hair from the inside out.
            </p>
          </div>

          {/* Modern Feature Layout */}
          <div className="space-y-16 mb-20">
            {/* Feature 1: Reactivates Hair Follicles */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[emerald-600]/20 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white rounded-3xl p-8  border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[emerald-600] rounded-2xl flex items-center justify-center ">
                        <FaLeaf className="text-slate-900 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900">Reactivates Hair Follicles</h3>
                        <p className="text-emerald-600 font-semibold">Deep Cellular Action</p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                      Our advanced formula penetrates deep into the scalp to awaken dormant hair follicles and stimulate new growth at the cellular level.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-600">85%</div>
                        <div className="text-sm text-slate-600">Follicle Activation</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-600">2x</div>
                        <div className="text-sm text-slate-600">Faster Results</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Deep Scalp Penetration</h4>
                      <p className="text-slate-600">Reaches the root cause of hair loss</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Stimulates Blood Flow</h4>
                      <p className="text-slate-600">Increases nutrient delivery to follicles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Awakens Dormant Follicles</h4>
                      <p className="text-slate-600">Brings sleeping follicles back to life</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Stronger & Thicker Hair */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Reinforces Hair Structure</h4>
                      <p className="text-slate-600">Strengthens from the inside out</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Reduces Breakage</h4>
                      <p className="text-slate-600">Protects against damage and loss</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Promotes Density</h4>
                      <p className="text-slate-600">Creates fuller, thicker appearance</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[emerald-600]/20 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white rounded-3xl p-8  border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[emerald-600] rounded-2xl flex items-center justify-center ">
                        <FaShieldAlt className="text-slate-900 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900">Stronger & Thicker Hair</h3>
                        <p className="text-emerald-600 font-semibold">Structural Reinforcement</p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                      Strengthens existing hair strands and promotes thicker, more resilient growth that lasts and resists damage.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-600">3x</div>
                        <div className="text-sm text-slate-600">Hair Strength</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-600">40%</div>
                        <div className="text-sm text-slate-600">Thicker Strands</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Hair Regrowth */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[emerald-600]/20 to-transparent rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white rounded-3xl p-8  border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[emerald-600] rounded-2xl flex items-center justify-center ">
                        <FaCheckCircle className="text-slate-900 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900">Proven Hair Regrowth</h3>
                        <p className="text-emerald-600 font-semibold">Visible Results</p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                      Clinically proven to regrow hair in areas where it was lost, restoring your natural hairline and confidence.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-600">95%</div>
                        <div className="text-sm text-slate-600">Success Rate</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-600">4-8</div>
                        <div className="text-sm text-slate-600">Weeks to Results</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Visible New Growth</h4>
                      <p className="text-slate-600">See real results in weeks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Restores Hairline</h4>
                      <p className="text-slate-600">Brings back your natural look</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Long-lasting Results</h4>
                      <p className="text-slate-600">Maintains your progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Features Grid */}
          <div className="grid lg:grid-cols-4 gap-6 mb-20">
            <div className="group bg-white rounded-2xl  border border-slate-100 p-6 text-center hover: transition-all duration-300 ">
              <div className="w-12 h-12 bg-[emerald-600] rounded-xl flex items-center justify-center mx-auto mb-4 ">
                <FaFlask className="text-slate-900 text-xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">5% Minoxidil</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Clinically tested concentration for optimal results</p>
            </div>
            
            <div className="group bg-white rounded-2xl  border border-slate-100 p-6 text-center hover: transition-all duration-300 ">
              <div className="w-12 h-12 bg-[emerald-600] rounded-xl flex items-center justify-center mx-auto mb-4 ">
                <FaTruck className="text-slate-900 text-xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Free Delivery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Express shipping worldwide included</p>
            </div>
            
            <div className="group bg-white rounded-2xl  border border-slate-100 p-6 text-center hover: transition-all duration-300 ">
              <div className="w-12 h-12 bg-[emerald-600] rounded-xl flex items-center justify-center mx-auto mb-4 ">
                <FaLeaf className="text-slate-900 text-xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">FDA Approved</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Safe, effective ingredients you can trust</p>
            </div>
            
            <div className="group bg-white rounded-2xl  border border-slate-100 p-6 text-center hover: transition-all duration-300 ">
              <div className="w-12 h-12 bg-[emerald-600] rounded-xl flex items-center justify-center mx-auto mb-4 ">
                <FaBoxOpen className="text-slate-900 text-xl" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">3 Package Options</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Flexible solutions for your needs</p>
            </div>
          </div>
          
          {/* Bottom CTA for Why Choose section */}
          <div className="text-center">
            <div className="relative bg-white rounded-3xl p-12  border border-slate-100">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[emerald-600] text-slate-900 px-6 py-2 rounded-full font-bold text-sm ">
                Ready to Transform?
              </div>
              <div className="pt-4">
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-6">Experience the Klys Difference</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of satisfied customers who have already transformed their hair and confidence with our clinically proven formula.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-300"
                    onClick={() => scrollToSection('products')}
                  >
                    <span className="relative z-10">Shop Now</span>
                  </button>
                  <button 
                    className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300"
                    onClick={() => setShowNewsletterDialog(true)}
                  >
                    Get Expert Tips
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="relative w-full bg-white py-16 lg:py-20">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600/10 to-emerald-500/10 border border-emerald-600/20 rounded-full px-4 py-2 mb-4">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
              <span className="text-xs font-semibold text-slate-700">Premium Hair Care</span>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-4"
              style={{ fontFamily: 'var(--font-code-bold)' }}
            >
              Klys Minoxidil
              <span className="block text-emerald-600">Treatment</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Clinically proven 5% minoxidil formula designed for maximum efficacy. 
              <span className="block mt-1 text-base font-medium text-slate-700">Choose your treatment plan below.</span>
            </p>
          </div>
          
          {/* Main Product Card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm">
              <div className="grid lg:grid-cols-2 min-h-[500px]">
                {/* Left Column - Product Image & Info */}
                <div className="relative p-8 lg:p-10 bg-white">
                  {/* Product Image */}
                  <div className="relative mb-8">
                    <ProductImageSlider images={["/product.png", "/product.png", "/product.png"]} alt="Klys Minoxidil" size="large" />
                  </div>

                  {/* Product Description */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Klys 5% Minoxidil Solution</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        Our advanced formula contains 5% minoxidil, the gold standard for hair regrowth treatment. 
                        Each 60ml bottle provides up to 30 days of treatment when used as directed.
                      </p>
                    </div>

                    {/* Key Features Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-slate-700">FDA Approved</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-slate-700">Clinically Proven</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-slate-700">Easy Application</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-slate-700">Fast Results</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Package Selection */}
                <div className="p-8 lg:p-10 bg-white border-l border-slate-100">
                  <div className="space-y-6">
                    {/* Package Selection Header */}
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Select Your Plan</h4>
                      <p className="text-slate-600 text-sm">Choose the treatment duration that works best for you</p>
                    </div>

                    {/* Package Options */}
                    <div className="space-y-3">
                      {packages.map((pkg) => (
                        <label
                key={pkg.id}
                          className={`relative block cursor-pointer transition-all duration-300 ${
                  selectedPackage?.id === pkg.id
                              ? 'ring-2 ring-emerald-600 ring-offset-1'
                              : 'hover:bg-emerald-50/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="package"
                            value={pkg.id}
                            checked={selectedPackage?.id === pkg.id}
                            onChange={() => setSelectedPackage(pkg)}
                            className="sr-only"
                          />
                          
                          <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedPackage?.id === pkg.id
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-slate-200 bg-white hover:border-emerald-300'
                          }`}>
                            <div className="flex items-start justify-between">
                              {/* Radio Button */}
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                                selectedPackage?.id === pkg.id
                                  ? 'border-emerald-600 bg-emerald-600'
                                  : 'border-slate-300'
                              }`}>
                                {selectedPackage?.id === pkg.id && (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
          </div>

                              {/* Package Content */}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h5 className="text-base font-bold text-slate-900">{pkg.name}</h5>
                                    <p className="text-slate-600 text-xs">{pkg.desc}</p>
                  </div>
                                  {pkg.popular && (
                                    <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                      Most Popular
                                    </span>
                                  )}
                                </div>

                                {/* Price and Savings */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-lg font-bold text-slate-900">${pkg.price}</div>
                                    <div className="text-xs text-slate-500">{pkg.per}</div>
                      </div>
                                  {pkg.id !== 1 && (
                                    <div className="text-right">
                                      <div className="text-xs text-emerald-600 font-semibold mt-1">
                                        Save ${calculateSavings(pkg.id)}
                    </div>
                                      <div className="text-xs text-slate-500">vs monthly</div>
                          </div>
                        )}
                      </div>
                    </div>
                            </div>
                          </div>
                        </label>
                      ))}
                  </div>
                  
                    {/* Selected Package Summary */}
                    {selectedPackage && (
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <h5 className="font-semibold text-slate-900 mb-3 text-sm">Package Includes:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedPackage.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-emerald-600 rounded-full flex items-center justify-center">
                                <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                              <span className="text-xs text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    )}

                    {/* Pricing and CTA */}
                    {selectedPackage && (
                      <div className="space-y-4">
                        {/* Total Price */}
                        <div className="bg-white rounded-xl p-4 border border-emerald-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-slate-700">Total Price:</span>
                            <span className="text-2xl font-bold text-emerald-600">${calculateTotalPrice(selectedPackage.id).toFixed(2)}</span>
                        </div>
                          <div className="text-xs text-slate-500">
                            Includes free shipping and money-back guarantee
                      </div>
                    </div>
                    
                        {/* Action Buttons */}
                        <div className="space-y-3">
                      <button
                        onClick={() => {
                          addItem(selectedPackage);
                        }}
                            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold text-base hover:bg-emerald-700 transition-all duration-300"
                      >
                        Add to Cart - ${calculateTotalPrice(selectedPackage.id).toFixed(2)}
                      </button>
                      
                      <Link
                            href={`/product?package=${selectedPackage.id}`}
                            className="w-full py-2 px-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:border-[emerald-600] hover:text-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>View Full Details</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                    )}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative w-full bg-white py-20 lg:py-32">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 ">
                <FaStar className="text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Customer Success Stories</span>
              </span>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-code-bold)' }}
            >
              What Our Customers
              <span className="block text-emerald-600">Say About Us</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Real stories from people who have transformed their hair and confidence with Klys. 
              <span className="block mt-2 text-lg font-semibold text-emerald-600">Join thousands of satisfied customers!</span>
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="relative group bg-white rounded-3xl p-8  border border-slate-100 transition-all duration-500 hover: ">
              {/* Floating elements */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center ">
                <FaCheckCircle className="text-slate-900 text-sm" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center ">
                <FaStar className="text-slate-900 text-sm" />
              </div>
              
              <div className="flex-grow pt-4">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_,i) => <FaStar key={i} className="text-emerald-600" />)}
                  <span className="text-xs text-slate-700 ml-3 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Verified Buyer</span>
                </div>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  "Klys Minoxidil changed my life! My hair is fuller and I feel so much more confident. The results were visible within just a few months."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[emerald-600] rounded-full flex items-center justify-center ">
                  <span className="text-slate-900 font-bold">AR</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Alex Rodriguez</div>
                  <div className="text-sm text-slate-600">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white rounded-3xl p-8  border border-slate-100 transition-all duration-500 hover: ">
              {/* Floating elements */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center ">
                <FaCheckCircle className="text-slate-900 text-sm" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center ">
                <FaStar className="text-slate-900 text-sm" />
              </div>
              
              <div className="flex-grow pt-4">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_,i) => <FaStar key={i} className="text-emerald-600" />)}
                  <span className="text-xs text-slate-700 ml-3 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Verified Buyer</span>
                </div>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  "I saw real results in just 3 months. The best investment I've made for myself. The customer service is exceptional too."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[emerald-600] rounded-full flex items-center justify-center ">
                  <span className="text-slate-900 font-bold">JL</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Jamie Lee</div>
                  <div className="text-sm text-slate-600">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white rounded-3xl p-8  border border-slate-100 transition-all duration-500 hover: ">
              {/* Floating elements */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center ">
                <FaCheckCircle className="text-slate-900 text-sm" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center ">
                <FaStar className="text-slate-900 text-sm" />
              </div>
              
              <div className="flex-grow pt-4">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_,i) => <FaStar key={i} className="text-emerald-600" />)}
                  <span className="text-xs text-slate-700 ml-3 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Verified Buyer</span>
                </div>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  "Easy to use, fast shipping, and the customer support is amazing! I've been using it for 6 months and the results are incredible."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[emerald-600] rounded-full flex items-center justify-center ">
                  <span className="text-slate-900 font-bold">MS</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Morgan Smith</div>
                  <div className="text-sm text-slate-600">Verified Customer</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA for testimonials */}
          <div className="text-center mt-20">
            <div className="relative bg-white rounded-3xl p-12  border border-slate-100">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[emerald-600] text-slate-900 px-6 py-2 rounded-full font-bold text-sm ">
                Join Our Success Stories
              </div>
              <div className="pt-4">
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-6">Ready to Transform Your Hair?</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Start your hair transformation journey today and become the next success story. Join thousands of satisfied customers who have already experienced the Klys difference.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-300"
                    onClick={() => scrollToSection('products')}
                  >
                    <span className="relative z-10">Shop Now</span>
                  </button>
                  <button 
                    className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300"
                    onClick={() => setShowNewsletterDialog(true)}
                  >
                    Get Expert Tips
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20 lg:py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.03),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-[emerald-600]/10 to-transparent rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-[emerald-600]/8 to-transparent rounded-full opacity-30 blur-3xl"></div>
        
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 ">
                <FaRegCommentDots className="text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Got Questions?</span>
              </span>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-code-bold)' }}
            >
              Frequently Asked
              <span className="block text-emerald-600">Questions</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Get answers to the most common questions about Klys Minoxidil.
              <span className="block mt-2 text-lg font-semibold text-emerald-600">Everything you need to know to get started!</span>
            </p>
          </div>
          
          <div className="space-y-6">
            <details className="group bg-white rounded-3xl p-8 border border-slate-100  hover: transition-all duration-300" open>
              <summary className="font-bold text-xl text-slate-900 cursor-pointer group-open:text-emerald-600 transition-colors flex items-center justify-between">
                <span>How soon will I see results?</span>
                <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center group-open:bg-slate-900 transition-colors ">
                  <svg className="w-5 h-5 text-slate-900 group-open:text-emerald-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-6 text-slate-700 leading-relaxed text-lg">
                Most users see visible results within 3-6 months of consistent use. Individual results may vary based on factors such as age, genetics, and the extent of hair loss.
              </p>
            </details>
            
            <details className="group bg-white rounded-3xl p-8 border border-slate-100  hover: transition-all duration-300">
              <summary className="font-bold text-xl text-slate-900 cursor-pointer group-open:text-emerald-600 transition-colors flex items-center justify-between">
                <span>Is Klys Minoxidil safe?</span>
                <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center group-open:bg-slate-900 transition-colors ">
                  <svg className="w-5 h-5 text-slate-900 group-open:text-emerald-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-6 text-slate-700 leading-relaxed text-lg">
                Yes! Our formula is FDA-approved and clinically tested for safety and effectiveness. We use only the highest quality ingredients that meet strict pharmaceutical standards.
              </p>
            </details>
            
            <details className="group bg-white rounded-3xl p-8 border border-slate-100  hover: transition-all duration-300">
              <summary className="font-bold text-xl text-slate-900 cursor-pointer group-open:text-emerald-600 transition-colors flex items-center justify-between">
                <span>Do you offer a money-back guarantee?</span>
                <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center group-open:bg-slate-900 transition-colors ">
                  <svg className="w-5 h-5 text-slate-900 group-open:text-emerald-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-6 text-slate-700 leading-relaxed text-lg">
                Absolutely. We stand behind our product with a comprehensive money-back guarantee. If you're not satisfied within 90 days, we'll refund your purchase—no questions asked.
              </p>
            </details>
            
            <details className="group bg-white rounded-3xl p-8 border border-slate-100  hover: transition-all duration-300">
              <summary className="font-bold text-xl text-slate-900 cursor-pointer group-open:text-emerald-600 transition-colors flex items-center justify-between">
                <span>How do I use the product?</span>
                <div className="w-8 h-8 bg-[emerald-600] rounded-full flex items-center justify-center group-open:bg-slate-900 transition-colors ">
                  <svg className="w-5 h-5 text-slate-900 group-open:text-emerald-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <p className="mt-6 text-slate-700 leading-relaxed text-lg">
                Apply the solution to your scalp twice daily as directed. Full instructions are included with your order, and our customer support team is always available to help.
              </p>
            </details>
          </div>
          
          <div className="text-center mt-20">
            <div className="relative bg-white rounded-3xl p-12  border border-slate-100">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[emerald-600] text-slate-900 px-6 py-2 rounded-full font-bold text-sm ">
                Need More Help?
              </div>
              <div className="pt-4">
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-6">Still have questions?</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Our expert support team is here to help you with any questions about Klys Minoxidil. We're committed to your success and satisfaction.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="#contact" className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover: transition-all duration-300 inline-flex items-center gap-2">
                    <span className="relative z-10">Contact Support Team</span>
                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  <button 
                    className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300"
                    onClick={() => setShowNewsletterDialog(true)}
                  >
                    Get Expert Advice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Newsletter Section */}
      <section id="newsletter" className="relative w-full bg-white py-20 lg:py-32">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 ">
                <FaEnvelope className="text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Stay Updated</span>
              </span>
            </div>
            <h2 
              className="text-4xl lg:text-6xl font-black text-slate-900 leading-[0.9] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-code-bold)' }}
            >
              Join Our
              <span className="block text-emerald-600">Newsletter</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Get exclusive hair care tips, early access to new products, and special offers delivered straight to your inbox.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Benefits */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8  border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">What You'll Get</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaGift className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Exclusive Discounts</h4>
                      <p className="text-slate-600">Be the first to know about special offers and get exclusive discount codes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaLeaf className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Hair Care Tips</h4>
                      <p className="text-slate-600">Expert advice and proven techniques for optimal hair health and growth.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaFlask className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Product Updates</h4>
                      <p className="text-slate-600">Early access to new products and formulations before they're available to everyone.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaUsers className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Success Stories</h4>
                      <p className="text-slate-600">Real customer testimonials and transformation stories to inspire your journey.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-2xl  border border-slate-100">
                  <FaShieldAlt className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900">Privacy First</div>
                  <div className="text-sm text-slate-600">Your data is safe</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl  border border-slate-100">
                  <FaCheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900">No Spam</div>
                  <div className="text-sm text-slate-600">Quality content only</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl  border border-slate-100">
                  <FaTimes className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-slate-900">Easy Unsubscribe</div>
                  <div className="text-sm text-slate-600">One click to leave</div>
                </div>
              </div>
            </div>

            {/* Right Column: Newsletter Form */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8  border border-slate-100">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Get Your Welcome Gift!</h3>
                  <p className="text-slate-600">Subscribe now and receive an exclusive discount code for your first purchase.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                    value="newsletter_section"
                  />

                  <div>
                    <label htmlFor="newsletter-email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        id="newsletter-email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[emerald-600] focus:border-[emerald-600] disabled:opacity-50 text-lg"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <FaGift className="w-5 h-5" />
                        Subscribe & Get Discount
                      </>
                    )}
                  </button>
                </form>

                {/* Privacy notice */}
                <p className="text-sm text-slate-500 text-center mt-6">
                  We respect your privacy. Unsubscribe at any time. No spam, ever.
                </p>

                {/* Social proof */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-600" />
                      <span className="font-medium">10,000+ subscribers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStar className="text-emerald-600" />
                      <span className="font-medium">4.9/5 rating</span>
                    </div>
                  </div>
                </div>
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
