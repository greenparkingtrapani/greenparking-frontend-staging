export async function putAdminConfig(
  token: string,
  vehicleType: string,
  config: {
    spaces: number;
    prices: { daily: number; hour: number };
  }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/admin/vehicle-config/${vehicleType}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    throw new Error(`Failed to update vehicle config: ${res.status}`);
  }

  return res.json();
}
