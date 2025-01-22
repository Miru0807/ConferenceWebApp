export async function getUserInformation(token) {
  const response = await fetch("http://localhost:3001/api/user/authToken", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return false;
}
