// src/pages/Bookings/BookingDetailDrawer.jsx
import { useState, useEffect } from "react";
import { getBookingDetail } from "../../network/api/admin/bookings";
import { Avatar } from "../../components/atoms/Avatar";
import { Badge } from "../../components/atoms/Badge";
import { IconX } from "../../components/atoms/Icons";
import { dateShort } from "../../utils/formatters";
import { toast } from "react-toastify";

function InfoCell({ label, value, accent = false }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        padding: "11px 14px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--ink-4)",
          marginBottom: 3,
          textTransform: "uppercase",
          letterSpacing: ".04em",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: accent ? "var(--accent)" : "var(--ink-1)",
        }}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

function PartyCard({ label, party }) {
  if (!party) return null;
  return (
    <div
      style={{
        flex: 1,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Avatar name={party.name} size={38} src={party.profileImageUrl} />
      <div>
        <div
          style={{
            fontSize: 11,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: ".04em",
            fontWeight: 600,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>
          {party.name}
        </div>
      </div>
    </div>
  );
}

function PaymentStatus({ booking }) {
  const {
    paymentConfirmed,
    professionalConfirmedPayment,
    agreedAmount,
    paymentAgreedAt,
  } = booking;

  // Fully settled
  if (paymentConfirmed && paymentAgreedAt) {
    return (
      <div
        style={{
          background: "var(--green-soft)",
          border: "1px solid var(--green)",
          borderRadius: "var(--radius)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 20 }}>✅</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--green)" }}>
            Payment fully confirmed —{" "}
            {agreedAmount != null
              ? `${Number(agreedAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} JD`
              : "—"}
          </div>
          <div style={{ fontSize: 12, color: "var(--green)", marginTop: 2 }}>
            Agreed on {dateShort(paymentAgreedAt)}
          </div>
        </div>
      </div>
    );
  }

  // Pro submitted amount, waiting on customer
  if (professionalConfirmedPayment && !paymentConfirmed) {
    return (
      <div
        style={{
          background: "var(--amber-soft)",
          border: "1px solid var(--amber)",
          borderRadius: "var(--radius)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 20 }}>⏳</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#946400" }}>
            Awaiting customer confirmation —{" "}
            {agreedAmount != null
              ? `${Number(agreedAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} JD`
              : "—"}
          </div>
          <div style={{ fontSize: 12, color: "#946400", marginTop: 2 }}>
            Professional submitted the amount; customer hasn't confirmed yet
          </div>
        </div>
      </div>
    );
  }

  // Nothing yet
  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 20 }}>💵</span>
      <div style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 500 }}>
        Cash payment not yet processed
      </div>
    </div>
  );
}

export default function BookingDetailDrawer({
  bookingId,
  onClose,
  onCancelSuccess,
}) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setLoading(true);
    getBookingDetail(bookingId)
      .then((res) => setBooking(res?.data ?? res))
      .catch(() => toast.error("Failed to load booking details"))
      .finally(() => setLoading(false));
  }, [bookingId]);

  return (
    <>
      <div className="gx-drawer-backdrop" onClick={onClose} />
      <div className="gx-drawer">
        {/* Head */}
        <div className="gx-drawer-head">
          <div className="gx-drawer-head-meta">
            {!loading && booking ? (
              <>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🔧
                </div>
                <div>
                  <div className="gx-drawer-head-title">
                    {booking.serviceName}
                  </div>
                  <div className="gx-drawer-head-sub">
                    {dateShort(booking.scheduledDate)}
                    {booking.scheduledTime ? ` · ${booking.scheduledTime}` : ""}
                    {" · "}Created {dateShort(booking.createdAt)}
                  </div>
                </div>
                <Badge status={booking.status} />
              </>
            ) : (
              <div className="gx-drawer-head-title">
                {loading ? "Loading…" : "Booking"}
              </div>
            )}
          </div>
          <button
            className="gx-drawer-close"
            onClick={onClose}
            aria-label="Close"
          >
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="gx-drawer-body">
          {loading ? (
            <div className="gx-empty">
              <div className="gx-empty-title">Loading…</div>
            </div>
          ) : !booking ? (
            <div className="gx-empty">
              <div className="gx-empty-title">Booking not found</div>
            </div>
          ) : (
            <>
              {/* Cancellation banner */}
              {booking.status === "Cancelled" && booking.cancellationReason && (
                <div
                  style={{
                    background: "var(--red-soft)",
                    border: "1px solid var(--red)",
                    borderRadius: "var(--radius)",
                    padding: "12px 14px",
                    marginBottom: 20,
                    fontSize: 13,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 16 }}>🚫</span>
                  <div>
                    <b style={{ color: "var(--red)" }}>Cancellation reason</b>
                    <div style={{ color: "var(--red)", marginTop: 3 }}>
                      {booking.cancellationReason}
                    </div>
                  </div>
                </div>
              )}

              {/* Parties */}
              <div className="gx-section">
                <div className="gx-section-head">
                  <div className="gx-section-title">Parties</div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <PartyCard label="Customer" party={booking.customer} />
                  <PartyCard
                    label="Professional"
                    party={booking.professional}
                  />
                </div>
              </div>

              {/* Job details */}
              <div className="gx-section">
                <div className="gx-section-head">
                  <div className="gx-section-title">Job Details</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <InfoCell label="Service" value={booking.serviceName} />
                  <InfoCell
                    label="Listed Price"
                    value={booking.servicePrice || "—"}
                  />
                  <InfoCell
                    label="Scheduled Date"
                    value={dateShort(booking.scheduledDate)}
                  />
                  <InfoCell label="Time" value={booking.scheduledTime || "—"} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <InfoCell label="Address" value={booking.address} />
                  </div>
                  {booking.description && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <InfoCell
                        label="Description"
                        value={booking.description}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="gx-section">
                <div className="gx-section-head">
                  <div className="gx-section-title">Payment</div>
                </div>
                <PaymentStatus booking={booking} />
              </div>

              {/* Booking images */}
              {booking.imageUrls?.length > 0 && (
                <div className="gx-section">
                  <div className="gx-section-head">
                    <div className="gx-section-title">Attached Images</div>
                    <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
                      {booking.imageUrls.length} files
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 10,
                    }}
                  >
                    {booking.imageUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "block" }}
                      >
                        <img
                          src={url}
                          alt={`Booking image ${i + 1}`}
                          style={{
                            width: "100%",
                            aspectRatio: "4/3",
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid var(--line)",
                            transition: "opacity .15s",
                          }}
                          onMouseOver={(e) => (e.target.style.opacity = ".8")}
                          onMouseOut={(e) => (e.target.style.opacity = "1")}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Report */}
              {booking.report && (
                <div className="gx-section">
                  <div className="gx-section-head">
                    <div className="gx-section-title">Report</div>
                    <span
                      style={{
                        background: "var(--red-soft)",
                        color: "var(--red)",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      Flagged
                    </span>
                  </div>
                  <div
                    style={{
                      background: "var(--red-soft)",
                      border: "1px solid var(--red)",
                      borderRadius: "var(--radius)",
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--red)",
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      {booking.report.description}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--red)",
                        marginTop: 6,
                        opacity: 0.75,
                      }}
                    >
                      Filed {dateShort(booking.report.createdAt)}
                    </div>
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="gx-section">
                <div className="gx-section-head">
                  <div className="gx-section-title">Metadata</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <InfoCell
                    label="Booking ID"
                    value={booking.id?.slice(0, 8) + "…"}
                  />
                  <InfoCell
                    label="Last Updated"
                    value={dateShort(booking.updatedAt)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
