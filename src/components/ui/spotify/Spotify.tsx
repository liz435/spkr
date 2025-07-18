"use client"

import { useEffect, useState } from "react"

export default function Spotify() {
  const [currentTrack, setCurrentTrack] = useState("37i9dQZF1DX0XUsuxWHRQd") // Spotify playlist ID
  const [embedType, setEmbedType] = useState<'track' | 'playlist' | 'album'>('playlist')
  
  // Some popular Spotify URIs for demo
  const spotifyContent = {
    track: "4iV5W9uYEdYUVa79Axb7Rh", // Never Gonna Give You Up
    playlist: "37i9dQZF1DX0XUsuxWHRQd", // RapCaviar
    album: "4aawyAB9vmqN3uQ7FjRGTy" // Global Warming - Pitbull
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #9333EA 100%)" }}
    >
      {/* Control buttons */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setEmbedType('playlist')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            embedType === 'playlist' 
              ? 'bg-white text-purple-600 shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Playlist
        </button>
        <button
          onClick={() => setEmbedType('track')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            embedType === 'track' 
              ? 'bg-white text-purple-600 shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Track
        </button>
        <button
          onClick={() => setEmbedType('album')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            embedType === 'album' 
              ? 'bg-white text-purple-600 shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Album
        </button>
      </div>

      {/* Spotify Embed Container */}
      <div
        className="w-full max-w-lg rounded-3xl p-6 relative"
        style={{
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          boxShadow: `
            inset 0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 -2px 4px rgba(255, 255, 255, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.4)
          `,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div className="text-white text-xs font-mono mb-4 tracking-wider opacity-80 text-center">
          SPOTIFY EMBED {">"} {embedType.toUpperCase()}
        </div>

        {/* Spotify Embed */}
        <div className="rounded-2xl overflow-hidden">
          <iframe
            src={`https://open.spotify.com/embed/${embedType}/${spotifyContent[embedType]}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-2xl"
          />
        </div>
      </div>

      {/* Alternative compact player */}
      <div
        className="w-full max-w-lg mt-8 rounded-3xl p-4 relative"
        style={{
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          boxShadow: `
            inset 0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 -2px 4px rgba(255, 255, 255, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.4)
          `,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="text-white text-xs font-mono mb-4 tracking-wider opacity-80 text-center">
          COMPACT PLAYER
        </div>
        <iframe
          src={`https://open.spotify.com/embed/${embedType}/${spotifyContent[embedType]}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen={false}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}
