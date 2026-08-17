"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Sliders,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PlusCircle,
  FileSpreadsheet,
  Receipt,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userEmail?: string | null;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [docSubmenuOpen, setDocSubmenuOpen] = useState(true);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      hasSubmenu: true,
      submenu: [
        { name: "Semua Dokumen", href: "/documents", icon: FileText },
        { name: "Proposal", href: "/documents?type=proposal", icon: FileSpreadsheet },
        { name: "Invoice", href: "/documents?type=invoice", icon: Receipt },
      ],
    },
    { name: "Klien", href: "/clients", icon: Users },
    { name: "Project", href: "/projects", icon: Briefcase },
    { name: "Presets Scope", href: "/presets", icon: Sliders },
    { name: "Pengaturan Studio", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {/* Mobile Hamburger Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            H
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-none text-white">Hammad Studio</h1>
            <span className="text-[10px] text-purple-300 font-medium">Document Generator</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-all duration-300 shadow-xl lg:shadow-none",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center space-x-3 group",
                collapsed && "justify-center w-full"
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition">
                H
              </div>
              {!collapsed && (
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h1 className="font-bold text-sm text-white tracking-tight">Hammad Studio</h1>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p className="text-[11px] text-purple-300 font-medium">DOCX Generator</p>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Action Button */}
          {!collapsed && (
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/documents/proposals/new"
                  className="flex items-center justify-center space-x-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-2.5 py-2 rounded-lg shadow-sm shadow-purple-900/40 transition active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Proposal</span>
                </Link>
                <Link
                  href="/documents/invoices/new"
                  className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 text-xs font-semibold px-2.5 py-2 rounded-lg transition active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Invoice</span>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              if (item.hasSubmenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => setDocSubmenuOpen(!docSubmenuOpen)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition",
                        isActive
                          ? "bg-purple-600/15 text-purple-300 font-semibold"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={cn("w-4 h-4", isActive ? "text-purple-400" : "text-slate-400")} />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            docSubmenuOpen && "rotate-90"
                          )}
                        />
                      )}
                    </button>
                    {!collapsed && docSubmenuOpen && (
                      <div className="pl-8 space-y-1">
                        {item.submenu?.map((sub) => {
                          const subActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition",
                                subActive
                                  ? "bg-purple-600 text-white font-medium shadow-sm"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                              )}
                            >
                              <sub.icon className="w-3.5 h-3.5 opacity-80" />
                              <span>{sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition",
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div
            className={cn(
              "flex items-center justify-between",
              collapsed && "flex-col space-y-3"
            )}
          >
            <div className={cn("flex items-center space-x-3", collapsed && "justify-center")}>
              <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300 font-semibold text-xs shadow-inner">
                HS
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-slate-200 truncate">
                    Hammad Admin
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {userEmail || "admin@hammad.studio"}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
