import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Target, Sparkles, TrendingUp, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden px-6 py-16 md:py-24">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 h-16 w-16 rounded-full bg-fun-yellow/30 blur-xl animate-pulse" />
        <div className="absolute top-32 right-20 h-20 w-20 rounded-full bg-fun-purple/20 blur-xl animate-pulse delay-300" />
        <div className="absolute bottom-20 left-1/4 h-12 w-12 rounded-full bg-fun-blue/25 blur-xl animate-pulse delay-500" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-secondary-foreground">
              Learn. Save. Grow!
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Become a Money{" "}
            <span className="text-primary">Superstar</span>
            <Star className="inline-block ml-2 h-8 w-8 text-warning animate-bounce" />
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Start your savings adventure! Set goals, watch your money grow, and unlock awesome rewards along the way.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="rounded-full px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow">
              Start Saving
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 text-base font-semibold border-2"
            >
              How It Works
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-6 py-16 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
            Your Savings Superpowers
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Goal Card */}
            <Card className="group border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:scale-110 transition-transform">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Set Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Dream big! Save for a new toy, game, or something special.
                </p>
              </CardContent>
            </Card>

            {/* Track Card */}
            <Card className="group border-2 border-transparent hover:border-accent/20 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 group-hover:scale-110 transition-transform">
                  <PiggyBank className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Track Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Watch your piggy bank grow with fun charts and badges!
                </p>
              </CardContent>
            </Card>

            {/* Grow Card */}
            <Card className="group border-2 border-transparent hover:border-fun-purple/20 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fun-purple/10 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7 text-fun-purple" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Level Up</h3>
                <p className="text-sm text-muted-foreground">
                  Earn stars and unlock rewards as you become a saving pro!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress Preview */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-md">
          <Card className="overflow-hidden border-2 shadow-xl">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Your Goal</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  Level 3
                </span>
              </div>
              
              <h3 className="mb-2 text-xl font-bold text-foreground">New Skateboard 🛹</h3>
              
              <div className="mb-3">
                <Progress value={65} className="h-3 rounded-full" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">$65 saved</span>
                <span className="text-muted-foreground">$100 goal</span>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 transition-all ${
                      star <= 3
                        ? "text-warning fill-warning scale-100"
                        : "text-muted scale-90"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Made with 💚 for young savers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
