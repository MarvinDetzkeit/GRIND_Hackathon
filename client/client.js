const BACKEND_URL = "http://localhost:3001";

export async function sendToBackend(payload, route) {
  const res = await fetch(BACKEND_URL + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}
