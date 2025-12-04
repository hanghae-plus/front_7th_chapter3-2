interface PropsType {
  searchTerm: string;
}

export function ProductEmptyFallback({ searchTerm }: PropsType) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">
        "{searchTerm}"에 대한 검색 결과가 없습니다.
      </p>
    </div>
  );
}
