"use client";

import { Component, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // In production: send to error tracking service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <motion.div
            className="max-w-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <span className="text-3xl">😮</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-800 dark:text-white">
              Oops! Something went wrong
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Don&apos;t worry, this happens sometimes. Let&apos;s try again.
            </p>
            <motion.button
              onClick={this.handleRetry}
              className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-medium text-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Patient-friendly error display
 * Extra gentle messaging for cognitive support users
 */
export function PatientErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white p-8 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        className="max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-5xl">🤗</span>
        </motion.div>
        
        <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">
          Let&apos;s Take a Breath
        </h1>
        
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          The app needs a moment. This is completely okay!
        </p>
        
        <div className="mt-6 rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-slate-800/70">
          <p className="text-slate-600 dark:text-slate-400">
            💜 You are doing great
          </p>
        </div>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="mt-8 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        )}
        
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          If this keeps happening, ask a family member for help.
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Simple loading fallback
 */
export function LoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-sky-200 border-t-sky-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="mt-4 text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );
}

/**
 * Full-page loading for patient mode
 */
export function PatientLoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-4xl">✨</span>
        </motion.div>
        <p className="mt-6 text-xl text-slate-600 dark:text-slate-400">
          {message}
        </p>
        <p className="mt-2 text-slate-500 dark:text-slate-500">
          Just a moment...
        </p>
      </motion.div>
    </div>
  );
}
