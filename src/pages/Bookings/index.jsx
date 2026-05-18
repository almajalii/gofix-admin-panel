import { useBookings } from './useBookings';
import { dateShort } from '../../utils/formatters';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { EmptyState } from '../../components/molecules/EmptyState';
import { SearchBar } from '../../components/molecules/SearchBar';
import { IconFlag } from '../../components/atoms/Icons';
import TableRow from '../../components/molecules/TableRow';


export default function Bookings() {
  const { filtered, loading, reportedCount, status, setStatus, search, setSearch } = useBookings();

  return (
    <div className="gx-page">
      <div className="gx-page-head">
        <div>
          <h1 className="gx-page-title">Bookings</h1>
          <div className="gx-page-subtitle">
            All service bookings across the platform.
            {reportedCount > 0 && (
              <span> · <b style={{ color: 'var(--red)' }}>{reportedCount} flagged for review</b></span>
            )}
          </div>
        </div>
      </div>

      <div className="gx-toolbar">
        <div className="gx-toolbar-left">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 11, border: '1px solid var(--line)', background: 'var(--surface)', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--ink-1)' }}
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="InProgress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings…" />
      </div>

      <div className="gx-card">
        {loading ? (
          <EmptyState title="Loading…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No bookings match" desc="Try changing the status filter or search term." />
        ) : (
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead>
                <tr>
                  <th>Customer</th><th>Professional</th><th>Service</th>
                  <th>Date</th><th>Status</th><th>Price</th><th>Flag</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const customerName = b.customerName || b.customer?.name || '—';
                  const professionalName = b.professionalName || b.professional?.name || '—';
                  const isReported = b.isReported || b.reported || b.hasReport;
                  return (
                    <TableRow key={b.id || b.bookingId}>
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
                      <td style={{ fontWeight: 500 }}>{b.serviceName || b.service || '—'}</td>
                      <td className="gx-muted">{dateShort(b.scheduledDate || b.date)}</td>
                      <td><Badge status={b.status} /></td>
                      <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{b.servicePrice || '—'}</td>
                      <td>
                        {isReported
                          ? <span className="gx-flag" title="Reported"><IconFlag /></span>
                          : <span className="gx-muted">—</span>}
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}