import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Video, VideoOff, Mic, MicOff, Settings, Users, Copy, Check } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Lobby = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getDevices();
    requestPermissions();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      
      setVideoDevices(videoInputs);
      setAudioDevices(audioInputs);
      
      if (videoInputs.length > 0 && !selectedVideoDevice) {
        setSelectedVideoDevice(videoInputs[0].deviceId);
      }
      if (audioInputs.length > 0 && !selectedAudioDevice) {
        setSelectedAudioDevice(audioInputs[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting devices:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      setPermissionsGranted(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast({
        title: "Permissions granted",
        description: "Camera and microphone access granted successfully.",
      });
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast({
        title: "Permissions required",
        description: "Please allow camera and microphone access to continue.",
        variant: "destructive",
      });
    }
  };

  const updateStream = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled ? { deviceId: selectedVideoDevice } : false,
        audio: audioEnabled ? { deviceId: selectedAudioDevice } : false
      });
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error updating stream:', error);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
      }
    }
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Link copied!",
      description: "Room link copied to clipboard.",
    });
  };

  const joinRoom = () => {
    if (permissionsGranted) {
      navigate(`/room/${roomId}`);
    } else {
      toast({
        title: "Permissions required",
        description: "Please allow camera and microphone access before joining.",
        variant: "destructive",
      });
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
            <Button variant="outline" onClick={copyRoomLink}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Setup your recording
            </h1>
            <p className="text-muted-foreground">
              Test your camera and microphone before joining the room
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Camera preview</CardTitle>
                  <CardDescription>
                    Make sure you look good and your lighting is optimal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {videoEnabled && permissionsGranted ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoOff className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Controls overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        variant={videoEnabled ? "default" : "destructive"}
                        size="icon"
                        onClick={toggleVideo}
                      >
                        {videoEnabled ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <VideoOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant={audioEnabled ? "default" : "destructive"}
                        size="icon"
                        onClick={toggleAudio}
                      >
                        {audioEnabled ? (
                          <Mic className="w-4 h-4" />
                        ) : (
                          <MicOff className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Device Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Camera</Label>
                    <Select 
                      value={selectedVideoDevice} 
                      onValueChange={(value) => {
                        setSelectedVideoDevice(value);
                        updateStream();
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {videoDevices.map(device => (
                          <SelectItem key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Microphone</Label>
                    <Select 
                      value={selectedAudioDevice} 
                      onValueChange={(value) => {
                        setSelectedAudioDevice(value);
                        updateStream();
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                      <SelectContent>
                        {audioDevices.map(device => (
                          <SelectItem key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-video">Enable camera</Label>
                    <Switch
                      id="enable-video"
                      checked={videoEnabled}
                      onCheckedChange={toggleVideo}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-audio">Enable microphone</Label>
                    <Switch
                      id="enable-audio"
                      checked={audioEnabled}
                      onCheckedChange={toggleAudio}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Room Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Room ID</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {roomId}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={joinRoom} 
                className="w-full" 
                size="lg"
                disabled={!permissionsGranted}
              >
                Join room
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lobby;