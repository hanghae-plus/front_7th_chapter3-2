interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className = "" }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export const TableHeader = ({
  children,
  align = "left",
  className = "",
}: TableHeaderProps) => {
  const alignStyles = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  return (
    <th
      className={`px-6 py-3 ${alignStyles[align]} text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell = ({ children, className = "" }: TableCellProps) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
      {children}
    </td>
  );
};
