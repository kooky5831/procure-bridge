
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { WorkflowInstance, ApprovalStatus } from "./types";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual API call
const mockPendingApprovals: WorkflowInstance[] = [
  {
    id: "1",
    requestId: "REQ-001",
    requestTitle: "New Laptops for Dev Team",
    amount: 4500,
    currency: "USD",
    category: "IT Equipment",
    currentStep: 1,
    status: "IN_PROGRESS",
    createdAt: new Date(),
    approvalSteps: [
      {
        order: 1,
        role: "IT_MANAGER",
        status: "PENDING"
      },
      {
        order: 2,
        role: "FINANCE",
        status: "PENDING"
      }
    ]
  },
  {
    id: "2",
    requestId: "REQ-002",
    requestTitle: "Office Furniture",
    amount: 2300,
    currency: "USD",
    category: "Furniture",
    currentStep: 1,
    status: "IN_PROGRESS",
    createdAt: new Date(),
    approvalSteps: [
      {
        order: 1,
        role: "PROCUREMENT",
        status: "PENDING"
      }
    ]
  }
];

interface ApprovalActionProps {
  status: ApprovalStatus;
}

function ApprovalStatusBadge({ status }: ApprovalActionProps) {
  const variants: Record<ApprovalStatus, { variant: "default" | "destructive", label: string, icon: React.ReactNode }> = {
    PENDING: { variant: "default", label: "Pending", icon: <Clock className="w-4 h-4" /> },
    APPROVED: { variant: "default", label: "Approved", icon: <CheckCircle2 className="w-4 h-4" /> },
    REJECTED: { variant: "destructive", label: "Rejected", icon: <XCircle className="w-4 h-4" /> },
    CHANGES_REQUESTED: { variant: "destructive", label: "Changes Requested", icon: <AlertCircle className="w-4 h-4" /> }
  };

  const { variant, label, icon } = variants[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {icon}
      {label}
    </Badge>
  );
}

export function ApprovalDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<WorkflowInstance | null>(null);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleApprovalAction = (action: 'approve' | 'reject' | 'request_changes') => {
    if (!selectedRequest) return;

    const actionMessages = {
      approve: "Request approved successfully",
      reject: "Request rejected",
      request_changes: "Changes requested from submitter"
    };

    toast({
      title: actionMessages[action],
      description: comment ? `Comment: ${comment}` : undefined,
    });

    setComment("");
    setSelectedRequest(null);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left side - Approvals List */}
      <div className="col-span-5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPendingApprovals.map((approval) => (
                <Card 
                  key={approval.id}
                  className={`cursor-pointer transition-colors hover:bg-muted ${
                    selectedRequest?.id === approval.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedRequest(approval)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{approval.requestTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {approval.requestId} · {approval.category}
                        </p>
                      </div>
                      <ApprovalStatusBadge status="PENDING" />
                    </div>
                    <div className="text-sm">
                      Amount: {approval.amount} {approval.currency}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Request Details & Actions */}
      <div className="col-span-7">
        <Card className="h-[calc(100vh-12rem)]">
          <CardContent className="p-6">
            {selectedRequest ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">{selectedRequest.requestTitle}</h2>
                  <p className="text-sm text-muted-foreground">{selectedRequest.requestId}</p>
                </div>

                <Tabs defaultValue="details">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <p className="text-sm">{selectedRequest.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Amount</label>
                        <p className="text-sm">
                          {selectedRequest.amount} {selectedRequest.currency}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Your Comment</label>
                      <Textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add your comments here..."
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApprovalAction('approve')}
                        className="flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleApprovalAction('request_changes')}
                        className="flex-1"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Request Changes
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleApprovalAction('reject')}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="space-y-4">
                      {selectedRequest.approvalSteps.map((step) => (
                        <div 
                          key={step.order}
                          className="flex items-center gap-4 p-4 rounded-lg border"
                        >
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${step.status === 'APPROVED' ? 'bg-green-100' : 
                              step.status === 'REJECTED' ? 'bg-red-100' : 
                              'bg-gray-100'}
                          `}>
                            {step.order}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{step.role}</p>
                            {step.approvedBy && (
                              <p className="text-sm text-muted-foreground">
                                {step.approvedBy} · {step.approvedAt?.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <ApprovalStatusBadge status={step.status} />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a request to view details and take action
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
