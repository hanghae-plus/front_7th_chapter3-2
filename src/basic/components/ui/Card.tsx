const Card = ({ children }: { children: React.ReactNode }) => {
  return <section className="bg-white rounded-lg border border-gray-200 p-4">{children}</section>;
};

export default Card;
