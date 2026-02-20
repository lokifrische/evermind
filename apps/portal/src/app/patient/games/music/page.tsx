"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";

// Musical eras and sample playlists
const playlists = [
  {
    id: "1950s",
    era: "1950s",
    title: "The Fifties",
    subtitle: "Rock & Roll, Doo-Wop",
    icon: "🎸",
    color: "from-rose-400 to-pink-600",
    songs: [
      { title: "Rock Around the Clock", artist: "Bill Haley", duration: "2:08" },
      { title: "Johnny B. Goode", artist: "Chuck Berry", duration: "2:38" },
      { title: "Heartbreak Hotel", artist: "Elvis Presley", duration: "2:08" },
      { title: "La Bamba", artist: "Ritchie Valens", duration: "2:10" },
      { title: "Great Balls of Fire", artist: "Jerry Lee Lewis", duration: "1:52" },
    ],
  },
  {
    id: "1960s",
    era: "1960s",
    title: "The Sixties",
    subtitle: "Beatles, Motown",
    icon: "✌️",
    color: "from-purple-400 to-indigo-600",
    songs: [
      { title: "Yesterday", artist: "The Beatles", duration: "2:05" },
      { title: "My Girl", artist: "The Temptations", duration: "2:58" },
      { title: "Respect", artist: "Aretha Franklin", duration: "2:28" },
      { title: "Good Vibrations", artist: "Beach Boys", duration: "3:39" },
      { title: "What a Wonderful World", artist: "Louis Armstrong", duration: "2:21" },
    ],
  },
  {
    id: "1970s",
    era: "1970s",
    title: "The Seventies",
    subtitle: "Disco, Soul, Rock",
    icon: "🕺",
    color: "from-amber-400 to-orange-600",
    songs: [
      { title: "Dancing Queen", artist: "ABBA", duration: "3:51" },
      { title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55" },
      { title: "Stayin' Alive", artist: "Bee Gees", duration: "4:45" },
      { title: "Hotel California", artist: "Eagles", duration: "6:30" },
      { title: "I Will Survive", artist: "Gloria Gaynor", duration: "3:15" },
    ],
  },
  {
    id: "1980s",
    era: "1980s",
    title: "The Eighties",
    subtitle: "Pop, Synth, Classics",
    icon: "🎹",
    color: "from-sky-400 to-blue-600",
    songs: [
      { title: "Billie Jean", artist: "Michael Jackson", duration: "4:54" },
      { title: "Take On Me", artist: "a-ha", duration: "3:46" },
      { title: "Sweet Child O' Mine", artist: "Guns N' Roses", duration: "5:56" },
      { title: "Like a Prayer", artist: "Madonna", duration: "5:41" },
      { title: "Don't Stop Believin'", artist: "Journey", duration: "4:11" },
    ],
  },
  {
    id: "christmas",
    era: "Holiday",
    title: "Christmas Classics",
    subtitle: "Holiday Favorites",
    icon: "🎄",
    color: "from-emerald-400 to-green-600",
    songs: [
      { title: "White Christmas", artist: "Bing Crosby", duration: "3:03" },
      { title: "Jingle Bell Rock", artist: "Bobby Helms", duration: "2:11" },
      { title: "Have Yourself a Merry Little Christmas", artist: "Judy Garland", duration: "3:29" },
      { title: "Let It Snow!", artist: "Dean Martin", duration: "1:56" },
      { title: "Rockin' Around the Christmas Tree", artist: "Brenda Lee", duration: "2:04" },
    ],
  },
  {
    id: "gospel",
    era: "Spiritual",
    title: "Gospel & Hymns",
    subtitle: "Uplifting Classics",
    icon: "🙏",
    color: "from-yellow-400 to-amber-600",
    songs: [
      { title: "Amazing Grace", artist: "Traditional", duration: "4:30" },
      { title: "How Great Thou Art", artist: "Traditional", duration: "4:45" },
      { title: "Oh Happy Day", artist: "Edwin Hawkins Singers", duration: "4:00" },
      { title: "Lean on Me", artist: "Bill Withers", duration: "4:01" },
      { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel", duration: "4:52" },
    ],
  },
];

interface Song {
  title: string;
  artist: string;
  duration: string;
}

export default function MusicPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(true);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setShowPlaylists(false);
    // In production: integrate with actual music service API
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const backToPlaylists = () => {
    setShowPlaylists(true);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen px-6 py-8 pt-20 pb-32">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🎶 Musical Memory Lane
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Listen to songs from your favorite years
        </p>
      </motion.header>

      <AnimatePresence mode="wait">
        {showPlaylists ? (
          <motion.div
            key="playlists"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Era/Playlist Selection */}
            <motion.div
              className="mx-auto mt-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {playlists.map((playlist, index) => (
                  <motion.button
                    key={playlist.id}
                    onClick={() => {
                      setSelectedPlaylist(playlist);
                      setShowPlaylists(false);
                    }}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${playlist.color} p-5 text-left text-white shadow-lg`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-4xl">{playlist.icon}</span>
                    <h3 className="mt-2 text-lg font-bold">{playlist.title}</h3>
                    <p className="text-sm text-white/80">{playlist.subtitle}</p>
                    <p className="mt-2 text-xs text-white/60">
                      {playlist.songs.length} songs
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Featured Song */}
            <motion.div
              className="mx-auto mt-8 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:bg-slate-800/70">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  🌟 Today's Featured Song
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-3xl">
                    🎵
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-white">
                      What a Wonderful World
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Louis Armstrong
                    </p>
                  </div>
                  <motion.button
                    onClick={() => playSong({ title: "What a Wonderful World", artist: "Louis Armstrong", duration: "2:21" })}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={backToPlaylists}
              className="mx-auto mt-4 flex items-center gap-2 text-slate-600 dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Playlists
            </motion.button>

            {/* Playlist Header */}
            <motion.div
              className={`mx-auto mt-4 max-w-md rounded-2xl bg-gradient-to-br ${selectedPlaylist.color} p-6 text-center text-white shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-5xl">{selectedPlaylist.icon}</span>
              <h2 className="mt-2 text-2xl font-bold">{selectedPlaylist.title}</h2>
              <p className="text-white/80">{selectedPlaylist.subtitle}</p>
            </motion.div>

            {/* Now Playing */}
            <AnimatePresence>
              {currentSong && (
                <motion.div
                  className="mx-auto mt-6 max-w-md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-slate-800">
                    {/* Album Art Placeholder */}
                    <motion.div
                      className={`mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedPlaylist.color} text-6xl shadow-lg`}
                      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 8, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                    >
                      🎵
                    </motion.div>

                    <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
                      {currentSong.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {currentSong.artist}
                    </p>

                    {/* Progress Bar (simulated) */}
                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${selectedPlaylist.color}`}
                          initial={{ width: "0%" }}
                          animate={{ width: isPlaying ? "100%" : "30%" }}
                          transition={{ duration: 180, ease: "linear" }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-slate-500">
                        <span>0:45</span>
                        <span>{currentSong.duration}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-6 flex items-center justify-center gap-6">
                      <motion.button
                        className="flex h-12 w-12 items-center justify-center rounded-full text-slate-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 20L9 12l10-8v16zM7 20H5V4h2v16z" />
                        </svg>
                      </motion.button>

                      <motion.button
                        onClick={togglePlayPause}
                        className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${selectedPlaylist.color} text-white shadow-lg`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isPlaying ? (
                          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </motion.button>

                      <motion.button
                        className="flex h-12 w-12 items-center justify-center rounded-full text-slate-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 4l10 8-10 8V4zm12 0h2v16h-2V4z" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Status Message */}
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      {isPlaying ? "♫ Now playing..." : "Paused"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Song List */}
            <motion.div
              className="mx-auto mt-6 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-white">
                Songs in this playlist
              </h3>
              <div className="space-y-2">
                {selectedPlaylist.songs.map((song, index) => (
                  <motion.button
                    key={song.title}
                    onClick={() => playSong(song)}
                    className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors ${
                      currentSong?.title === song.title
                        ? "bg-sky-100 dark:bg-sky-900/30"
                        : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                    } shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${selectedPlaylist.color} text-lg text-white`}>
                      {currentSong?.title === song.title && isPlaying ? "🎵" : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <span className="text-sm text-slate-400">{song.duration}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note about demo */}
      <motion.div
        className="mx-auto mt-8 max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="rounded-2xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            🎵 In the full version, this will connect to a music streaming service.
          </p>
        </div>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
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
