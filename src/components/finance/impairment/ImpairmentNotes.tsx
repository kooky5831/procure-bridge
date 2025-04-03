
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ImpairmentNotes() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <div>
            <CardTitle>Important Guidelines</CardTitle>
            <CardDescription>
              Asset revaluation and impairment procedures
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Upward Revaluation:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Must be supported by reliable market evidence</li>
              <li>Affects future depreciation calculations</li>
              <li>Creates a revaluation reserve in equity</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Downward Revaluation/Impairment:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Record immediately when identified</li>
              <li>First reduces any existing revaluation surplus</li>
              <li>Excess recognized as an impairment loss</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Required Documentation:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Market value assessment reports</li>
              <li>Technical evaluation for specialized assets</li>
              <li>Finance manager approval documentation</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Note: All revaluations require finance manager approval and supporting documentation. 
              Changes will affect future depreciation calculations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
