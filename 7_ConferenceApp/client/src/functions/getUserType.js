export function getUserType(value) {
  const roles = {
    0: "organizator",
    1: "author",
    2: "reviewer",
  };
  return roles[value] || "Invalid role";
}
