
import { BoxIcon } from "lucide-react";
import { NavItem } from "../NavItem";

interface AssetsSectionProps {
  currentPath: string;
}

export function AssetsSection({ currentPath }: AssetsSectionProps) {
  return (
    <div className="space-y-1">
      <NavItem 
        href="/assets" 
        isActive={currentPath.startsWith("/assets") || currentPath === "/maintenance" || currentPath === "/vendors"}
      >
        <BoxIcon className="h-4 w-4 mr-2" />
        Assets
      </NavItem>
    </div>
  );
}
