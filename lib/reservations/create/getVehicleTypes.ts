export async function getVehicleTypes({
  signal,
}: {
  signal?: AbortSignal;
} = {}) {
  const res = await fetch("/api/vehicle-types", { signal });

  if (!res.ok) {
    throw new Error(`Failed to fetch vehicle types: ${res.status}`);
  }

  return await res.json();
}
