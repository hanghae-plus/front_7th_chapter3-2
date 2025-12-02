interface PropsType {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Layout({ header, children, footer }: PropsType) {
  return (
    <div className="min-h-screen bg-gray-50">
      {header}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      {footer}
    </div>
  );
}
