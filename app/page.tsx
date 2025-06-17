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
}

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsPackage, setDetailsPackage] = useState<PackageType | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showSocialProof, setShowSocialProof] = useState(false);
  const packages: PackageType[] = [
    {
      id: 1,
      name: "1 Month Supply",
      desc: "Perfect for trying",
      price: 49.97,
      per: "/bottle",
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
      features: [
        "6 x 60ml Bottles",
        "Free Express Shipping",
        "90-Day Money Back",
        "Complete Hair Care Kit",
        "Personal Consultation"
      ],
    }
  ];

  const handleAddToCart = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setCartOpen(true);
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
  useEffect(() => {
    const timer = setTimeout(() => setShowSocialProof(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f6fa] flex flex-col items-center justify-start w-full font-sans">
      {/* Sticky Header with Tagline and FDA Badge */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#8B4513] tracking-tight">Kerelys</span>
            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold flex items-center gap-1"><FaLeaf className="inline" /> 100% Authentic</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold flex items-center gap-1"><FaFlask className="inline" /> FDA Approved</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
            <a href="#products" className="hover:text-[#8B4513] transition-colors">Products</a>
            <a href="#why" className="hover:text-[#8B4513] transition-colors">Why Kerelys?</a>
            <a href="#testimonials" className="hover:text-[#8B4513] transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-[#8B4513] transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-[#8B4513] transition-colors">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Cart" onClick={() => setCartOpen(true)}>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5h6" /></svg>
              </button>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{selectedPackage ? 1 : 0}</span>
            </div>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Open navigation" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileNavOpen(false)}>
            <nav className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg flex flex-col p-8 gap-6">
              <button className="self-end text-2xl text-gray-400 hover:text-gray-700" onClick={() => setMobileNavOpen(false)}>&times;</button>
              <a href="#products" className="hover:text-[#8B4513] transition-colors" onClick={() => setMobileNavOpen(false)}>Products</a>
              <a href="#why" className="hover:text-[#8B4513] transition-colors" onClick={() => setMobileNavOpen(false)}>Why Kerelys?</a>
              <a href="#testimonials" className="hover:text-[#8B4513] transition-colors" onClick={() => setMobileNavOpen(false)}>Reviews</a>
              <a href="#faq" className="hover:text-[#8B4513] transition-colors" onClick={() => setMobileNavOpen(false)}>FAQ</a>
              <a href="#contact" className="hover:text-[#8B4513] transition-colors" onClick={() => setMobileNavOpen(false)}>Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden bg-gradient-to-br from-[#f3f6fa] via-[#fbeee6] to-[#e6e2d3] rounded-b-3xl shadow-sm">
        {/* Left Content */}
        <div className="flex-1 max-w-xl z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
            Regrow Your Confidence<br />
            <span className="text-[#8B4513]">with Kerelys Minoxidil</span>
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
            Experience real, visible hair regrowth with our advanced, dermatologist-recommended formula. Trusted by thousands, Kerelys Minoxidil is your path to fuller, thicker hair and renewed self-assurance.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <button className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[#8B4513]">
              Shop Now
            </button>
            <button className="bg-white border border-[#8B4513] text-[#8B4513] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#fbeee6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513]">
              Learn More
            </button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold">Clinically Proven</span>
            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold">FDA Approved</span>
            <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-xs font-semibold">Free Express Shipping</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <FaShieldAlt className="text-green-500" />
            <span className="text-gray-600 text-base font-medium">100% Money Back Guarantee</span>
          </div>
        </div>
        {/* Right Content - Product Image */}
        <div className="relative flex-1 flex justify-end items-center h-[28rem]">
          <div className="relative w-[22rem] h-[28rem] flex items-center justify-center bg-white rounded-3xl shadow-xl">
            <Image
              src="/product.png"
              alt="Kerelys Minoxidil Solution"
              width={350}
              height={450}
              className="object-contain w-full h-full drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Product Specifications & Why Kerelys */}
      <section id="why" className="w-full bg-[#fbeee6] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#8B4513] mb-4">Why Choose Kerelys?</h2>
              <ul className="text-gray-700 text-lg space-y-2">
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Clinically proven for real results</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Dermatologist recommended</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 100% money-back guarantee</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Free express shipping on all orders</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Trusted by 10,000+ happy customers</li>
              </ul>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                <FaFlask className="text-3xl text-blue-700 mb-2" />
                <div className="font-bold text-[#8B4513]">5% Minoxidil</div>
                <div className="text-gray-600 text-sm">Clinically tested concentration</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                <FaTruck className="text-3xl text-green-700 mb-2" />
                <div className="font-bold text-[#8B4513]">Free Delivery</div>
                <div className="text-gray-600 text-sm">Express shipping worldwide</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                <FaLeaf className="text-3xl text-green-700 mb-2" />
                <div className="font-bold text-[#8B4513]">FDA Approved</div>
                <div className="text-gray-600 text-sm">Safe, effective ingredients</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                <FaBoxOpen className="text-3xl text-orange-700 mb-2" />
                <div className="font-bold text-[#8B4513]">3 Package Options</div>
                <div className="text-gray-600 text-sm">Flexible for your needs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Packages Section */}
      <section id="products" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Choose Your Package</h2>
        <p className="text-center text-gray-500 mb-10">All packages include free express shipping and a 100% money-back guarantee.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-colors relative ${selectedPackage?.id === pkg.id ? 'border-[#8B4513]' : 'border-gray-200 hover:border-[#8B4513]'} ${pkg.popular ? 'border-[#8B4513]' : ''}`}
              onClick={() => { setDetailsOpen(true); setDetailsPackage(pkg); }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${pkg.name}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#8B4513] text-white px-6 py-2 rounded-full text-sm font-semibold shadow">Most Popular</div>
              )}
              {pkg.id === 6 && (
                <div className="absolute -top-4 right-4 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow">Best Value</div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-gray-600">{pkg.desc}</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-[#8B4513]">${pkg.price.toFixed(2)}</span>
                <span className="text-gray-500">{pkg.per}</span>
                {pkg.popular && <div className="text-sm text-gray-500 mt-1">Save $30</div>}
                {pkg.id === 6 && <div className="text-sm text-gray-500 mt-1">Save $96</div>}
              </div>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <details className="mb-4">
                <summary className="text-[#8B4513] font-semibold cursor-pointer">What's included?</summary>
                <ul className="text-gray-600 text-sm mt-2 space-y-1">
                  <li>1x Kerelys Minoxidil bottle per month</li>
                  <li>Easy-apply dropper</li>
                  <li>Progress tracking guide</li>
                  <li>Access to support team</li>
                </ul>
              </details>
              <div className="text-xs text-green-700 mb-2 flex items-center gap-1"><FaShippingFast /> Free Express Shipping</div>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors mt-2 ${selectedPackage?.id === pkg.id ? 'bg-[#8B4513] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={e => { e.stopPropagation(); handleAddToCart(pkg); }}
                aria-label={`Add ${pkg.name} to cart`}
              >
                {selectedPackage?.id === pkg.id ? 'Selected' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full bg-white py-20 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f3f6fa] rounded-xl p-6 shadow text-center flex flex-col items-center">
              <Image src="/window.svg" alt="Alex R." width={48} height={48} className="rounded-full mb-2" />
              <div className="flex items-center gap-1 mb-1">{[...Array(5)].map((_,i) => <FaStar key={i} className="text-yellow-400" />)} <span className="text-xs text-green-700 ml-2">Verified Buyer</span></div>
              <p className="text-lg text-gray-700 mb-2">“Kerelys Minoxidil changed my life! My hair is fuller and I feel so much more confident.”</p>
              <div className="font-bold text-[#8B4513]">— Alex R.</div>
            </div>
            <div className="bg-[#f3f6fa] rounded-xl p-6 shadow text-center flex flex-col items-center">
              <Image src="/globe.svg" alt="Jamie L." width={48} height={48} className="rounded-full mb-2" />
              <div className="flex items-center gap-1 mb-1">{[...Array(5)].map((_,i) => <FaStar key={i} className="text-yellow-400" />)} <span className="text-xs text-green-700 ml-2">Verified Buyer</span></div>
              <p className="text-lg text-gray-700 mb-2">“I saw real results in just 3 months. The best investment I've made for myself.”</p>
              <div className="font-bold text-[#8B4513]">— Jamie L.</div>
            </div>
            <div className="bg-[#f3f6fa] rounded-xl p-6 shadow text-center flex flex-col items-center">
              <Image src="/next.svg" alt="Morgan S." width={48} height={48} className="rounded-full mb-2" />
              <div className="flex items-center gap-1 mb-1">{[...Array(5)].map((_,i) => <FaStar key={i} className="text-yellow-400" />)} <span className="text-xs text-green-700 ml-2">Verified Buyer</span></div>
              <p className="text-lg text-gray-700 mb-2">“Easy to use, fast shipping, and the customer support is amazing!”</p>
              <div className="font-bold text-[#8B4513]">— Morgan S.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full bg-[#fbeee6] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-white rounded-lg shadow p-6 group" open>
              <summary className="font-semibold text-lg text-[#8B4513] cursor-pointer group-open:text-[#A0522D]">How soon will I see results?</summary>
              <p className="mt-2 text-gray-700">Most users see visible results within 3-6 months of consistent use.</p>
            </details>
            <details className="bg-white rounded-lg shadow p-6 group">
              <summary className="font-semibold text-lg text-[#8B4513] cursor-pointer group-open:text-[#A0522D]">Is Kerelys Minoxidil safe?</summary>
              <p className="mt-2 text-gray-700">Yes! Our formula is FDA-approved and clinically tested for safety and effectiveness.</p>
            </details>
            <details className="bg-white rounded-lg shadow p-6 group">
              <summary className="font-semibold text-lg text-[#8B4513] cursor-pointer group-open:text-[#A0522D]">Do you offer a money-back guarantee?</summary>
              <p className="mt-2 text-gray-700">Absolutely. If you're not satisfied within 90 days, we'll refund your purchase—no questions asked.</p>
            </details>
            <details className="bg-white rounded-lg shadow p-6 group">
              <summary className="font-semibold text-lg text-[#8B4513] cursor-pointer group-open:text-[#A0522D]">How do I use the product?</summary>
              <p className="mt-2 text-gray-700">Apply the solution to your scalp twice daily as directed. Full instructions are included with your order.</p>
            </details>
          </div>
          <div className="text-center mt-10">
            <span className="text-lg text-gray-700">Still have questions?</span>
            <a href="#contact" className="ml-2 text-[#8B4513] underline font-semibold">Contact our support team</a>
          </div>
        </div>
      </section>

      {/* Blog/Advice Section Preview */}
      <section id="blog" className="w-full bg-white py-20 mt-12 border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Hair Growth Tips & Advice</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f3f6fa] rounded-xl p-6 shadow flex flex-col">
              <h3 className="font-bold text-lg mb-2">5 Proven Ways to Boost Hair Growth</h3>
              <p className="text-gray-700 mb-4">Discover science-backed strategies to maximize your results with Kerelys Minoxidil.</p>
              <a href="#" className="text-[#8B4513] font-semibold hover:underline mt-auto">Read More →</a>
            </div>
            <div className="bg-[#f3f6fa] rounded-xl p-6 shadow flex flex-col">
              <h3 className="font-bold text-lg mb-2">How to Use Minoxidil for Best Results</h3>
              <p className="text-gray-700 mb-4">Step-by-step guide to applying minoxidil and tracking your progress.</p>
              <a href="#" className="text-[#8B4513] font-semibold hover:underline mt-auto">Read More →</a>
            </div>
            <div className="bg-[#f3f6fa] rounded-xl p-6 shadow flex flex-col">
              <h3 className="font-bold text-lg mb-2">Customer Success Stories</h3>
              <p className="text-gray-700 mb-4">Real stories from people who transformed their hair and confidence with Kerelys.</p>
              <a href="#" className="text-[#8B4513] font-semibold hover:underline mt-auto">Read More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full bg-[#8B4513] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-2xl font-bold">Kerelys</div>
            <div className="text-sm text-white/70">Premium Minoxidil Solutions</div>
            <div className="flex gap-3 mt-2">
              <a href="#" aria-label="Facebook" className="hover:text-blue-300"><FaFacebook /></a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-300"><FaInstagram /></a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400"><FaTwitter /></a>
              <a href="mailto:info@kerelys.com" aria-label="Email" className="hover:text-green-200"><FaEnvelope /></a>
            </div>
          </div>
          <nav className="flex flex-col md:flex-row gap-4 md:gap-8 text-lg">
            <a href="#products" className="hover:underline">Products</a>
            <a href="#why" className="hover:underline">Why Kerelys?</a>
            <a href="#faq" className="hover:underline">FAQ</a>
            <a href="#testimonials" className="hover:underline">Reviews</a>
          </nav>
          <form className="flex flex-col gap-2 w-full max-w-xs">
            <label htmlFor="newsletter" className="text-sm font-semibold">Subscribe to our newsletter</label>
            <div className="flex gap-2">
              <input id="newsletter" type="email" placeholder="Your email" className="px-3 py-2 rounded-l-lg text-gray-800" required />
              <button type="submit" className="bg-white text-[#8B4513] px-4 py-2 rounded-r-lg font-bold hover:bg-orange-100">Join</button>
            </div>
          </form>
          <div className="text-xs text-white/60 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Kerelys. All rights reserved.<br />
            <a href="#" className="underline hover:text-white">Privacy Policy</a> &middot; <a href="#" className="underline hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      {detailsOpen && detailsPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setDetailsOpen(false)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700" aria-label="Close details">&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-center">{detailsPackage.name}</h2>
            <div className="text-center text-gray-600 mb-4">{detailsPackage.desc}</div>
            <Image src="/product.png" alt="Kerelys Minoxidil" width={120} height={180} className="mx-auto mb-4" />
            <div className="mb-4">
              <h3 className="font-semibold text-[#8B4513] mb-1">How to Use</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Apply 1ml to dry scalp twice daily</li>
                <li>Massage gently for 1 minute</li>
                <li>Do not rinse for at least 4 hours</li>
                <li>See visible results in 3-6 months</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-[#8B4513] mb-1">Before & After</h3>
              <div className="flex gap-2 justify-center">
                <Image src="/window.svg" alt="Before" width={60} height={60} className="rounded-full border" />
                <Image src="/globe.svg" alt="After" width={60} height={60} className="rounded-full border" />
              </div>
            </div>
            <button className="w-full bg-[#8B4513] text-white py-3 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors mt-4" onClick={() => { setDetailsOpen(false); handleAddToCart(detailsPackage); }}>Add to Cart</button>
          </div>
        </div>
      )}

      {/* Sticky Add to Cart Bar (mobile) */}
      {showStickyBar && selectedPackage && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t shadow-lg flex items-center justify-between px-4 py-3 md:hidden animate-fade-in">
          <div className="flex items-center gap-2">
            <Image src="/product.png" alt="Kerelys Minoxidil" width={40} height={60} />
            <div>
              <div className="font-bold text-[#8B4513] text-sm">{selectedPackage.name}</div>
              <div className="text-[#8B4513] font-bold text-lg">${selectedPackage.price.toFixed(2)}</div>
            </div>
          </div>
          <button className="bg-[#8B4513] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#A0522D]" onClick={() => setCartOpen(true)}>Checkout</button>
        </div>
      )}

      {/* Social Proof Popup */}
      {showSocialProof && (
        <div className="fixed bottom-24 left-4 z-50 bg-white border shadow-lg rounded-lg px-4 py-3 flex items-center gap-2 animate-fade-in">
          <FaRegCommentDots className="text-green-600 text-xl" />
          <span className="text-sm text-gray-700"><b>Maria from Rome</b> just purchased <b>3 Month Supply</b>!</span>
        </div>
      )}
    </main>
  );
}
