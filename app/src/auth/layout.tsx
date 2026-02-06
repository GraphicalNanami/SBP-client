export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-route-layout min-h-screen bg-background antialiased">
      {children}
    </div>
  );
}
