import { Link } from 'react-router-dom';

export default function NavItem({ to, label, Icon, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        active
          ? 'bg-brand text-white'
          : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}