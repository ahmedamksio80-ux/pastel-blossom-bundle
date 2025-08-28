import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  lastCompleted: string;
  totalCompleted: number;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabitName, setNewHabitName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        streak: 0,
        completedToday: false,
        lastCompleted: '',
        totalCompleted: 0,
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setIsDialogOpen(false);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const today = new Date().toDateString();
        const isCompleting = !habit.completedToday;
        
        return {
          ...habit,
          completedToday: isCompleting,
          lastCompleted: isCompleting ? today : habit.lastCompleted,
          streak: isCompleting ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          totalCompleted: isCompleting ? habit.totalCompleted + 1 : habit.totalCompleted - 1,
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const getCharacterLevel = () => {
    const totalCompleted = habits.reduce((sum, habit) => sum + habit.totalCompleted, 0);
    if (totalCompleted < 5) return '🐣';
    if (totalCompleted < 15) return '🐤';
    if (totalCompleted < 30) return '🐦';
    if (totalCompleted < 50) return '🦅';
    return '🦋';
  };

  const completedToday = habits.filter(habit => habit.completedToday).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 pb-24">
      <div className="max-w-sm mx-auto">
        <header className="text-center mb-8 mt-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Habit Tracker</h1>
          <p className="text-muted-foreground">Build your character daily</p>
        </header>

        {/* Character Progress */}
        <Card className="app-card text-center mb-6 bounce-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="cute-icon" />
            <h3 className="text-lg font-semibold">Your Character</h3>
          </div>
          <div className="text-6xl mb-4">{getCharacterLevel()}</div>
          <div className="text-sm text-muted-foreground mb-2">
            Level {Math.floor(habits.reduce((sum, habit) => sum + habit.totalCompleted, 0) / 5) + 1}
          </div>
          <div className="text-lg font-medium text-accent">
            {completedToday}/{habits.length} habits today
          </div>
        </Card>

        {/* Habits List */}
        <div className="space-y-3 mb-6">
          {habits.map((habit, index) => (
            <Card key={habit.id} className="app-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{habit.name}</h4>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>🔥 {habit.streak} day streak</span>
                    <span>•</span>
                    <span>✅ {habit.totalCompleted} total</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleHabit(habit.id)}
                    variant={habit.completedToday ? "default" : "outline"}
                    size="sm"
                    className={habit.completedToday ? "gradient-button" : "rounded-full"}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteHabit(habit.id)}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {habits.length === 0 && (
          <Card className="app-card text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-lg font-semibold mb-2">Start Building Habits!</h3>
            <p className="text-muted-foreground mb-4">
              Add your first habit to begin your journey
            </p>
          </Card>
        )}

        {/* Add Habit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="floating-action">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="app-card max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center">Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="e.g., Drink 8 glasses of water"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                className="rounded-full"
              />
              <Button onClick={addHabit} className="gradient-button w-full">
                Add Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HabitTracker;