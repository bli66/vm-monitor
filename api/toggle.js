import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing id" });

  let state =
    (await redis.get("vm_state")) || {
      u1: false,
      u2: false,
      u3: false,
      u4: false,
      u5: false,
    };

  state[id] = !state[id];
  await redis.set("vm_state", state);

  res.status(200).json(state);
}
