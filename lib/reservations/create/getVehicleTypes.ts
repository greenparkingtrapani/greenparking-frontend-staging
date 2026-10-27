export async function getVehicleTypes({ signal }: { signal?: AbortSignal } = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/vehicle-types`, { signal });

  if (!res.ok) {
    throw new Error(`Failed to fetch vehicle types: ${res.status}`);
  }
  return await res.json();
}
