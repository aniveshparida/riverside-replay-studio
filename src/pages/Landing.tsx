import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Users, Shield, Zap, Video, Mic } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Riverside</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/login">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Record podcasts and videos with{" "}
            <span className="text-primary">studio quality</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create professional content remotely. Record up to 8 participants in 4K video and lossless audio, 
            all from your browser.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Input 
              placeholder="Enter your email"
              className="max-w-sm"
            />
            <Button size="lg" className="px-8">
              Start recording for free
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>No downloads required</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Up to 8 participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Studio quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything you need to create amazing content
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  4K Video Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Record in up to 4K resolution with progressive upload technology. 
                  Never lose your content, even with poor connections.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-primary" />
                  Lossless Audio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Crystal clear, uncompressed audio that sounds like you're in the same room. 
                  Perfect for podcasts and interviews.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Multi-participant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Record with up to 8 participants simultaneously. Each person gets their own 
                  high-quality track for easy editing.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to start recording?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of creators who trust Riverside for their content creation needs.
          </p>
          <Link to="/login">
            <Button size="lg" className="px-12">
              <Play className="w-4 h-4 mr-2" />
              Get started for free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Video className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Riverside</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Riverside. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;