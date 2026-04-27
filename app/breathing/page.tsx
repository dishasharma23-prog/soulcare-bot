"use client";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const PHASES: { name: Phase; duration: number; label: string }[] = [
  { name: "inhale", duration: 4, label: "Breathe In" },
  { name: "hold", duration: 7, label: "Hold" },
  { name: "exhale", duration: 8, label: "Breathe Out" },
  { name: "rest", duration: 2, label: "Rest" },
];

export default function BreathingPage() {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (countdown === 0) {
      const next = (phaseIndex + 1) % PHASES.length;
      if (next === 0) setCycles(c => c + 1);
      setPhaseIndex(next);
      setCountdown(PHASES[next].duration);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [running, countdown, phaseIndex]);

  const toggle = () => {
    if (running) {
      setRunning(false);
      setPhaseIndex(0);
      setCountdown(PHASES[0].duration);
    } else {
      setRunning(true);
    }
  };

  const phase = PHASES[phaseIndex];
  const progress = 1 - countdown / phase.duration;
  const size = 200;
  const r = 80;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  return (
    <div className="dash-page">
      <div className="dash-greeting">Breathing Exercise</div>
      <div className="dash-sub">4-7-8 breathing to calm your mind</div>

      <div className="dash-card breath-card">
        <div className="breath-label">{phase.label}</div>
        <svg width={size} height={size} className="breath-svg">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(180,130,255,0.2)" strokeWidth="8" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#8e44ad" strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: "stroke-dasharray 1s linear" }}
          />
          <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
            fontSize="36" fontWeight="bold" fill="#6a0dad">
            {countdown}
          </text>
        </svg>

        <button onClick={toggle} className={"breath-btn " + (running ? "breath-btn-stop" : "")}>
          {running ? "Stop" : "Start"}
        </button>

        <div className="breath-cycles">Cycles completed: {cycles}</div>
      </div>

      <div className="dash-card">
        <div className="card-title">How it works</div>
        <div className="breath-steps">
          <div className="breath-step"><span className="breath-step-num">4s</span><span>Breathe in through your nose</span></div>
          <div className="breath-step"><span className="breath-step-num">7s</span><span>Hold your breath</span></div>
          <div className="breath-step"><span className="breath-step-num">8s</span><span>Exhale through your mouth</span></div>
        </div>
      </div>

      <div className="dash-bottom-space" />
      <BottomNav active="breathing" />
    </div>
  );
}