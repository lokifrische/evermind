"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Mock slideshow photos
const slideshowPhotos = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
    title: "Sarah's Wedding Day",
    date: "June 15, 2019",
    hasNarration: true,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=1200&h=800&fit=crop",
    title: "Christmas at Home",
    date: "December 25, 2018",
    hasNarration: false,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop",
    title: "David's Graduation",
    date: "May 20, 2010",
    hasNarration: true,
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
    title: "Beach Vacation",
    date: "July 1998",
    hasNarration: false,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop",
    title: "First Home",
    date: "September 1985",
    hasNarration: true,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=800&fit=crop",
    title: "Our Wedding Day",
    date: "April 12, 1975",
    hasNarration: true,
  },
];

export default function SlideshowPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhoto = slideshowPhotos[currentIndex];
  const displayDuration = currentPhoto.hasNarration ? 15000 : 8000; // Longer for narration

  // Auto-advance slideshow
  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slideshowPhotos.length);
      }, displayDuration);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [currentIndex, isPlaying, displayDuration]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowInfo(false);
      }, 4000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showControls]);

  // Show controls on tap
  const handleTap = () => {
    setShowControls(true);
    setShowInfo(true);
  };

  // Navigation
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideshowPhotos.length);
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slideshowPhotos.length) % slideshowPhotos.length);
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div 
      className="fixed inset-0 bg-black"
      onClick={handleTap}
    >
      {/* Photo Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={currentPhoto.src}
            alt={currentPhoto.title}
            className="h-full w-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Photo Info (fades after delay) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="absolute bottom-32 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {currentPhoto.title}
            </h2>
            <p className="mt-2 text-xl text-white/80">{currentPhoto.date}</p>
            {currentPhoto.hasNarration && (
              <motion.div
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-500/80 px-4 py-2 backdrop-blur-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <span className="text-sm font-medium text-white">Playing Story</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Exit Button */}
            <Link href="/patient/memories">
              <motion.button
                className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-black/40 px-4 py-3 text-white backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-medium">Exit</span>
              </motion.button>
            </Link>

            {/* Progress Bar */}
            <div className="absolute left-4 right-4 top-16 flex gap-1">
              {slideshowPhotos.map((_, index) => (
                <div
                  key={index}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: index < currentIndex ? "100%" : "0%" }}
                    animate={{
                      width:
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                          ? "100%"
                          : "0%",
                    }}
                    transition={{
                      duration: index === currentIndex ? displayDuration / 1000 : 0,
                      ease: "linear",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <motion.button
              className="absolute left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </motion.button>

            <motion.button
              className="absolute right-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              className="absolute bottom-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {isPlaying ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              ) : (
                <svg className="h-8 w-8 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              )}
            </motion.button>

            {/* Photo Counter */}
            <div className="absolute bottom-10 right-4 rounded-full bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {currentIndex + 1} / {slideshowPhotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
