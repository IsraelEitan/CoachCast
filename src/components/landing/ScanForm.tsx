"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";

export const ScanForm: FC = () => {
  const [scanStatus, setScanStatus] = useState("");

  function handleScanSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScanStatus("Your sample content scan is ready. Open the app to continue.");
    event.currentTarget.reset();
  }

  return (
    <form className="scan-form" onSubmit={handleScanSubmit}>
      <label>
        Website or Instagram
        <input type="text" name="scan-target" placeholder="yourgym.com or @coachname" required />
      </label>
      <button className="button button--primary" type="submit">
        Get My Free Content Scan
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {scanStatus}
      </p>
    </form>
  );
};

export default ScanForm;
