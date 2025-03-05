
import { Link } from "react-router-dom";

type SidebarLogoProps = {
  collapsed?: boolean;
};

export function SidebarLogo({ collapsed = false }: SidebarLogoProps) {
  return (
    <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
      <Link to="/" className="flex items-center space-x-2">
        <span className="bg-primary text-white px-2 py-1 rounded font-bold">PS</span>
        {!collapsed && <span className="font-semibold">Patorama Studios</span>}
      </Link>
    </div>
  );
}
