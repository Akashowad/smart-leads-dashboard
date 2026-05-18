import { Download, Search } from "lucide-react";
import { Button, Input, Select } from "../ui";
import type { LeadFilters, LeadSource, LeadStatus } from "../../types/lead";

interface LeadFiltersProps {
  filters: LeadFilters;
  searchValue: string;
  exporting: boolean;
  onFilterChange(filters: Partial<LeadFilters>): void;
  onSearchChange(value: string): void;
  onExport(): void;
}

const statuses: Array<LeadStatus | ""> = ["", "New", "Contacted", "Qualified", "Lost"];
const sources: Array<LeadSource | ""> = ["", "Website", "Instagram", "Referral"];

export const LeadFiltersBar = ({ filters, searchValue, exporting, onFilterChange, onSearchChange, onExport }: LeadFiltersProps) => (
  <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <Input className="pl-9" placeholder="Search name or email" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} />
    </div>
    <Select value={filters.status} onChange={(event) => onFilterChange({ status: event.target.value as LeadStatus | "" })}>
      {statuses.map((status) => <option key={status} value={status}>{status || "All statuses"}</option>)}
    </Select>
    <Select value={filters.source} onChange={(event) => onFilterChange({ source: event.target.value as LeadSource | "" })}>
      {sources.map((source) => <option key={source} value={source}>{source || "All sources"}</option>)}
    </Select>
    <Select value={filters.sort} onChange={(event) => onFilterChange({ sort: event.target.value as LeadFilters["sort"] })}>
      <option value="latest">Latest first</option>
      <option value="oldest">Oldest first</option>
    </Select>
    <Button type="button" className="bg-slate-900 hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950" disabled={exporting} onClick={onExport}>
      <Download size={16} /> {exporting ? "Exporting..." : "CSV"}
    </Button>
  </div>
);
