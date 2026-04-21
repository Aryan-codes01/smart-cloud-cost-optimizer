export function SectionCard({ title, kicker, children, actions }) {
  return (
    <section className="surface-panel">
      <div className="section-head">
        <div>
          {kicker ? <span className="eyebrow">{kicker}</span> : null}
          <h3>{title}</h3>
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
