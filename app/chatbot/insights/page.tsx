"use client";

import { useEffect, useState } from "react";
import EmotionChart from "../EmotionChart";
import { formatInsightText } from "../../utils/formatInsightText";



 // ✅ ADDED & USED EVERYWHERE

export default function InsightsPage() {
  const [report, setReport] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [active, setActive] = useState("summary");

  useEffect(() => {
    const saved = localStorage.getItem("weeklyReport");
    const wl = localStorage.getItem("weekLog");

    if (saved) setReport(JSON.parse(saved));
    if (wl) setLogs(JSON.parse(wl));
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700 text-lg">
        No Insights Yet 💛 <br /> Start chatting with SoulCare first.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFE4FF] p-6 flex justify-center">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">
            Your Weekly Insights 💜
          </h2>

          <nav className="flex flex-col gap-3">
            {["summary", "trends", "coping", "improve"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`py-3 px-4 rounded-lg text-left text-sm font-medium transition 
                ${
                  active === tab
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {tab === "summary" && "Summary"}
                {tab === "trends" && "Trends"}
                {tab === "coping" && "Coping Plan"}
                {tab === "improve" && "Areas to Improve"}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 space-y-6">
          
          {/* SUMMARY */}
          {active === "summary" && (
            <Box title="Weekly Summary">
              {formatInsightText(report.weekly_summary)}
            </Box>
          )}

          {/* TRENDS */}
          {active === "trends" && (
            <Box title="Emotional Trends">
              <EmotionChart logs={logs} />

              <div className="mt-6">
                <h4 className="font-semibold text-purple-700 mb-2">
                  Top Triggers:
                </h4>

                <ul className="list-disc ml-5 text-gray-700 leading-7">
                  {report.top_triggers?.map((t: any, i: number) => (
                    <li key={i}>{formatInsightText(t)}</li>
                  ))}
                </ul>
              </div>
            </Box>
          )}

          {/* COPING PLAN */}
          {active === "coping" && (
            <Box title="Coping Plan">
              {formatInsightText(report.coping_plan)}
            </Box>
          )}

          {/* AREAS TO IMPROVE */}
          {active === "improve" && (
            <Box title="Areas to Improve">

              <h4 className="font-semibold text-purple-700">Journaling Prompts</h4>
              <ul className="list-disc ml-5 mb-4">
                {report.areas_to_improve.journaling_prompts.map(
                  (item: string, i: number) => (
                    <li key={i}>{formatInsightText(item)}</li>
                  )
                )}
              </ul>

              <h4 className="font-semibold text-purple-700">Affirmations</h4>
              <ul className="list-disc ml-5 mb-4">
                {report.areas_to_improve.affirmations.map(
                  (item: string, i: number) => (
                    <li key={i}>{formatInsightText(item)}</li>
                  )
                )}
              </ul>

              <h4 className="font-semibold text-purple-700">Emotional Routines</h4>
              <ul className="list-disc ml-5">
                {report.areas_to_improve.emotional_routines.map(
                  (item: string, i: number) => (
                    <li key={i}>{formatInsightText(item)}</li>
                  )
                )}
              </ul>

            </Box>
          )}
        </main>
      </div>
    </div>
  );
}

/* REUSABLE BOX COMPONENT — SAFE (NO <p> INSIDE <p>) */
function Box({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-purple-600 font-bold text-2xl mb-4">{title}</h3>

      <div className="text-gray-700 leading-7 whitespace-pre-line text-[15px]">
        {children}
      </div>
    </div>
  );
}
