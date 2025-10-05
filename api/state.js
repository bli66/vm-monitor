import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  const state =
    (await redis.get("vm_state")) || {
      u1: false,
      u2: false,
      u3: false,
      u4: false,
      u5: false,
    };
  res.status(200).json(state);
}
