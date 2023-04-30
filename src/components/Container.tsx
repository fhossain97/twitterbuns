export const Container = ({ children }: { children: React.ReactNode }) => {
  const containerStyle = {
    childrenStyle: `bg-blue-200 m-auto p-3 max-w-xl`,
  };

  return <div className={containerStyle.childrenStyle}>{children}</div>;
};
