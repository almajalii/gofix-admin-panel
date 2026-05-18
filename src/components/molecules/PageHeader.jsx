export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0E1A2B] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#5C6675] mt-1">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">{children}</div>
      )}
    </div>
  );
}