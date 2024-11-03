export function extractFinvizTable(
  rawHtml: string
): Record<string, string | string>[] | null {
  const tableRegex =
    /<table[^>]*class="styled-table-new[^>]*>[\s\S]*?<\/table>/i;
  const tableMatch = rawHtml.match(tableRegex);

  if (!tableMatch) return null;

  const tableHtml = tableMatch[0];
  const headers = extractHeaders(tableHtml);
  const rows = extractRows(tableHtml);

  return rows.map((row) => {
    const rowObject: Record<string, string> = {};
    row.forEach((cell, index) => {
      rowObject[headers[index]] = cell;
    });

    return rowObject;
  });
}

const extractHeaders = (html: string): string[] => {
  const headerRegex = /<th[^>]*>([\s\S]*?)<\/th>/g;

  const headers: string[] = [];
  let headerMatch;

  while ((headerMatch = headerRegex.exec(html)) !== null) {
    const cleanHeader = headerMatch[1].replace(/<[^>]*>/g, "").trim();
    headers.push(cleanHeader);
  }

  return headers;
};

const extractRows = (html: string): string[][] => {
  const rowRegex = /<tr class="styled-row[^>]*>(.*?)<\/tr>/gs;
  const cellRegex = /<td[^>]*>(.*?)<\/td>/gs;
  const tickerRegex = /<a[^>]*class="tab-link"[^>]*>(.*?)<\/a>/;
  const priceRegex = /(?:>)([\d.,]+)/;

  const rows: string[][] = [];
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1];
    const cells: string[] = [];
    let cellIndex = 0;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(row)) !== null) {
      let cellContent = cellMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();

      // Extract ticker symbol for the second column
      if (cellIndex === 1) {
        const tickerMatch = cellMatch[1].match(tickerRegex);
        cellContent = tickerMatch ? tickerMatch[1] : cellContent;
      }

      // Correct the 11th column to capture the actual price value
      if (cellIndex === 10) {
        const priceMatch = cellMatch[1].match(priceRegex);
        cellContent = priceMatch ? priceMatch[1] : cellContent;
      }

      cells.push(cellContent.replace(" •", ""));
      cellIndex++;
    }

    rows.push(cells);
  }

  return rows;
};
