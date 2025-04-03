
import { VendorList } from "@/components/maintenance/vendor/VendorList";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function Vendors() {
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Vendors</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your organization's service providers</p>
        </div>
      </div>

      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {["Asset List", "Maintenance", "Vendors"].map((item) => (
            <Link
              key={item}
              to={item === "Asset List" ? "/assets" : 
                  item === "Maintenance" ? "/maintenance" : "/vendors"}
              className={cn(
                "flex items-center py-4 px-1 border-b-2 text-sm font-medium transition-colors hover:border-gray-300 hover:text-gray-700",
                location.pathname === 
                  (item === "Asset List" ? "/assets" : 
                   item === "Maintenance" ? "/maintenance" : "/vendors")
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {item}
              {item === "Maintenance" && <ArrowRight className="ml-1 h-4 w-4" />}
            </Link>
          ))}
        </nav>
      </div>

      <VendorList />
    </div>
  );
}
