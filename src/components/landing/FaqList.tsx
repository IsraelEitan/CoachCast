"use client";

import type { FC } from "react";
import { useState } from "react";

const faqs = [
  {
    question: "What do I actually need to do?",
    answer:
      "Record a short clip with the teleprompter. Everything after that, including editing, overlays, B-roll, captions, and scheduling, is automated."
  },
  {
    question: "Can I edit the AI-generated script?",
    answer:
      "Yes. You can rewrite any section before recording or ask the AI to make the hook sharper, calmer, more technical, or more beginner friendly."
  },
  {
    question: "Does this work for gyms with multiple coaches?",
    answer:
      "Yes. Studio plans support multiple trainers, shared branding, approval workflows, and content calendars for different programs."
  },
  {
    question: "How fast is the finished video ready?",
    answer:
      "Most videos are edited and ready in minutes, not days. You can review them or let CoachCast schedule them automatically."
  }
];

export const FaqList: FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => {
        const isOpen = openFaq === index;
        return (
          <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
            <button
              className="faq-question"
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenFaq(isOpen ? null : index)}
            >
              {faq.question}
              <span />
            </button>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqList;
