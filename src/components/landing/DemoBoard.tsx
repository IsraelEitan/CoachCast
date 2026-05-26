"use client";

import type { FC } from "react";
import { useState } from "react";

const demoPanels = ["script", "record", "publish"] as const;

type DemoPanel = (typeof demoPanels)[number];

export const DemoBoard: FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoPanel>("script");

  return (
    <div className="demo-board" aria-label="Three stage product demo">
      {demoPanels.map((panel, index) => (
        <button
          className={`demo-card ${activeDemo === panel ? "demo-card--active" : ""}`}
          data-demo-panel={panel}
          key={panel}
          type="button"
          onClick={() => setActiveDemo(panel)}
        >
          <span>{index + 1}</span>
          <h3>
            {panel === "script" && "AI writes your script"}
            {panel === "record" && "You record with a teleprompter"}
            {panel === "publish" && "We edit and publish"}
          </h3>
          <p>
            {panel === "script" && "In your coaching voice, built around your offer."}
            {panel === "record" && "Read naturally while demoing the movement."}
            {panel === "publish" && "Fully automatic after the recording."}
          </p>
          {panel === "script" && (
            <div className="script-lines">
              <div />
              <div />
              <div />
              <div />
            </div>
          )}
          {panel === "record" && (
            <div className="record-chip">
              <span className="rec-dot" />
              REC
            </div>
          )}
          {panel === "publish" && (
            <div className="publish-tags">
              <span>AI B-roll</span>
              <span>Captions</span>
              <span>Schedule</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default DemoBoard;
