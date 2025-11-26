import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Success = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="bg-card border border-border rounded-xl p-12 shadow-2xl animate-fade-in">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-20 w-20 text-secondary animate-glow" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Thanks for submitting!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Our team will review your details and contact you within 24 hours.
          </p>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 shadow-lg"
            onClick={() => window.location.href = "https://evoxers.com"}
          >
            Go back to EVOXERS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
