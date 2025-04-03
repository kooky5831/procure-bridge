
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  depth?: number;
  variant?: 'default' | 'procurement' | 'assets' | 'finance' | 'reports' | 'admin';
}

export function NavItem({ href, children, depth = 0, variant = 'default' }: NavItemProps) {
  const getVariantStyles = (isActive: boolean) => {
    switch (variant) {
      case 'procurement':
        return isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700';
      case 'assets':
        return isActive 
          ? 'bg-green-100 text-green-700' 
          : 'text-green-600 hover:bg-green-50 hover:text-green-700';
      case 'finance':
        return isActive 
          ? 'bg-purple-100 text-purple-700' 
          : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700';
      case 'reports':
        return isActive 
          ? 'bg-amber-100 text-amber-700' 
          : 'text-amber-600 hover:bg-amber-50 hover:text-amber-700';
      case 'admin':
        return isActive 
          ? 'bg-red-100 text-red-700' 
          : 'text-red-600 hover:bg-red-50 hover:text-red-700';
      default:
        return isActive 
          ? 'bg-accent text-accent-foreground' 
          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground';
    }
  };

  return (
    <NavLink
      to={href}
      className={({ isActive }) => cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        depth > 0 && "pl-10",
        getVariantStyles(isActive)
      )}
      end
    >
      {children}
    </NavLink>
  );
}
