"use client"

import Link from "next/link";

interface LogoProps {
  variant?: "header" | "footer";
  showBadges?: boolean;
  className?: string;
}

export default function Logo({ variant = "header", showBadges = false, className = "" }: LogoProps) {
  const isHeader = variant === "header";
  
  return (
    <Link href="/" className={`flex items-center gap-3 group logo-simple ${className}`}>
      {/* Brand Name */}
      <div className="flex flex-col">
        <span 
          className={`font-bold text-slate-900 leading-tight ${
            isHeader ? 'text-3xl' : 'text-2xl text-white'
          }`}
          style={{ fontFamily: 'var(--font-code-bold)' }}
        >
          Klys
        </span>
        {isHeader && (
          <span className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5">
            Premium Solutions
          </span>
        )}
      </div>
    </Link>
  );
} 