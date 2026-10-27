interface GetAvailabilityParams {
  vehicleTypeId: number;
  startTime: string;
  endTime: string;
}

export async function getAvailability({
  startTime,
  endTime,
  vehicleTypeId,
}: GetAvailabilityParams) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${apiUrl}/api/availability?startTime=${startTime}&endTime=${endTime}&vehicleTypeId=${vehicleTypeId}`
  );

  if (!res.ok) {
    throw new Error(`Failed to search reservation: ${res.status}`);
  }

  return await res.json();
}
