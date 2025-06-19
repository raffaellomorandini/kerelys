"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaShippingFast, FaLock, FaStar, FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaLeaf, FaFlask, FaBoxOpen, FaTruck, FaShieldAlt, FaCcVisa, FaCcMastercard, FaCcPaypal, FaRegCommentDots } from "react-icons/fa";

interface PackageType {
  id: number;
  name: string;
  desc: string;
  price: number;
  per: string;
  features: string[];
  popular?: boolean;
  stripeProductId: string;
}

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsPackage, setDetailsPackage] = useState<PackageType | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const packages: PackageType[] = [
    {
      id: 1,
      name: "1 Month Supply",
      desc: "Perfect for trying",
      price: 49.97,
      per: "/bottle",
      stripeProductId: "prod_SWkMCTU7zYFuy7",
      features: [
        "1 x 60ml Bottle",
        "Free Shipping",
        "30-Day Money Back"
      ],
    },
    {
      id: 3,
      name: "3 Month Supply",
      desc: "Recommended treatment",
      price: 39.97,
      per: "/bottle",
      stripeProductId: "prod_SWkMCTU7zYFuy7",
      features: [
        "3 x 60ml Bottles",
        "Free Express Shipping",
        "60-Day Money Back",
        "Progress Tracking Guide"
      ],
      popular: true
    },
    {
      id: 6,
      name: "6 Month Supply",
      desc: "Best value & results",
      price: 33.97,
      per: "/bottle",
      stripeProductId: "prod_SWkMCTU7zYFuy7",
      features: [
        "6 x 60ml Bottles",
        "Free Express Shipping",
        "90-Day Money Back",
        "Complete Hair Care Kit",
        "Personal Consultation"
      ],
    }
  ];

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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

  // Social proof popup logic
 

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start w-full font-sans">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#8B4513] tracking-tight">Kerelys</span>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium flex items-center gap-1">
                    <FaLeaf className="text-green-600" /> Authentic
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium flex items-center gap-1">
                    <FaFlask className="text-blue-600" /> FDA Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Products</a>
              <a href="#why" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Why Kerelys?</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Reviews</a>
              <a href="#faq" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">FAQ</a>
              <a href="#contact" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Contact</a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
             
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-[#8B4513] hover:bg-gray-50 rounded-lg transition-colors" 
                aria-label="Open navigation" 
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileNavOpen(false)}>
            <nav className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl flex flex-col p-8">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-[#8B4513]">Menu</span>
                <button 
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" 
                  onClick={() => setMobileNavOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                <a href="#products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Products</a>
                <a href="#why" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Why Kerelys?</a>
                <a href="#testimonials" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Reviews</a>
                <a href="#faq" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>FAQ</a>
                <a href="#contact" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Contact</a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B4513] bg-[#8B4513]/10 px-4 py-2 rounded-full">
                <FaFlask className="text-[#8B4513]" />
                Clinically Proven Formula
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Regrow Your Confidence with
              <span className="text-[#8B4513] block">Kerelys Minoxidil</span>
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed mb-8">
              Experience real, visible hair regrowth with our advanced, dermatologist-recommended formula. Trusted by thousands, Kerelys Minoxidil is your path to fuller, thicker hair and renewed self-assurance.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button 
                className="bg-[#8B4513] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#A0522D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2"
                onClick={() => scrollToSection('products')}
              >
                Shop Now
              </button>
              <button 
                className="border-2 border-[#8B4513] text-[#8B4513] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8B4513] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2"
                onClick={() => scrollToSection('why')}
              >
                Learn More
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaShieldAlt className="text-green-500" />
                <span className="font-medium">100% Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaShippingFast className="text-blue-500" />
                <span className="font-medium">Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaLeaf className="text-green-500" />
                <span className="font-medium">FDA Approved</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Product Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513]/20 to-transparent rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <Image
                  src="/product.png"
                  alt="Kerelys Minoxidil Solution"
                  width={400}
                  height={500}
                  className="object-contain w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications & Why Kerelys */}
      <section id="why" className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Kerelys?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to quality, science, and customer satisfaction sets us apart in the hair care industry.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Clinically Proven Results</h3>
                    <p className="text-gray-600">Our formula has been extensively tested and proven to deliver real, measurable hair regrowth results.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaFlask className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Dermatologist Recommended</h3>
                    <p className="text-gray-600">Trusted by healthcare professionals worldwide for its safety and effectiveness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Money Back Guarantee</h3>
                    <p className="text-gray-600">We're confident in our product. If you're not satisfied, we'll refund your purchase—no questions asked.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaTruck className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Express Shipping</h3>
                    <p className="text-gray-600 text-sm">Fast, reliable delivery to your doorstep with tracking and insurance included.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFlask className="text-blue-600 text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">5% Minoxidil</h3>
                <p className="text-gray-600 text-sm">Clinically tested concentration for optimal results</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTruck className="text-green-600 text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Free Delivery</h3>
                <p className="text-gray-600 text-sm">Express shipping worldwide included</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLeaf className="text-green-600 text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">FDA Approved</h3>
                <p className="text-gray-600 text-sm">Safe, effective ingredients you can trust</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBoxOpen className="text-orange-600 text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">3 Package Options</h3>
                <p className="text-gray-600 text-sm">Flexible solutions for your needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Packages Section */}
      <section id="products" className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Package</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All packages include free express shipping and our comprehensive money-back guarantee.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 relative hover:shadow-xl ${
                  selectedPackage?.id === pkg.id 
                    ? 'border-[#8B4513] shadow-xl' 
                    : 'border-gray-200 hover:border-[#8B4513]'
                } ${pkg.popular ? 'border-[#8B4513] ring-2 ring-[#8B4513]/20' : ''}`}
                onClick={() => { setDetailsOpen(true); setDetailsPackage(pkg); }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${pkg.name}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#8B4513] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}
                {pkg.id === 6 && (
                  <div className="absolute -top-4 right-4 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    Best Value
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600">{pkg.desc}</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-[#8B4513]">${pkg.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-lg">{pkg.per}</span>
                  </div>
                  {pkg.popular && <div className="text-sm text-green-600 font-semibold mt-2">Save $30</div>}
                  {pkg.id === 6 && <div className="text-sm text-green-600 font-semibold mt-2">Save $96</div>}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                
                <details className="mb-6">
                  <summary className="text-[#8B4513] font-semibold cursor-pointer hover:text-[#A0522D] transition-colors">
                    What's included?
                  </summary>
                  <ul className="text-gray-600 text-sm mt-3 space-y-2 pl-4">
                    <li>• 1x Kerelys Minoxidil bottle per month</li>
                    <li>• Easy-apply dropper</li>
                    <li>• Progress tracking guide</li>
                    <li>• Access to support team</li>
                  </ul>
                </details>
                
                <div className="text-xs text-green-700 mb-4 flex items-center gap-2 justify-center">
                  <FaShippingFast className="text-green-600" />
                  Free Express Shipping
                </div>
                
                <button
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                    selectedPackage?.id === pkg.id 
                      ? 'bg-[#8B4513] text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                  onClick={e => { e.stopPropagation(); }}
                  aria-label={`Buy ${pkg.name} now`}
                >
                  {selectedPackage?.id === pkg.id ? 'Selected' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from people who have transformed their hair and confidence with Kerelys.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_,i) => <FaStar key={i} className="text-yellow-400" />)}
                <span className="text-xs text-green-700 ml-2 font-semibold">Verified Buyer</span>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "Kerelys Minoxidil changed my life! My hair is fuller and I feel so much more confident. The results were visible within just a few months."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">AR</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Alex Rodriguez</div>
                  <div className="text-sm text-gray-600">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_,i) => <FaStar key={i} className="text-yellow-400" />)}
                <span className="text-xs text-green-700 ml-2 font-semibold">Verified Buyer</span>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "I saw real results in just 3 months. The best investment I've made for myself. The customer service is exceptional too."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">JL</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Jamie Lee</div>
                  <div className="text-sm text-gray-600">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_,i) => <FaStar key={i} className="text-yellow-400" />)}
                <span className="text-xs text-green-700 ml-2 font-semibold">Verified Buyer</span>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "Easy to use, fast shipping, and the customer support is amazing! I've been using it for 6 months and the results are incredible."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">MS</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Morgan Smith</div>
                  <div className="text-sm text-gray-600">Verified Customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to the most common questions about Kerelys Minoxidil.
            </p>
          </div>
          
          <div className="space-y-6">
            <details className="bg-gray-50 rounded-xl p-6 group border border-gray-200" open>
              <summary className="font-semibold text-xl text-gray-900 cursor-pointer group-open:text-[#8B4513] transition-colors">
                How soon will I see results?
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Most users see visible results within 3-6 months of consistent use. Individual results may vary based on factors such as age, genetics, and the extent of hair loss.
              </p>
            </details>
            
            <details className="bg-gray-50 rounded-xl p-6 group border border-gray-200">
              <summary className="font-semibold text-xl text-gray-900 cursor-pointer group-open:text-[#8B4513] transition-colors">
                Is Kerelys Minoxidil safe?
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Yes! Our formula is FDA-approved and clinically tested for safety and effectiveness. We use only the highest quality ingredients that meet strict pharmaceutical standards.
              </p>
            </details>
            
            <details className="bg-gray-50 rounded-xl p-6 group border border-gray-200">
              <summary className="font-semibold text-xl text-gray-900 cursor-pointer group-open:text-[#8B4513] transition-colors">
                Do you offer a money-back guarantee?
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Absolutely. We stand behind our product with a comprehensive money-back guarantee. If you're not satisfied within 90 days, we'll refund your purchase—no questions asked.
              </p>
            </details>
            
            <details className="bg-gray-50 rounded-xl p-6 group border border-gray-200">
              <summary className="font-semibold text-xl text-gray-900 cursor-pointer group-open:text-[#8B4513] transition-colors">
                How do I use the product?
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Apply the solution to your scalp twice daily as directed. Full instructions are included with your order, and our customer support team is always available to help.
              </p>
            </details>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-4">Still have questions?</p>
            <a href="#contact" className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:text-[#A0522D] transition-colors">
              Contact our support team
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Blog/Advice Section Preview
      <section id="blog" className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hair Growth Tips & Advice</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights and proven strategies to maximize your hair growth journey.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-xl text-gray-900 mb-4">5 Proven Ways to Boost Hair Growth</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Discover science-backed strategies to maximize your results with Kerelys Minoxidil and complementary hair care practices.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:text-[#A0522D] transition-colors">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-xl text-gray-900 mb-4">How to Use Minoxidil for Best Results</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Step-by-step guide to applying minoxidil correctly and tracking your progress for optimal results.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:text-[#A0522D] transition-colors">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Customer Success Stories</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Real stories from people who transformed their hair and confidence with Kerelys Minoxidil.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:text-[#A0522D] transition-colors">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer id="contact" className="w-full bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">Kerelys</div>
              <p className="text-gray-400 mb-6 max-w-md">
                Premium Minoxidil Solutions for real hair regrowth results. Trusted by thousands of customers worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" aria-label="Facebook" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#8B4513] transition-colors">
                  <FaFacebook className="text-white" />
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#8B4513] transition-colors">
                  <FaInstagram className="text-white" />
                </a>
                <a href="#" aria-label="Twitter" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#8B4513] transition-colors">
                  <FaTwitter className="text-white" />
                </a>
                <a href="mailto:info@kerelys.com" aria-label="Email" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#8B4513] transition-colors">
                  <FaEnvelope className="text-white" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <nav className="space-y-2">
                <a href="#products" className="block text-gray-400 hover:text-white transition-colors">Products</a>
                <a href="#why" className="block text-gray-400 hover:text-white transition-colors">Why Kerelys?</a>
                <a href="#faq" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
                <a href="#testimonials" className="block text-gray-400 hover:text-white transition-colors">Reviews</a>
              </nav>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Stay updated with the latest hair care tips and exclusive offers.
              </p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B4513]" 
                  required 
                />
                <button 
                  type="submit" 
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Kerelys. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      {detailsOpen && detailsPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative">
            <button 
              onClick={() => setDetailsOpen(false)} 
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors" 
              aria-label="Close details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{detailsPackage.name}</h2>
              <p className="text-gray-600">{detailsPackage.desc}</p>
            </div>
            
            <div className="flex justify-center mb-6">
              <Image 
                src="/product.png" 
                alt="Kerelys Minoxidil" 
                width={120} 
                height={180} 
                className="object-contain"
              />
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-[#8B4513] mb-2">How to Use</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Apply 1ml to dry scalp twice daily</li>
                  <li>• Massage gently for 1 minute</li>
                  <li>• Do not rinse for at least 4 hours</li>
                  <li>• See visible results in 3-6 months</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#8B4513] mb-2">What's Included</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Kerelys Minoxidil Solution</li>
                  <li>• Easy-apply dropper</li>
                  <li>• Progress tracking guide</li>
                  <li>• Customer support access</li>
                </ul>
              </div>
            </div>
            
            <button 
              className="w-full bg-[#8B4513] text-white py-3 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors" 
              onClick={() => { setDetailsOpen(false); }}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}

      {/* Sticky Add to Cart Bar (mobile)
      {showStickyBar && selectedPackage && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t shadow-lg flex items-center justify-between px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <Image src="/product.png" alt="Kerelys Minoxidil" width={40} height={60} className="object-contain" />
            <div>
              <div className="font-bold text-[#8B4513] text-sm">{selectedPackage.name}</div>
              <div className="text-[#8B4513] font-bold text-lg">${selectedPackage.price.toFixed(2)}</div>
            </div>
          </div>
          <button 
            className="bg-[#8B4513] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors" 
            onClick={() => {}}
          >
            Buy Now
          </button>
        </div>
      )} */}

      
    </main>
  );
}
