export default function StatCard({ label, value, icon: Icon, primary = false }) {
  return (
    <div className={`rounded-2xl p-6 flex flex-col gap-3 ${
      primary
        ? 'bg-[#ED8936] text-white'
        : 'bg-white border border-[#E7E2D5]'
    }`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${primary ? 'text-white/80' : 'text-[#5C6675]'}`}>
          {label}
        </p>
        {Icon && <Icon size={20} className={primary ? 'text-white/80' : 'text-[#5C6675]'} />}
      </div>
      <p className={`text-3xl font-extrabold tracking-tight ${primary ? 'text-white' : 'text-[#0E1A2B]'}`}>
        {value ?? '—'}
      </p>
    </div>
  );
}