"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaShippingFast, FaLock, FaStar, FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaLeaf, FaFlask, FaBoxOpen, FaTruck, FaShieldAlt, FaCcVisa, FaCcMastercard, FaCcPaypal, FaRegCommentDots, FaGift, FaArrowLeft, FaHeart, FaShare, FaApple, FaArrowRight } from "react-icons/fa";
import { addEmail } from "../actions";
import { toast } from "sonner";
import NewsletterDialog from "../components/NewsletterDialog";
import Cart from "../components/Cart";

import { useCart } from "../contexts/CartContext";
import FastPaymentButtons from "../components/FastPaymentButtons";
import Link from "next/link";
import { use } from 'react'
import { useRouter } from "next/navigation";
import { packages, PackageType, calculateSavings, calculateTotalPrice } from "../lib/products";

type Params = Promise<{ id: string }>

export default function ProductPage({ params }: { params: Params }) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { addItem } = useCart();
  const id = use(params).id;
  const router = useRouter();

  const product = packages.find(pkg => pkg.id === parseInt(id));

  useEffect(() => {
    if (product) {
      setSelectedPackage(product);
    }
  }, [product]);

  // Sticky bar logic
  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Product Not Found</h1>
            <Link href="/" className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFA500] transition-colors font-semibold">
              <FaArrowLeft className="text-sm" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">


      {/* Breadcrumb */}
      <div className="w-full bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#products" className="hover:text-[#FFD700] transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[#FFD700] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Hero Section */}
      <section className="w-full py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Product Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 group-hover:shadow-[0_25px_50px_-12px_rgba(255,215,0,0.25)] transition-all duration-500">
                  <Image
                    src="/product.png"
                    alt={`${product.name} - Klys Minoxidil`}
                    width={400}
                    height={500}
                    className="object-contain w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFD700] bg-[#FFD700]/10 px-4 py-2 rounded-full mb-6 border border-[#FFD700]/20">
                  <FaFlask className="text-[#FFD700]" />
                  {product.popular ? 'Most Popular' : 'Clinically Proven'}
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  {product.desc}
                </p>
              </div>

              {/* Price Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-[#FFD700]">${product.price}</span>
                  <span className="text-slate-600">{product.per}</span>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  {product.id === 1 ? 'One-time purchase' : 
                   product.id === 3 ? 'Save $30 compared to monthly' : 
                   'Save $96 compared to monthly'}
                </p>
                
                {/* Features */}
                <div className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <FaCheckCircle className="text-[#FFD700] flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button 
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
                  onClick={() => {
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      stripeProductId: product.stripeProductId,
                      image: "/product.png"
                    });
                    toast.success(`${product.name} added to cart!`);
                  }}
                >
                  Add to Cart - ${calculateTotalPrice(product.id).toFixed(2)}
                </button>
                
                {/* Fast Payment Buttons */}
                <div className="border-t border-slate-200 pt-6">
                  <p className="text-sm text-slate-600 mb-4 text-center font-medium">Or pay instantly with:</p>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                    <FastPaymentButtons 
                      variant="secondary" 
                      size="sm" 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        stripeProductId: product.stripeProductId,
                        image: "/product.png"
                      }}
                    />
                  </div>
                </div>
                
                <button 
                  className="w-full border-2 border-[#FFD700] text-[#FFD700] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFD700] hover:text-slate-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
                  onClick={() => setShowNewsletterDialog(true)}
                >
                  Get Special Discount
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaShieldAlt className="text-[#FFD700]" />
                  <span className="font-medium">Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaShippingFast className="text-[#FFD700]" />
                  <span className="font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaLeaf className="text-[#FFD700]" />
                  <span className="font-medium">FDA Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="w-full py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {['overview', 'ingredients', 'usage', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-800 shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-[#FFD700] border border-white/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">Product Overview</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {product.details?.description}
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">Key Benefits</h4>
                    <ul className="space-y-3">
                      {product.details?.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-[#FFD700] mt-1 flex-shrink-0" />
                          <span className="text-slate-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">What's Included</h4>
                    <ul className="space-y-3">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-[#FFD700] mt-1 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">Active Ingredients</h3>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Key Ingredients</h4>
                    <ul className="space-y-4">
                      {product.details?.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                          <FaFlask className="text-[#FFD700] flex-shrink-0" />
                          <span className="text-slate-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Safety & Quality</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <FaLeaf className="text-[#FFD700]" />
                        <span className="text-slate-700 font-medium">FDA Approved Formula</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <FaShieldAlt className="text-[#FFD700]" />
                        <span className="text-slate-700 font-medium">Dermatologist Tested</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <FaCheckCircle className="text-[#FFD700]" />
                        <span className="text-slate-700 font-medium">No Harmful Chemicals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">How to Use</h3>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Application Instructions</h4>
                    <ol className="space-y-4">
                      {product.details?.usage.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-800 rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 text-lg">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Important Tips</h4>
                    <div className="space-y-4">
                      <div className="p-6 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <h5 className="font-semibold text-slate-800 mb-2">Best Time to Apply</h5>
                        <p className="text-slate-600">Apply in the morning and evening for optimal results</p>
                      </div>
                      <div className="p-6 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <h5 className="font-semibold text-slate-800 mb-2">Consistency is Key</h5>
                        <p className="text-slate-600">Use daily for at least 4 months to see significant results</p>
                      </div>
                      <div className="p-6 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <h5 className="font-semibold text-slate-800 mb-2">Patience Required</h5>
                        <p className="text-slate-600">Results vary by individual, typically visible in 8-12 weeks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">Expected Results</h3>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Timeline</h4>
                    <div className="space-y-4">
                      {product.details?.results.map((result, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                          <FaStar className="text-[#FFD700] mt-1 flex-shrink-0" />
                          <span className="text-slate-700 text-lg">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Success Factors</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <FaCheckCircle className="text-[#FFD700]" />
                        <span className="text-slate-700 font-medium">Consistent daily application</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <FaCheckCircle className="text-[#FFD700]" />
                        <span className="text-slate-700 font-medium">Proper scalp preparation</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <FaCheckCircle className="text-[#FFD700]" />
                        <span className="text-slate-700 font-medium">Complete treatment cycle</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                        <FaCheckCircle className="text-[#FFD700]" />
                        <span className="text-slate-700 font-medium">Healthy lifestyle habits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

      {/* Sticky Bottom Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-bold text-slate-800">{product.name}</p>
                  <p className="text-sm text-slate-600">{product.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#FFD700]">${product.price}</p>
                  <p className="text-sm text-slate-600">{product.per}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-800 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      stripeProductId: product.stripeProductId,
                      image: "/product.png"
                    });
                    toast.success(`${product.name} added to cart!`);
                  }}
                >
                  Add to Cart - ${calculateTotalPrice(product.id).toFixed(2)}
                </button>
                <FastPaymentButtons variant="compact" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 