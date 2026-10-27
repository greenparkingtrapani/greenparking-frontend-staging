export interface TotalPriceResponse {
  total_price: number;
  discount: boolean;
}

export async function getTotalPrice({
  vehicleTypeId,
  startTime,
  endTime,
  signal,
}: {
  vehicleTypeId: number;
  startTime: string;
  endTime: string;
  signal?: AbortSignal;
}): Promise<TotalPriceResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const params = new URLSearchParams({
    vehicle_type_id: vehicleTypeId.toString(),
    start_time: startTime,
    end_time: endTime,
  });
  const res = await fetch(`${apiUrl}/api/total-price?${params.toString()}`, { signal });
  if (!res.ok) {
    throw new Error(`Error fetching total price: ${res.status}`);
  }
  const data = await res.json();
  return data as TotalPriceResponse;
}
