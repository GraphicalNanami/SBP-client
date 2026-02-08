const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#131010] text-white border-t border-border">
      <div className="container-main py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-lg font-semibold mb-3">Stellar Builder Platform</p>
            <p className="text-sm text-muted-foreground">
              Institutional-grade tooling, grant rounds, and community programs that
              accelerate the next generation of Stellar builders.
            </p>
          </div>
           <div>
           

            
          </div>

         
         
        </div>

        <div className="mt-10 flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          
          <span>© {currentYear} Stellar Builder Platform. All rights reserved.</span>
          <span>
           <a href="https://github.com/Stellar-Build-Platform/SBP-Client" target="_blank" rel="noopener noreferrer">
           
          <li className="flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="https://github.com/Stellar-Build-Platform/SBP-Client"
              className="w-4 h-4  group-hover:scale-110 transition-transform duration-300 cursor-pointer "
            >
              <path
                d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                fill="currentColor"
              />
            </svg>
            Github
          </li>
          </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
