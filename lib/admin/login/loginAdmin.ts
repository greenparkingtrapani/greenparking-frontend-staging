export async function loginAdmin(user: string, password: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, password }),
  });

  if (!res.ok) {
    throw new Error(`Failed to login: ${res.status}`);
  }
  const data = await res.json();
  return data.token;
}
