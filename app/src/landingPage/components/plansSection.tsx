 import { ArrowRight } from "lucide-react";
import { CircleHighlight } from "@/src/shared/components/ui/highlightText";
 
 const PlansSection = () => {
   return (
     <section className="py-24">
       <div className="container-main">
         {/* Heading */}
         <div className="text-center mb-6">
           <h2 className="heading-section">
             A plan for <CircleHighlight>anyone</CircleHighlight>.
             <br />
             Anytime.
           </h2>
         </div>
         
         <p className="text-body text-center mb-16">
           We help your business grow.
         </p>
         
         {/* Cards Grid */}
         <div className="grid md:grid-cols-3 gap-6">
           <PlanCard 
             title="Startups"
             description="Learn about the Remote platform and services"
           />
           <PlanCard 
             title="Mid-size"
             description="See our standard pricing and get a customized quote."
           />
           <PlanCard 
             title="Enterprise"
             description="See our standard pricing and get a customized quote."
           />
         </div>
       </div>
     </section>
   );
 };
 
 interface PlanCardProps {
   title: string;
   description: string;
 }
 
 const PlanCard = ({ title, description }: PlanCardProps) => {
   return (
     <div className="group bg-card border border-border rounded-3xl p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between min-h-[320px]">
       <div className="flex items-start justify-between">
         <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
         <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-200">
           <ArrowRight className="w-4 h-4" />
         </button>
       </div>
       
       <p className="text-muted-foreground text-base leading-relaxed">
         {description}
       </p>
     </div>
   );
 };
 
 export default PlansSection;