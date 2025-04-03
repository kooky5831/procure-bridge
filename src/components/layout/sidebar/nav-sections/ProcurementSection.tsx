
import { FileTextIcon } from "lucide-react";
import { NavItem } from "../NavItem";

interface ProcurementSectionProps {
  currentPath: string;
}

export function ProcurementSection({ currentPath }: ProcurementSectionProps) {
  return (
    <NavItem href="/requests" variant="procurement">
      <FileTextIcon className="h-4 w-4 mr-2" />
      Procurement
    </NavItem>
  );
}
