import React from "react";
import { Link, useLocation } from "../../../lib/local-router";
import { BarChart3, Kanban, Users } from "lucide-react";

export const CrmNavBar: React.FC = () => {
  const { pathname } = useLocation();

  const items = [
    {
      label: "Kanban Prospecção",
      shortLabel: "Kanban",
      to: "/crm/dashboard",
      icon: Kanban,
      active: pathname === "/crm/dashboard",
      activeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      iconClass: "text-emerald-400",
    },
    {
      label: "Clientes & Histórico",
      shortLabel: "Clientes",
      to: "/crm/clientes",
      icon: Users,
      active: pathname === "/crm/clientes" || pathname.startsWith("/crm/clientes/"),
      activeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      iconClass: "text-amber-400",
    },
    {
      label: "Planejador Google Ads",
      shortLabel: "Ads Planner",
      to: "/crm/planejador",
      icon: BarChart3,
      active: pathname === "/crm/planejador",
      activeClass: "bg-blue-600/20 text-blue-300 border-blue-500/40",
      iconClass: "text-blue-400",
    },
  ];

  return (
    <nav
      aria-label="Navegação principal do CRM"
      className="flex items-center gap-1.5 bg-[#0f1420] border border-[#1a2030] p-1 rounded-xl overflow-x-auto max-w-full"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`inline-flex items-center gap-1.5 px-3 min-h-[44px] sm:min-h-[36px] py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              item.active
                ? `${item.activeClass} shadow-sm`
                : "text-[#94a3b8] border-transparent hover:text-white hover:bg-[#161d2e]"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${item.active ? item.iconClass : "text-slate-400"}`} />
            <span className="sm:hidden">{item.shortLabel}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
