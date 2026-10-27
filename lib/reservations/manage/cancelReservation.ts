export async function cancelReservation(
  reservationCode: string
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/reservations/${reservationCode}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return;
  }

  if (!res.ok) {
    throw new Error(`Failed to cancel reservation: ${res.status}`);
  }
}
