"use client";

import { useState, useRef, useCallback } from 'react';
import { uploadImage } from '@/lib/supabase/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  placeholder = 'Upload an image or paste a URL',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadImage(file, folder);
      if (url) {
        onChange(url);
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setError(null);
  };

  const handleClear = () => {
    onChange('');
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {/* Preview */}
      {value && (
        <div className="relative mb-3 overflow-hidden rounded-lg border border-[var(--border)]">
          <img
            src={value}
            alt="Preview"
            className="h-40 w-full object-cover"
            onError={() => setError('Failed to load image preview')}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragActive
              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
              : 'border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <svg className="h-8 w-8 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="mt-2 text-sm text-[var(--muted-foreground)]">Uploading...</span>
            </div>
          ) : (
            <>
              <svg className="h-10 w-10 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="mt-2 text-sm font-medium">Click to upload or drag & drop</span>
              <span className="mt-1 text-xs text-[var(--muted-foreground)]">PNG, JPG, GIF up to 5MB</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {/* URL Input (alternative) */}
      <div className="mt-3">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span>or paste a URL</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          disabled={uploading}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
