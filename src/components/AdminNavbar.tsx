import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LayoutDashboard, FileText, PlusCircle, Moon, Sun, BookOpen } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const AdminNavbar = () => {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2 group">
          <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold text-gradient">Admin Panel</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
          </Link>
          
          <Link to="/admin/posts">
            <Button variant="ghost" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Posts</span>
            </Button>
          </Link>
          
          <Link to="/admin/posts/create">
            <Button variant="default" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden md:inline">Create Post</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>

          <Button variant="destructive" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
