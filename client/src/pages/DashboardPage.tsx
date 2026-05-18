import { Plus, Users, UserCheck, MessageSquare, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { leadsApi } from "../api/leads";
import { AppShell } from "../components/layout/AppShell";
import { LeadFiltersBar } from "../components/leads/LeadFilters";
import { LeadForm } from "../components/leads/LeadForm";
import { LeadTable } from "../components/leads/LeadTable";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import type { Lead, LeadFilters, LeadPayload } from "../types/lead";
import { downloadBlob } from "../utils/download";
import { getErrorMessage } from "../utils/errors";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({ status: "", source: "", search: "", sort: "latest", page: 1 });
  const [searchValue, setSearchValue] = useState("");
  const [meta, setMeta] = useState({ page: 1, total: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const debouncedSearch = useDebounce(searchValue);

  useEffect(() => {
    setFilters((current) => ({ ...current, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await leadsApi.list(filters);
      setLeads(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const stats = useMemo(() => {
    const qualified = leads.filter((lead) => lead.status === "Qualified").length;
    const contacted = leads.filter((lead) => lead.status === "Contacted").length;
    const newLeads = leads.filter((lead) => lead.status === "New").length;
    return {
      total: meta.total,
      qualified,
      contacted,
      newLeads
    };
  }, [leads, meta.total]);

  const handleSave = async (payload: LeadPayload) => {
    setSaving(true);
    setError("");
    try {
      if (editingLead) await leadsApi.update(editingLead._id, payload);
      else await leadsApi.create(payload);
      setShowForm(false);
      setEditingLead(null);
      await fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this lead permanently?");
    if (!confirmed) return;
    try {
      await leadsApi.remove(id);
      await fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await leadsApi.exportCsv(filters);
      downloadBlob(blob, "leads.csv");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-6">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-panel backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-lg dark:border-slate-800/40 dark:bg-[#0d1527]/70">
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-violet-500/10 blur-xl transition-all group-hover:bg-violet-500/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Leads</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition-transform group-hover:scale-110 dark:bg-violet-950/50 dark:text-violet-400">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-violet-600 dark:text-violet-400">Pipeline active</span> in workspace
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-panel backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg dark:border-slate-800/40 dark:bg-[#0d1527]/70">
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-amber-500/10 blur-xl transition-all group-hover:bg-amber-500/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contacted (On Page)</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{stats.contacted}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-transform group-hover:scale-110 dark:bg-amber-950/50 dark:text-amber-400">
                <MessageSquare size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-1.5 rounded-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${stats.total > 0 ? (stats.contacted / Math.min(stats.total, 10)) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-panel backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg dark:border-slate-800/40 dark:bg-[#0d1527]/70">
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl transition-all group-hover:bg-emerald-500/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Qualified (On Page)</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{stats.qualified}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-950/50 dark:text-emerald-400">
                <UserCheck size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${stats.total > 0 ? (stats.qualified / Math.min(stats.total, 10)) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Leads</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, sort, and export your pipeline.</p>
          </div>
          <Button onClick={() => { setEditingLead(null); setShowForm(true); }}>
            <Plus size={16} /> New lead
          </Button>
        </div>

        {showForm ? <LeadForm lead={editingLead} loading={saving} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditingLead(null); }} /> : null}

        <LeadFiltersBar
          filters={filters}
          searchValue={searchValue}
          exporting={exporting}
          onSearchChange={setSearchValue}
          onExport={handleExport}
          onFilterChange={(next) => setFilters((current) => ({ ...current, ...next, page: 1 }))}
        />

        {error ? <div className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-100">{error}</div> : null}
        {loading ? <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">Loading leads...</div> : null}
        {!loading && leads.length === 0 ? <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">No leads match the current filters.</div> : null}
        {!loading && leads.length > 0 ? <LeadTable leads={leads} canDelete={user?.role === "Admin"} onEdit={(lead) => { setEditingLead(lead); setShowForm(true); }} onDelete={handleDelete} /> : null}

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">Page {meta.page} of {Math.max(meta.totalPages, 1)}</p>
          <div className="flex gap-2">
            <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100" disabled={!meta.hasPreviousPage} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>Previous</Button>
            <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100" disabled={!meta.hasNextPage} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>Next</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
