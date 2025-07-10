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
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  // Get the package from URL or default to the one matching the ID
  const defaultPackage = packages.find(pkg => pkg.id === parseInt(id));
  const packageFromUrl = searchParams.get('package');

  useEffect(() => {
    if (packageFromUrl) {
      const pkg = packages.find(p => p.id === parseInt(packageFromUrl));
      if (pkg) {
        setSelectedPackage(pkg);
      } else {
        setSelectedPackage(defaultPackage || packages[1]); // Default to popular package
      }
    } else {
      setSelectedPackage(defaultPackage || packages[1]); // Default to popular package
    }
  }, [packageFromUrl, defaultPackage]);

  // Update URL when package changes
  const handlePackageChange = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    const newUrl = `/${id}?package=${pkg.id}`;
    router.push(newUrl, { scroll: false });
  };

  // Sticky bar logic
  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!defaultPackage) {
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
            <span className="text-[#FFD700] font-medium">Klys Minoxidil</span>
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
                    alt="Klys Minoxidil"
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
                  Premium Hair Care Solution
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                  Klys 5% Minoxidil
                  <span className="block text-[#FFD700]">Treatment</span>
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Clinically proven 5% minoxidil formula that delivers visible results in weeks, not months. 
                  Each bottle contains 60ml of solution, providing up to 30 days of treatment when used as directed.
                </p>
              </div>

              {/* Package Selection */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
                <h4 className="text-xl font-bold text-slate-900 mb-6">Choose Your Treatment Plan:</h4>
                
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPackage?.id === pkg.id
                          ? 'border-[#FFD700] bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 shadow-lg'
                          : 'border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value={pkg.id}
                        checked={selectedPackage?.id === pkg.id}
                        onChange={() => handlePackageChange(pkg)}
                        className="sr-only"
                      />
                      
                      {/* Radio Button */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                        selectedPackage?.id === pkg.id
                          ? 'border-[#FFD700] bg-[#FFD700]'
                          : 'border-slate-300'
                      }`}>
                        {selectedPackage?.id === pkg.id && (
                          <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Package Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-lg font-bold text-slate-900">{pkg.name}</h5>
                          {pkg.popular && (
                            <span className="bg-[#FFD700] text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{pkg.desc}</p>
                        
                        {/* Price and Savings */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-slate-900">${pkg.price}</div>
                            <div className="text-sm text-slate-500">{pkg.per}</div>
                          </div>
                          {pkg.id !== 1 && (
                            <div className="text-right">
                              <div className="text-sm font-bold text-[#FFD700]">
                                Save ${calculateSavings(pkg.id)}
                              </div>
                              <div className="text-xs text-slate-500">vs monthly</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Selected Package Details */}
                {selectedPackage && (
                  <div className="mt-6 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 rounded-2xl p-6 border border-[#FFD700]/20">
                    <h5 className="text-lg font-bold text-slate-900 mb-4">Package Includes:</h5>
                    <div className="space-y-2">
                      {selectedPackage.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Price and Action Buttons */}
              {selectedPackage && (
                <div className="space-y-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-slate-700">Total Price:</span>
                      <span className="text-3xl font-bold text-slate-900">${calculateTotalPrice(selectedPackage.id).toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      Includes free shipping and money-back guarantee
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button 
                      className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
                      onClick={() => {
                        addItem({
                          id: selectedPackage.id,
                          name: selectedPackage.name,
                          price: selectedPackage.price,
                          stripeProductId: selectedPackage.stripeProductId,
                          image: "/product.png"
                        });
                        toast.success(`${selectedPackage.name} added to cart!`);
                      }}
                    >
                      Add to Cart - ${calculateTotalPrice(selectedPackage.id).toFixed(2)}
                    </button>
                    
                    {/* Fast Payment Buttons */}
                    <div className="border-t border-slate-200 pt-6">
                      <p className="text-sm text-slate-600 mb-4 text-center font-medium">Or pay instantly with:</p>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                        <FastPaymentButtons 
                          variant="secondary" 
                          size="sm" 
                          product={{
                            id: selectedPackage.id,
                            name: selectedPackage.name,
                            price: selectedPackage.price,
                            stripeProductId: selectedPackage.stripeProductId,
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
                </div>
              )}

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
                  {selectedPackage?.details?.description || defaultPackage?.details?.description}
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">Key Benefits</h4>
                    <ul className="space-y-3">
                      {(selectedPackage?.details?.benefits || defaultPackage?.details?.benefits)?.map((benefit, idx) => (
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
                      {(selectedPackage?.features || defaultPackage?.features)?.map((feature, idx) => (
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
                      {(selectedPackage?.details?.ingredients || defaultPackage?.details?.ingredients)?.map((ingredient, idx) => (
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
                      {(selectedPackage?.details?.usage || defaultPackage?.details?.usage)?.map((step, idx) => (
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
                      {(selectedPackage?.details?.results || defaultPackage?.details?.results)?.map((result, idx) => (
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
      {showStickyBar && selectedPackage && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-bold text-slate-800">{selectedPackage.name}</p>
                  <p className="text-sm text-slate-600">{selectedPackage.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#FFD700]">${selectedPackage.price}</p>
                  <p className="text-sm text-slate-600">{selectedPackage.per}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-800 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    addItem({
                      id: selectedPackage.id,
                      name: selectedPackage.name,
                      price: selectedPackage.price,
                      stripeProductId: selectedPackage.stripeProductId,
                      image: "/product.png"
                    });
                    toast.success(`${selectedPackage.name} added to cart!`);
                  }}
                >
                  Add to Cart - ${calculateTotalPrice(selectedPackage.id).toFixed(2)}
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