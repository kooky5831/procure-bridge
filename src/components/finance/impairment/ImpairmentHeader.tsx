
import { Button } from "@/components/ui/button";
import { FileText, Scale, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ImpairmentHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Asset Revaluation</h1>
          <p className="text-muted-foreground">
            Record asset impairment or upward revaluation events
          </p>
        </div>
      </div>
      <div className="space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/finance/depreciation-schedule")}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Schedule
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/finance/depreciation-setup")}
        >
          <Scale className="h-4 w-4 mr-2" />
          Depreciation Setup
        </Button>
      </div>
    </div>
  );
}
