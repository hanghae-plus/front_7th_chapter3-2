interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  className,
  placeholder,
}: SearchBarProps) => {
  return (
    <div className={className}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '상품 검색...'}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
