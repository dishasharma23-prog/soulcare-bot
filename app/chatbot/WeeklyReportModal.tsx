"use client";

import { useState, useEffect } from "react";
import EmotionChart from "./EmotionChart";
import { formatInsightText } from "../utils/formatInsightText";

export default function WeeklyReportOverlay({ report, logs, onClose }: any) {
  const [activeTab, setActiveTab] = useState("Summary");
  const [visible, setVisible] = useState(false);

  const tabs = ["Summary", "Trends", "Coping Plan", "Areas to Improve"];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      className="report-overlay"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="report-panel"
        style={{
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Header */}
        <div className="report-header">
          <div>
            <div className="report-eyebrow">✨ Your Weekly Recap</div>
            <h2 className="report-title">Weekly Insights 💜</h2>
          </div>
          <button className="report-close" onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="report-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`report-tab ${activeTab === tab ? "active-tab" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="report-content">
          {activeTab === "Summary" && (
            <div className="report-section">
              {formatInsightText(report.weekly_summary)}
            </div>
          )}
          {activeTab === "Trends" && (
            <div className="report-section">
              <EmotionChart logs={logs} />
              {report.top_triggers?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-purple-700 font-semibold text-lg mb-2">Top Triggers</h4>
                  <ul className="list-disc ml-5 text-gray-700 leading-8">
                    {report.top_triggers.map((t: string, i: number) => (
                      <li key={i}>{formatInsightText(t)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {activeTab === "Coping Plan" && (
            <div className="report-section">
              {formatInsightText(report.coping_plan)}
            </div>
          )}
          {activeTab === "Areas to Improve" && (
            <div className="report-section">
              {report.areas_to_improve?.journaling_prompts && (
                <>
                  <h4 className="text-purple-700 font-semibold text-lg mb-2">Journaling Prompts</h4>
                  <ul className="list-disc ml-5 mb-5 text-gray-700 leading-8">
                    {report.areas_to_improve.journaling_prompts.map((item: string, i: number) => (
                      <li key={i}>{formatInsightText(item)}</li>
                    ))}
                  </ul>
                  <h4 className="text-purple-700 font-semibold text-lg mb-2">Affirmations</h4>
                  <ul className="list-disc ml-5 mb-5 text-gray-700 leading-8">
                    {report.areas_to_improve.affirmations.map((item: string, i: number) => (
                      <li key={i}>{formatInsightText(item)}</li>
                    ))}
                  </ul>
                  <h4 className="text-purple-700 font-semibold text-lg mb-2">Emotional Routines</h4>
                  <ul className="list-disc ml-5 text-gray-700 leading-8">
                    {report.areas_to_improve.emotional_routines.map((item: string, i: number) => (
                      <li key={i}>{formatInsightText(item)}</li>
                    ))}
                  </ul>
                </>
              )}
              {typeof report.areas_to_improve === "string" && (
                formatInsightText(report.areas_to_improve)
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="report-footer">
          <a href="/chatbot/insights" className="insights-link-btn">
            Open Full Insights Page →
          </a>
          <button className="report-close-btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
