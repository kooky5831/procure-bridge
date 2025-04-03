
import { Button } from "@/components/ui/button";
import { RequestList } from "@/components/dashboard/RequestList";
import { useState } from "react";
import { NewRequestDialog } from "./components/NewRequestDialog";
import { RequestHeader } from "./components/RequestHeader";

export default function Requests() {
  const [showNewRequest, setShowNewRequest] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RequestHeader title="My Purchase Requests" />
        <Button onClick={() => setShowNewRequest(true)}>
          Create New Request
        </Button>
      </div>

      <RequestList showActions={true} filterByCurrentUser={true} />

      <NewRequestDialog 
        open={showNewRequest} 
        onOpenChange={setShowNewRequest}
      />
    </div>
  );
}
