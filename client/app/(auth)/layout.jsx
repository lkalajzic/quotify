const AuthLayout = (props) => {
  const { children } = props;
  return (
    <div className="flex h-full mt-16 justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
