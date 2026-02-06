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
  </div>
</div>
                 
       </div>
     </section>
   );
 };
 

 

 
 export default Hero;