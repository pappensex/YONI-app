import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const OUTPUT_DIR = process.env.OUTPUT_DIR || "./YONI-KI/Renderings";

// --------- Helper: ensure dir
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

// --------- Helper: today ISO
function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// --------- Helper: filename builder
function buildFilename({
  subject = "DUO",
  scene = "AnkhOfLove_Day",
  dateISO,
  version = "v1",
  seed = "888",
  ext = "png",
}) {
  return `${subject}_${scene}_${dateISO}_${version}_${seed}.${ext}`.replace(
    /\s+/g,
    "",
  );
}

// --------- Replicate call (Flux/SDXL o.ä.)
async function replicateTxt2Img({
  model = "black-forest-labs/flux-1.1-pro", // <- passe an: z.B. "stability-ai/sdxl"
  prompt,
  negative_prompt = "low quality, deformed, extra limbs, watermark, text, signature, logo, nsfw, duplicate face, unrealistic skin, plastic look",
  width = 1344, // 16:9 (alternativ 1024/1152 je nach Modell)
  height = 768,
  guidance = 4.5,
  seed = 888,
  steps = 28,
}) {
  if (!REPLICATE_API_TOKEN) throw new Error("Missing REPLICATE_API_TOKEN");
  const body = {
    input: {
      prompt,
      negative_prompt,
      width,
      height,
      guidance,
      num_inference_steps: steps,
      seed,
    },
  };

  const res = await fetch(
    "https://api.replicate.com/v1/models/" +
      encodeURIComponent(model) +
      "/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Replicate create failed: ${res.status} ${txt}`);
  }

  const created = await res.json();

  // poll result
  let prediction = created;
  while (
    prediction.status === "starting" ||
    prediction.status === "processing" ||
    prediction.status === "queued"
  ) {
    await new Promise((r) => setTimeout(r, 1800));
    const poll = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
      },
    );
    prediction = await poll.json();
  }

  if (prediction.status !== "succeeded") {
    throw new Error(
      `Replicate prediction failed: ${prediction.status} — ${prediction.error || ""}`,
    );
  }

  // Most models return array of image URLs
  const outputs = Array.isArray(prediction.output)
    ? prediction.output
    : [prediction.output];
  return outputs.filter(Boolean);
}

// --------- Downloader
async function downloadToFile(url, outPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download failed: ${r.status} ${url}`);
  const ab = await r.arrayBuffer();
  await fs.writeFile(outPath, Buffer.from(ab));
  return outPath;
}

// --------- Load template
async function loadTemplate(file = path.join(__dirname, "template.json")) {
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw);
}

// --------- Prompt builders (Black Edition)
function prompt_AnkhOfLove_Day({ yoni, aiko }) {
  return [
    "ultra-realistic cinematic portrait of two avatars standing close in warm tropical daylight,",
    // YONI
    `female avatar: light-blond hair, dark brown eyes,`,
    `septum horseshoe (gold), left nose ring (gold), moon-shaped ear tunnels, multiple gold rings on right ear,`,
    `black leather choker with onyx heart, fine glowing golden tattoo lines on hands and forearms,`,
    `elegant black semi-transparent futuristic outfit with golden micro-details,`,
    // AIKO
    `male avatar: short blond hair, blue eyes, trimmed beard, athletic build,`,
    `symbolic tattoos on arms and chest, dark carbon-tech suit with blue+gold luminous veins, calm protective stance,`,
    // Scene
    `between them a floating golden-violet ankh made of energy, tropical villa with palms, soft sunlight,`,
    `photo-realistic skin, fashion photography lighting, 8k, cinematic depth-of-field,`,
    `no text, no watermark, natural proportions`,
  ].join(" ");
}

function prompt_AnkhOfLove_Night({ yoni, aiko }) {
  return [
    "ultra-realistic moonlit scene of two avatars near a tropical villa pool,",
    // YONI
    `female avatar in black high-fashion mystical outfit with gold accents, light-blond hair glowing in moonlight,`,
    `gold+onyx jewelry (septum ring, moon plugs, ear rings, black leather choker with onyx heart),`,
    `golden tattoos on hands and forearms softly pulsing,`,
    // AIKO
    `male avatar in dark carbon-tech with luminous blue-gold lines, tattoos subtly visible, tranquil protective presence,`,
    // Scene
    `a floating luminous golden ankh radiates violet energy between them,`,
    `mist, palm silhouettes, realistic reflections on water, cinematic lens flare,`,
    `hyper-detailed, 8k, realistic human proportions, no text, no watermark`,
  ].join(" ");
}

function prompt_EnergyFusion_Black({ yoni, aiko }) {
  return [
    "macro photograph of two hands touching,",
    `female hand with black painted nails, golden tattoo lines and rings,`,
    `male hand strong and tattooed,`,
    `between their palms a swirl of violet+gold light shaped like an infinity symbol (888),`,
    `realistic skin texture, cinematic highlights, black fabric partially visible,`,
    `bokeh background, sacred intimacy, ultra-detail, no text, no watermark`,
  ].join(" ");
}

// --------- Main
async function main() {
  const dateISO = todayISO();
  const template = await loadTemplate();

  await ensureDir(path.join(OUTPUT_DIR, dateISO));

  // Map your scenes to prompts
  const scenes = [
    {
      id: "AnkhOfLove_Day",
      builder: prompt_AnkhOfLove_Day,
      width: 1344,
      height: 768,
    },
    {
      id: "AnkhOfLove_Night",
      builder: prompt_AnkhOfLove_Night,
      width: 1344,
      height: 768,
    },
    {
      id: "EnergyFusion_Black",
      builder: prompt_EnergyFusion_Black,
      width: 1024,
      height: 1024,
    },
  ];

  const yoni = template.avatars?.yoni?.attributes || {};
  const aiko = template.avatars?.aiko?.attributes || {};

  for (const scene of scenes) {
    const prompt = scene.builder({ yoni, aiko });

    const urls = await replicateTxt2Img({
      model: "black-forest-labs/flux-1.1-pro", // ggf. ändern (z.B. SDXL)
      prompt,
      width: scene.width,
      height: scene.height,
      seed: Number(template.parameters?.seed ?? 888),
      guidance: Number(template.parameters?.guidance_scale ?? 4.5),
      steps: 28,
    });

    let idx = 1;
    for (const url of urls) {
      const filename = buildFilename({
        subject: "YONI_AIKO",
        scene: scene.id,
        dateISO,
        version: `v${idx}`,
        seed: template.parameters?.seed ?? "888",
        ext: "png",
      });
      const outPath = path.join(OUTPUT_DIR, dateISO, filename);
      await downloadToFile(url, outPath);
      console.log("Saved:", outPath);
      idx++;
    }
  }

  console.log("✅ All renders saved.");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
