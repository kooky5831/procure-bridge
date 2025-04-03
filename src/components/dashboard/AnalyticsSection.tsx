
import { Box, DollarSign, FileText, Wrench } from "lucide-react";
import { StatCard } from "./StatCard";
import { OverviewGraph } from "./OverviewGraph";
import { DepartmentSpending } from "./DepartmentSpending";
import { CompletionRate } from "./CompletionRate";
import { MaintenanceAlerts } from "./MaintenanceAlerts";
import { RequestList } from "./RequestList";

export function AnalyticsSection() {
  const departmentData = [
    { name: 'IT', spent: 45000, budget: 100000, percentage: 45 },
    { name: 'HR', spent: 25000, budget: 50000, percentage: 50 },
    { name: 'Finance', spent: 30000, budget: 80000, percentage: 37.5 },
    { name: 'Operations', spent: 65000, budget: 120000, percentage: 54.2 }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Requests"
        value="12"
        description="3 pending approval"
        icon={FileText}
        linkText="View all requests"
        linkPath="/requests"
      />
      <StatCard
        title="Assets"
        value="142"
        description="23 require maintenance"
        icon={Box}
        linkText="View all assets"
        linkPath="/assets"
      />
      <StatCard
        title="Budget Used"
        value="68%"
        description="$340,000 remaining"
        icon={DollarSign}
        linkText="View budget"
        linkPath="/finance"
      />
      <StatCard
        title="Maintenance"
        value="8"
        description="Scheduled this month"
        icon={Wrench}
        linkText="View schedule"
        linkPath="/maintenance"
      />
      
      <div className="md:col-span-2">
        <OverviewGraph />
      </div>
      <div className="md:col-span-2">
        <DepartmentSpending departments={departmentData} />
      </div>
      <div className="md:col-span-2">
        <CompletionRate 
          title="Request Completion Rate"
          value="75"
          percentage={75}
        />
      </div>
      <div className="md:col-span-2">
        <MaintenanceAlerts alerts={[
          { id: '1', asset: 'Printer XC-101', dueDate: '2024-03-15', priority: 'high' },
          { id: '2', asset: 'Laptop HP-441', dueDate: '2024-03-20', priority: 'medium' },
          { id: '3', asset: 'Server R-201', dueDate: '2024-03-25', priority: 'low' }
        ]} />
      </div>
      
      <div className="col-span-full">
        <RequestList showActions={false} />
      </div>
    </div>
  );
}
