"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { memoryStore, BankAccount } from "@/db/store";
import { Building, Plus, Save, Shield, Settings, Check } from "lucide-react";

export default function SettingsPage() {
  const [bankAccounts, setBankAccounts] = useState(memoryStore.getBankAccounts());
  const [studioSettings, setStudioSettings] = useState(memoryStore.getStudioSettings());

  const [companyProfile, setCompanyProfile] = useState(studioSettings.company_profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    memoryStore.saveStudioSettings("company_profile", companyProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div>
      <Header
        title="Pengaturan Studio"
        subtitle="Profil studio, rekening bank, dan ketentuan default"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Company Profile Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-purple-600" />
              <span>Profil Hammad Studio</span>
            </h2>
            {savedSuccess && (
              <span className="inline-flex items-center space-x-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Pengaturan Tersimpan</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCompany} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Studio</label>
              <input
                type="text"
                value={companyProfile.name}
                onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Studio</label>
              <input
                type="text"
                value={companyProfile.tagline}
                onChange={(e) => setCompanyProfile({ ...companyProfile, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Website Resmi</label>
              <input
                type="text"
                value={companyProfile.website}
                onChange={(e) => setCompanyProfile({ ...companyProfile, website: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Konten WhatsApp / Telepon</label>
              <input
                type="text"
                value={companyProfile.phone}
                onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Profil Studio</span>
              </button>
            </div>
          </form>
        </div>

        {/* Bank Accounts Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-4 h-4 text-purple-600" />
              <span>Daftar Rekening Bank Reseller / Invoice</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bankAccounts.map((b) => (
              <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase">{b.bankName}</span>
                <p className="font-mono text-sm font-bold text-slate-900">{b.accountNumber}</p>
                <p className="text-xs text-slate-500 font-medium">{b.accountHolder}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
