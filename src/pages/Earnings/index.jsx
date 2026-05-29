// src/pages/Earnings/index.jsx
import { useState, useEffect } from "react";
import { getAllEarnings } from "../../network/api/admin/earnings";
import PageHeader from "../../components/molecules/PageHeader";
import { Avatar } from "../../components/atoms/Avatar";
import { SearchBar } from "../../components/molecules/SearchBar";
import { EmptyState } from "../../components/molecules/EmptyState";

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " JD"
    : "—";
function SummaryCard({ label, value, sub, accent = false }) {
  return (
    <div
      className="gx-stat-card"
      style={
        accent
          ? {
              background:
                "linear-gradient(135deg,var(--accent),var(--accent-2))",
              color: "#fff",
              borderColor: "var(--accent)",
            }
          : {}
      }
    >
      <div
        className="gx-stat-label"
        style={accent ? { color: "rgba(255,255,255,.85)" } : {}}
      >
        {label}
      </div>
      <div
        className="gx-stat-value"
        style={{ fontSize: 28, ...(accent ? { color: "#fff" } : {}) }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="gx-stat-delta"
          style={accent ? { color: "rgba(255,255,255,.75)" } : {}}
        >
          {sub}
        </div>
      )}
      {accent && <div className="gx-stat-blob" />}
    </div>
  );
}

function ProRow({ pro, onClick }) {
  const feeRate =
    pro.totalGross > 0
      ? ((pro.totalAdminFee / pro.totalGross) * 100).toFixed(0)
      : 0;

  return (
    <tr
      className="gx-table-row"
      style={{ cursor: "pointer" }}
      onClick={() => onClick(pro)}
    >
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            name={pro.professionalName}
            size={36}
            src={pro.profileImageUrl}
          />
          <div>
            <div
              style={{ fontWeight: 600, fontSize: 14, color: "var(--ink-1)" }}
            >
              {pro.professionalName}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 1 }}>
              {pro.category || "—"}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <span
          style={{
            background: "var(--blue-soft)",
            color: "var(--blue)",
            borderRadius: 999,
            padding: "2px 10px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {pro.totalCompletedJobs}
        </span>
      </td>
      <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 14 }}>
        {fmt(pro.totalGross)}
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{ fontWeight: 600, fontSize: 14, color: "var(--accent)" }}
          >
            {fmt(pro.totalAdminFee)}
          </span>
          <span
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent-ink)",
              borderRadius: 999,
              padding: "1px 7px",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {feeRate}%
          </span>
        </div>
      </td>
      <td
        style={{
          padding: "14px 16px",
          fontWeight: 600,
          color: "var(--green)",
          fontSize: 14,
        }}
      >
        {fmt(pro.totalNetPayout)}
      </td>
      <td style={{ padding: "14px 16px" }}>
        {pro.recentItems?.length > 0 ? (
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
            {new Date(pro.recentItems[0].paidAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}

function ProDrawer({ pro, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!pro) return null;

  return (
    <>
      <div className="gx-drawer-backdrop" onClick={onClose} />
      <div className="gx-drawer" style={{ width: 520 }}>
        {/* Head */}
        <div className="gx-drawer-head">
          <div className="gx-drawer-head-meta">
            <Avatar
              name={pro.professionalName}
              size={44}
              src={pro.profileImageUrl}
            />
            <div>
              <div className="gx-drawer-head-title">{pro.professionalName}</div>
              <div className="gx-drawer-head-sub">
                {pro.category || "—"} · {pro.totalCompletedJobs} jobs completed
              </div>
            </div>
          </div>
          <button
            className="gx-drawer-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 5l14 14M19 5L5 19"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="gx-drawer-body">
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: "var(--surface-2)",
                borderRadius: 12,
                padding: "14px 16px",
                border: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  marginBottom: 6,
                }}
              >
                Gross
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-1)" }}
              >
                {fmt(pro.totalGross)}
              </div>
            </div>
            <div
              style={{
                background: "var(--accent-soft)",
                borderRadius: 12,
                padding: "14px 16px",
                border: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--accent-ink)",
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  marginBottom: 6,
                }}
              >
                GoFix Fee (15%)
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {fmt(pro.totalAdminFee)}
              </div>
            </div>
            <div
              style={{
                background: "var(--green-soft)",
                borderRadius: 12,
                padding: "14px 16px",
                border: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--green)",
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  marginBottom: 6,
                }}
              >
                Net Payout
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 700, color: "var(--green)" }}
              >
                {fmt(pro.totalNetPayout)}
              </div>
            </div>
          </div>

          {/* Fee progress bar */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--ink-4)",
                marginBottom: 6,
              }}
            >
              <span>Revenue split</span>
              <span>85% pro · 15% GoFix</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: "var(--line)",
                overflow: "hidden",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: "85%",
                  background: "var(--green)",
                  borderRadius: "999px 0 0 999px",
                }}
              />
              <div style={{ width: "15%", background: "var(--accent)" }} />
            </div>
          </div>

          {/* Recent transactions */}
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "var(--ink-1)",
              marginBottom: 12,
            }}
          >
            Recent Transactions
          </div>
          {pro.recentItems?.length === 0 ? (
            <div
              style={{
                color: "var(--ink-4)",
                fontSize: 13,
                textAlign: "center",
                padding: 24,
              }}
            >
              No transactions yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {pro.recentItems?.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    background:
                      i % 2 === 0 ? "var(--surface-2)" : "transparent",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 13,
                        color: "var(--ink-1)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.serviceName || "—"}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink-4)",
                        marginTop: 1,
                      }}
                    >
                      {item.clientName} ·{" "}
                      {new Date(item.paidAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      flexShrink: 0,
                      marginLeft: 16,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "var(--ink-1)",
                      }}
                    >
                      {fmt(item.amount)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      fee {fmt(Math.round(item.amount * 0.15 * 100) / 100)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: 20,
              padding: "12px 16px",
              background: "var(--amber-soft)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--amber)",
              lineHeight: 1.5,
            }}
          >
            <b>Note:</b> Only showing the 5 most recent transactions. Add{" "}
            <code>GET /api/admin/earnings/{"{professionalId}"}</code> for full
            history.
          </div>
        </div>
      </div>
    </>
  );
}

export default function Earnings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllEarnings()
      .then((res) => setData(res?.data ?? res ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(
    (p) =>
      !search ||
      p.professionalName?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  // Platform totals
  const totalGross = data.reduce((s, p) => s + (p.totalGross ?? 0), 0);
  const totalFee = data.reduce((s, p) => s + (p.totalAdminFee ?? 0), 0);
  const totalNet = data.reduce((s, p) => s + (p.totalNetPayout ?? 0), 0);
  const totalJobs = data.reduce((s, p) => s + (p.totalCompletedJobs ?? 0), 0);

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Earnings</h1>
          <div className="gx-page-subtitle">
            Platform revenue, professional payouts, and GoFix fee breakdown.
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="gx-stat-grid" style={{ marginBottom: 28 }}>
        <SummaryCard
          label="Total Platform Volume"
          value={fmt(totalGross)}
          sub={`${totalJobs} paid jobs`}
          accent
        />
        <SummaryCard
          label="GoFix Revenue (15%)"
          value={fmt(totalFee)}
          sub="admin fee collected"
        />
        <SummaryCard
          label="Total Pro Payouts"
          value={fmt(totalNet)}
          sub="net to professionals"
        />
        <SummaryCard
          label="Active Professionals"
          value={data.length}
          sub="with paid bookings"
        />
      </div>

      {/* Table */}
      <div className="gx-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14 }}>All Professionals</div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search professionals…"
          />
        </div>

        {loading ? (
          <EmptyState title="Loading earnings…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No earnings found"
            desc="No paid bookings match your search."
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="gx-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 20px", textAlign: "left" }}>
                    Professional
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "center" }}>
                    Jobs
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left" }}>
                    Gross
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left" }}>
                    GoFix Fee
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left" }}>
                    Net Payout
                  </th>
                  <th style={{ padding: "10px 16px", textAlign: "left" }}>
                    Last Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pro) => (
                  <ProRow
                    key={pro.professionalId}
                    pro={pro}
                    onClick={setSelected}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ProDrawer pro={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
