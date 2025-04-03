
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Department {
  name: string;
  spent: number;
  budget: number;
  percentage: number;
}

interface DepartmentSpendingProps {
  departments: Department[];
}

export function DepartmentSpending({ departments }: DepartmentSpendingProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Top Departments by Spend</CardTitle>
          <Select defaultValue="allTime">
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allTime">All time</SelectItem>
              <SelectItem value="thisYear">This year</SelectItem>
              <SelectItem value="thisQuarter">This quarter</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {departments.map((dept) => (
            <div key={dept.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dept.name}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(dept.spent)} / {formatCurrency(dept.budget)}
                </span>
              </div>
              <Progress value={dept.percentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {dept.percentage}% of budget utilized
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
