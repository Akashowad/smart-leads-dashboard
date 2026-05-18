type CsvValue = string | number | Date | null | undefined;

const escapeCsv = (value: CsvValue): string => {
  const normalized = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${normalized.replace(/"/g, '""')}"`;
};

export const toCsv = (headers: string[], rows: CsvValue[][]): string => {
  const csvRows = [headers.map(escapeCsv).join(",")];
  for (const row of rows) csvRows.push(row.map(escapeCsv).join(","));
  return csvRows.join("\n");
};
