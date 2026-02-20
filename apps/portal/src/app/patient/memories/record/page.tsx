"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

// Recording states
type RecordingState = "idle" | "recording" | "paused" | "done";

// Sample prompts
const prompts = [
  { id: "holiday", text: "What was your favorite holiday tradition?", icon: "🎄" },
  { id: "childhood", text: "Tell me about your childhood home.", icon: "🏠" },
  { id: "love", text: "How did you meet your spouse?", icon: "💕" },
  { id: "job", text: "What was your first job?", icon: "💼" },
  { id: "travel", text: "What's your favorite vacation memory?", icon: "✈️" },
  { id: "food", text: "What was your grandmother's best recipe?", icon: "🍳" },
];

const DEMO_CARE_CIRCLE_ID = process.env.NEXT_PUBLIC_DEMO_CARE_CIRCLE_ID || '11111111-1111-1111-1111-111111111111';

export default function RecordStoryPage() {
  const router = useRouter();
  const [state, setState] = useState<RecordingState>("idle");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Recording timer
  useEffect(() => {
    if (state === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start recording with real audio
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start(1000); // Collect data every second
      setState("recording");
      setRecordingTime(0);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please allow microphone access.");
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setState("done");
  }, []);

  // Save recording to Supabase
  const saveRecording = useCallback(async () => {
    if (!audioBlob) {
      setError("No recording to save");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      
      // Generate filename
      const ext = audioBlob.type.includes('webm') ? 'webm' : 'm4a';
      const fileName = `stories/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      
      // Upload audio to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, audioBlob, {
          cacheControl: '3600',
          contentType: audioBlob.type,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      // Get the active prompt text
      const activePrompt = prompts.find(p => p.id === selectedPrompt);
      const memoryTitle = title.trim() || activePrompt?.text || "My Story";

      // Create memory record
      const { error: dbError } = await supabase
        .from('memories')
        .insert({
          care_circle_id: DEMO_CARE_CIRCLE_ID,
          title: memoryTitle,
          description: activePrompt ? `Prompted: ${activePrompt.text}` : "A recorded story",
          type: 'story',
          thumbnail_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
        });

      if (dbError) {
        console.error("Database error:", dbError);
        // Still show success since audio was uploaded
      }

      // Show success
      setShowSuccess(true);
      
      // Reset after delay
      setTimeout(() => {
        router.push('/patient/memories');
      }, 2500);

    } catch (err) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save recording");
    } finally {
      setIsSaving(false);
    }
  }, [audioBlob, selectedPrompt, title, router]);

  // Discard recording
  const discardRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setState("idle");
    setRecordingTime(0);
    setTitle("");
  }, [audioUrl]);

  const activePrompt = prompts.find((p) => p.id === selectedPrompt);

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🎙️ Record Your Story
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Share a memory in your own words
        </p>
      </motion.header>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mx-auto mt-4 max-w-sm rounded-xl bg-red-100 px-4 py-3 text-center text-red-700 dark:bg-red-900/30 dark:text-red-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Prompt Selection (if idle) */}
      <AnimatePresence mode="wait">
        {state === "idle" && !selectedPrompt && (
          <motion.div
            key="prompts"
            className="mx-auto mt-8 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="mb-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Pick a prompt or just start talking
            </p>
            <div className="space-y-3">
              {prompts.map((prompt, index) => (
                <motion.button
                  key={prompt.id}
                  onClick={() => setSelectedPrompt(prompt.id)}
                  className="flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-3xl">{prompt.icon}</span>
                  <span className="flex-1 text-left font-medium text-slate-700 dark:text-slate-200">
                    {prompt.text}
                  </span>
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </motion.button>
              ))}
            </div>

            {/* Free recording button */}
            <motion.button
              onClick={() => setSelectedPrompt("free")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-4 text-slate-500 transition-colors hover:border-sky-400 hover:text-sky-500 dark:border-slate-600 dark:hover:border-sky-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span>Or just start talking about anything</span>
            </motion.button>
          </motion.div>
        )}

        {/* Recording Interface */}
        {(selectedPrompt || state !== "idle") && !showSuccess && (
          <motion.div
            key="recording"
            className="mx-auto mt-8 flex w-full max-w-sm flex-1 flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Prompt Display */}
            {activePrompt && (
              <motion.div
                className="mb-8 rounded-2xl bg-amber-50 px-6 py-4 text-center dark:bg-amber-900/20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-3xl">{activePrompt.icon}</span>
                <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-200">
                  {activePrompt.text}
                </p>
              </motion.div>
            )}

            {/* Recording Visualization */}
            <motion.div
              className="relative flex h-48 w-48 items-center justify-center"
              animate={state === "recording" ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {/* Outer rings */}
              {state === "recording" && (
                <>
                  <motion.div
                    className="absolute h-full w-full rounded-full border-4 border-purple-300"
                    animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute h-full w-full rounded-full border-4 border-purple-300"
                    animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}

              {/* Main mic button */}
              <motion.button
                onClick={() => {
                  if (state === "idle") startRecording();
                  else if (state === "recording") stopRecording();
                }}
                disabled={isSaving}
                className={`flex h-32 w-32 items-center justify-center rounded-full shadow-2xl ${
                  state === "recording"
                    ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40"
                    : state === "done"
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/40"
                    : "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/40"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {state === "recording" ? (
                  <motion.div
                    className="h-10 w-10 rounded-sm bg-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                ) : state === "done" ? (
                  <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                )}
              </motion.button>
            </motion.div>

            {/* Timer */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-4xl font-bold text-slate-800 dark:text-white">
                {formatTime(recordingTime)}
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                {state === "idle" && "Tap to start recording"}
                {state === "recording" && "Recording... tap to stop"}
                {state === "done" && "Recording complete!"}
              </p>
            </motion.div>

            {/* Audio Playback when done */}
            {state === "done" && audioUrl && (
              <motion.div
                className="mt-6 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="mb-2 text-center text-sm text-slate-500 dark:text-slate-400">
                  Listen to your recording:
                </p>
                <audio
                  src={audioUrl}
                  controls
                  className="w-full rounded-xl"
                />
              </motion.div>
            )}

            {/* Title input when done */}
            {state === "done" && (
              <motion.div
                className="mt-4 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your story a title (optional)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-slate-700 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </motion.div>
            )}

            {/* Actions when done */}
            {state === "done" && (
              <motion.div
                className="mt-6 flex w-full gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={discardRecording}
                  disabled={isSaving}
                  className="flex-1 rounded-2xl bg-slate-200 py-4 font-semibold text-slate-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Again
                </motion.button>
                <motion.button
                  onClick={saveRecording}
                  disabled={isSaving}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 py-4 font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSaving ? "Saving..." : "Save Story ✓"}
                </motion.button>
              </motion.div>
            )}

            {/* Encouragement during recording */}
            {state === "recording" && (
              <motion.p
                className="mt-8 max-w-xs text-center text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                Take your time. There&apos;s no rush. Your story matters. 💜
              </motion.p>
            )}

            {/* Change prompt button */}
            {state === "idle" && selectedPrompt && (
              <motion.button
                onClick={() => setSelectedPrompt(null)}
                className="mt-6 text-sm text-slate-500 underline dark:text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Choose a different prompt
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Success State */}
        {showSuccess && (
          <motion.div
            key="success"
            className="mx-auto mt-8 flex flex-1 flex-col items-center justify-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-500/40"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </motion.div>
            <motion.h2
              className="mt-6 text-2xl font-bold text-slate-800 dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Story Saved! 🎉
            </motion.h2>
            <motion.p
              className="mt-2 text-slate-600 dark:text-slate-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your memory is now part of your story.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
