
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileTextIcon, CheckCircleIcon, PackageCheck, TruckIcon, ArchiveIcon } from "lucide-react";

export function HorizontalNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const items = [
    { 
      href: "/requests", 
      label: "Purchase Requests",
      icon: FileTextIcon
    },
    { 
      href: "/requests/approvals", 
      label: "Approvals",
      icon: CheckCircleIcon
    },
    { 
      href: "/grn", 
      label: "Goods Receipt",
      icon: PackageCheck
    },
    { 
      href: "/requests/delivery", 
      label: "Deliveries",
      icon: TruckIcon
    },
    { 
      href: "/requests/history", 
      label: "History",
      icon: ArchiveIcon
    }
  ];

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center space-x-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                  currentPath === item.href
                    ? "text-primary border-b-2 border-primary h-16 flex items-center"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
