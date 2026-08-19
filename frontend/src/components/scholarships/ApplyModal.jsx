/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle,
  Calendar,
  Building,
  AlertTriangle,
  Upload,
  FileText,
  ChevronRight,
  ChevronLeft,
  Loader,
} from "lucide-react";

const DEFAULT_REQUIREMENTS = [
  "Valid school ID",
  "Certificate of enrollment",
  "Latest grade report",
];

// ── Step 1: Overview ──────────────────────────────────────────────
const OverviewStep = ({ scholarship, onNext, onClose }) => (
  <>
    {/* Quick Stats */}
    <div className="modal-stats-row">
      <div className="modal-stat">
        <span className="modal-stat-value">{scholarship.amount}</span>
        <span className="modal-stat-label">per semester</span>
      </div>
      <div className="modal-stat">
        <Calendar size={16} />
        <span className="modal-stat-value">{scholarship.deadline}</span>
        <span className="modal-stat-label">deadline</span>
      </div>
      <div className="modal-stat">
        <Building size={16} />
        <span className="modal-stat-value">{scholarship.slots}</span>
        <span className="modal-stat-label">slots</span>
      </div>
    </div>

    <div className="modal-body">
      <div className="modal-section">
        <h3 className="modal-section-title">About this Scholarship</h3>
        <p className="modal-description">{scholarship.description}</p>
      </div>

      <div className="modal-section">
        <h3 className="modal-section-title">
          <CheckCircle size={16} />
          Required Documents
        </h3>
        <p className="modal-req-count">
          You will need to upload{" "}
          <strong>{scholarship.requirements.length} documents</strong> in the
          next step.
        </p>
        <ul className="requirements-list">
          {scholarship.requirements.map((req, i) => (
            <li key={i} className="requirement-item">
              <span className="req-bullet" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="modal-notice">
        <AlertTriangle size={16} />
        <p>
          Ensure all documents are <strong>clear, complete, and valid</strong>.
          Incomplete submissions may be disqualified. You will upload them in
          the next step.
        </p>
      </div>
    </div>

    <div className="modal-footer">
      <button className="btn btn-ghost" onClick={onClose}>
        Cancel
      </button>
      <button className="btn btn-primary" onClick={onNext}>
        Upload Documents <ChevronRight size={16} />
      </button>
    </div>
  </>
);

// ── Step 2: Document Upload ───────────────────────────────────────
const UploadStep = ({
  scholarship,
  onConfirm,
  onBack,
  onClose,
  isSubmitting,
}) => {
  const requirements = scholarship.requirements?.length > 0
    ? scholarship.requirements
    : DEFAULT_REQUIREMENTS;
  const [uploads, setUploads] = useState(
    requirements.map(() => null), // null = not uploaded
  );
  const fileRefs = useRef([]);

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploads((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  // ── Dev Hotkey: Shift + 0 to simulate uploads ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey && (e.key === "0" || e.key === ")")) {
        setUploads(
          requirements.map(
            () =>
              new File(["mock content"], "simulated_document.pdf", {
                type: "application/pdf",
              }),
          ),
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requirements]);

  const uploadedCount = uploads.filter(Boolean).length;
  const totalRequired = requirements.length;
  const allUploaded = uploadedCount === totalRequired;
  const progressPct = totalRequired > 0 ? Math.round((uploadedCount / totalRequired) * 100) : 100;

  return (
    <>
      {/* Upload progress bar */}
      <div className="modal-upload-progress">
        <div className="upload-progress-labels">
          <span>
            {uploadedCount} of {totalRequired} documents uploaded
          </span>
          <span className={allUploaded ? "upload-done-label" : ""}>
            {progressPct}%
          </span>
        </div>
        <div className="upload-progress-bar">
          <div
            className="upload-progress-fill"
            style={{
              width: `${progressPct}%`,
              backgroundColor: allUploaded
                ? "var(--success-text)"
                : "var(--golden-yellow)",
            }}
          />
        </div>
      </div>

      <div className="modal-body">
        <div className="modal-section">
          <h3 className="modal-section-title">Upload Your Documents</h3>
          <p className="modal-description modal-description-spaced">
            Click each field below to attach the corresponding file. Accepted
            formats: PDF, JPG, PNG. Max 5MB per file.
          </p>

          <div className="upload-list">
            {requirements.map((req, i) => {
              const file = uploads[i];
              return (
                <div
                  key={i}
                  className={`upload-item ${file ? "upload-item-done" : ""}`}
                  onClick={() => fileRefs.current[i]?.click()}
                >
                  <div className="upload-item-icon">
                    {file ? (
                      <CheckCircle size={20} color="var(--success-text)" />
                    ) : (
                      <Upload size={20} />
                    )}
                  </div>
                  <div className="upload-item-info">
                    <span className="upload-item-label">{req}</span>
                    {file ? (
                      <span className="upload-item-filename">{file.name}</span>
                    ) : (
                      <span className="upload-item-hint">
                        Click to browse file…
                      </span>
                    )}
                  </div>
                  {file && (
                    <button
                      className="upload-item-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploads((prev) => {
                          const n = [...prev];
                          n[i] = null;
                          return n;
                        });
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    ref={(el) => (fileRefs.current[i] = el)}
                    onChange={(e) => handleFileChange(i, e)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {!allUploaded && (
          <div className="modal-notice">
            <AlertTriangle size={16} />
            <p>
              Please upload{" "}
              <strong>all {totalRequired} required documents</strong> before
              confirming.
            </p>
          </div>
        )}

        {allUploaded && (
          <div className="modal-notice modal-notice-success">
            <CheckCircle size={16} />
            <p>
              All documents uploaded! Review your files above, then click{" "}
              <strong>Confirm Application</strong>.
            </p>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button
          className="btn btn-ghost"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onConfirm(uploads)}
          disabled={!allUploaded || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader size={16} className="spin-icon" /> Submitting…
            </>
          ) : (
            "Confirm Application"
          )}
        </button>
      </div>
    </>
  );
};

// ── Root Modal ────────────────────────────────────────────────────
const ApplyModal = ({ scholarship, onConfirm, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadsRef = useRef([]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isSubmitting]);

  if (!scholarship) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Simulate async submission (in real app: POST to backend)
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(uploadsRef.current);
    }, 1200);
  };

  return (
    <div
      className="modal-overlay"
      onClick={!isSubmitting ? onClose : undefined}
      role="dialog"             // <-- NEW: Marks this as a dialog box
      aria-modal="true"         // <-- NEW: Prevents interacting with background
      aria-labelledby="modal-title" // <-- NEW: Points to the title ID
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header (persistent) */}
        <div className="modal-header">
          <div className="modal-title-block">
            {/* NEW: Added id="modal-title" so the dialog can read it */}
            <h2 className="modal-title" id="modal-title">{scholarship.title}</h2>
            <span className="modal-provider-tag">{scholarship.provider}</span>
          </div>
          <div className="modal-header-actions">
            <div className="modal-steps">
              <span className={`modal-step-dot ${step >= 1 ? "active" : ""}`} />
              <span className="modal-step-line" />
              <span className={`modal-step-dot ${step >= 2 ? "active" : ""}`} />
            </div>
            <button
              className="modal-close-btn"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Close modal" // <-- NEW: Explains what the X does
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <OverviewStep
            scholarship={scholarship}
            onNext={() => setStep(2)}
            onClose={onClose}
          />
        )}
        {step === 2 && (
          <UploadStep
            scholarship={scholarship}
            onConfirm={(uploads) => {
              uploadsRef.current = uploads;
              handleConfirm();
            }}
            onBack={() => setStep(1)}
            onClose={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
