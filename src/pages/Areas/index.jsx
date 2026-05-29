// src/pages/Areas/index.jsx
import { useState, useEffect } from "react";
import { getAreaStats } from "../../network/api/admin/areas";
import { toast } from "react-toastify";

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " JD"
    : "—";

const fmtN = (n) => (typeof n === "number" ? n.toLocaleString("en-US") : "—");

// ── Mini horizontal bar ───────────────────────────────────────────────────────
function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 8,
          borderRadius: 999,
          background: "var(--line)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: "width 0.6s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: "var(--ink-3)",
          fontVariantNumeric: "tabular-nums",
          minWidth: 28,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── City summary card ─────────────────────────────────────────────────────────
function CityCard({ city, isActive, onClick, rank }) {
  const COLORS = [
    "var(--accent)",
    "var(--blue)",
    "var(--green)",
    "var(--purple)",
  ];
  const color = COLORS[(rank - 1) % COLORS.length];

  return (
    <button
      onClick={onClick}
      style={{
        background: isActive ? "var(--surface)" : "var(--surface)",
        border: `2px solid ${isActive ? color : "var(--line)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "20px 22px",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.18s",
        width: "100%",
        boxShadow: isActive ? `0 0 0 4px ${color}22` : "none",
        transform: isActive ? "translateY(-2px)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${color}18`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            #{rank}
          </div>
          <div>
            <div
              style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)" }}
            >
              {city.cityName}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 1 }}>
              {city.areas?.length ?? 0} areas
            </div>
          </div>
        </div>
        {isActive && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color,
              background: `${color}18`,
              padding: "3px 8px",
              borderRadius: 999,
            }}
          >
            Active
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Professionals", value: fmtN(city.totalProfessionals) },
          { label: "Bookings", value: fmtN(city.totalBookings) },
          { label: "Completed", value: fmtN(city.completedBookings) },
          { label: "Revenue", value: fmt(city.totalRevenue) },
        ].map(({ label, value }) => (
          <div key={label}>
            <div
              style={{ fontSize: 11, color: "var(--ink-4)", marginBottom: 2 }}
            >
              {label}
            </div>
            <div
              style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}

// ── Area breakdown for selected city ─────────────────────────────────────────
function CityDetail({ city, rank }) {
  const COLORS = [
    "var(--accent)",
    "var(--blue)",
    "var(--green)",
    "var(--purple)",
  ];
  const color = COLORS[(rank - 1) % COLORS.length];

  const areas = city.areas ?? [];
  const maxBookings = Math.max(...areas.map((a) => a.bookings), 1);
  const maxPros = Math.max(...areas.map((a) => a.professionals), 1);
  const maxRevenue = Math.max(...areas.map((a) => a.revenue), 1);

  const [sort, setSort] = useState("bookings");

  const sorted = [...areas].sort((a, b) => b[sort] - a[sort]);

  return (
    <div className="gx-card" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-1)" }}>
            {city.cityName} — Area Breakdown
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>
            {areas.length} neighborhoods · {fmtN(city.totalBookings)} total
            bookings
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["bookings", "professionals", "revenue"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`gx-btn gx-btn-sm ${sort === s ? "gx-btn-primary" : "gx-btn-secondary"}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart section */}
      <div style={{ padding: "20px 24px 8px" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            color: "var(--ink-4)",
            marginBottom: 14,
          }}
        >
          {sort === "bookings"
            ? "Bookings per area"
            : sort === "professionals"
              ? "Professionals per area"
              : "Revenue per area (JD)"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((area) => (
            <div
              key={area.areaId}
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1fr",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ink-1)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {area.areaName}
              </div>
              <Bar
                value={
                  sort === "bookings"
                    ? area.bookings
                    : sort === "professionals"
                      ? area.professionals
                      : Math.round(area.revenue)
                }
                max={
                  sort === "bookings"
                    ? maxBookings
                    : sort === "professionals"
                      ? maxPros
                      : Math.round(maxRevenue)
                }
                color={color}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", marginTop: 8 }}>
        <table className="gx-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Area</th>
              <th style={{ textAlign: "center" }}>Professionals</th>
              <th style={{ textAlign: "center" }}>Bookings</th>
              <th style={{ textAlign: "center" }}>Completed</th>
              <th style={{ textAlign: "center" }}>Completion Rate</th>
              <th style={{ textAlign: "right" }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((area, i) => {
              const rate =
                area.bookings > 0
                  ? Math.round((area.completedBookings / area.bookings) * 100)
                  : 0;
              return (
                <tr
                  key={area.areaId}
                  style={{
                    background:
                      i % 2 === 0 ? "transparent" : "var(--surface-2)",
                  }}
                >
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: i === 0 ? color : "var(--line)",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>{area.areaName}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        background: "var(--blue-soft)",
                        color: "var(--blue)",
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {area.professionals}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>
                    {area.bookings}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      color: "var(--green)",
                      fontWeight: 600,
                    }}
                  >
                    {area.completedBookings}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 6,
                          borderRadius: 999,
                          background: "var(--line)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${rate}%`,
                            height: "100%",
                            background:
                              rate >= 70
                                ? "var(--green)"
                                : rate >= 40
                                  ? "var(--amber)"
                                  : "var(--red)",
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--ink-3)",
                          minWidth: 30,
                        }}
                      >
                        {rate}%
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      color: "var(--green)",
                    }}
                  >
                    {fmt(area.revenue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Totals row */}
          <tfoot>
            <tr
              style={{
                background: "var(--surface-2)",
                borderTop: "2px solid var(--line)",
              }}
            >
              <td style={{ fontWeight: 700, fontSize: 13 }}>Total</td>
              <td style={{ textAlign: "center", fontWeight: 700 }}>
                {city.totalProfessionals}
              </td>
              <td style={{ textAlign: "center", fontWeight: 700 }}>
                {city.totalBookings}
              </td>
              <td
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  color: "var(--green)",
                }}
              >
                {city.completedBookings}
              </td>
              <td style={{ textAlign: "center" }}>
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  {city.totalBookings > 0
                    ? Math.round(
                        (city.completedBookings / city.totalBookings) * 100,
                      )
                    : 0}
                  %
                </span>
              </td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: 700,
                  color: "var(--green)",
                }}
              >
                {fmt(city.totalRevenue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ── Platform-wide comparison chart ───────────────────────────────────────────
function CityCompareChart({ cities }) {
  const COLORS = [
    "var(--accent)",
    "var(--blue)",
    "var(--green)",
    "var(--purple)",
  ];
  const maxBookings = Math.max(...cities.map((c) => c.totalBookings), 1);

  return (
    <div className="gx-card" style={{ padding: "20px 24px 24px" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          color: "var(--ink-1)",
          marginBottom: 4,
        }}
      >
        City Activity Comparison
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 20 }}>
        Total bookings across all cities
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cities.map((city, i) => (
          <div key={city.cityId}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}
              >
                {city.cityName}
              </span>
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                {city.totalBookings} bookings · {fmtN(city.totalProfessionals)}{" "}
                pros
              </span>
            </div>
            <div
              style={{
                height: 12,
                borderRadius: 999,
                background: "var(--line)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.round((city.totalBookings / maxBookings) * 100)}%`,
                  background: COLORS[i % COLORS.length],
                  borderRadius: 999,
                  transition: "width 0.8s cubic-bezier(.16,1,.3,1)",
                  transitionDelay: `${i * 0.1}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Areas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(0); // index

  useEffect(() => {
    getAreaStats()
      .then((res) => {
        const d = res?.data ?? res;
        setData(d);
      })
      .catch(() => toast.error("Failed to load area stats"))
      .finally(() => setLoading(false));
  }, []);

  const cities = data?.cities ?? [];
  const totalBookings = cities.reduce((s, c) => s + c.totalBookings, 0);
  const totalPros = cities.reduce((s, c) => s + c.totalProfessionals, 0);
  const totalRevenue = cities.reduce((s, c) => s + c.totalRevenue, 0);
  const totalCompleted = cities.reduce((s, c) => s + c.completedBookings, 0);

  return (
    <div className="gx-page">
      {/* Header */}
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Areas</h1>
          <div className="gx-page-subtitle">
            City and neighborhood activity across the platform.
          </div>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="gx-stat-card"
              style={{ height: 160, opacity: 0.3 }}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Platform totals */}
          <div className="gx-stat-grid" style={{ marginBottom: 28 }}>
            {[
              {
                label: "Total Bookings",
                value: fmtN(totalBookings),
                accent: false,
                primary: true,
              },
              {
                label: "Active Professionals",
                value: fmtN(totalPros),
                accent: false,
              },
              {
                label: "Completed Jobs",
                value: fmtN(totalCompleted),
                accent: false,
              },
              {
                label: "Total Revenue",
                value: fmt(totalRevenue),
                accent: false,
              },
            ].map(({ label, value, primary }) => (
              <div
                key={label}
                className={`gx-stat-card${primary ? " is-primary" : ""}`}
              >
                <div className="gx-stat-label">{label}</div>
                <div className="gx-stat-value" style={{ fontSize: 28 }}>
                  {value}
                </div>
                {primary && <div className="gx-stat-blob" />}
              </div>
            ))}
          </div>

          {/* Two column: city cards + comparison chart */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 24,
            }}
          >
            {/* City selector cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cities.map((city, i) => (
                <CityCard
                  key={city.cityId}
                  city={city}
                  rank={i + 1}
                  isActive={selectedCity === i}
                  onClick={() => setSelectedCity(i)}
                />
              ))}
            </div>

            {/* Comparison chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <CityCompareChart cities={cities} />

              {/* Quick stats */}
              <div className="gx-card" style={{ padding: "18px 22px" }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--ink-1)",
                    marginBottom: 16,
                  }}
                >
                  Platform Completion Rate
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "var(--green)",
                    letterSpacing: "-0.02em",
                    marginBottom: 6,
                  }}
                >
                  {totalBookings > 0
                    ? Math.round((totalCompleted / totalBookings) * 100)
                    : 0}
                  %
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4)",
                    marginBottom: 14,
                  }}
                >
                  {fmtN(totalCompleted)} of {fmtN(totalBookings)} bookings
                  completed
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "var(--line)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${totalBookings > 0 ? Math.round((totalCompleted / totalBookings) * 100) : 0}%`,
                      background: "var(--green)",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selected city detail */}
          {cities[selectedCity] && (
            <CityDetail city={cities[selectedCity]} rank={selectedCity + 1} />
          )}
        </>
      )}
    </div>
  );
}
