interface SectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  action,
  children,
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          {action}
        </div>
      </div>
      {children}
    </section>
  );
};
