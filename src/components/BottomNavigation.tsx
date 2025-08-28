import { NavLink } from 'react-router-dom';
import { Timer, CheckSquare, StickyNote } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { path: '/', icon: Timer, label: 'Focus' },
    { path: '/habits', icon: CheckSquare, label: 'Habits' },
    { path: '/notes', icon: StickyNote, label: 'Notes' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-primary scale-110'
                  : 'text-muted-foreground hover:text-primary'
              }`
            }
          >
            <Icon className="cute-icon" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;