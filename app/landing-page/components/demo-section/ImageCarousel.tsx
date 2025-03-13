import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface DemoImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: DemoImage[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenPopup: () => void;
}

export default function ImageCarousel({
  images,
  currentIndex,
  onPrev,
  onNext,
  onOpenPopup,
}: ImageCarouselProps) {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
      <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black">
        <div
          className="h-full w-full overflow-hidden cursor-pointer group"
          onClick={onOpenPopup}
        >
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>

          {/* Image carousel */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover object-[-10px_center] transition-transform duration-700 ease-in-out group-hover:scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs z-20">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
}