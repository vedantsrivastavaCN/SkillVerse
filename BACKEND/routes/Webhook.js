const express = require("express");

const router = express.Router();

// Minimal normalization: return everything after "skillverse/backend/" (case-insensitive)
function toRepoRelativeAfterBackend(inputPath) {
  if (!inputPath || typeof inputPath !== "string") return null;
  const normalized = inputPath.replace(/\\/g, "/");
  const lower = normalized.toLowerCase();
  const marker = "/skillverse/backend/";
  const idx = lower.indexOf(marker);
  if (idx !== -1) {
    const rel = normalized.slice(idx + marker.length);
    return rel || null;
  }
  // If marker not found, try starting from first occurrence of "/backend/"
  const backendOnly = "/backend/";
  const idxBackend = lower.indexOf(backendOnly);
  if (idxBackend !== -1) {
    return normalized.slice(idxBackend + backendOnly.length) || null;
  }
  // Fallback: as-is (may already be repo-relative)
  return normalized;
}

// Sentry webhook endpoint
router.post("/sentry", async (req, res) => {
  try {
    const payload = req.body || {};
    const rawPath = payload?.topFrame?.path || payload?.topFrame?.file || payload?.file || null;
    const repoRelativePath = toRepoRelativeAfterBackend(rawPath);
    return res.status(200).json({ received: true, repoRelativePath });
  } catch (error) {
    return res.status(500).json({ received: false });
  }
});

module.exports = router;


