import { Plus } from "lucide-react";
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
    return [
      { label: "Visible leads", value: meta.total },
      { label: "Qualified on page", value: qualified },
      { label: "Contacted on page", value: contacted }
    ];
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
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </div>
          ))}
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
