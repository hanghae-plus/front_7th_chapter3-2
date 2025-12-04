export const SvgBase = ({
  children,
  ...props
}: React.PropsWithChildren<React.SVGProps<SVGSVGElement>>) => {
  return <svg {...props}>{children}</svg>;
};
