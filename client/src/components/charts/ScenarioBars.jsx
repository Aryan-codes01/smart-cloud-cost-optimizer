import { formatCurrency } from "../../utils/format.js";

export function ScenarioBars({ scenarios = [] }) {
  const max = Math.max(...scenarios.map((scenario) => scenario.amount), 1);

  return (
    <div className="scenario-bars">
      {scenarios.map((scenario) => (
        <div className="scenario-row" key={scenario.label}>
          <div className="scenario-copy">
            <span>{scenario.label}</span>
            <strong>{formatCurrency(scenario.amount)}</strong>
          </div>
          <div className="scenario-track">
            <span
              className="scenario-fill"
              style={{ width: `${(scenario.amount / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
