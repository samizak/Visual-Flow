import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  onNext?: () => void;
  onPrev?: () => void;
  showNavigation?: boolean;
  currentIndex?: number;
  totalImages?: number;
}

export default function ImagePopup({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  onNext,
  onPrev,
  showNavigation = false,
  currentIndex,
  totalImages,
}: ImagePopupProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowRight" && onNext) {
        onNext();
      } else if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!mounted) return null;

  const popupContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            className="relative w-[90%]  max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation arrows */}
            {showNavigation && onPrev && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
            )}

            {showNavigation && onNext && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
            )}

            {/* Image counter */}
            {showNavigation &&
              currentIndex !== undefined &&
              totalImages !== undefined && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {currentIndex + 1} / {totalImages}
                </div>
              )}

            <AnimatePresence mode="wait">
              <motion.img
                key={imageSrc}
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(popupContent, document.body);
}
