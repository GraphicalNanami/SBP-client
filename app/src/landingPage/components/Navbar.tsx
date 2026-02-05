'use client';

 import { ArrowRight } from "lucide-react";
 import Link from "next/link";
 
 const Navbar = () => {
   return (
     <nav className="w-full py-4 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
       <div className="container-main flex items-center justify-between">
         {/* Logo */}
         <Link href="/src/landingPage" className="flex items-center gap-2">
           <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
             <span className="text-background text-xs font-bold">≡</span>
           </div>
           <span className="text-xl font-semibold text-foreground">Stellar</span>
         </Link>
         
         {/* Navigation Links */}
         <div className="hidden md:flex items-center gap-8">
           <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hackathons</a>
           <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ecosystem</a>
           <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Developers</a>
         </div>
         
         {/* CTAs */}
         <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-all duration-200">
             Try for free
           </button>
           <Link href="/src/auth">
             <button className="px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 flex items-center gap-2">
               sign up / sign in
             </button>
           </Link>
         </div>
       </div>
     </nav>
   );
 };
 
 export default Navbar;