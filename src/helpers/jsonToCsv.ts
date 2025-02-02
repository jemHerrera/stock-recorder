export function jsonToCsv(json: any[]): string {
  const headers = Object.keys(json[0]).join(",") + "\n";
  const rows = json.map((row) => Object.values(row).join(",")).join("\n");
  return headers + rows;
}
