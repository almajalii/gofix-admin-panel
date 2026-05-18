import { IconSearch } from '../atoms/Icons';

export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="gx-search">
      <span className="gx-search-icon">
        <IconSearch />
      </span>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}