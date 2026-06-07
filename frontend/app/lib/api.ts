const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

export interface ApiUser {
  id: string;
  name: string;
}

export interface Participation {
  id: string;
  user_id: string;
  participation_type: string;
  participation_amount: { unit: "liquid" | "unit"; amount: number };
}

interface ParticipationAmount {
  unit: "liquid" | "unit";
  amount: number;
}

export interface Stock {
  participation_amount: ParticipationAmount;
  participation_type: string;
  goal_amount: ParticipationAmount;
  achieved_amount: ParticipationAmount;
}

export async function fetchUsers(): Promise<ApiUser[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchStocks(): Promise<Record<string, Stock>> {
  const res = await fetch(`${API_BASE}/participations/stocks`);
  if (!res.ok) throw new Error("Failed to fetch stocks");
  return res.json();
}

export async function fetchUserParticipations(userId: string): Promise<Participation[]> {
  const res = await fetch(`${API_BASE}/participations/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user participations");
  return res.json();
}

export async function addParticipation(
  userId: string,
  participationType: string,
  amount: number,
  unit: "liquid" | "unit"
): Promise<Participation> {
  const res = await fetch(`${API_BASE}/participations/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      participation_type: participationType,
      participation_amount: amount,
      participation_unit: unit,
    }),
  });
  if (!res.ok) throw new Error("Failed to add participation");
  return res.json();
}
