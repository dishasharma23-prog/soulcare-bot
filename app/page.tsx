"use client";
export default function Home() {
  return (
    <div className="landing-container min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="noise"></div>
      <section className="relative z-10 mt-10 max-w-4xl w-full">
        <h1 className="text-5xl font-extrabold text-purple-700 leading-tight fade-up">
          Your AI Companion for
          <br /> Emotional Well-Being
        </h1>
        <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto fade-up delay-300">
          Feeling overwhelmed, stressed, or just need someone to talk to?
          SoulCare listens softly with comfort and without judgment.
        </p>
        <div className="fade-up delay-300 flex justify-center mt-6">
          <a href="/dashboard" className="cta-button">Talk to SoulCare</a>
        </div>
        <div className="mascot-wrapper fade-up delay-300">
          <img src="/soulcare-mascot.png" alt="SoulCare Mascot" className="mascot-img" />
        </div>
      </section>
      <footer className="text-sm text-gray-500 pb-6 mt-6">This does not replace professional therapy.</footer>
    </div>
  );
}