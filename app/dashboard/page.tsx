"use client";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
const MOODS = [
  { label: "Awful", value: 1, color: "#ff6b6b" },
  { label: "Sad", value: 2, color: "#ffa07a" },
  { label: "Okay", value: 3, color: "#ffd93d" },
  { label: "Good", value: 4, color: "#6bcb77" },
  { label: "Amazing", value: 5, color: "#845ef7" },
];
const AFFIRMATIONS = [
  "I choose peace, I choose joy, I choose me.",
  "I am enough, exactly as I am today.",
  "I am growing stronger every single day.",
  "I deserve kindness, especially from myself.",
  "Today I will be gentle with my heart.",
];
const GOALS = [
  "Take a 5-minute walk outside today",
  "Drink 8 glasses of water today",
  "Write down 3 things you are grateful for",
  "Take 10 deep breaths when you feel stressed",
  "Spend 10 minutes doing something you love",
];
function getDayIndex() { return new Date().getDay(); }
function getTodayKey() { return new Date().toDateString(); }
export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weekDays, setWeekDays] = useState<boolean[]>([false,false,false,false,false,false,false]);
  const [goalDone, setGoalDone] = useState(false);
  const todayAffirmation = AFFIRMATIONS[new Date().getDay() % AFFIRMATIONS.length];
  const todayGoal = GOALS[new Date().getDay() % GOALS.length];
  useEffect(() => {
    const todayMood = localStorage.getItem("mood_" + getTodayKey());
    if (todayMood) { setSelectedMood(parseInt(todayMood)); setMoodLogged(true); }
    const streakData = JSON.parse(localStorage.getItem("streakData") || "{}");
    const today = new Date();
    const weekChecks = [0,1,2,3,4,5,6].map(i => {
      const d = new Date(today);
      d.setDate(today.getDate() - (today.getDay() - i));
      return !!streakData[d.toDateString()];
    });
    setWeekDays(weekChecks);
    let s = 0;
    for (let i = getDayIndex(); i >= 0; i--) { if (weekChecks[i]) s++; else break; }
    setStreak(s);
    setGoalDone(localStorage.getItem("goal_" + getTodayKey()) === "true");
  }, []);
  const logMood = (value: number) => {
    setSelectedMood(value); setMoodLogged(true);
    localStorage.setItem("mood_" + getTodayKey(), value.toString());
    const streakData = JSON.parse(localStorage.getItem("streakData") || "{}");
    streakData[getTodayKey()] = value;
    localStorage.setItem("streakData", JSON.stringify(streakData));
    const today = new Date();
    const newWeek = [0,1,2,3,4,5,6].map(i => {
      const d = new Date(today);
      d.setDate(today.getDate() - (today.getDay() - i));
      return !!streakData[d.toDateString()];
    });
    setWeekDays(newWeek);
    let s = 0;
    for (let i = getDayIndex(); i >= 0; i--) { if (newWeek[i]) s++; else break; }
    setStreak(s);
  };
  const toggleGoal = () => {
    const newVal = !goalDone; setGoalDone(newVal);
    localStorage.setItem("goal_" + getTodayKey(), newVal.toString());
  };
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };
  const currentMoodObj = MOODS.find(m => m.value === selectedMood);
  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <div className="dash-greeting">{getGreeting()}, Beautiful Soul!</div>
          <div className="dash-sub">You matter. You are doing amazing.</div>
        </div>
        <img src="/soulcare-mascot.png" alt="SoulCare" className="dash-mascot" />
      </div>
      <div className="dash-card streak-card">
        <div className="streak-label">Day Streak: {streak}</div>
        <div className="week-days">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, i) => {
            const dayIndex = i === 6 ? 0 : i + 1;
            const isToday = getDayIndex() === dayIndex;
            const done = weekDays[dayIndex];
            return (
              <div key={day} className="day-item">
                <div className={"day-circle " + (done ? "day-done " : "") + (isToday ? "day-today" : "")}>{done ? "v" : ""}</div>
                <div className={"day-label " + (isToday ? "day-label-today" : "")}>{day}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="dash-card">
        <div className="card-title">How are you feeling today?</div>
        {moodLogged && currentMoodObj ? (
          <div className="mood-logged">
            <div className="mood-logged-label">Feeling {currentMoodObj.label} today</div>
            <button className="mood-change-btn" onClick={() => setMoodLogged(false)}>Change</button>
          </div>
        ) : (
          <div className="mood-grid">
            {MOODS.map((mood) => (
              <button key={mood.value} onClick={() => logMood(mood.value)}
                className={"mood-btn " + (selectedMood === mood.value ? "mood-selected" : "")}
                style={selectedMood === mood.value ? { borderColor: mood.color, background: mood.color + "22" } : {}}>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="dash-card">
        <div className="card-title">Today Goal</div>
        <div className="goal-row">
          <div className="goal-text">{todayGoal}</div>
          <button onClick={toggleGoal} className={"goal-check " + (goalDone ? "goal-done" : "")}>{goalDone ? "v" : ""}</button>
        </div>
        {goalDone && <div className="goal-congrats">Amazing! You did it today!</div>}
      </div>
      <div className="dash-card affirmation-card">
        <div className="card-title">Daily Affirmation</div>
        <div className="affirmation-text">"{todayAffirmation}"</div>
      </div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{streak}</div><div className="stat-label">Day Streak</div></div>
        <div className="stat-card"><div className="stat-num">{weekDays.filter(Boolean).length}</div><div className="stat-label">Days Active</div></div>
      </div>
      <div className="dash-bottom-space" />
      <BottomNav active="home" />
    </div>
  );
}