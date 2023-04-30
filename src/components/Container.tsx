export const Container = ({ children }: { children: React.ReactNode }) => {
  const containerStyle = {
    childrenStyle: `bg-blue-200 ma-auto `,
  };

  return <div className={containerStyle.childrenStyle}>{children}</div>;
};
