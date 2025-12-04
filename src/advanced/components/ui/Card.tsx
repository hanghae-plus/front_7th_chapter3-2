interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <section className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {children}
    </section>
  );
};
