 interface HighlightedTextProps {
   children: React.ReactNode;
   className?: string;
 }
 
 export const CircleHighlight = ({ children, className = "" }: HighlightedTextProps) => {
   return (
     <span className={`relative inline-block ${className}`}>
       <svg
         className="absolute -inset-x-4 -inset-y-2 w-[calc(100%+32px)] h-[calc(100%+16px)]"
         viewBox="0 0 200 80"
         preserveAspectRatio="none"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
       >
         <ellipse
           cx="100"
           cy="40"
           rx="95"
           ry="35"
           stroke="hsl(75, 96%, 68%)"
           strokeWidth="3"
           fill="none"
           strokeLinecap="round"
           style={{
             strokeDasharray: "8 6",
           }}
         />
       </svg>
       <span className="relative z-10">{children}</span>
     </span>
   );
 };
 
 export const UnderlineHighlight = ({ children, className = "" }: HighlightedTextProps) => {
   return (
     <span className={`relative inline-block ${className}`}>
       <span className="relative z-10">{children}</span>
       <svg
         className="absolute -bottom-2 left-0 w-full h-4"
         viewBox="0 0 200 20"
         preserveAspectRatio="none"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
       >
         <path
           d="M5 15 Q 50 5, 100 12 T 195 10"
           stroke="hsl(75 100% 75%)"
           strokeWidth="4"
           fill="none"
           strokeLinecap="round"
         />
       </svg>
     </span>
   );
 };
 
 export const BackgroundHighlight = ({ children, className = "" }: HighlightedTextProps) => {
   return (
     <span className={`relative inline-block ${className}`}>
       <span 
         className="absolute inset-0 bg-lime rounded-lg -mx-2 -my-1 px-2 py-1"
         style={{ 
           transform: "rotate(-1deg)",
           zIndex: 0 
         }}
       />
       <span className="relative z-10">{children}</span>
     </span>
   );
 };