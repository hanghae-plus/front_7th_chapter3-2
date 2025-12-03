import useDebounce from '../hooks/useDebounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar = ({
  value,
  onChange,
  className,
  placeholder,
  debounceMs = 0,
}: SearchBarProps) => {
  const debouncedOnChange = useDebounce(onChange, debounceMs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceMs > 0) {
      debouncedOnChange(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className={className}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || '상품 검색...'}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
