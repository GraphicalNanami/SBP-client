 import { ArrowRight } from "lucide-react";
import { CircleHighlight } from "@/src/shared/components/ui/highlightText";

 const Hero = () => {
   return (
     <section className="pt-20 pb-16 min-h-screen ">
       <div className="container-main">
         {/* Badge */}
        
         
         {/* Main Content */}
         <div className="flex flex-col justify-center items-center text-center gap-12">
  {/* Illustration - Left */}
  
  {/* Text Content - Center */}
  <div className="flex-1 text-center flex flex-col justify-center items-center pt-15 px-4">
    <h1 className="text-bold text-7xl mb-6" style={{ fontFamily: 'var(--font-jersey)' }}>
       Building the future
       <br />
       of Stellar
     </h1>
    
    <p className="text-body max-w-lg mx-auto mb-10">
      Discover hackathons, connect with top builders, and scale the next generation of Stellar projects.
    </p>
    
    {/* CTA Buttons */}
    <div className="flex items-center justify-center gap-4 items-center flex justify-center mt-10 gap-4">
      <button className="px-6 py-3.5 text-base font-medium text-foreground border border-border bg-card rounded-xl hover:bg-secondary transition-all duration-200">
        Try for free
      </button>
      <button className="px-6 py-3.5 text-base font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200">
        Get a demo
      </button>
    </div>
  </div>
</div>
                 
       </div>
     </section>
   );
 };
 

 

 
 export default Hero;