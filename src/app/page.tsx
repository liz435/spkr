'use client'

import { useState } from "react";
import SPKR from "@/components/Speaker";

export default function Home() {
  const [speakerState, setSpeakerState] = useState({ rotation: 0, color: "orange" });

  const rotateSpeaker = () => {
    setSpeakerState((prev) => ({ ...prev, rotation: prev.rotation + Math.PI / 4 }));
  };

  const changeSpeakerColor = (color: string) => {
    setSpeakerState((prev) => ({ ...prev, color }));
  };

  const changeFaceColor = (color: string, face:string) => {
    setSpeakerState((prev) => ({ ...prev,[face]: color }));

  }
  const colors = ["blue", "green", "orange", "red", "purple", "yellow"];


  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <nav className="hidden sm:flex space-x-4">
            <a href="#" className="hover:text-gray-400 transition">Home</a>
            <a href="#" className="hover:text-gray-400 transition">About</a>
            <a href="#" className="hover:text-gray-400 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Sidebar */}
        <aside className="w-full sm:w-1/4 bg-gray-800 border-r border-gray-700">
          <nav className="p-4">
            <ul className="space-y-3">
              <li>
                <button
                  onClick={rotateSpeaker}
                  className="block w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  Rotate Speaker
                </button>
              </li>

              <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Customize Color</h2>
              <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => changeSpeakerColor(color)}
                  className={`w-10 h-10 ring-1 ring-white transition ${
                    color === "blue" ? "bg-blue-700 hover:bg-blue-600" :
                    color === "green" ? "bg-green-700 hover:bg-green-600" :
                    color === "orange" ? "bg-orange-700 hover:bg-orange-600" :
                    color === "red" ? "bg-red-700 hover:bg-red-600" :
                    color === "purple" ? "bg-purple-700 hover:bg-purple-600" :
                    color === "yellow" ? "bg-yellow-700 hover:bg-yellow-600" :
                    color === "pink" ? "bg-pink-700 hover:bg-pink-600" :
                    color === "teal" ? "bg-teal-700 hover:bg-teal-600" :
                    "bg-gray-700 hover:bg-gray-600"
                  }`}
                  title={`Change to ${color}`}
                />
              ))}
            </div>
              </div>


              <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Customize Individual Face Color</h2>
              <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => changeFaceColor(color,"front")}
                  className={`w-10 h-10 ring-1 ring-white transition ${
                    color === "blue" ? "bg-blue-700 hover:bg-blue-600" :
                    color === "green" ? "bg-green-700 hover:bg-green-600" :
                    color === "orange" ? "bg-orange-700 hover:bg-orange-600" :
                    color === "red" ? "bg-red-700 hover:bg-red-600" :
                    color === "purple" ? "bg-purple-700 hover:bg-purple-600" :
                    color === "yellow" ? "bg-yellow-700 hover:bg-yellow-600" :
                    color === "pink" ? "bg-pink-700 hover:bg-pink-600" :
                    color === "teal" ? "bg-teal-700 hover:bg-teal-600" :
                    "bg-gray-700 hover:bg-gray-600"
                  }`}
                  title={`Change to ${color}`}
                />
              ))}
            </div>
              </div>


            </ul>
          </nav>
        </aside>

        {/* Main Scene */}
        <main className="flex-1 bg-gray-900 relative">
          <div className="absolute inset-0">
            <SPKR speakerState={speakerState} />
          </div>
        </main>
      </div>
    </div>
  );
}