import { ReservationDashboard } from "@/types/reservation";

export async function getReservation(sessionId: string, signal?: AbortSignal): Promise<ReservationDashboard> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${apiUrl}/api/reservation/by-session?session_id=${sessionId}`,
    { signal }
  );
  if (!res.ok) throw new Error(`Failed to fetch reservation: ${res.status}`);
  return res.json();
}
