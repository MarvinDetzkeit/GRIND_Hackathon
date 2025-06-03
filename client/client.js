const BACKEND_URL = "https://grind-hackathon.onrender.com"

export async function sendToBackend(payload, route) {
  return
  const res = await fetch(BACKEND_URL + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}
