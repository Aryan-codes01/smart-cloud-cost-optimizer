import { useState } from "react";

export function UploadPanel({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [strategy, setStrategy] = useState("append");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      return;
    }

    await onUpload(file, strategy);
    event.target.reset();
    setFile(null);
  }

  return (
    <form className="upload-panel" onSubmit={handleSubmit}>
      <label className="file-dropzone">
        <span className="eyebrow">Mock AWS / Azure / GCP bill</span>
        <strong>Upload CSV or JSON billing data</strong>
        <p>Perfect for your mini-project demo and ready to grow into live billing sync.</p>
        <input
          type="file"
          accept=".csv,.json"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>

      <div className="inline-form">
        <label className="field-group">
          <span>Import Mode</span>
          <select value={strategy} onChange={(event) => setStrategy(event.target.value)}>
            <option value="append">Append to existing demo data</option>
            <option value="replace">Replace current dataset</option>
          </select>
        </label>

        <button className="button-primary" type="submit" disabled={!file || loading}>
          {loading ? "Importing..." : "Import Billing Data"}
        </button>
      </div>
    </form>
  );
}
