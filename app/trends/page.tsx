"use client";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

interface DayData {
  date: string;
  checkIn: number | null;
  chatEmotion: number | null;
}

const MOOD_LABELS: Record<number, string> = { 1: "Awful", 2: "Sad", 3: "Okay", 4: "Good", 5: "Amazing" };
const EMOTION_MAP: Record<string, number> = {
  joy: 5, happy: 5, excited: 5, amazing: 5,
  content: 4, good: 4, calm: 4, peaceful: 4,
  neutral: 3, okay: 3, fine: 3,
  sad: 2, anxious: 2, worried: 2, tired: 2,
  angry: 1, awful: 1, depressed: 1, stressed: 1,
};

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toDateString();
  });
}

export default function TrendsPage() {
  const [data, setData] = useState<DayData[]>([]);
  const [totalChats, setTotalChats] = useState(0);
  const [topMood, setTopMood] = useState("--");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const days = getLast7Days();
    const streakData = JSON.parse(localStorage.getItem("streakData") || "{}");
    const weekLog = JSON.parse(localStorage.getItem("weekLog") || "[]");

    setTotalChats(weekLog.length);

    const moodCounts: Record<number, number> = {};
    let s = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (streakData[days[i]]) s++;
      else break;
    }
    setStreak(s);

    const mapped: DayData[] = days.map(dateStr => {
      const checkIn = streakData[dateStr] ? parseInt(streakData[dateStr]) : null;
      if (checkIn) moodCounts[checkIn] = (moodCounts[checkIn] || 0) + 1;

      const dayLogs = weekLog.filter((l: any) => new Date(l.timestamp).toDateString() === dateStr);
      let chatEmotion: number | null = null;
      if (dayLogs.length > 0) {
        const emotions = dayLogs.map((l: any) => {
          const e = (l.emotion || "").toLowerCase();
          return EMOTION_MAP[e] || 3;
        });
        chatEmotion = Math.round(emotions.reduce((a: number, b: number) => a + b, 0) / emotions.length);
      }

      return { date: dateStr, checkIn, chatEmotion };
    });

    setData(mapped);

    const top = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    if (top) setTopMood(MOOD_LABELS[parseInt(top[0])] || "--");
  }, []);

  const chartH = 140;
  const chartW = 300;
  const pad = 20;
  const cols = data.length;
  const colW = (chartW - pad * 2) / (cols - 1);

  const toY = (val: number | null) => val ? chartH - pad - ((val - 1) / 4) * (chartH - pad * 2) : null;

  const pointsCheckIn = data.map((d, i) => ({ x: pad + i * colW, y: toY(d.checkIn) })).filter(p => p.y !== null);
  const pointsChat = data.map((d, i) => ({ x: pad + i * colW, y: toY(d.chatEmotion) })).filter(p => p.y !== null);

  const toPath = (pts: { x: number; y: number | null }[]) =>
    pts.filter(p => p.y !== null).map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const dayLabels = data.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  return (
    <div className="dash-page">
      <div className="dash-greeting">Mood Trends</div>
      <div className="dash-sub">Your emotional journey this week</div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{streak}</div><div className="stat-label">Day Streak</div></div>
        <div className="stat-card"><div className="stat-num">{totalChats}</div><div className="stat-label">Total Chats</div></div>
        <div className="stat-card"><div className="stat-num" style={{fontSize:"1rem"}}>{topMood}</div><div className="stat-label">Top Mood</div></div>
      </div>

      <div className="dash-card">
        <div className="card-title">This Week</div>
        <div className="trends-legend">
          <span className="legend-dot" style={{background:"#8e44ad"}} /> Check-in
          <span className="legend-dot" style={{background:"#4fc3f7", marginLeft:"12px"}} /> Chat emotion
        </div>
        <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} className="trends-chart">
          {[1,2,3,4,5].map(v => {
            const y = toY(v)!;
            return <line key={v} x1={pad} y1={y} x2={chartW - pad} y2={y} stroke="rgba(180,130,255,0.15)" strokeWidth="1" />;
          })}
          {pointsCheckIn.length > 1 && <path d={toPath(pointsCheckIn)} fill="none" stroke="#8e44ad" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {pointsChat.length > 1 && <path d={toPath(pointsChat)} fill="none" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {pointsCheckIn.map((p, i) => <circle key={i} cx={p.x} cy={p.y!} r="4" fill="#8e44ad" />)}
          {pointsChat.map((p, i) => <circle key={i} cx={p.x} cy={p.y!} r="4" fill="#4fc3f7" />)}
        </svg>
        <div className="trends-labels">
          {dayLabels.map((d, i) => <span key={i} className="trends-day-label">{d}</span>)}
        </div>
      </div>

      <div className="dash-card">
        <div className="card-title">Daily Breakdown</div>
        {data.map((d, i) => (
          <div key={i} className="trends-row">
            <div className="trends-day">{dayLabels[i]}</div>
            <div className="trends-bars">
              <div className="trends-bar-wrap">
                <div className="trends-bar" style={{width: d.checkIn ? `${(d.checkIn/5)*100}%` : "0%", background: "#8e44ad"}} />
                <span className="trends-bar-label">{d.checkIn ? MOOD_LABELS[d.checkIn] : "--"}</span>
              </div>
              <div className="trends-bar-wrap">
                <div className="trends-bar" style={{width: d.chatEmotion ? `${(d.chatEmotion/5)*100}%` : "0%", background: "#4fc3f7"}} />
                <span className="trends-bar-label">{d.chatEmotion ? MOOD_LABELS[d.chatEmotion] : "--"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-bottom-space" />
      <BottomNav active="trends" />
    </div>
  );
}