"use client"

import Link from "next/link";
import { FaLeaf, FaFlask } from "react-icons/fa";

interface LogoProps {
  variant?: "header" | "footer";
  showBadges?: boolean;
  className?: string;
}

export default function Logo({ variant = "header", showBadges = true, className = "" }: LogoProps) {
  const isHeader = variant === "header";
  
  return (
    <Link href="/" className={`flex items-center gap-5 group logo-simple ${className}`}>
      {/* Brand Name with bigger text */}
      <div className="flex flex-col">
        <span className={`font-bold text-slate-900 logo-code-bold leading-tight ${
          isHeader ? 'text-4xl' : 'text-2xl text-white'
        }`}>
          Klys
        </span>
        {isHeader && (
          <span className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5">
            Premium Solutions
          </span>
        )}
      </div>
      
      {/* Enhanced Trust Badges */}
      {showBadges && isHeader && (
        <div className="hidden sm:flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-lg font-semibold flex items-center gap-1.5 border border-emerald-200 shadow-sm">
            <FaLeaf className="text-emerald-600 text-xs" /> Authentic
          </span>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-semibold flex items-center gap-1.5 border border-blue-200 shadow-sm">
            <FaFlask className="text-blue-600 text-xs" /> FDA Approved
          </span>
        </div>
      )}
    </Link>
  );
} 