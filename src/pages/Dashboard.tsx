
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompletionRate } from "@/components/dashboard/CompletionRate";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { DepartmentSpending } from "@/components/dashboard/DepartmentSpending";

// Mock data for demonstration
const departmentSpending = [
  { name: "IT Department", spent: 125000, budget: 150000, percentage: 83 },
  { name: "Human Resources", spent: 45000, budget: 75000, percentage: 60 },
  { name: "Operations", spent: 89000, budget: 100000, percentage: 89 },
  { name: "Marketing", spent: 35000, budget: 50000, percentage: 70 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7days");
  const [compareWith, setCompareWith] = useState("previous");
  const [frequency, setFrequency] = useState("daily");

  const handleAddRequest = () => {
    navigate("/requests", { state: { openCreateDialog: true } });
  };

  const handleExport = () => {
    toast.success("Dashboard data exported successfully");
  };

  return (
    <div className="container mx-auto py-4 sm:py-6">
      <div className="px-4 sm:px-0">
        <DashboardHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          compareWith={compareWith}
          setCompareWith={setCompareWith}
          frequency={frequency}
          setFrequency={setFrequency}
          onAddRequest={handleAddRequest}
          onExport={handleExport}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CompletionRate 
            title="Active Requests Value" 
            value="$45,231.89" 
            subtext="$3,241.89 previous period" 
            percentage={12} 
            trend="up"
            link="/requests"
          />
          <CompletionRate 
            title="Approval Efficiency" 
            value="2.4 days" 
            subtext="3.1 days average response time" 
            percentage={22} 
            trend="down"
            link="/requests/approvals"
          />
          <CompletionRate 
            title="Pending Actions" 
            value="24" 
            subtext="18 requests need your attention" 
            percentage={33} 
            trend="up"
            link="/requests/pending"
          />
          <CompletionRate 
            title="Budget Utilization" 
            value="67%" 
            subtext="of Q1 procurement budget used" 
            percentage={5} 
            trend="up"
            link="/finance"
          />
        </div>

        <AnalyticsSection />
        <div className="mt-6">
          <DepartmentSpending departments={departmentSpending} />
        </div>
      </div>
    </div>
  );
}
