"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaShippingFast, FaLock, FaStar, FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaLeaf, FaFlask, FaBoxOpen, FaTruck, FaShieldAlt, FaCcVisa, FaCcMastercard, FaCcPaypal, FaRegCommentDots, FaGift, FaArrowLeft } from "react-icons/fa";
import { addEmail } from "../actions";
import { toast } from "sonner";
import NewsletterDialog from "../components/NewsletterDialog";
import Cart from "../components/Cart";
import CartIcon from "../components/CartIcon";
import { useCart } from "../contexts/CartContext";
import Link from "next/link";

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

export default function ProductsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const { addItem } = useCart();

  // Sticky bar logic
  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
              <Link href="/#products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">Products</Link>
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
                <Link href="/#products" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium py-2" onClick={() => setMobileNavOpen(false)}>Products</Link>
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
            <span className="text-[#8B4513] font-medium">Products</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect Kerelys Minoxidil package for your hair regrowth journey. All packages include free shipping and our comprehensive money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* Product Packages Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 relative hover:shadow-xl ${
                  pkg.popular ? 'border-[#8B4513] ring-2 ring-[#8B4513]/20' : 'border-gray-200 hover:border-[#8B4513]'
                }`}
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
                
                {/* <details className="mb-6">
                  <summary className="text-[#8B4513] font-semibold cursor-pointer hover:text-[#A0522D] transition-colors">
                    What's included?
                  </summary>
                  <ul className="text-gray-600 text-sm mt-3 space-y-2 pl-4">
                    <li>• 1x Kerelys Minoxidil bottle per month</li>
                    <li>• Easy-apply dropper</li>
                    <li>• Progress tracking guide</li>
                    <li>• Access to support team</li>
                  </ul>
                </details> */}
                
                <div className="text-xs text-green-700 mb-4 flex items-center gap-2 justify-center">
                  <FaShippingFast className="text-green-600" />
                  Free Express Shipping
                </div>
                
                <div className="space-y-3">
                  <Link
                    href={`/products/${pkg.id}`}
                    className="w-full py-3 px-4 border-2 border-[#8B4513] text-[#8B4513] rounded-lg font-semibold transition-all duration-300 hover:bg-[#8B4513] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2 text-center block"
                  >
                    View Details
                  </Link>
                  
                  <button
                    className="w-full py-4 bg-[#8B4513] text-white rounded-lg font-semibold transition-all duration-300 hover:bg-[#A0522D] shadow-lg"
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
                  >
                    Add to Cart - ${pkg.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full bg-gray-50 py-20">
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
                  <p className="font-semibold text-gray-900">Ready to start your hair regrowth journey?</p>
                  <p className="text-sm text-gray-600">Choose from our 3 package options</p>
                </div>
              </div>
              <Link href="/#products" className="bg-[#8B4513] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#A0522D] transition-colors">
                View Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 