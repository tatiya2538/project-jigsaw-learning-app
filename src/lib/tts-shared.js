export const TTS_VOICE = "th-TH-PremwadeeNeural";
export const TTS_VOICE_LABEL = "Premwadee (Edge Neural)";

export function normalizeTtsParagraphs(paragraphs = []) {
  return paragraphs
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

export function buildTtsText(paragraphs = []) {
  return normalizeTtsParagraphs(paragraphs).join("\n\n");
}

export function buildTtsMeta(result, paragraphs = []) {
  const sourceText = result.sourceText || buildTtsText(paragraphs);

  return {
    url: result.url,
    hash: result.hash,
    voice: result.voice || TTS_VOICE,
    voiceLabel: result.voiceLabel || TTS_VOICE_LABEL,
    sourceText,
    generatedAt: new Date().toISOString(),
  };
}

export function isTtsUpToDate(paragraphs = [], ttsMeta = null) {
  if (!ttsMeta?.url || !ttsMeta?.sourceText) return false;
  return ttsMeta.sourceText === buildTtsText(paragraphs);
}
