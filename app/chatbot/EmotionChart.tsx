"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EmotionChart({ logs }: any) {
  if (!logs || logs.length === 0) {
    return <p>No emotional data yet 💜</p>;
  }

  const emotionCounts: any = {};

  logs.forEach((log: any) => {
    if (log.emotion) {
      emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
    }
  });

  const labels = Object.keys(emotionCounts);
  const scores = Object.values(emotionCounts);

  const data = {
    labels,
    datasets: [
      {
        label: "Emotion Frequency",
        data: scores,
        backgroundColor: "rgba(142, 68, 173, 0.6)",
        borderColor: "rgba(142, 68, 173, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
      <Bar data={data} />
    </div>
  );
}
