// frontend/src/pages/Home.tsx
import React from "react";
import TaskList from "../components/TaskList";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <TaskList />
    </div>
  );
}
