"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { memoryStore, ProjectPreset } from "@/db/store";
import { Sliders, Plus, CheckCircle2, FileText } from "lucide-react";

export default function PresetsPage() {
  const [presets, setPresets] = useState(memoryStore.getPresets());

  return (
    <div>
      <Header
        title="Presets Scope Project"
        subtitle="Template scope otomatis untuk penawaran Hammad Studio"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded border border-purple-200">
                    {preset.category}
                  </span>
                  <span className="text-emerald-600 flex items-center space-x-1 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aktif</span>
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-2">{preset.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{preset.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>{preset.defaultPayload?.scopes?.length || 0} Scope Items</span>
                </span>
                <span className="text-purple-600 font-semibold hover:underline cursor-pointer">
                  Detail Preset
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
