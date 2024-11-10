import axios from "axios";

export async function fetchFinvizScreenerRaw(filters: string) {
  try {
    const response = await axios.get<string>(
      `https://finviz.com/screener.ashx?${filters}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching screener.");
    return null;
  }
}
