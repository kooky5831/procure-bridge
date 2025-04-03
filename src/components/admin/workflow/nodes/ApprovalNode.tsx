
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const roles = [
  { value: 'PROCUREMENT', label: 'Procurement', description: 'Reviews and approves purchase requests' },
  { value: 'FINANCE', label: 'Finance', description: 'Reviews financial implications' },
  { value: 'IT', label: 'IT', description: 'Technical review and approval' },
  { value: 'LEGAL', label: 'Legal', description: 'Legal compliance review' },
  { value: 'SECURITY', label: 'Security', description: 'Security assessment' },
  { value: 'EMPLOYEE', label: 'Employee', description: 'Initial request creation' }
];

function ApprovalNodeComponent({ data, isConnectable }: any) {
  const handleApproverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    data.approver = event.target.value;
  };

  return (
    <Card className="w-[300px]">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">
          {data.label}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure who needs to approve at this stage</p>
            </TooltipContent>
          </Tooltip>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Role</Label>
              <Switch
                checked={data.isActive !== false}
                onCheckedChange={(checked) => {
                  data.isActive = checked;
                }}
                className="scale-75"
              />
            </div>
            <Select
              value={data.role}
              onValueChange={(value) => {
                data.role = value;
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select approver role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span>{role.label}</span>
                      <span className="text-xs text-muted-foreground">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Approver</Label>
            <Input 
              placeholder="Enter approver email"
              value={data.approver}
              onChange={handleApproverChange}
            />
          </div>
        </div>
      </CardContent>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground/50 !w-3 !h-3 !border-2 !border-background"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted-foreground/50 !w-3 !h-3 !border-2 !border-background"
        isConnectable={isConnectable}
      />
    </Card>
  );
}

export const ApprovalNode = memo(ApprovalNodeComponent);
