import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, Phone, Square, Circle, Settings, Users, Monitor } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  stream?: MediaStream;
}

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', isHost: true, videoEnabled: true, audioEnabled: true },
    { id: '2', name: 'John Doe', isHost: false, videoEnabled: true, audioEnabled: true },
    { id: '3', name: 'Jane Smith', isHost: false, videoEnabled: false, audioEnabled: true },
  ]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Initialize local video stream
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    }).catch(error => {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Media access error",
        description: "Could not access camera or microphone.",
        variant: "destructive",
      });
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      toast({
        title: "Recording started",
        description: "Your session is now being recorded.",
      });
    } else {
      setIsRecording(false);
      toast({
        title: "Recording stopped", 
        description: "Your recording has been saved and will be processed.",
      });
      // Navigate to upload page after stopping
      setTimeout(() => {
        navigate('/upload');
      }, 1000);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
      }
    }
  };

  const leaveRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "Left room",
      description: "You have left the recording room.",
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Video className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Room: {roomId}</span>
            </div>
            
            {isRecording && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Circle className="w-2 h-2 fill-current animate-pulse" />
                REC {formatTime(recordingTime)}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Users className="w-3 h-3 mr-1" />
              {participants.length}
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Video Grid */}
      <main className="flex-1 p-6">
        <div className="h-full">
          {participants.length <= 2 ? (
            // 1-2 participants: side by side
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {participants.map((participant, index) => (
                <Card key={participant.id} className="relative overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted relative">
                      {participant.id === '1' && videoEnabled ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : participant.videoEnabled ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                            {participant.name.charAt(0)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <VideoOff className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Participant info */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Badge variant={participant.isHost ? "default" : "secondary"}>
                          {participant.name}
                          {participant.isHost && " (Host)"}
                        </Badge>
                        {!participant.audioEnabled && (
                          <Badge variant="destructive">
                            <MicOff className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // 3+ participants: grid layout
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {participants.map((participant) => (
                <Card key={participant.id} className="relative overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted relative">
                      {participant.id === '1' && videoEnabled ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : participant.videoEnabled ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            {participant.name.charAt(0)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <VideoOff className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-2 left-2 flex items-center gap-1">
                        <Badge variant={participant.isHost ? "default" : "secondary"} className="text-xs">
                          {participant.name}
                        </Badge>
                        {!participant.audioEnabled && (
                          <Badge variant="destructive">
                            <MicOff className="w-2 h-2" />
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Controls */}
      <footer className="border-t border-border p-6 bg-card">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={audioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full"
          >
            {audioEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant={videoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full"
          >
            {videoEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            onClick={toggleRecording}
            className="rounded-full px-6"
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Circle className="w-5 h-5 mr-2" />
                Start Recording
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={leaveRoom}
            className="rounded-full"
          >
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Room;