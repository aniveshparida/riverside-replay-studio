import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Video, Users, Clock, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [roomId, setRoomId] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    const roomLink = `${window.location.origin}/room/${newRoomId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Room created!",
      description: "Room link copied to clipboard. You can now share it with participants.",
    });
    
    setIsCreateDialogOpen(false);
    
    // Navigate to lobby
    navigate(`/lobby/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/lobby/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Riverside</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Profile</Button>
            <Button variant="ghost" size="sm">Settings</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to your studio
            </h1>
            <p className="text-lg text-muted-foreground">
              Start recording high-quality podcasts and videos in seconds
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Create a new room</CardTitle>
                <CardDescription>
                  Start a new recording session and invite participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Create room
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new room</DialogTitle>
                      <DialogDescription>
                        You'll get a unique link to share with your participants. Everyone will join a lobby first to test their setup.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center">
                        <Button onClick={handleCreateRoom} size="lg" className="px-8">
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Link copied!
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Generate room link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle>Join a room</CardTitle>
                <CardDescription>
                  Enter a room ID to join an existing recording session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div>
                    <Label htmlFor="room-id">Room ID</Label>
                    <Input
                      id="room-id"
                      type="text"
                      placeholder="Enter room ID"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="outline" className="w-full" size="lg">
                    Join room
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Recordings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent recordings</CardTitle>
                  <CardDescription>Your latest recording sessions</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate('/recordings')}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No recordings yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first room to start recording amazing content
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;