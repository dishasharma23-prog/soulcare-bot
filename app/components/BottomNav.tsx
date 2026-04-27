"use client";
import { useRouter } from "next/navigation";
const NAV_ITEMS = [
  { icon: "Home", label: "Home", path: "/dashboard", key: "home" },
  { icon: "Chat", label: "Chat", path: "/chatbot", key: "chat" },
  { icon: "Insights", label: "Insights", path: "/chatbot/insights", key: "insights" },
];
export default function BottomNav({ active }: { active: string }) {
  const router = useRouter();
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button key={item.key} onClick={() => router.push(item.path)}
          className={"nav-item " + (active === item.key ? "nav-active" : "")}>
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}