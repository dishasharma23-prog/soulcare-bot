export default function Home() {
  return (
    <div className="min-h-screen bg-[#EDE7F6] flex flex-col text-[#2E2E2E]">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold text-[#6A4BBC]">SoulCare Bot 💜</h1>
        <a href="/chatbot" className="px-5 py-2 bg-[#9575CD] text-white rounded-xl hover:opacity-90">
          Start Chatting
        </a>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between px-12 mt-10">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Your AI Companion for Emotional Well-Being 🌙
          </h2>

          <p className="mt-4 text-lg">
            Feeling overwhelmed, stressed, or just need someone to talk to?  
            <span className="font-semibold">SoulCare</span> is here to listen — gently, without judgment.
            Available 24/7, anytime you need comfort.
          </p>

          <a href="/chatbot"
            className="inline-block mt-6 px-6 py-3 bg-[#9575CD] text-white font-semibold rounded-xl hover:opacity-90">
            Talk to SoulCare
          </a>
        </div>

        {/* Illustration */}
        <img
          src="https://i.postimg.cc/TPSZ38BR/meditate-girl-illustration.png"
          alt="Calm girl illustration"
          className="w-[300px] md:w-[420px] mt-10 md:mt-0"
        />
      </div>

      {/* ABOUT SECTION */}
      <div className="px-12 mt-16 max-w-3xl mx-auto text-center">
        <h3 className="text-3xl font-semibold">You’re Not Alone 💛</h3>
        <p className="mt-4 text-lg">
          Life can get heavy sometimes. SoulCare Bot provides a safe and supportive space to share your feelings.
          We listen. We comfort. We care.  
          <br /><br />
          <em>This does not replace professional therapy.</em>
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-4 gap-6 px-12 mt-14 text-center">
        <div className="bg-white p-6 rounded-2xl shadow">💬 Supportive Conversations</div>
        <div className="bg-white p-6 rounded-2xl shadow">🌍 Hindi & English Support</div>
        <div className="bg-white p-6 rounded-2xl shadow">🧘 Breathing & Coping Guidance</div>
        <div className="bg-white p-6 rounded-2xl shadow">🛟 Safe Emotional Space</div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-sm opacity-70 pb-6">
        SoulCare Bot offers emotional support but is not a replacement for professional mental health care.  
        If you feel unsafe, please reach out to a trusted person or helpline.
      </footer>
    </div>
  );
}
