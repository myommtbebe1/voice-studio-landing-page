import LeftSidebar from "./components/LeftSidebar.jsx";
import Editor from "./components/Editor.jsx";
import RightSidebar from "./components/RightSidebar.jsx";

import { useMemo, useState } from "react";

function formatTime(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(Math.floor(s % 60)).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function Voicestudio() {
  const [voices] = useState([
    { id: "v1", name: "Voice 1", tagline: "News Anchor" },
    { id: "v2", name: "Voice 2", tagline: "News Anchor" },
    { id: "v3", name: "Voice 3", tagline: "News Anchor" },
  ]);

  const [selectedVoiceId, setSelectedVoiceId] = useState("v1");
  const [text, setText] = useState("");

  const [outputs] = useState([
    {
      id: 1,
      name: "Project_Draft_.wav",
      durationSec: 14,
      when: "Generated Just Now",
    },
  ]);

  const wordCount = useMemo(() => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [text]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white text-slate-800">
      <main className="flex flex-1 overflow-hidden">
        <LeftSidebar
          voices={voices}
          selectedVoiceId={selectedVoiceId}
          setSelectedVoiceId={setSelectedVoiceId}
        />

        {/* ✅ NO onGenerate passed */}
        <Editor
          text={text}
          setText={setText}
          wordCount={wordCount}
        />

        <RightSidebar outputs={outputs} formatTime={formatTime} />
      </main>
    </div>
  );
}
