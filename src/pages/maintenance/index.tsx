
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MaintenanceList } from "@/components/maintenance/MaintenanceList";
import { CreateMaintenanceDialog } from "@/components/maintenance/CreateMaintenanceDialog";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";

export default function Maintenance() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const maintenanceListRef = useRef<{ fetchMaintenanceData: () => Promise<void> }>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Maintenance Tasks</h1>
          <p className="text-muted-foreground">Track and manage asset maintenance schedules</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="inline-flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Maintenance Task
        </Button>
      </div>

      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {["Asset List", "Maintenance", "Vendors"].map((item) => (
            <Link
              key={item}
              to={item === "Asset List" ? "/assets" : 
                  item === "Maintenance" ? "/maintenance" : "/vendors"}
              className={cn(
                "py-4 px-1 border-b-2 text-sm font-medium transition-colors hover:border-gray-300 hover:text-gray-700",
                location.pathname === 
                  (item === "Asset List" ? "/assets" : 
                   item === "Maintenance" ? "/maintenance" : "/vendors")
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <MaintenanceList ref={maintenanceListRef} />
      </div>
      
      <CreateMaintenanceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          maintenanceListRef.current?.fetchMaintenanceData();
        }}
      />
    </main>
  );
}
