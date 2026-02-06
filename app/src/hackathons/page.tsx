import Link from "next/link";
import { Plus } from "lucide-react";

export default function HackathonsPage() {
  return (
    <div className="min-h-screen">
      <div className="container-main py-12 md:py-20">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Hackathons
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg">
            Discover and participate in Stellar ecosystem hackathons. Ready to host your own?
          </p>
          
          <Link href="/src/organization">
            <button className="px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 flex items-center gap-2">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Create Hackathon
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
