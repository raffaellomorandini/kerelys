"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaShippingFast, FaLock, FaStar, FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaLeaf, FaFlask, FaBoxOpen, FaTruck, FaShieldAlt, FaCcVisa, FaCcMastercard, FaCcPaypal, FaRegCommentDots, FaGift, FaArrowLeft, FaHeart, FaShare } from "react-icons/fa";
import { addEmail } from "../../actions";
import { toast } from "sonner";
import NewsletterDialog from "../../components/NewsletterDialog";
import Cart from "../../components/Cart";
import CartIcon from "../../components/CartIcon";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import { use } from 'react'
 
type Params = Promise<{ id: string }>

interface PackageType {
  id: number;
  name: string;
  desc: string;
  price: number;
  per: string;
  features: string[];
  popular?: boolean;
  stripeProductId: string;
  details?: {
    description: string;
    benefits: string[];
    ingredients: string[];
    usage: string[];
    results: string[];
  };
}

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
    details: {
      description: "Start your hair regrowth journey with our 1-month supply. Perfect for those who want to try Kerelys Minoxidil and experience the first signs of improvement. This package includes everything you need to begin your transformation.",
      benefits: [
        "Ideal for first-time users",
        "Risk-free trial period",
        "Complete starter kit included",
        "30-day money-back guarantee"
      ],
      ingredients: [
        "5% Minoxidil (active ingredient)",
        "Propylene Glycol",
        "Ethanol",
        "Purified Water",
        "Natural extracts"
      ],
      usage: [
        "Apply twice daily to affected areas",
        "Use 1ml per application",
        "Massage gently into scalp",
        "Allow to dry completely",
        "Continue for at least 4 months for best results"
      ],
      results: [
        "First results typically visible in 8-12 weeks",
        "Gradual hair thickening",
        "Reduced hair shedding",
        "Improved scalp health"
      ]
    }
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
    popular: true,
    details: {
      description: "Our most popular choice! The 3-month supply provides the optimal treatment period to see significant results. This package includes our comprehensive progress tracking guide and extended money-back guarantee.",
      benefits: [
        "Optimal treatment duration",
        "Significant cost savings",
        "Progress tracking included",
        "Extended 60-day guarantee",
        "Free express shipping"
      ],
      ingredients: [
        "5% Minoxidil (active ingredient)",
        "Propylene Glycol",
        "Ethanol",
        "Purified Water",
        "Natural extracts",
        "Vitamin B5 (Panthenol)",
        "Biotin"
      ],
      usage: [
        "Apply twice daily to affected areas",
        "Use 1ml per application",
        "Massage gently into scalp",
        "Allow to dry completely",
        "Track progress weekly",
        "Continue for full 3 months"
      ],
      results: [
        "Visible results in 6-8 weeks",
        "Significant hair regrowth",
        "Improved hair density",
        "Enhanced confidence"
      ]
    }
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
    details: {
      description: "The ultimate hair regrowth solution! Our 6-month supply offers the best value and provides the complete treatment cycle needed for maximum results. Includes our complete hair care kit and personal consultation.",
      benefits: [
        "Maximum value and savings",
        "Complete treatment cycle",
        "Personal consultation included",
        "Complete hair care kit",
        "90-day money-back guarantee",
        "Priority customer support"
      ],
      ingredients: [
        "5% Minoxidil (active ingredient)",
        "Propylene Glycol",
        "Ethanol",
        "Purified Water",
        "Natural extracts",
        "Vitamin B5 (Panthenol)",
        "Biotin",
        "Niacinamide",
        "Zinc PCA"
      ],
      usage: [
        "Apply twice daily to affected areas",
        "Use 1ml per application",
        "Massage gently into scalp",
        "Allow to dry completely",
        "Follow complete hair care routine",
        "Schedule consultation for personalized advice"
      ],
      results: [
        "Maximum hair regrowth potential",
        "Long-term hair health improvement",
        "Sustained results",
        "Complete transformation"
      ]
    }
  }
];

export default function ProductPage({ params }: { params: Params }) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { addItem } = useCart();
  const id = use(params).id;

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="text-[#8B4513] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start w-full font-sans">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#8B4513] tracking-tight">Kerelys</span>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium flex items-center gap-1">
                    <FaLeaf className="text-green-600" /> Authentic
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium flex items-center gap-1">
                    <FaFlask className="text-blue-600" /> FDA Approved
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Products</Link>
              <Link href="/#products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Shop</Link>
              <Link href="/#why" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Why Kerelys?</Link>
              <Link href="/#testimonials" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Reviews</Link>
              <Link href="/#faq" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">FAQ</Link>
              <Link href="/#contact" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Contact</Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <CartIcon />
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
                <Link href="/products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Products</Link>
                <Link href="/#products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Shop</Link>
                <Link href="/#why" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Why Kerelys?</Link>
                <Link href="/#testimonials" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Reviews</Link>
                <Link href="/#faq" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>FAQ</Link>
                <Link href="/#contact" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Contact</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#8B4513] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#products" className="hover:text-[#8B4513] transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[#8B4513] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Hero Section */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513]/20 to-transparent rounded-3xl blur-3xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                  <Image
                    src="/product.png"
                    alt={`${product.name} - Kerelys Minoxidil`}
                    width={400}
                    height={500}
                    className="object-contain w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B4513] bg-[#8B4513]/10 px-4 py-2 rounded-full mb-4">
                  <FaFlask className="text-[#8B4513]" />
                  {product.popular ? 'Most Popular' : 'Clinically Proven'}
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {product.desc}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-[#8B4513]">${product.price}</span>
                  <span className="text-gray-600">{product.per}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {product.id === 1 ? 'One-time purchase' : 
                   product.id === 3 ? 'Save $30 compared to monthly' : 
                   'Save $96 compared to monthly'}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button 
                  className="w-full bg-[#8B4513] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#A0522D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2"
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
                  Add to Cart - ${product.price}
                </button>
                <button 
                  className="w-full border-2 border-[#8B4513] text-[#8B4513] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8B4513] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2"
                  onClick={() => setShowNewsletterDialog(true)}
                >
                  Get Special Discount
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaShieldAlt className="text-green-500" />
                  <span className="font-medium">Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaShippingFast className="text-blue-500" />
                  <span className="font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaLeaf className="text-green-500" />
                  <span className="font-medium">FDA Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['overview', 'ingredients', 'usage', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#8B4513] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Overview</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.details?.description}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {product.details?.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Active Ingredients</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Ingredients</h4>
                    <ul className="space-y-3">
                      {product.details?.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FaFlask className="text-[#8B4513] flex-shrink-0" />
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Safety & Quality</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FaLeaf className="text-green-600" />
                        <span className="text-gray-700">FDA Approved Formula</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FaShieldAlt className="text-blue-600" />
                        <span className="text-gray-700">Dermatologist Tested</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <FaCheckCircle className="text-purple-600" />
                        <span className="text-gray-700">No Harmful Chemicals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Application Instructions</h4>
                    <ol className="space-y-3">
                      {product.details?.usage.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Important Tips</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Best Time to Apply</h5>
                        <p className="text-blue-800 text-sm">Apply in the morning and evening for optimal results</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">Consistency is Key</h5>
                        <p className="text-green-800 text-sm">Use daily for at least 4 months to see significant results</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h5 className="font-semibold text-orange-900 mb-2">Patience Required</h5>
                        <p className="text-orange-800 text-sm">Results vary by individual, typically visible in 8-12 weeks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Expected Results</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-4">
                      {product.details?.results.map((result, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <FaStar className="text-[#8B4513] mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Success Factors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Consistent daily application</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Proper scalp preparation</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Complete treatment cycle</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-gray-700">Healthy lifestyle habits</span>
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
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#8B4513]">${product.price}</p>
                  <p className="text-sm text-gray-600">{product.per}</p>
                </div>
              </div>
              <button 
                className="bg-[#8B4513] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors"
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
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 