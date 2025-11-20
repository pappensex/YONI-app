export const config = { runtime: "edge" };

export default async function handler(req) {
  const { scene = "AnkhOfLove_Day" } = await req.json();
  const seed = 888;
  const model = "black-forest-labs/flux-1.1-pro";

  const promptMap = {
    AnkhOfLove_Day: `ultra-realistic cinematic portrait ... (Day version)`,
    AnkhOfLove_Night: `ultra-realistic moonlit scene ... (Night version)`,
    EnergyFusion_Black: `macro photograph of two hands ...`,
  };

  const body = {
    input: {
      prompt: promptMap[scene],
      width: 1344,
      height: 768,
      guidance: 4.5,
      num_inference_steps: 28,
      seed,
    },
  };

  const r = await fetch(
    `https://api.replicate.com/v1/models/${model}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const data = await r.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
