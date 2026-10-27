
export async function deleteAdminReservation(
  token: string,
  code: string,
  refund?: boolean
): Promise<Response> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}/admin/reservations/${code}?refund=${refund ? "true" : "false"}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete reservation: ${res.status}`);
  }

  return res;
}
