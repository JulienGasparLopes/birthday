const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://91.161.223.225:55555";

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

export type VoteChoice = "yes" | "maybe" | "no";
export type EventPart = "apres-midi" | "soiree" | "nuit" | "brunch";

export interface Vote {
  user_id: string;
  event_part: EventPart;
  choice: VoteChoice;
}

export async function setVote(userId: string, eventPart: EventPart, choice: VoteChoice): Promise<Vote> {
  const res = await fetch(`${API_BASE}/votes/set`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, event_part: eventPart, choice }),
  });
  if (!res.ok) throw new Error("Failed to set vote");
  return res.json();
}

export async function fetchUserVotes(userId: string): Promise<Vote[]> {
  const res = await fetch(`${API_BASE}/votes/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user votes");
  return res.json();
}

export async function fetchVoteCounts(): Promise<Record<string, Record<VoteChoice, number>>> {
  const res = await fetch(`${API_BASE}/votes/counts`);
  if (!res.ok) throw new Error("Failed to fetch vote counts");
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
