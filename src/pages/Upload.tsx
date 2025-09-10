import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Video, Download, Clock, CheckCircle, Upload as UploadIcon, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Recording {
  id: string;
  name: string;
  date: string;
  duration: string;
  size: string;
  status: 'processing' | 'ready' | 'uploading';
  progress: number;
  participants: number;
}

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      name: 'Team Meeting #1',
      date: new Date().toLocaleDateString(),
      duration: '45:23',
      size: '2.1 GB',
      status: 'uploading',
      progress: 68,
      participants: 3
    },
    {
      id: '2',
      name: 'Podcast Episode #12',
      date: '2024-01-09',
      duration: '1:23:45',
      size: '3.8 GB',
      status: 'ready',
      progress: 100,
      participants: 2
    },
    {
      id: '3',
      name: 'Interview with John',
      date: '2024-01-08',
      duration: '32:10',
      size: '1.2 GB',
      status: 'processing',
      progress: 25,
      participants: 2
    }
  ]);

  useEffect(() => {
    // Simulate progress updates for uploading/processing recordings
    const interval = setInterval(() => {
      setRecordings(prev => prev.map(recording => {
        if (recording.status === 'uploading' && recording.progress < 100) {
          const newProgress = Math.min(recording.progress + Math.random() * 5, 100);
          return {
            ...recording,
            progress: newProgress,
            status: newProgress >= 100 ? 'processing' : 'uploading'
          };
        }
        if (recording.status === 'processing' && recording.progress < 100) {
          const newProgress = Math.min(recording.progress + Math.random() * 3, 100);
          return {
            ...recording,
            progress: newProgress,
            status: newProgress >= 100 ? 'ready' : 'processing'
          };
        }
        return recording;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: Recording['status']) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="secondary"><UploadIcon className="w-3 h-3 mr-1" />Uploading</Badge>;
      case 'processing':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'ready':
        return <Badge><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge>;
    }
  };

  const handleDownload = (recording: Recording) => {
    toast({
      title: "Download started",
      description: `Downloading ${recording.name}...`,
    });
  };

  const handlePlay = (recording: Recording) => {
    toast({
      title: "Opening player",
      description: `Opening ${recording.name} in media player...`,
    });
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
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Your Recordings
            </h1>
            <p className="text-muted-foreground">
              Manage and download your recorded sessions
            </p>
          </div>

          {/* Current Upload Progress */}
          <div className="mb-8">
            {recordings.some(r => r.status === 'uploading') && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UploadIcon className="w-5 h-5 text-primary" />
                    Upload in Progress
                  </CardTitle>
                  <CardDescription>
                    Your recording is being uploaded and processed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recordings
                    .filter(r => r.status === 'uploading')
                    .map(recording => (
                      <div key={recording.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{recording.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {recording.progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={recording.progress} className="w-full" />
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recordings List */}
          <div className="space-y-4">
            {recordings.map((recording) => (
              <Card key={recording.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-muted-foreground" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{recording.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{recording.date}</span>
                          <span>{recording.duration}</span>
                          <span>{recording.size}</span>
                          <span>{recording.participants} participants</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {getStatusBadge(recording.status)}
                      
                      {recording.status === 'processing' && (
                        <div className="flex items-center gap-2">
                          <Progress value={recording.progress} className="w-24" />
                          <span className="text-sm text-muted-foreground">
                            {recording.progress.toFixed(0)}%
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {recording.status === 'ready' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePlay(recording)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Play
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(recording)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </>
                        )}
                        
                        {(recording.status === 'uploading' || recording.status === 'processing') && (
                          <Button variant="outline" size="sm" disabled>
                            {recording.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {recordings.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No recordings yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start your first recording session to see your content here
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Create New Room
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Upload;