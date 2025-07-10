
export interface PackageType {
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

export const packages: PackageType[] = [
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
      "30-Day Money Back Guarantee",
      "FDA Approved Formula",
      "24/7 Customer Support",
      "Easy Application Guide"
    ],
    details: {
      description: "Start your hair regrowth journey with our 1-month supply. Perfect for those who want to try Klys Minoxidil and experience the first signs of improvement. This package includes everything you need to begin your transformation.",
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
      "60-Day Money Back Guarantee",
      "Progress Tracking Guide",
      "Priority Customer Support",
      "Hair Care Tips"
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
      "90-Day Money Back Guarantee",
      "Complete Hair Care Kit",
      "Personal Consultation",
      "Priority Customer Support"
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

// Helper function to get package by ID
export const getPackageById = (id: number): PackageType | undefined => {
  return packages.find(pkg => pkg.id === id);
};

// Helper function to get popular package
export const getPopularPackage = (): PackageType | undefined => {
  return packages.find(pkg => pkg.popular);
};

// Helper function to calculate savings
export const calculateSavings = (packageId: number): number => {
  const pkg = getPackageById(packageId);
  if (!pkg) return 0;
  
  const basePrice = 49.97; // 1 month supply price
  const totalPrice = pkg.price * (pkg.id === 1 ? 1 : pkg.id === 3 ? 3 : 6);
  const savings = (basePrice * (pkg.id === 1 ? 1 : pkg.id === 3 ? 3 : 6)) - totalPrice;
  
  return Math.round(savings * 100) / 100;
};

// Helper function to calculate total price for a package
export const calculateTotalPrice = (packageId: number): number => {
  const pkg = getPackageById(packageId);
  if (!pkg) return 0;
  
  const totalPrice = pkg.price * (pkg.id === 1 ? 1 : pkg.id === 3 ? 3 : 6);
  return Math.round(totalPrice * 100) / 100;
}; 