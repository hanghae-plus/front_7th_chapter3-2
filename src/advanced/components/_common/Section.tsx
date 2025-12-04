import { type FC, ReactNode } from "react";

interface IProps {
  title: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

const Section: FC<IProps> = ({ title, children, action }) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
};

export default Section;
