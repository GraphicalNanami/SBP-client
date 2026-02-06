 import { ArrowRight } from "lucide-react";
import { CircleHighlight } from "@/src/shared/components/ui/highlightText";
 
 const Hero = () => {
   return (
     <section className="pt-20 pb-16 min-h-[100vh] flex ">
       <div className="container-main">
         {/* Badge */}
         <div className="flex justify-center mb-8">
           <a 
             href="#" 
             className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full hover:border-muted-foreground/30 transition-all duration-200 group"
           >
             <span className="px-2.5 py-0.5 bg-lime text-foreground text-xs font-medium rounded-full">
               New
             </span>
             <span className="text-sm text-muted-foreground">
               Ecosystem Grant Round 4 is live
             </span>
             <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
           </a>
         </div>
         
         {/* Main Content */}
         <div className="flex flex-col justify-center items-center text-center gap-12">
  {/* Illustration - Left */}
  
  {/* Text Content - Center */}
  <div className="flex-1 text-center">
    <h1 className="text-bold text-7xl mb-6" style={{ fontFamily: 'var(--font-onest)' }}>
       Building the <CircleHighlight>future</CircleHighlight> 
       <br />
       of Stellar
     </h1>
    
    <p className="text-body max-w-lg mx-auto mb-10">
      Discover hackathons, connect with top builders, and scale the next generation of Stellar projects.
    </p>
    
    {/* CTA Buttons */}
    <div className="flex items-center justify-center gap-4">
      <button className="px-6 py-3.5 text-base font-medium text-foreground border border-border bg-card rounded-xl hover:bg-secondary transition-all duration-200">
        Try for free
      </button>
      <button className="px-6 py-3.5 text-base font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200">
        Get a demo
      </button>
    </div>
  </div>
</div>
         
         {/* Dashboard Preview */}
        
       </div>
     </section>
   );
 };
 

 

 
 export default Hero;