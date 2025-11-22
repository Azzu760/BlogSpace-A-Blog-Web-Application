import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Moon, Sun, BookOpen } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface PublicNavbarProps {
  onSearch: (query: string) => void;
}

const PublicNavbar = ({ onSearch }: PublicNavbarProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold text-gradient">BlogSpace</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/?filter=Technology" className="text-sm font-medium hover:text-primary transition-colors">
            Technology
          </Link>
          <Link to="/?filter=Design" className="text-sm font-medium hover:text-primary transition-colors">
            Design
          </Link>
          <Link to="/?filter=Business" className="text-sm font-medium hover:text-primary transition-colors">
            Business
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-9 w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link to="/admin/login">
            <Button variant="default">Admin Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
