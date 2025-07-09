"use client"

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaEye } from "react-icons/fa";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  title?: string;
  subtitle?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  title = "See the Difference",
  subtitle = "Real results from real customers"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateSliderPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPositionTouch(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      updateSliderPositionTouch(e);
    }
  };

  const updateSliderPosition = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const updateSliderPositionTouch = (e: React.TouchEvent | TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleArrowClick = (direction: "left" | "right") => {
    const increment = direction === "left" ? -10 : 10;
    setSliderPosition(prev => Math.max(0, Math.min(100, prev + increment)));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-soft">
            <FaEye className="text-blue-600" />
            Before & After Results
          </span>
        </div>
        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
          {title}
        </h3>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative group">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-blue-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-emerald-200/30 rounded-full opacity-40 blur-3xl animate-pulse-glow" style={{animationDelay: "2s"}}></div>
        </div>

        {/* Main slider container */}
        <div 
          ref={containerRef}
          className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-elegant border border-slate-200/50 overflow-hidden group-hover:shadow-2xl transition-all duration-500 hover-lift"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Before Image (Background) */}
          <div className="relative w-full h-96 lg:h-[500px]">
            <Image
              src={beforeImage}
              alt={beforeAlt}
              fill
              className="object-cover"
              priority
            />
            
            {/* Before Label */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-800 shadow-soft border border-white/50">
              Before
            </div>
          </div>

          {/* After Image (Overlay) */}
          <div 
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full">
              <Image
                src={afterImage}
                alt={afterAlt}
                fill
                className="object-cover"
                priority
              />
              
              {/* After Label */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-800 shadow-soft border border-white/50">
                After
              </div>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-elegant cursor-ew-resize flex items-center justify-center group-hover:w-2 transition-all duration-200"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Handle Circle */}
            <div className="w-8 h-8 bg-white rounded-full shadow-elegant border-2 border-blue-600 flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            
            {/* Handle Arrow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-elegant border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <FaArrowLeft className="text-slate-600 text-xs" />
            </div>
          </div>

          {/* Divider Line */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-white shadow-lg"
            style={{ left: `${sliderPosition}%` }}
          ></div>

          {/* Control Buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <button
              onClick={() => handleArrowClick("left")}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-soft border border-white/50 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label="Move slider left"
            >
              <FaArrowLeft className="text-slate-600" />
            </button>
            
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft border border-white/50">
              <span className="text-sm font-semibold text-slate-800">
                {Math.round(sliderPosition)}%
              </span>
            </div>
            
            <button
              onClick={() => handleArrowClick("right")}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-soft border border-white/50 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label="Move slider right"
            >
              <FaArrowRight className="text-slate-600" />
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Drag to compare
          </div>
        </div>

        {/* Floating testimonial */}
        <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-elegant p-4 border border-slate-200 max-w-xs animate-float glass">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Mike R.</p>
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 italic">"Incredible transformation in just 6 months!"</p>
        </div>
      </div>
    </div>
  );
} 