export default function Table({ headers, children, empty }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E7E2D5] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E7E2D5]">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#5C6675]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
      {empty && (
        <div className="py-16 text-center text-sm text-[#5C6675]">
          {empty}
        </div>
      )}
    </div>
  );
}