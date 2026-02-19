"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// Message types
interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Quick action suggestions
const quickActions = [
  { id: "date", label: "What day is it?", icon: "📅" },
  { id: "weather", label: "What's the weather?", icon: "🌤️" },
  { id: "family", label: "Tell me about my family", icon: "👨‍👩‍👧‍👦" },
  { id: "schedule", label: "What's happening today?", icon: "📋" },
  { id: "memory", label: "Share a memory with me", icon: "💭" },
  { id: "music", label: "Play some music", icon: "🎵" },
  { id: "call", label: "Call someone", icon: "📞" },
  { id: "help", label: "I need help", icon: "🆘" },
];

// Simulated AI responses (in production, this would call an actual AI)
const getAIResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("day") || lowerInput.includes("date") || lowerInput.includes("today")) {
    const today = new Date();
    return `Today is ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. It's a lovely day, Maggie. 🌸`;
  }
  
  if (lowerInput.includes("weather")) {
    return "It looks like it's a beautiful day outside! About 72 degrees and sunny. Perfect weather for a short walk in the garden. ☀️";
  }
  
  if (lowerInput.includes("family") || lowerInput.includes("who")) {
    return "Your family loves you so much! You have two wonderful children: Sarah and David. Sarah is your daughter - she's married and lives nearby. She visits you often. David is your son - he has two kids, Emma and Tommy, your grandchildren! Would you like me to show you their photos?";
  }
  
  if (lowerInput.includes("schedule") || lowerInput.includes("today") || lowerInput.includes("happening")) {
    return "Today you have a lovely day planned! Sarah is coming to visit at 2:00 PM. You also have your afternoon medication at 3:00 PM. Would you like me to remind you closer to the time?";
  }
  
  if (lowerInput.includes("memory") || lowerInput.includes("remember")) {
    return "I have a beautiful memory to share! Last Christmas, the whole family gathered at your house. You made your famous apple pie, and little Tommy said it was 'the best pie ever!' Would you like to see the photos from that day?";
  }
  
  if (lowerInput.includes("music")) {
    return "I'd love to play some music for you! Would you like to hear some songs from the 60s and 70s? Those were your favorites. Just say 'play music' and I'll start your playlist. 🎵";
  }
  
  if (lowerInput.includes("call")) {
    return "Who would you like to call? I can connect you to Sarah, David, or anyone else in your contacts. Just say their name, and I'll make the call for you. 📞";
  }
  
  if (lowerInput.includes("help") || lowerInput.includes("scared") || lowerInput.includes("confused")) {
    return "I'm right here with you, Maggie. You're safe. Would you like me to call Sarah? She can be here soon. In the meantime, take a slow, deep breath with me. Everything is okay. 💜";
  }
  
  if (lowerInput.includes("where am i") || lowerInput.includes("where is this")) {
    return "You're at home, Maggie - your beautiful home that you and Robert bought in 1985. You're in your living room. This is a safe, familiar place. Your daughter Sarah will visit later today. 🏠";
  }
  
  if (lowerInput.includes("who are you")) {
    return "I'm your digital helper! You can call me your assistant. I'm here to help you remember things, answer questions, play music, and keep you company. I'm not a real person, but I'm always here when you need me. 😊";
  }
  
  return "I'm here to help! You can ask me about the date, weather, your family, or your schedule. Or we can just chat if you'd like. What would you like to know?";
};

export default function TalkToMePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello Maggie! 👋 I'm here to help. You can talk to me about anything - ask me questions, or just chat. What's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate thinking
    setIsThinking(true);
    setTimeout(() => {
      const response = getAIResponse(text);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };

  // Handle quick action
  const handleQuickAction = (action: typeof quickActions[0]) => {
    sendMessage(action.label);
  };

  // Toggle voice listening
  const toggleListening = () => {
    setIsListening((prev) => !prev);
    // In production: implement Web Speech API
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        sendMessage("What day is it today?");
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col pt-16">
      {/* Header */}
      <motion.header
        className="px-6 py-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          💬 Talk to Me
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          I&apos;m here to help
        </p>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mx-auto max-w-md space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                  message.type === "user"
                    ? "bg-sky-500 text-white"
                    : "bg-white shadow-lg dark:bg-slate-800"
                }`}
              >
                <p className={`text-lg ${message.type === "assistant" ? "text-slate-700 dark:text-slate-200" : ""}`}>
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Thinking indicator */}
          <AnimatePresence>
            {isThinking && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-4 shadow-lg dark:bg-slate-800">
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-slate-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-slate-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-slate-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Quick questions:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickActions.slice(0, 5).map((action) => (
              <motion.button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm dark:bg-slate-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{action.icon}</span>
                <span className="text-slate-700 dark:text-slate-300">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-4 py-4 pb-32 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-md items-center gap-3">
          {/* Text Input */}
          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(inputText)}
              placeholder="Type a message..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-lg focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Send Button */}
          {inputText.trim() ? (
            <motion.button
              onClick={() => sendMessage(inputText)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </motion.button>
          ) : (
            // Microphone Button
            <motion.button
              onClick={toggleListening}
              className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
                isListening
                  ? "bg-red-500 text-white"
                  : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
            >
              {isListening ? (
                <motion.div
                  className="h-5 w-5 rounded-sm bg-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              )}
            </motion.button>
          )}
        </div>

        {/* Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="mt-3 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="text-lg text-red-500">🎙️ Listening...</p>
              <p className="text-sm text-slate-500">Tap to stop</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
