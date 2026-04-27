/// <reference types="react" />
/* eslint-disable react/jsx-key */
import React from "react";

export function formatInsightText(raw: string) {
  if (!raw) return <></>;

  let text = raw.replace(/\*\*/g, "");
  const lines = text.split("\n");

 const elements: React.ReactNode[] = [];


  let currentList: string[] = [];
  let listType: "ol" | "ul" | null = null;

  const flushList = () => {
    if (currentList.length === 0) return;

    if (listType === "ol") {
      elements.push(
        <ol key={`ol-${elements.length}`} className="list-decimal ml-6 mb-4 text-gray-700">
          {currentList.map((item, idx) => (
            <li key={idx} className="mb-1">{item}</li>
          ))}
        </ol>
      );
    } else if (listType === "ul") {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc ml-6 mb-4 text-gray-700">
          {currentList.map((item, idx) => (
            <li key={idx} className="mb-1">{item}</li>
          ))}
        </ul>
      );
    }

    currentList = [];
    listType = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      elements.push(<div key={`space-${idx}`} className="h-3"></div>);
      return;
    }

    if (/^[A-Za-z].+:$/.test(trimmed)) {
      flushList();
      elements.push(
        <h4 key={`h-${idx}`} className="text-purple-600 font-bold text-lg mt-4 mb-1">
          {trimmed.replace(":", "")}
        </h4>
      );
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== "ol") flushList();
      listType = "ol";
      currentList.push(trimmed.replace(/^\d+\.\s/, ""));
      return;
    }

    if (/^- /.test(trimmed) || /^\* /.test(trimmed)) {
      if (listType !== "ul") flushList();
      listType = "ul";
      currentList.push(trimmed.slice(2));
      return;
    }

    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-gray-700 leading-7 mb-2">
        {trimmed}
      </p>
    );
  });

  flushList();
  return <>{elements}</>;
}
