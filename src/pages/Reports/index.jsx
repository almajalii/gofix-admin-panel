import { useState, useEffect } from "react";
import { dateShort } from "../../utils/formatters";
import { IconSearch, IconFlag } from "../../components/atoms/Icons";
import { toast } from "react-toastify";
import { getReports, resolveReport } from "../../network/api/admin/reports";
import TableRow from "../../components/molecules/TableRow";

function Avatar({ name, size = 32 }) {
  const initials = (name || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="gx-avatar gx-avatar-fallback"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending: { label: "Pending", cls: "badge-pending" },
    Accepted: { label: "Accepted", cls: "badge-info" },
    InProgress: { label: "In progress", cls: "badge-info" },
    Completed: { label: "Completed", cls: "badge-approved" },
    Cancelled: { label: "Cancelled", cls: "badge-draft" },
  };
  const m = map[status] || { label: status, cls: "badge-draft" };
  return (
    <span className={`gx-badge ${m.cls}`}>
      <span className="gx-badge-dot" />
      {m.label}
    </span>
  );
}

function ReportStatusBadge({ status }) {
  const map = {
    Pending: { label: "Open", cls: "badge-pending" },
    Resolved: { label: "Resolved", cls: "badge-approved" },
    Dismissed: { label: "Dismissed", cls: "badge-draft" },
  };
  const m = map[status] || { label: "Open", cls: "badge-pending" };
  return (
    <span className={`gx-badge ${m.cls}`}>
      <span className="gx-badge-dot" />
      {m.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="gx-empty">
      <div className="gx-empty-title">No reports</div>
      <div className="gx-empty-desc">
        All clear — no bookings have been flagged yet.
      </div>
    </div>
  );
}

function ReportModal({ report, onClose, onResolve, loading }) {
  const [notes, setNotes] = useState("");
  const isPending =
    !report.status || report.status === "" || report.status === "Pending";

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="gx-modal-backdrop" onClick={onClose}>
      <div
        className="gx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520 }}
      >
        {/* Title */}
        <div
          className="gx-modal-title"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ color: "var(--red)" }}>
            <IconFlag />
          </span>
          Report Details
          <span style={{ marginLeft: "auto" }}>
            <ReportStatusBadge status={report.status} />
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 12,
          }}
        >
          {/* Parties */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Customer", party: report.customer },
              { label: "Professional", party: report.professional },
            ].map(({ label, party }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: "var(--surface-2)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--line)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--ink-4)",
                    marginBottom: 6,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: ".04em",
                  }}
                >
                  {label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar
                    name={party?.name}
                    size={30}
                    src={party?.profileImageUrl}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink-1)",
                    }}
                  >
                    {party?.name || "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Booking snapshot */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
              { label: "Service", value: report.serviceName },
              { label: "Price", value: report.servicePrice },
              { label: "Date", value: dateShort(report.scheduledDate) },
              {
                label: "Status",
                value: <StatusBadge status={report.bookingStatus} />,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "10px 12px",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--ink-4)",
                    marginBottom: 3,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: ".04em",
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Report description */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--ink-3)",
                marginBottom: 6,
              }}
            >
              Customer's report
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: "var(--red-soft)",
                borderRadius: "var(--radius)",
                fontSize: 13,
                lineHeight: 1.6,
                borderLeft: "3px solid var(--red)",
              }}
            >
              {report.reportDescription}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
              Reported {dateShort(report.reportedAt)}
            </div>
          </div>

          {/* Admin notes (resolved) */}
          {!isPending && report.adminNotes && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-3)",
                  marginBottom: 6,
                }}
              >
                Admin notes
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--green-soft)",
                  borderRadius: "var(--radius)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  borderLeft: "3px solid var(--green)",
                }}
              >
                {report.adminNotes}
              </div>
              {report.resolvedAt && (
                <div
                  style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}
                >
                  Resolved {dateShort(report.resolvedAt)}
                </div>
              )}
            </div>
          )}

          {/* Admin notes input (pending) */}
          {isPending && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-3)",
                  marginBottom: 6,
                }}
              >
                Admin notes (optional)
              </div>
              <textarea
                className="gx-textarea"
                placeholder="Add notes about your decision…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>
          )}
        </div>

        <div className="gx-modal-actions" style={{ marginTop: 20 }}>
          <button
            className="gx-btn gx-btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          {isPending && (
            <>
              <button
                className="gx-btn gx-btn-secondary"
                onClick={() => onResolve(report.reportId, "Dismissed", notes)}
                disabled={loading}
              >
                Dismiss
              </button>
              <button
                className="gx-btn gx-btn-success"
                onClick={() => onResolve(report.reportId, "Resolved", notes)}
                disabled={loading}
              >
                {loading ? "Resolving…" : "Mark resolved"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("Pending");

  useEffect(() => {
    setLoading(true);
    getReports()
      .then(setReports)
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  async function handleResolve(reportId, resolution, adminNotes) {
    setActionLoading(true);
    try {
      await resolveReport(reportId, {
        resolution,
        adminNotes: adminNotes?.trim() || null,
      });
      setReports((prev) =>
        prev.map((r) =>
          r.reportId === reportId
            ? {
                ...r,
                status: resolution,
                adminNotes,
                resolvedAt: new Date().toISOString(),
              }
            : r,
        ),
      );
      setSelected(null);
      toast.success(`Report ${resolution.toLowerCase()} successfully`);
    } catch {
      toast.error("Failed to resolve report");
    } finally {
      setActionLoading(false);
    }
  }

  const isPendingReport = (r) =>
    !r.status || r.status === "" || r.status === "Pending";

  const tabCounts = {
    Pending: reports.filter(isPendingReport).length,
    Resolved: reports.filter((r) => r.status === "Resolved").length,
    Dismissed: reports.filter((r) => r.status === "Dismissed").length,
  };

  const filtered = reports.filter((r) => {
    const matchesTab =
      tab === "Pending"
        ? isPendingReport(r)
        : tab === "Resolved"
          ? r.status === "Resolved"
          : r.status === "Dismissed";
    if (!matchesTab) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.customer?.name || "").toLowerCase().includes(q) ||
      (r.professional?.name || "").toLowerCase().includes(q) ||
      (r.serviceName || "").toLowerCase().includes(q) ||
      (r.reportDescription || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Reports</h1>
          <div className="gx-page-subtitle">
            Bookings flagged by customers for review.
            {tabCounts.Pending > 0 && (
              <span>
                {" "}
                ·{" "}
                <b style={{ color: "var(--red)" }}>{tabCounts.Pending} open</b>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left">
          <div className="gx-tabs">
            {["Pending", "Resolved", "Dismissed"].map((t) => (
              <button
                key={t}
                className={`gx-tab${tab === t ? " is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
                <span className="gx-tab-count">{tabCounts[t]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="gx-search">
          <span className="gx-search-icon">
            <IconSearch />
          </span>
          <input
            placeholder="Search by name or service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="gx-card">
        {loading ? (
          <div className="gx-empty">
            <div className="gx-empty-title">Loading…</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Professional</th>
                  <th>Service</th>
                  <th>Booking date</th>
                  <th>Reported</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <TableRow
                    key={r.reportId}
                    clickable
                    onClick={() => setSelected(r)}
                  >
                    <td className="gx-row-num">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <div className="gx-table-name">
                        <Avatar name={r.customer?.name} size={30} />
                        <span>{r.customer?.name || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="gx-table-name">
                        <Avatar name={r.professional?.name} size={30} />
                        <span>{r.professional?.name || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{r.serviceName}</span>
                    </td>
                    <td className="gx-muted">{dateShort(r.scheduledDate)}</td>
                    <td className="gx-muted">{dateShort(r.reportedAt)}</td>
                    <td>
                      <StatusBadge status={r.bookingStatus} />
                    </td>
                    <td>
                      <div className="gx-row-actions">
                        <button
                          className="gx-btn gx-btn-secondary gx-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ReportModal
          report={selected}
          onClose={() => setSelected(null)}
          onResolve={handleResolve}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
