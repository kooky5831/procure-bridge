
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, FileText, PlayCircle, Search, Trash2 } from "lucide-react";
import type { MaintenanceTask } from "@/types/maintenance";
import { toast } from "sonner";
import { MaintenanceDetailDialog } from "./MaintenanceDetailDialog";
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { maintenanceService } from "@/services/maintenance";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Maintenance } from "@/services/maintenance";

export const MaintenanceList = forwardRef((props, ref) => {
  // Add these two new state variables after existing useState declarations
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [tasks, setTasks] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleDelete = async (task: Maintenance) => {
    if (window.confirm('Are you sure you want to delete this maintenance task?')) {
      try {
        await maintenanceService.deleteMaintenance(task.task_id);
        await loadTasks(); 
        toast({
          title: "Success",
          description: "Maintenance task deleted successfully"
        }); 
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete maintenance task",
          variant: "destructive"
        });
      }
    }
  };
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getMaintenanceTasks();
      // Handle the response data structure correctly
      const tasksArray = Array.isArray(response) ? response : (response as { data: Maintenance[] }).data || [];
      const formattedTasks = tasksArray.map((task: any) => ({
        ...task,
        maintenance_type: task.task_type || task.maintenance_type || '',
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading maintenance tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance tasks",
        variant: "destructive",
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };
  useImperativeHandle(ref, () => ({
    fetchMaintenanceData: loadTasks
  }));
  useEffect(() => {
    loadTasks();
  }, []);
  const filteredTasks = tasks.filter(task =>
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.maintenance_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 border-t-2 border-r-2 border-primary rounded-full animate-spin mr-2" />
        <span>Loading maintenance tasks...</span>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.task_id}</TableCell>
                <TableCell>{task.asset_name}</TableCell>
                <TableCell>{task.maintenance_type}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.cost}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    task.status === "completed" ? "bg-green-100 text-green-800" :
                    task.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  {task.scheduled_date ? new Date(task.scheduled_date).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const formattedTask: MaintenanceTask = {
                          id: task.id.toString(),
                          task_id: task.id.toString(),
                          assetId: task.asset.toString(),
                          assetName: task.asset_name || '',
                          description: task.description,
                          maintenanceType: task.maintenance_type === 'internal_maintenance' ? 'Internal' : 'External',
                          scheduledDate: task.scheduled_date ? task.scheduled_date.split('T')[0] : null,
                          completedDate: task.completed_at ? task.completed_at.split('T')[0] : null,
                          status: task.status === 'completed' ? 'Completed' : 
                         task.status === 'in_progress' ? 'In Progress' : 'Scheduled',
                          cost: parseFloat(task.cost) || 0,
                          location: '',
                        };
                        setSelectedTask(formattedTask);
                        setIsDetailOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(task)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <MaintenanceDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        task={selectedTask as MaintenanceTask}
      />
    </div>
  );
});