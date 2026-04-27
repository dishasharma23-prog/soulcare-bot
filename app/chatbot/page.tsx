"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import WeeklyReportOverlay from "./WeeklyReportModal";
import BottomNav from "../components/BottomNav";

interface Message { id: number; text: string; sender: "user" | "soulcare"; }

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([{ id: 1, text: "Hey, I am SoulCare. How are you feeling today?", sender: "soulcare" }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayReport, setOverlayReport] = useState<any>(null);
  const [overlayLogs, setOverlayLogs] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = inputMessage.trim();
    const newMessages = [...messages, { id: Date.now(), text: userMessage, sender: "user" as const }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: "soulcare" }]);
      const logs = JSON.parse(localStorage.getItem("weekLog") || "[]");
      logs.push({ user: userMessage, reply: data.reply, emotion: data.emotion, triggers: data.triggers, insight: data.insight, suggestion: data.suggestion, timestamp: new Date().toISOString() });
      localStorage.setItem("weekLog", JSON.stringify(logs));
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Something went wrong, try again?", sender: "soulcare" }]);
    } finally { setIsLoading(false); }
  }, [inputMessage, isLoading, messages]);

  const generateWeeklyReport = async () => {
    const logs = JSON.parse(localStorage.getItem("weekLog") || "[]");
    if (!logs.length) { setMessages(prev => [...prev, { id: Date.now(), text: "Chat a little with me first, then I can generate your weekly report.", sender: "soulcare" }]); return; }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/weekly", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ logs }) });
      const report = await res.json();
      localStorage.setItem("weeklyReport", JSON.stringify(report));
      setOverlayReport(report); setOverlayLogs(logs); setShowOverlay(true);
    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
  };

  return (
    <>
      {showOverlay && overlayReport && <WeeklyReportOverlay report={overlayReport} logs={overlayLogs} onClose={() => setShowOverlay(false)} />}
      <div className="chat-page">
        <h1 className="chat-header">SoulCare Companion</h1>
        <div className="chat-actions">
          <button onClick={generateWeeklyReport} disabled={isGenerating} className="action-btn report-btn">
            {isGenerating ? "Generating..." : "Generate Weekly Report"}
          </button>
          <a href="/chatbot/insights" className="action-btn insights-btn">View Insights</a>
        </div>
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className={"bubble-wrapper " + (msg.sender === "user" ? "user-wrapper" : "soul-wrapper")}>
              {msg.sender === "soulcare" && <div className="avatar">SC</div>}
              <div className={"bubble " + (msg.sender === "user" ? "user-bubble" : "soul-bubble")}>{msg.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="bubble-wrapper soul-wrapper">
              <div className="avatar">SC</div>
              <div className="bubble soul-bubble typing-bubble">
                <span className="dot-bounce" /><span className="dot-bounce delay-1" /><span className="dot-bounce delay-2" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Talk to me... I am here" className="chat-input" />
          <button onClick={sendMessage} disabled={isLoading} className="send-btn">Send</button>
        </div>
        <BottomNav active="chat" />
      </div>
    </>
  );
}