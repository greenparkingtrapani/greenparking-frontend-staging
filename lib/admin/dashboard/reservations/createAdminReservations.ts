import {ReservationPayload} from "@/types/reservation";

export async function createAdminReservation(token: string, data: ReservationPayload) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const res = await fetch(`${apiUrl}/admin/reservations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create reservation: ${res.status}`);
  }

  return res.json();
}