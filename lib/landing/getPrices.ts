import { Price } from "@/types/reservation";

export async function getPrices({ signal }: { signal?: AbortSignal } = {}): Promise<Price[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/prices`, { signal });

  if (!res.ok) {
   throw new Error(`Failed to fetch prices: ${res.status}`);
  }

  return  res.json();
}
