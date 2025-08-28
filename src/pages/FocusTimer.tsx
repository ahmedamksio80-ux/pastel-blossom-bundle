import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const FocusTimer = () => {
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
          const newTotalTime = totalTime + 25;
          setSessions(newSessions);
          setTotalTime(newTotalTime);
          localStorage.setItem('focus-sessions', JSON.stringify(newSessions));
          localStorage.setItem('focus-time', JSON.stringify(newTotalTime));
          setMinutes(25);
          setSeconds(0);
          
          // Show completion celebration
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds, sessions, totalTime]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const getPlantStage = () => {
    if (sessions < 3) return '🌱';
    if (sessions < 10) return '🌿';
    if (sessions < 25) return '🌳';
    return '🌸';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 pb-24">
      <div className="max-w-sm mx-auto">
        <header className="text-center mb-8 mt-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Focus Timer</h1>
          <p className="text-muted-foreground">Stay focused, grow your garden</p>
        </header>

        {/* Timer Display */}
        <Card className="app-card text-center mb-6 bounce-in">
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

        {/* Plant Growth */}
        <Card className="app-card text-center mb-6 slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="cute-icon" />
            <h3 className="text-lg font-semibold">Your Garden</h3>
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
      </div>
    </div>
  );
};

export default FocusTimer;