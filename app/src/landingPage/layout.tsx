export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-layout min-h-screen bg-background antialiased font-sans">
      {children}
    </div>
  );
}
