import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, FieldError, Input, Select } from "../ui";
import type { Lead, LeadPayload, LeadSource, LeadStatus } from "../../types/lead";

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];

interface LeadFormProps {
  lead?: Lead | null;
  loading: boolean;
  onSubmit(payload: LeadPayload): Promise<void>;
  onCancel(): void;
}

export const LeadForm = ({ lead, loading, onSubmit, onCancel }: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LeadPayload>({
    defaultValues: { name: "", email: "", status: "New", source: "Website" }
  });

  useEffect(() => {
    reset(
      lead
        ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source }
        : { name: "", email: "", status: "New", source: "Website" }
    );
  }, [lead, reset]);

  return (
    <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Name
          <Input {...register("name", { required: "Name is required", minLength: { value: 2, message: "Use at least 2 characters" } })} />
          <FieldError message={errors.name?.message} />
        </label>
        <label className="text-sm font-medium">
          Email
          <Input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" } })} />
          <FieldError message={errors.email?.message} />
        </label>
        <label className="text-sm font-medium">
          Status
          <Select {...register("status")}>{statuses.map((status) => <option key={status}>{status}</option>)}</Select>
        </label>
        <label className="text-sm font-medium">
          Source
          <Select {...register("source")}>{sources.map((source) => <option key={source}>{source}</option>)}</Select>
        </label>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" className="bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={loading}>{loading ? "Saving..." : lead ? "Update lead" : "Create lead"}</Button>
      </div>
    </form>
  );
};
