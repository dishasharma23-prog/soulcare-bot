"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#F3E8FF] flex flex-col items-center">

      {/* TOP SECTION – Hero */}
      <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between px-8 md:px-12 mt-20">

        {/* LEFT TEXT */}
        <div className="max-w-xl text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 leading-tight">
            Your AI Companion for <br /> Emotional Well-Being 🌙
          </h1>

          <p className="text-gray-700 text-lg mt-4 leading-relaxed">
            Feeling overwhelmed, stressed, or just need someone to talk to? 
            <span className="font-semibold text-purple-600"> SoulCare </span>
            listens softly — with comfort and without judgment. Available anytime you
            need a safe, supportive space.
          </p>

          {/* ⭐ Improved Button */}
          <a
            href="/chatbot"
            className="
              inline-block mt-6 px-10 py-3.5
              bg-gradient-to-r from-purple-600 to-purple-700
              hover:from-purple-700 hover:to-purple-800
              text-white font-semibold 
              rounded-full
              shadow-[0_6px_16px_rgba(120,58,255,0.55)]
              hover:shadow-[0_8px_20px_rgba(120,58,255,0.65)]
              border border-white/50
              backdrop-blur-sm
              transition-all
            "
          >
            Talk to SoulCare 💜
          </a>

        </div>

        {/* RIGHT MASCOT CARD */}
        <div className="mt-10 md:mt-0">
          <div className="bg-white/80 p-4 rounded-2xl shadow-xl backdrop-blur-sm">
            <img
              src="/soulcare-mascot.png"
              alt="SoulCare Mascot"
              className="w-72 md:w-80 rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* MIDDLE REASSURANCE */}
      <section className="text-center mt-20 px-8 max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800">
          You’re Not Alone 💛
        </h2>
        <p className="text-gray-600 mt-3 leading-relaxed">
          Life can get heavy sometimes. SoulCare Bot provides a safe and supportive
          space to share your feelings. We listen. We comfort. We care.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          This does not replace professional therapy.
        </p>
      </section>

    </div>
  );
}
