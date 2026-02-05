 import { ArrowRight } from "lucide-react";
 
 const Hero = () => {
   return (
     <section className="pt-20 pb-16">
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
               Announcing our $2.3M Seed Round
             </span>
             <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
           </a>
         </div>
         
         {/* Main Content */}
         <div className="flex flex-col lg:flex-row items-center gap-12">
           {/* Illustration - Left */}
          
           
           {/* Text Content - Center/Right */}
           <div className="flex-1 text-center lg:text-left lg:pl-8">
             
             
             <p className="text-body max-w-lg mx-auto lg:mx-0 mb-10">
               A hiring platform that works the way you do.
             </p>
             
             {/* CTA Buttons */}
             <div className="flex items-center justify-center lg:justify-start gap-4">
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
         <div className="mt-16">
           <DashboardPreview />
         </div>
       </div>
     </section>
   );
 };
 
 const DashboardPreview = () => {
   return (
     <div className="bg-card border border-border rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] overflow-hidden">
       {/* Toolbar */}
       <div className="flex items-center justify-between px-6 py-4 border-b border-border">
         <div className="flex items-center gap-4">
           <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
             <span className="text-background text-xs">≡</span>
           </div>
           <div className="flex items-center gap-3 text-muted-foreground">
             <span className="text-sm">👥</span>
             <span className="text-sm">$</span>
             <span className="text-sm">⊘</span>
             <span className="text-sm">+</span>
           </div>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
             <span className="text-background text-xs">≡</span>
           </div>
           <span className="text-sm font-medium">Remote</span>
           <span className="text-muted-foreground">/</span>
           <span className="text-sm">All</span>
         </div>
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-lime"></div>
           <div className="w-8 h-8 rounded-full bg-muted"></div>
         </div>
       </div>
       
       {/* Content */}
       <div className="p-6">
         <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 rounded-full bg-lime/50 flex items-center justify-center text-sm">🎅</div>
           <h3 className="text-xl font-medium">Good morning, Jessica!</h3>
         </div>
         
         <div className="flex items-center gap-3 mb-6">
           <span className="px-3 py-1.5 bg-secondary rounded-lg text-sm">Team <span className="font-medium">All</span></span>
           <span className="px-3 py-1.5 bg-secondary rounded-lg text-sm">Status <span className="font-medium">Pending</span></span>
         </div>
         
         {/* Table */}
         <div className="border border-border rounded-2xl overflow-hidden">
           <table className="w-full">
             <thead>
               <tr className="border-b border-border bg-secondary/50">
                 <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Users</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Team</th>
                 <th className="px-4 py-3"></th>
               </tr>
             </thead>
             <tbody>
               <TableRow 
                 name="David Wilson"
                 initials="DW"
                 role="Founder & CEO"
                 status="Pending"
                 amount="$200,000"
                 team="BW"
                 selected
               />
               <TableRow 
                 name="Jessica Hayes"
                 initials="JH"
                 role="Co-founder & CFO"
                 status="Pending"
                 amount="$200,000"
                 team="AS MB"
                 selected
               />
               <TableRow 
                 name="Constanza Perez"
                 initials="CP"
                 role="Head of Product"
                 badge="Product"
                 status="Pending"
                 amount="$150,000"
                 team="AS MB"
               />
               <TableRow 
                 name="Meera Desai"
                 initials="MD"
                 role="Head of Engineering"
                 badge="Tech"
                 status="Pending"
                 amount="$170,000"
                 team="AS"
               />
             </tbody>
           </table>
         </div>
       </div>
     </div>
   );
 };
 
 interface TableRowProps {
   name: string;
   initials: string;
   role: string;
   badge?: string;
   status: string;
   amount: string;
   team: string;
   selected?: boolean;
 }
 
 const TableRow = ({ name, initials, role, badge, status, amount, team, selected }: TableRowProps) => {
   return (
     <tr className={`border-b border-border last:border-0 ${selected ? 'bg-secondary/30' : ''}`}>
       <td className="px-4 py-4">
         <div className="flex items-center gap-3">
           <input 
             type="checkbox" 
             checked={selected} 
             readOnly
             className="w-4 h-4 rounded border-border"
           />
           <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
             {initials}
           </div>
           <span className="font-medium text-sm">{name}</span>
         </div>
       </td>
       <td className="px-4 py-4">
         <div className="flex items-center gap-2">
           <span className="text-sm text-muted-foreground">{role}</span>
           {badge && (
             <span className="px-2 py-0.5 bg-foreground text-background text-xs rounded">{badge}</span>
           )}
         </div>
       </td>
       <td className="px-4 py-4">
        <span className="text-sm text-warning">{status}</span>
       </td>
       <td className="px-4 py-4">
         <span className="text-sm">{amount}</span>
       </td>
       <td className="px-4 py-4">
         <div className="flex items-center gap-1">
           <span className="text-xs text-muted-foreground">{team}</span>
           <div className="w-6 h-6 rounded-full bg-muted"></div>
         </div>
       </td>
       <td className="px-4 py-4">
         <button className="text-muted-foreground hover:text-foreground">⋯</button>
       </td>
     </tr>
   );
 };
 
 export default Hero;