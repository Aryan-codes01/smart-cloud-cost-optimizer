import { SectionCard } from "../components/SectionCard.jsx";

const blocks = [
  {
    title: "Frontend",
    copy:
      "React + Vite dashboard with role-aware routing, upload flow, forecast visualizations, and an action center.",
  },
  {
    title: "API Layer",
    copy:
      "Express services expose dashboard analytics, provider sync, upload ingestion, and auto-action execution endpoints.",
  },
  {
    title: "Analytics Engine",
    copy:
      "Cost normalization, idle-resource detection, rightsizing logic, savings estimation, and next-month forecasting run in dedicated backend services.",
  },
  {
    title: "Data Layer",
    copy:
      "MongoDB is the primary store for billing and action logs, with an in-memory fallback for fast local setup and resilience.",
  },
];

export function ArchitecturePage() {
  return (
    <div className="page-grid">
      <SectionCard title="Structured System Design" kicker="Platform architecture and service flow">
        <div className="architecture-grid">
          {blocks.map((block) => (
            <article className="architecture-card" key={block.title}>
              <h4>{block.title}</h4>
              <p>{block.copy}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
