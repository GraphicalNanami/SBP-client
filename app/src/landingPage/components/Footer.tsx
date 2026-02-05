const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f0f0f] text-white border-t border-border">
      <div className="container-main py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold mb-3">Stellar Global</p>
            <p className="text-sm text-muted-foreground">
              Institutional-grade tooling, grant rounds, and community programs that
              accelerate the next generation of Stellar builders.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4">
              Products
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Hackathon Directory</li>
              <li>Grant Network</li>
              <li>Builder Community</li>
              <li>Compliance Resources</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4">
              Connect
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Contact</li>
              <li>Documentation</li>
              <li>Security &amp; Compliance</li>
              <li>Press Kit</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {currentYear} Stellar Global. All rights reserved.</span>
          <span>Terms · Privacy · Security</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
