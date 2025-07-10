"use client";
import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ProductImageSliderProps {
  images: string[];
  alt?: string;
  size?: 'medium' | 'large';
}

export default function ProductImageSlider({ images, alt = "Product image", size = 'medium' }: ProductImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const containerClasses = size === 'large' 
    ? "relative w-full mx-auto" 
    : "relative w-full max-w-md mx-auto";

  const imageContainerClasses = size === 'large'
    ? "relative aspect-[4/5] rounded-2xl overflow-hidden border border-emerald-100 bg-white flex items-center justify-center"
    : "relative aspect-square rounded-xl overflow-hidden border border-emerald-100 bg-white flex items-center justify-center";

  const previewClasses = size === 'large'
    ? "flex justify-center gap-4 mt-6"
    : "flex justify-center gap-3 mt-4";

  const previewSizeClasses = size === 'large'
    ? "w-20 h-20 rounded-lg"
    : "w-16 h-16 rounded-lg";

  return (
    <div className={containerClasses}>
      {/* Main Image Container */}
      <div className={imageContainerClasses}>
        {/* Main Image with Fade Animation */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-contain"
                priority={index === current}
              />
            </div>
          ))}
        </div>
        
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-emerald-50 border border-emerald-200 rounded-full p-2 shadow transition-all duration-200 hover:scale-110"
          aria-label="Previous image"
        >
          <FaChevronLeft className="text-emerald-600 w-5 h-5" />
        </button>
        
        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-emerald-50 border border-emerald-200 rounded-full p-2 shadow transition-all duration-200 hover:scale-110"
          aria-label="Next image"
        >
          <FaChevronRight className="text-emerald-600 w-5 h-5" />
        </button>
      </div>
      
      {/* Image Previews */}
      <div className={previewClasses}>
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`relative ${previewSizeClasses} overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              i === current 
                ? "border-emerald-600 shadow-lg" 
                : "border-slate-200 hover:border-emerald-300"
            }`}
            aria-label={`Go to image ${i + 1}`}
          >
            <Image
              src={image}
              alt={`${alt} preview ${i + 1}`}
              fill
              className="object-cover"
            />
            {/* Active indicator overlay */}
            {i === current && (
              <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
