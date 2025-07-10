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
import { useRouter, useSearchParams } from "next/navigation";
import { packages, PackageType, calculateSavings, calculateTotalPrice } from "../lib/products";
import ProductImageSlider from "../components/ProductImageSlider";

export default function ProductPage() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the package from URL query parameter
  const packageFromUrl = searchParams.get('package');

  useEffect(() => {
    if (packageFromUrl) {
      const pkg = packages.find(p => p.id === parseInt(packageFromUrl));
      if (pkg) {
        setSelectedPackage(pkg);
      } else {
        setSelectedPackage(packages[1]); // Default to popular package
      }
    } else {
      setSelectedPackage(packages[1]); // Default to popular package
    }
  }, [packageFromUrl]);

  // Update URL when package changes
  const handlePackageChange = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    const newUrl = `/product?package=${pkg.id}`;
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

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="w-full bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#products" className="hover:text-emerald-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-emerald-600 font-medium">Klys Minoxidil</span>
          </div>
        </div>
      </div>

      {/* Product Hero Section */}
      <section className="relative w-full py-12 lg:py-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.03),transparent_50%)]" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-emerald-600/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-tr from-emerald-600/2 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="lg:sticky lg:top-0 lg:h-fit">
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-full p-30">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl blur-2xl"></div>
                  <ProductImageSlider images={["/product.png", "/product.png", "/product.png"]} alt="Klys Minoxidil" size="large" />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                  <span className="text-xs font-semibold text-slate-700">Premium Hair Care</span>
                </div>
                <h1 
                  className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-code-bold)' }}
                >
                  Klys 5% Minoxidil
                  <span className="block text-emerald-600">Treatment</span>
                </h1>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Clinically proven 5% minoxidil formula designed for maximum efficacy. 
                  Each 60ml bottle provides up to 30 days of treatment when used as directed.
                </p>
              </div>

              {/* Package Selection */}
              <div className="bg-white rounded-xl p-6  border border-slate-200">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Select Your Plan</h4>
                  <p className="text-slate-600 text-sm">Choose the treatment duration that works best for you</p>
                </div>
                
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`relative block cursor-pointer transition-all duration-300 ${
                        selectedPackage?.id === pkg.id
                          ? 'ring-2 ring-emerald-600 ring-offset-1'
                          : 'hover:bg-slate-50'
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
                      
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedPackage?.id === pkg.id
                          ? 'border-emerald-600 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5'
                          : 'border-slate-200 bg-white hover:border-slate-300'
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
                                  <div className="text-xs font-bold text-emerald-600">
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
                  <div className="mt-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                    <h5 className="font-semibold text-slate-900 mb-3 text-sm">Package Includes:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPackage.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-600 rounded-full flex items-center justify-center">
                            <svg className="w-1.5 h-1.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Price and Action Buttons */}
              {selectedPackage && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 ">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-700">Total Price:</span>
                      <span className="text-2xl font-bold text-slate-900">${calculateTotalPrice(selectedPackage.id).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Includes free shipping and money-back guarantee
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      className="w-full bg-emerald-600 text-slate-800 px-6 py-3 rounded-xl font-bold text-base  hover:  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
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
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs text-slate-600 mb-3 text-center font-medium">Or pay instantly with:</p>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
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
                      className="w-full border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold text-base hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
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
                  <FaShieldAlt className="text-emerald-600" />
                  <span className="font-medium">Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaShippingFast className="text-emerald-600" />
                  <span className="font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaLeaf className="text-emerald-600" />
                  <span className="font-medium">FDA Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="w-full py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {['overview', 'ingredients', 'usage', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-slate-800 '
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl p-8  border border-slate-100">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">Product Overview</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {selectedPackage?.details?.description || packages[1]?.details?.description}
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">Key Benefits</h4>
                    <ul className="space-y-3">
                      {(selectedPackage?.details?.benefits || packages[1]?.details?.benefits)?.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-emerald-600 mt-1 flex-shrink-0" />
                          <span className="text-slate-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">What's Included</h4>
                    <ul className="space-y-3">
                      {(selectedPackage?.features || packages[1]?.features)?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-emerald-600 mt-1 flex-shrink-0" />
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
                      {(selectedPackage?.details?.ingredients || packages[1]?.details?.ingredients)?.map((ingredient, idx) => (
                        <li key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <FaFlask className="text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Safety & Quality</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <FaLeaf className="text-emerald-600" />
                        <span className="text-slate-700 font-medium">FDA Approved Formula</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <FaShieldAlt className="text-emerald-600" />
                        <span className="text-slate-700 font-medium">Dermatologist Tested</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <FaCheckCircle className="text-emerald-600" />
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
                      {(selectedPackage?.details?.usage || packages[1]?.details?.usage)?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-slate-800 rounded-full flex items-center justify-center text-sm font-bold">
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
                      <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <h5 className="font-semibold text-slate-800 mb-2">Best Time to Apply</h5>
                        <p className="text-slate-600">Apply in the morning and evening for optimal results</p>
                      </div>
                      <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <h5 className="font-semibold text-slate-800 mb-2">Consistency is Key</h5>
                        <p className="text-slate-600">Use daily for at least 4 months to see significant results</p>
                      </div>
                      <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
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
                      {(selectedPackage?.details?.results || packages[1]?.details?.results)?.map((result, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                          <FaStar className="text-emerald-600 mt-1 flex-shrink-0" />
                          <span className="text-slate-700 text-lg">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-6">Success Factors</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <FaCheckCircle className="text-emerald-600" />
                        <span className="text-slate-700 font-medium">Consistent daily application</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <FaCheckCircle className="text-emerald-600" />
                        <span className="text-slate-700 font-medium">Proper scalp preparation</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <FaCheckCircle className="text-emerald-600" />
                        <span className="text-slate-700 font-medium">Complete treatment cycle</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                        <FaCheckCircle className="text-emerald-600" />
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
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95  border-t border-slate-200 ">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-bold text-slate-800">{selectedPackage.name}</p>
                  <p className="text-sm text-slate-600">{selectedPackage.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">${selectedPackage.price}</p>
                  <p className="text-sm text-slate-600">{selectedPackage.per}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover: hover:scale-105 transition-all duration-300"
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
