export default function HackathonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hackathon-layout min-h-screen bg-background antialiased font-sans">
      {children}
    </div>
  );
}
