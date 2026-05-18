export default function TableRow({ children, onClick, clickable = false }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[#E7E2D5] transition-colors ${
        clickable ? 'cursor-pointer hover:bg-[#F7F3EA]' : ''
      }`}
    >
      {children}
    </tr>
  );
}