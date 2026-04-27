"use client";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  date: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Happy");
  const [saved, setSaved] = useState(false);

  const MOODS = ["Happy", "Sad", "Anxious", "Calm", "Angry", "Grateful"];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    setEntries(saved);
  }, []);

  const saveEntry = () => {
    if (!text.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      mood,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    setText("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
  };

  return (
    <div className="dash-page">
      <div className="journal-header">
        <div className="dash-greeting">Your Journal</div>
        <div className="dash-sub">Your thoughts, your safe space</div>
      </div>

      <div className="dash-card">
        <div className="card-title">How was your day?</div>
        <div className="mood-select-row">
          {MOODS.map(m => (
            <button key={m} onClick={() => setMood(m)}
              className={"mood-pill " + (mood === m ? "mood-pill-active" : "")}>
              {m}
            </button>
          ))}
        </div>
        <textarea
          className="journal-textarea"
          placeholder="Write about your day..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
        />
        <button onClick={saveEntry} className="journal-save-btn">
          {saved ? "Saved!" : "Save Entry"}
        </button>
      </div>

      <div className="journal-entries-title">Recent Entries</div>

      {entries.length === 0 && (
        <div className="journal-empty">No entries yet. Start writing today!</div>
      )}

      {entries.map(entry => (
        <div key={entry.id} className="journal-entry-card">
          <div className="journal-entry-top">
            <div>
              <div className="journal-entry-date">{entry.date}</div>
              <div className="journal-entry-mood">{entry.mood}</div>
            </div>
            <button onClick={() => deleteEntry(entry.id)} className="journal-delete-btn">x</button>
          </div>
          <div className="journal-entry-text">{entry.text}</div>
        </div>
      ))}

      <div className="dash-bottom-space" />
      <BottomNav active="journal" />
    </div>
  );
}