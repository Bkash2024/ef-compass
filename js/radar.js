/**
 * 12-axis Executive Function radar chart (pure SVG string generator).
 * Axis values are skill totals on the 3-18 scale.
 */
import { EXECUTIVE_SKILLS } from "./data.js";
import { SCORE_MAX } from "./state.js";

const SIZE = 440;
const CENTER = SIZE / 2;
const RADIUS = 150;
const LABEL_OFFSET = 18;
const LEVELS = 6; // rings at 3, 6, 9, 12, 15, 18
// Horizontal padding so long labels ("Metacognition", "Persistence") never clip at either edge.
const PAD_X = 64;

function point(index, count, r) {
  const angle = (index * 2 * Math.PI) / count - Math.PI / 2;
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle), cos: Math.cos(angle) };
}

function anchorFor(cos) {
  if (cos > 0.2) return "start";
  if (cos < -0.2) return "end";
  return "middle";
}

const escapeXml = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** @param totals result of computeTotals(): { [skillId]: { total } } */
export function generateRadar(totals) {
  const n = EXECUTIVE_SKILLS.length;
  const labels = [];
  const parts = [`<svg viewBox="${-PAD_X} 0 ${SIZE + 2 * PAD_X} ${SIZE}" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Executive function radar chart. Select a skill label to open its guide.">`];

  for (let level = 1; level <= LEVELS; level++) {
    const pts = EXECUTIVE_SKILLS.map((_, i) => point(i, n, (RADIUS * level) / LEVELS)).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    parts.push(`<polygon class="radar-grid" points="${pts.join(" ")}"/>`);
  }

  EXECUTIVE_SKILLS.forEach((skill, i) => {
    const edge = point(i, n, RADIUS);
    const label = point(i, n, RADIUS + LABEL_OFFSET);
    parts.push(`<line class="radar-axis" x1="${CENTER}" y1="${CENTER}" x2="${edge.x.toFixed(1)}" y2="${edge.y.toFixed(1)}"/>`);
    // Labels are drawn after the data so the polygon never intercepts their clicks.
    labels.push(`<a href="#stage-guide" class="radar-link" data-skill-id="${escapeXml(skill.id)}" aria-label="Open ${escapeXml(skill.name)} guide"><text class="radar-label" x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="${anchorFor(label.cos)}" dominant-baseline="middle">${escapeXml(skill.shortName)}</text></a>`);
  });

  const dataPts = EXECUTIVE_SKILLS.map((skill, i) => {
    const total = totals[skill.id]?.total ?? 0;
    return point(i, n, (Math.min(total, SCORE_MAX) / SCORE_MAX) * RADIUS);
  });
  parts.push(`<polygon class="radar-area" points="${dataPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}"/>`);
  dataPts.forEach(p => parts.push(`<circle class="radar-point" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4"/>`));

  parts.push(...labels, "</svg>");
  return parts.join("");
}
