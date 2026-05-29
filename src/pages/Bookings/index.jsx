// src/pages/Bookings/index.jsx
import { useState } from "react";
import { useBookings } from "./useBookings";
import { dateShort } from "../../utils/formatters";
import { Avatar } from "../../components/atoms/Avatar";
import { Badge } from "../../components/atoms/Badge";
import { EmptyState } from "../../components/molecules/EmptyState";
import { SearchBar } from "../../components/molecules/SearchBar";
import { IconFlag } from "../../components/atoms/Icons";
import TableRow from "../../components/molecules/TableRow";
import BookingDetailDrawer from "./BookingDetailDrawer";

const CANCELLABLE = ["Pending", "Accepted", "OnTheWay", "InProgress"];

const STATUSES = [
  "All",
  "Pending",
  "Accepted",
  "OnTheWay",
  "Arrived",
  "InProgress",
  "Completed",
  "Cancelled",
  "Declined",
];

function CancelModal({ booking, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();

  return (
    <div className="gx-modal-backdrop" onClick={onClose}>
      <div className="gx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gx-modal-title">Cancel booking</div>
        <div className="gx-modal-desc">
          Cancelling <b>{booking.serviceName || booking.service}</b> for{" "}
          <b>{booking.customer?.name || booking.customerName}</b>. Both the
          customer and professional will be notified.
        </div>
        <textarea
          className="gx-textarea"
          placeholder="Reason for cancellation (required)…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
        <div className="gx-modal-actions">
          <button
            className="gx-btn gx-btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Keep booking
          </button>
          <button
            className="gx-btn gx-btn-danger"
            onClick={() => onConfirm(trimmed)}
            disabled={loading || trimmed.length < 5}
          >
            {loading ? "Cancelling…" : "Cancel booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Bookings() {
  const {
    filtered,
    loading,
    actionLoading,
    reportedCount,
    status,
    setStatus,
    search,
    setSearch,
    handleCancel,
  } = useBookings();

  const [cancelTarget, setCancelTarget] = useState(null);
  const [detailBookingId, setDetailBookingId] = useState(null);

  async function handleConfirmCancel(reason) {
    const ok = await handleCancel(cancelTarget.id, reason);
    if (ok) setCancelTarget(null);
  }

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Bookings</h1>
          <div className="gx-page-subtitle">
            All service bookings across the platform.
            {reportedCount > 0 && (
              <span>
                {" "}
                · <b style={{ color: "var(--red)" }}>{reportedCount} flagged</b>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left">
          <div className="gx-tabs" style={{ flexWrap: "wrap" }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`gx-tab${status === s ? " is-active" : ""}`}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search bookings…"
        />
      </div>

      <div className="gx-card">
        {loading ? (
          <EmptyState title="Loading…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No bookings match"
            desc="Try changing the status filter or search term."
          />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Professional</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Flag</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const customerName =
                    b.customerName || b.customer?.name || "—";
                  const professionalName =
                    b.professionalName || b.professional?.name || "—";
                  const isReported = b.isReported || b.reported || b.hasReport;
                  const canCancel = CANCELLABLE.includes(b.status);

                  return (
                    <TableRow
                      key={b.id || b.bookingId}
                      clickable
                      onClick={() => setDetailBookingId(b.id || b.bookingId)}
                    >
                      <td>
                        <div className="gx-table-name">
                          <Avatar name={customerName} size={30} />
                          <span>{customerName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="gx-table-name">
                          <Avatar name={professionalName} size={30} />
                          <span>{professionalName}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {b.serviceName || b.service || "—"}
                      </td>
                      <td className="gx-muted">
                        {dateShort(b.scheduledDate || b.date)}
                      </td>
                      <td>
                        <Badge status={b.status} />
                      </td>
                      <td
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          fontWeight: 500,
                        }}
                      >
                        {b.servicePrice || "—"}
                      </td>
                      <td>
                        {isReported ? (
                          <span className="gx-flag" title="Reported">
                            <IconFlag />
                          </span>
                        ) : (
                          <span className="gx-muted">—</span>
                        )}
                      </td>
                      <td>
                        <div className="gx-row-actions">
                          <button
                            className="gx-btn gx-btn-secondary gx-btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailBookingId(b.id || b.bookingId);
                            }}
                          >
                            View
                          </button>
                          {canCancel && (
                            <button
                              className="gx-btn gx-btn-danger-soft gx-btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCancelTarget(b);
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {detailBookingId && (
        <BookingDetailDrawer
          bookingId={detailBookingId}
          onClose={() => setDetailBookingId(null)}
        />
      )}

      {/* Cancel modal */}
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancel}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
