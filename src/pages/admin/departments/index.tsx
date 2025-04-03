
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { toast } from "sonner";
import type { Department } from "@/types/department";
import { defaultDepartments } from "@/types/department";
import { CreateDepartmentDialog } from "@/components/admin/departments/CreateDepartmentDialog";
import { departmentService } from "@/services/department";

export default function Departments() {
  const [isLoading, setIsLoading] = useState(false)
  const [departmentData, setDepartmentData] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [departments] = useState<Department[]>(defaultDepartments);

  const filteredDepartments = departmentData?.filter(
    (dept) =>
      dept?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (deptId: string) => {
    try {
      // API call would go here
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  useEffect(()=>{
    const fetchDepartmentData = async () => {
      setIsLoading(true);
      try{
        const data = await departmentService.getDepartment();
        setDepartmentData(data);
      } catch (error){
        console.error('Error fetching user details:', error);
      }finally {
        setIsLoading(false);
      }
    }

    fetchDepartmentData()
  }, [])
  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
  }, [reload]);
  console.log("this is department", departmentData)
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Departments</h1>
          <p className="text-muted-foreground">Manage organizational departments and their assignments</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Department
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {isLoading ? (
              <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"/>
                      </svg>
                      <span>Loading Department...</span>
                    </div>
                  </TableCell>
              </TableRow>
            ) : departmentData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No department found
                  </TableCell>
                </TableRow>
              ) : (
            filteredDepartments?.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>{dept.description}</TableCell>
                <TableCell>{dept.manager ? "Assigned" : "Unassigned"}</TableCell>
                <TableCell>{new Date(dept.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => console.log("Edit", dept.id)}>
                        Edit Department
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(dept.id)}
                      >
                        Delete Department
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </div>

      <CreateDepartmentDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onReload={setReload}
        reload={reload}
      />
    </main>
  );
}
