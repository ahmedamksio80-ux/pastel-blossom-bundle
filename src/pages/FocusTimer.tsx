import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sprout, Settings, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

const FocusTimer = () => {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('focus-sessions');
    return saved ? JSON.parse(saved) : 0;
  });
  const [totalTime, setTotalTime] = useState(() => {
    const saved = localStorage.getItem('focus-time');
    return saved ? JSON.parse(saved) : 0;
  });
  const [collectedPlants, setCollectedPlants] = useState(() => {
    const saved = localStorage.getItem('collected-plants');
    return saved ? JSON.parse(saved) : [];
  });
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Session completed!
          setIsActive(false);
          const newSessions = sessions + 1;
          const newTotalTime = totalTime + selectedDuration;
          setSessions(newSessions);
          setTotalTime(newTotalTime);
          
          // Add plant to collection
          const newPlant = getPlantBySession(newSessions);
          const updatedPlants = [...collectedPlants];
          if (!updatedPlants.includes(newPlant)) {
            updatedPlants.push(newPlant);
            setCollectedPlants(updatedPlants);
            localStorage.setItem('collected-plants', JSON.stringify(updatedPlants));
          }
          
          localStorage.setItem('focus-sessions', JSON.stringify(newSessions));
          localStorage.setItem('focus-time', JSON.stringify(newTotalTime));
          setMinutes(selectedDuration);
          setSeconds(0);
          
          // Show completion celebration
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds, sessions, totalTime, selectedDuration, collectedPlants]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setMinutes(selectedDuration);
    setSeconds(0);
  };

  const getPlantStage = () => {
    if (sessions < 3) return '🌱';
    if (sessions < 10) return '🌿';
    if (sessions < 25) return '🌳';
    return '🌸';
  };

  const getPlantBySession = (sessionCount: number) => {
    if (sessionCount >= 25) return '🌸';
    if (sessionCount >= 10) return '🌳';
    if (sessionCount >= 3) return '🌿';
    return '🌱';
  };

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setSelectedDuration(newDuration);
    if (!isActive) {
      setMinutes(newDuration);
      setSeconds(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 pb-24">
      <div className="max-w-sm mx-auto">
        <header className="text-center mb-8 mt-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Focus Timer</h1>
          <p className="text-muted-foreground">Stay focused, grow your garden</p>
        </header>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="garden" className="flex items-center gap-2">
              <Flower2 className="w-4 h-4" />
              Garden
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            {/* Timer Settings */}
            <Card className="app-card">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="cute-icon" />
                <h3 className="text-lg font-semibold">Timer Duration</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">1 min</span>
                  <span className="text-lg font-medium">{selectedDuration} minutes</span>
                  <span className="text-sm text-muted-foreground">120 min</span>
                </div>
                <Slider
                  value={[selectedDuration]}
                  onValueChange={handleDurationChange}
                  max={120}
                  min={1}
                  step={1}
                  disabled={isActive}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Timer Display */}
            <Card className="app-card text-center bounce-in">
              <div className="text-6xl font-bold text-primary mb-4 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={toggle}
                  size="lg"
                  className="gradient-button flex items-center gap-2"
                >
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>

              {isActive && (
                <div className="text-accent font-medium pulse-glow">
                  Stay focused! 🎯
                </div>
              )}
            </Card>

            {/* Current Plant */}
            <Card className="app-card text-center slide-up">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sprout className="cute-icon" />
                <h3 className="text-lg font-semibold">Current Plant</h3>
              </div>
              <div className="text-6xl mb-4">{getPlantStage()}</div>
              <p className="text-muted-foreground">
                {sessions < 3 ? 'Complete 3 sessions to see growth!' :
                 sessions < 10 ? 'Great progress! Keep going!' :
                 sessions < 25 ? 'Your plant is thriving!' :
                 'Amazing focus master! 🏆'}
              </p>
            </Card>

            {/* Stats */}
            <Card className="app-card slide-up">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📊 Your Progress
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{sessions}</div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{totalTime}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="garden" className="space-y-6">
            <Card className="app-card">
              <div className="flex items-center gap-3 mb-6">
                <Flower2 className="cute-icon" />
                <h3 className="text-lg font-semibold">Your Plant Collection</h3>
              </div>
              
              {collectedPlants.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🪴</div>
                  <p className="text-muted-foreground">Complete focus sessions to grow your first plant!</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {collectedPlants.map((plant, index) => (
                    <div key={index} className="text-center p-3 rounded-lg border border-border/50 bg-muted/30">
                      <div className="text-3xl mb-2">{plant}</div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Plant Collection Guide:</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>🌱 Seedling - Complete 3 sessions</div>
                  <div>🌿 Sprout - Complete 10 sessions</div>
                  <div>🌳 Tree - Complete 25 sessions</div>
                  <div>🌸 Flower - Master level!</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FocusTimer;