"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Puzzle images with simple, recognizable subjects
const puzzleImages = [
  {
    id: "sunflower",
    name: "Sunflower",
    src: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=600&fit=crop",
    difficulty: 4, // 2x2 grid
    hint: "A bright yellow flower"
  },
  {
    id: "beach",
    name: "Beach",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop",
    difficulty: 4,
    hint: "Sand and ocean"
  },
  {
    id: "cat",
    name: "Kitten",
    src: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
    difficulty: 4,
    hint: "A fluffy pet"
  },
  {
    id: "garden",
    name: "Garden",
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop",
    difficulty: 4,
    hint: "Colorful flowers"
  },
  {
    id: "coffee",
    name: "Coffee Cup",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    difficulty: 4,
    hint: "A warm morning drink"
  },
];

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  row: number;
  col: number;
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function JigsawPage() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const currentPuzzle = puzzleImages[currentPuzzleIndex];
  const gridSize = 2; // 2x2 grid for simplicity
  const totalPieces = gridSize * gridSize;

  // Initialize puzzle pieces
  useEffect(() => {
    const initialPieces: PuzzlePiece[] = [];
    for (let i = 0; i < totalPieces; i++) {
      initialPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        row: Math.floor(i / gridSize),
        col: i % gridSize,
      });
    }
    
    // Shuffle positions
    const shuffledPositions = shuffleArray([...Array(totalPieces).keys()]);
    const shuffledPieces = initialPieces.map((piece, index) => ({
      ...piece,
      currentPosition: shuffledPositions[index],
    }));
    
    setPieces(shuffledPieces);
    setIsComplete(false);
    setMoves(0);
    setShowPreview(true);

    // Auto-hide preview after 3 seconds
    const timer = setTimeout(() => setShowPreview(false), 3000);
    return () => clearTimeout(timer);
  }, [currentPuzzleIndex, totalPieces]);

  // Check if puzzle is complete
  useEffect(() => {
    if (pieces.length > 0) {
      const complete = pieces.every((piece) => piece.currentPosition === piece.correctPosition);
      if (complete && moves > 0) {
        setIsComplete(true);
      }
    }
  }, [pieces, moves]);

  // Handle piece click
  const handlePieceClick = useCallback((clickedPieceId: number) => {
    if (isComplete) return;

    if (selectedPiece === null) {
      setSelectedPiece(clickedPieceId);
    } else {
      // Swap positions
      setPieces((prev) => {
        const newPieces = [...prev];
        const piece1Index = newPieces.findIndex((p) => p.id === selectedPiece);
        const piece2Index = newPieces.findIndex((p) => p.id === clickedPieceId);
        
        const temp = newPieces[piece1Index].currentPosition;
        newPieces[piece1Index].currentPosition = newPieces[piece2Index].currentPosition;
        newPieces[piece2Index].currentPosition = temp;
        
        return newPieces;
      });
      setMoves((prev) => prev + 1);
      setSelectedPiece(null);
    }
  }, [selectedPiece, isComplete]);

  // Get piece at position
  const getPieceAtPosition = (position: number) => {
    return pieces.find((p) => p.currentPosition === position);
  };

  // Next puzzle
  const nextPuzzle = () => {
    setCurrentPuzzleIndex((prev) => (prev + 1) % puzzleImages.length);
    setSelectedPiece(null);
  };

  // Replay same puzzle
  const replayPuzzle = () => {
    const initialPieces: PuzzlePiece[] = [];
    for (let i = 0; i < totalPieces; i++) {
      initialPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        row: Math.floor(i / gridSize),
        col: i % gridSize,
      });
    }
    
    const shuffledPositions = shuffleArray([...Array(totalPieces).keys()]);
    const shuffledPieces = initialPieces.map((piece, index) => ({
      ...piece,
      currentPosition: shuffledPositions[index],
    }));
    
    setPieces(shuffledPieces);
    setIsComplete(false);
    setMoves(0);
    setSelectedPiece(null);
    setShowPreview(true);
    setTimeout(() => setShowPreview(false), 3000);
  };

  return (
    <div className="min-h-screen px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🧩 Simple Puzzle
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Tap two pieces to swap them
        </p>
      </motion.header>

      {/* Progress Info */}
      <motion.div
        className="mx-auto mt-4 flex max-w-sm items-center justify-between text-sm text-slate-600 dark:text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span>Puzzle: {currentPuzzle.name}</span>
        <span>Moves: {moves}</span>
      </motion.div>

      {/* Hint Button */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => setShowPreview(true)}
          className="w-full rounded-xl bg-amber-100 px-4 py-3 text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          👁️ Show Complete Picture
        </motion.button>
      </motion.div>

      {/* Puzzle Board */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Preview Overlay */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <img
                  src={currentPuzzle.src}
                  alt={currentPuzzle.name}
                  className="max-h-[70vh] max-w-full rounded-3xl"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
                  <p className="text-xl font-bold text-white">{currentPuzzle.name}</p>
                  <p className="mt-1 text-white/80">Tap anywhere to close</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle Grid */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-200 shadow-xl dark:bg-slate-700">
          <div
            className="grid h-full w-full gap-1 p-1"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {[...Array(totalPieces)].map((_, position) => {
              const piece = getPieceAtPosition(position);
              if (!piece) return null;

              const isSelected = selectedPiece === piece.id;
              const isCorrect = piece.currentPosition === piece.correctPosition;

              return (
                <motion.button
                  key={position}
                  onClick={() => handlePieceClick(piece.id)}
                  className={`relative overflow-hidden rounded-lg ${
                    isSelected ? "ring-4 ring-sky-500 ring-offset-2" : ""
                  } ${isCorrect && !isComplete ? "ring-2 ring-emerald-400" : ""}`}
                  layout
                  whileHover={{ scale: isComplete ? 1 : 1.02 }}
                  whileTap={{ scale: isComplete ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div
                    className="h-full w-full bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${currentPuzzle.src})`,
                      backgroundSize: `${gridSize * 100}%`,
                      backgroundPosition: `${(piece.correctPosition % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctPosition / gridSize) * (100 / (gridSize - 1))}%`,
                    }}
                  />
                  {/* Piece number hint (optional, for accessibility) */}
                  {!isComplete && (
                    <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-xs font-bold text-white">
                      {piece.id + 1}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Completion Overlay */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-center text-white"
                >
                  <span className="text-6xl">🎉</span>
                  <h2 className="mt-2 text-2xl font-bold">Complete!</h2>
                  <p className="mt-1 text-emerald-100">
                    Solved in {moves} moves
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="mx-auto mt-6 flex max-w-sm gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isComplete ? (
          <>
            <motion.button
              onClick={nextPuzzle}
              className="flex-1 rounded-xl bg-sky-500 py-4 font-semibold text-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next Puzzle →
            </motion.button>
            <motion.button
              onClick={replayPuzzle}
              className="flex-1 rounded-xl bg-slate-100 py-4 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              onClick={replayPuzzle}
              className="flex-1 rounded-xl bg-slate-100 py-4 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Shuffle
            </motion.button>
            <motion.button
              onClick={nextPuzzle}
              className="flex-1 rounded-xl bg-slate-100 py-4 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Skip →
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Puzzle Selection */}
      <motion.div
        className="mx-auto mt-8 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="mb-3 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Choose a puzzle:
        </p>
        <div className="flex justify-center gap-2">
          {puzzleImages.map((puzzle, index) => (
            <motion.button
              key={puzzle.id}
              onClick={() => setCurrentPuzzleIndex(index)}
              className={`h-14 w-14 overflow-hidden rounded-xl ${
                index === currentPuzzleIndex
                  ? "ring-2 ring-sky-500 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={puzzle.src}
                alt={puzzle.name}
                className="h-full w-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mx-auto mt-6 max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm dark:bg-slate-800/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            💡 Tap one piece, then tap another to swap them.
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">Green border = correct spot!</span>
          </p>
        </div>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link href="/patient/games">
          <motion.button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Games
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
