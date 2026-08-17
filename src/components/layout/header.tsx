"use client";

import Link from "next/link";
import { PlusCircle, FileSpreadsheet, Receipt } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Link
          href="/documents/proposals/new"
          className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xs transition active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Buat Proposal</span>
        </Link>
        <Link
          href="/documents/invoices/new"
          className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xs transition active:scale-95"
        >
          <Receipt className="w-3.5 h-3.5 text-purple-400" />
          <span>Buat Invoice</span>
        </Link>
      </div>
    </header>
  );
}
