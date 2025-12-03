import { type FC } from "react";

interface IProps {
  searchTerm : string;
  setSearchTerm : (v : string) => void;
}

const SearchBar: FC<IProps> = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="ml-8 flex-1 max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="상품 검색..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
