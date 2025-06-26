"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle, FaLeaf, FaFlask, FaShieldAlt, FaTruck, FaStar, FaGift, FaArrowRight } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import FastPaymentButtons from "../components/FastPaymentButtons";

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
    name: "Starter Pack",
    desc: "Perfect for trying Kerelys",
    price: 29.99,
    per: "per bottle",
    features: [
      "1 Month Supply",
      "Free Shipping",
      "Money Back Guarantee",
      "24/7 Customer Support",
      "FDA Approved Formula"
    ],
    stripeProductId: "price_1OqX8X2eZvKYlo2C9QZQZQZQ"
  },
  {
    id: 2,
    name: "Popular Pack",
    desc: "Most popular choice",
    price: 79.99,
    per: "per 3 months",
    features: [
      "3 Month Supply",
      "Free Express Shipping",
      "Money Back Guarantee",
      "Priority Customer Support",
      "FDA Approved Formula",
      "Save $10"
    ],
    popular: true,
    stripeProductId: "price_1OqX8X2eZvKYlo2C9QZQZQZQ"
  },
  {
    id: 3,
    name: "Value Pack",
    desc: "Best value for money",
    price: 139.99,
    per: "per 6 months",
    features: [
      "6 Month Supply",
      "Free Express Shipping",
      "Money Back Guarantee",
      "Priority Customer Support",
      "FDA Approved Formula",
      "Save $40",
      "Bonus Hair Care Guide"
    ],
    stripeProductId: "price_1OqX8X2eZvKYlo2C9QZQZQZQ"
  }
];

export default function ProductsPage() {
  const { addItem } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('shadow-lg');
        } else {
          header.classList.remove('shadow-lg');
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-blue-800 transition-colors flex items-center gap-1">
                <span>Home</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-blue-800 font-medium">Products</span>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-soft badge-float">
                <FaFlask className="text-blue-600" />
                Premium Solutions
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Choose Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 block animate-pulse">Perfect Package</span>
            </h1>
            <p className="text-slate-600 text-xl leading-relaxed max-w-3xl mx-auto">
              Select the ideal Kerelys Minoxidil package for your hair regrowth journey. All packages include free shipping and our comprehensive money-back guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* Product Packages Section */}
      <section className="w-full bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`relative group bg-white rounded-3xl p-8 shadow-soft border border-slate-200/50 transition-all duration-500 hover:shadow-elegant hover:scale-105 hover-lift ${
                  pkg.popular ? 'ring-2 ring-blue-500/20 border-blue-200' : 'hover:border-blue-200'
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-elegant badge-float">
                    Most Popular
                  </div>
                )}
                
                {/* Value Badge */}
                {pkg.id === 3 && (
                  <div className="absolute -top-4 right-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-elegant badge-float">
                    Best Value
                  </div>
                )}
                
                {/* Package Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-slate-600">{pkg.desc}</p>
                </div>
                
                {/* Price Section */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">${pkg.price.toFixed(2)}</span>
                    <span className="text-slate-500 text-lg">{pkg.per}</span>
                  </div>
                  {pkg.popular && (
                    <div className="text-sm text-emerald-600 font-semibold mt-2 flex items-center justify-center gap-1">
                      <FaGift className="text-emerald-500" />
                      Save $10
                    </div>
                  )}
                  {pkg.id === 3 && (
                    <div className="text-sm text-emerald-600 font-semibold mt-2 flex items-center justify-center gap-1">
                      <FaGift className="text-emerald-500" />
                      Save $40
                    </div>
                  )}
                </div>
                
                {/* Features List */}
                <div className="flex-grow">
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                          <FaCheckCircle className="text-emerald-600 text-xs" />
                        </div>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Action Buttons */}
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
                    Add to Cart - ${pkg.price}
                  </button>
                  
                  {/* Fast Payment Buttons */}
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
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Kerelys?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our commitment to quality, science, and customer satisfaction sets us apart in the hair care industry.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Clinically Proven Results</h3>
                    <p className="text-slate-600">Our formula has been extensively tested and proven to deliver real, measurable hair regrowth results.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaFlask className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Dermatologist Recommended</h3>
                    <p className="text-slate-600">Trusted by healthcare professionals worldwide for its safety and effectiveness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">100% Money Back Guarantee</h3>
                    <p className="text-slate-600">We're confident in our product. If you're not satisfied, we'll refund your purchase—no questions asked.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaTruck className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Free Express Shipping</h3>
                    <p className="text-slate-600">Get your order delivered quickly and securely with our complimentary express shipping service.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-3xl p-8 shadow-soft border border-slate-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FaStar className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Trusted by Thousands</h3>
                  <p className="text-slate-600 mb-6">
                    Join thousands of satisfied customers who have transformed their hair and confidence with Kerelys.
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-amber-400 text-xl" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">4.9/5 Average Rating</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float">
                <FaCheckCircle className="text-white text-sm" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce badge-float" style={{animationDelay: '1s'}}>
                <FaFlask className="text-white text-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Hair?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have already experienced the Kerelys difference. Start your hair regrowth journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#products"
              className="btn-primary text-lg px-8 py-4 shadow-elegant hover:scale-105 transition-transform duration-200 btn-enhanced"
            >
              Shop Now
            </Link>
            <Link
              href="/#testimonials"
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200 btn-enhanced"
            >
              Read Reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 