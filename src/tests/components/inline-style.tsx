import React from "react";

export const InlineStyleComponent = () => (
  <div
    style={{
      padding: 16,
    }}
  >
    <button
      style={{
        background: "#00f",
        color: "#fff",
        padding: 8,
        borderRadius: 4,
        fontSize: "2em",
      }}
    >
      This component was styled with inline styles
    </button>
  </div>
);
