import { Edit, Trash2 } from "lucide-react";
import type { Lead } from "../../types/lead";
import { Button } from "../ui";

const statusStyle: Record<Lead["status"], string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100",
  Contacted: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-100",
  Qualified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100",
  Lost: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-100"
};

export const LeadTable = ({
  leads,
  canDelete,
  onEdit,
  onDelete
}: {
  leads: Lead[];
  canDelete: boolean;
  onEdit(lead: Lead): void;
  onDelete(id: string): void;
}) => (
  <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-100 text-left text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <td className="px-4 py-3">
                <p className="font-semibold">{lead.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{lead.email}</p>
              </td>
              <td className="px-4 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyle[lead.status]}`}>{lead.status}</span></td>
              <td className="px-4 py-3">{lead.source}</td>
              <td className="px-4 py-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button className="h-9 w-9 bg-slate-100 p-0 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100" onClick={() => onEdit(lead)} aria-label={`Edit ${lead.name}`}>
                    <Edit size={16} />
                  </Button>
                  {canDelete ? (
                    <Button className="h-9 w-9 bg-red-600 p-0 hover:bg-red-700" onClick={() => onDelete(lead._id)} aria-label={`Delete ${lead.name}`}>
                      <Trash2 size={16} />
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
