/**
 * EF-Compass state: responses (1-6), skill scoring, friction mappings,
 * and localStorage + JSON import/export.
 */
import { EXECUTIVE_SKILLS, RATING_SCALE, WORKSHEET_SCHEMAS } from "./data.js";

const STORAGE_KEY = "ef-compass:user-data";
export const EFFORT_LEVELS = ["low-effort", "high-effort"];
export const SCORE_MIN = 3;
export const SCORE_MAX = 18;

export const ratingScale = RATING_SCALE;
export const worksheetSchemas = WORKSHEET_SCHEMAS;

function createDefaultState() {
  return {
    profile: { name: "", age: "", context: "" },
    responses: {},            // { [itemId 1-36]: rating 1-6 }
    currentItem: 1,
    completed: false,
    theme: "system",
    frictionMappings: {},     // { [taskId]: { description, skillId, effort } }
    actionPlans: [],
    timeCalibratorLogs: [],
    postmortems: [],
    stressLogs: []
  };
}

/* ---------- persistence ---------- */

export function loadState() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) return normalizeState(JSON.parse(json));
  } catch (e) {
    console.warn("Failed to load EF-Compass state", e);
  }
  return createDefaultState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save EF-Compass state", e);
  }
  return state;
}

/** Merge unknown input onto defaults, keeping only valid shapes. */
function normalizeState(raw) {
  const base = createDefaultState();
  if (!raw || typeof raw !== "object") return base;
  const state = { ...base, ...raw };
  state.profile = { ...base.profile, ...(raw.profile || {}) };
  state.responses = {};
  for (const [id, value] of Object.entries(raw.responses || {})) {
    if (isValidItemId(Number(id)) && isValidRating(value)) state.responses[id] = value;
  }
  state.frictionMappings = {};
  for (const [id, m] of Object.entries(raw.frictionMappings || {})) {
    if (m && m.description && getSkillById(m.skillId) && EFFORT_LEVELS.includes(m.effort)) {
      state.frictionMappings[id] = { description: String(m.description), skillId: m.skillId, effort: m.effort };
    }
  }
  state.actionPlans = sanitizeRecords(raw.actionPlans, validateActionPlan, "createdAt");
  state.timeCalibratorLogs = sanitizeRecords(raw.timeCalibratorLogs, validateTimeLog, "completedAt");
  state.postmortems = sanitizeRecords(raw.postmortems, validatePostmortem, "createdAt", true);
  state.stressLogs = sanitizeRecords(raw.stressLogs, validateStressLog, "createdAt", true);
  return state;
}

/** Re-validate stored/imported records; drop invalid ones, keep ids and timestamps when present. */
function sanitizeRecords(list, validate, stampKey, uniqueIds = false) {
  if (!Array.isArray(list)) return [];
  const usedIds = new Set();
  return list.flatMap(item => {
    try {
      const data = validate(item || {});
      let id = typeof item.id === "string" && item.id ? item.id : newId();
      // CRUD addresses records by id, so imported duplicates need distinct identities.
      if (uniqueIds) {
        if (usedIds.has(id)) {
          const replacement = newId();
          id = replacement;
          let suffix = 1;
          while (usedIds.has(id)) id = `${replacement}-${suffix++}`;
        }
        usedIds.add(id);
      }
      return [{
        id,
        [stampKey]: typeof item[stampKey] === "string" ? item[stampKey] : new Date().toISOString(),
        ...data
      }];
    } catch {
      return [];
    }
  });
}

/* ---------- responses & scoring ---------- */

const ITEM_IDS = EXECUTIVE_SKILLS.flatMap(s => s.items.map(i => i.id));
export const TOTAL_ITEMS = ITEM_IDS.length;

export function isValidItemId(id) {
  return ITEM_IDS.includes(id);
}

export function isValidRating(value) {
  return RATING_SCALE.some(r => r.value === value);
}

export function getSkillById(skillId) {
  return EXECUTIVE_SKILLS.find(s => s.id === skillId) || null;
}

export function setResponse(state, itemId, rating) {
  if (!isValidItemId(itemId)) throw new Error(`Unknown item ${itemId}`);
  if (!isValidRating(rating)) throw new Error(`Rating ${rating} is out of range`);
  state.responses[itemId] = rating;
  return saveState(state);
}

export function answeredCount(state) {
  return Object.keys(state.responses).length;
}

export function isAssessmentComplete(state) {
  return answeredCount(state) === TOTAL_ITEMS;
}

/**
 * Per-skill totals. `total` is the sum of answered items (3-18 once all three
 * are answered); `complete` is false until all 3 items have a response.
 */
export function computeTotals(state) {
  const totals = {};
  for (const skill of EXECUTIVE_SKILLS) {
    const ratings = skill.items.map(i => state.responses[i.id]).filter(v => v !== undefined);
    totals[skill.id] = {
      total: ratings.reduce((a, b) => a + b, 0),
      answered: ratings.length,
      complete: ratings.length === skill.items.length
    };
  }
  return totals;
}

/** Ranked list of fully answered skills, lowest score first (ties keep data order). */
function rankedSkills(state) {
  const totals = computeTotals(state);
  return EXECUTIVE_SKILLS
    .filter(s => totals[s.id].complete)
    .map(s => ({ skillId: s.id, total: totals[s.id].total }))
    .sort((a, b) => a.total - b.total);
}

/** Higher score = stronger skill (items are positively worded). */
export function getStrengths(state, count = 3) {
  return rankedSkills(state).reverse().slice(0, count);
}

export function getWeaknesses(state, count = 3) {
  return rankedSkills(state).slice(0, count);
}

export function resetAssessment(state) {
  state.responses = {};
  state.currentItem = 1;
  state.completed = false;
  return saveState(state);
}

/* ---------- friction mappings (CRUD) ---------- */

function validateFriction({ description, skillId, effort }) {
  const text = typeof description === "string" ? description.trim() : "";
  if (!text) throw new Error("Task description is required");
  if (!getSkillById(skillId)) throw new Error(`Unknown skill ${skillId}`);
  if (!EFFORT_LEVELS.includes(effort)) throw new Error(`Effort must be one of: ${EFFORT_LEVELS.join(", ")}`);
  return { description: text, skillId, effort };
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addFriction(state, fields) {
  const mapping = validateFriction(fields);
  const taskId = newId();
  state.frictionMappings[taskId] = mapping;
  saveState(state);
  return { taskId, ...mapping };
}

export function getFriction(state, taskId) {
  const m = state.frictionMappings[taskId];
  return m ? { taskId, ...m } : null;
}

export function listFriction(state) {
  return Object.entries(state.frictionMappings).map(([taskId, m]) => ({ taskId, ...m }));
}

export function updateFriction(state, taskId, updates) {
  const existing = state.frictionMappings[taskId];
  if (!existing) throw new Error(`No friction mapping found for ${taskId}`);
  const mapping = validateFriction({ ...existing, ...updates });
  state.frictionMappings[taskId] = mapping;
  saveState(state);
  return { taskId, ...mapping };
}

export function deleteFriction(state, taskId) {
  if (!(taskId in state.frictionMappings)) return false;
  delete state.frictionMappings[taskId];
  saveState(state);
  return true;
}

/* ---------- action plans (CRUD) ---------- */

export const ACTION_PLAN_FIELDS = WORKSHEET_SCHEMAS.actionPlan.fields;
export const ACTION_PLAN_REQUIRED = ["targetSkillId", "situation", "goal", "microPractice", "cue"];

/** Validates against WORKSHEET_SCHEMAS.actionPlan; returns only schema fields, trimmed. */
export function validateActionPlan(fields = {}) {
  const plan = {};
  for (const { key, label } of ACTION_PLAN_FIELDS) {
    const value = typeof fields[key] === "string" ? fields[key].trim() : "";
    if (!value && ACTION_PLAN_REQUIRED.includes(key)) throw new Error(`${label} is required`);
    plan[key] = value;
  }
  if (!getSkillById(plan.targetSkillId)) throw new Error(`Unknown skill ${plan.targetSkillId}`);
  if (plan.targetDate && !isValidIsoDate(plan.targetDate)) {
    throw new Error("Target completion date must be a valid date");
  }
  return plan;
}

export function addActionPlan(state, fields) {
  const plan = { id: newId(), createdAt: new Date().toISOString(), ...validateActionPlan(fields) };
  state.actionPlans.push(plan);
  saveState(state);
  return { ...plan };
}

export function getActionPlan(state, id) {
  const plan = state.actionPlans.find(p => p.id === id);
  return plan ? { ...plan } : null;
}

export function listActionPlans(state) {
  return state.actionPlans.map(p => ({ ...p }));
}

export function updateActionPlan(state, id, updates) {
  const index = state.actionPlans.findIndex(p => p.id === id);
  if (index === -1) throw new Error(`No action plan found for ${id}`);
  const existing = state.actionPlans[index];
  state.actionPlans[index] = { id, createdAt: existing.createdAt, ...validateActionPlan({ ...existing, ...updates }) };
  saveState(state);
  return { ...state.actionPlans[index] };
}

export function deleteActionPlan(state, id) {
  const before = state.actionPlans.length;
  state.actionPlans = state.actionPlans.filter(p => p.id !== id);
  if (state.actionPlans.length === before) return false;
  saveState(state);
  return true;
}

/* ---------- time-estimation logs (CRUD, stored in state.timeCalibratorLogs) ---------- */

const round = (n, places) => Math.round(n * 10 ** places) / 10 ** places;

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return NaN;
}

/** variancePct is always computed here (never trusted from input): (actual - estimate) / estimate * 100. */
export function validateTimeLog({ taskName, estimatedMinutes, actualMinutes } = {}) {
  const name = typeof taskName === "string" ? taskName.trim() : "";
  if (!name) throw new Error("Task name is required");
  const estimated = toNumber(estimatedMinutes);
  if (!Number.isFinite(estimated) || estimated <= 0) throw new Error("Estimated minutes must be greater than 0");
  const actual = toNumber(actualMinutes);
  if (!Number.isFinite(actual) || actual < 0) throw new Error("Actual minutes must be 0 or more");
  const est = round(estimated, 2);
  const act = round(actual, 2);
  return { taskName: name, estimatedMinutes: est, actualMinutes: act, variancePct: round(((act - est) / est) * 100, 1) };
}

export function addTimeLog(state, fields) {
  const log = { id: newId(), completedAt: new Date().toISOString(), ...validateTimeLog(fields) };
  state.timeCalibratorLogs.push(log);
  saveState(state);
  return { ...log };
}

export function getTimeLog(state, id) {
  const log = state.timeCalibratorLogs.find(l => l.id === id);
  return log ? { ...log } : null;
}

export function listTimeLogs(state) {
  return state.timeCalibratorLogs.map(l => ({ ...l }));
}

export function updateTimeLog(state, id, updates) {
  const index = state.timeCalibratorLogs.findIndex(l => l.id === id);
  if (index === -1) throw new Error(`No time log found for ${id}`);
  const existing = state.timeCalibratorLogs[index];
  state.timeCalibratorLogs[index] = { id, completedAt: existing.completedAt, ...validateTimeLog({ ...existing, ...updates }) };
  saveState(state);
  return { ...state.timeCalibratorLogs[index] };
}

export function deleteTimeLog(state, id) {
  const before = state.timeCalibratorLogs.length;
  state.timeCalibratorLogs = state.timeCalibratorLogs.filter(l => l.id !== id);
  if (state.timeCalibratorLogs.length === before) return false;
  saveState(state);
  return true;
}

/* ---------- postmortems (CRUD, validated against WORKSHEET_SCHEMAS.learningFromMistakes) ---------- */

/** Strict YYYY-MM-DD check that rejects roll-over dates such as 2026-02-31. */
export function isValidIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof value === "string" ? value : "");
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  // Date.UTC treats years 0-99 as 1900-1999; set the full year explicitly.
  const d = new Date(0);
  d.setUTCFullYear(year, month - 1, day);
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

export const POSTMORTEM_FIELDS = WORKSHEET_SCHEMAS.learningFromMistakes.fields;
export const POSTMORTEM_REQUIRED = ["situation", "whatWentWrong", "nextTime"];

/** Returns only schema fields, trimmed; required ones must be non-empty. */
export function validatePostmortem(fields = {}) {
  const pm = {};
  for (const { key, label } of POSTMORTEM_FIELDS) {
    if (fields[key] !== undefined && typeof fields[key] !== "string") {
      throw new Error(`${label} must be text`);
    }
    const value = (fields[key] ?? "").trim();
    if (!value && POSTMORTEM_REQUIRED.includes(key)) throw new Error(`${label} is required`);
    pm[key] = value;
  }
  return pm;
}

export function addPostmortem(state, fields) {
  const pm = { id: newId(), createdAt: new Date().toISOString(), ...validatePostmortem(fields) };
  state.postmortems.push(pm);
  saveState(state);
  return { ...pm };
}

export function getPostmortem(state, id) {
  const pm = state.postmortems.find(p => p.id === id);
  return pm ? { ...pm } : null;
}

export function listPostmortems(state) {
  return state.postmortems.map(p => ({ ...p }));
}

export function updatePostmortem(state, id, updates) {
  const index = state.postmortems.findIndex(p => p.id === id);
  if (index === -1) throw new Error(`No postmortem found for ${id}`);
  const existing = state.postmortems[index];
  state.postmortems[index] = { id, createdAt: existing.createdAt, ...validatePostmortem({ ...existing, ...updates }) };
  saveState(state);
  return { ...state.postmortems[index] };
}

export function deletePostmortem(state, id) {
  const before = state.postmortems.length;
  state.postmortems = state.postmortems.filter(p => p.id !== id);
  if (state.postmortems.length === before) return false;
  saveState(state);
  return true;
}

/* ---------- stress-reset logs (CRUD): date, strategy, durationMinutes, notes ---------- */

export const STRESS_DURATION_MAX = 1440; // minutes in a day

export function validateStressLog({ date, strategy, durationMinutes, notes } = {}) {
  const day = typeof date === "string" ? date.trim() : "";
  if (!isValidIsoDate(day)) throw new Error("Date must be a valid date (YYYY-MM-DD)");
  const name = typeof strategy === "string" ? strategy.trim() : "";
  if (!name) throw new Error("Strategy is required");
  const minutes = toNumber(durationMinutes);
  const roundedMinutes = round(minutes, 2);
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > STRESS_DURATION_MAX || roundedMinutes <= 0) {
    throw new Error(`Duration must be greater than 0 (rounded to two decimals) and at most ${STRESS_DURATION_MAX} minutes`);
  }
  if (notes !== undefined && typeof notes !== "string") throw new Error("Notes must be text");
  return {
    date: day,
    strategy: name,
    durationMinutes: roundedMinutes,
    notes: (notes ?? "").trim()
  };
}

export function addStressLog(state, fields) {
  const log = { id: newId(), createdAt: new Date().toISOString(), ...validateStressLog(fields) };
  state.stressLogs.push(log);
  saveState(state);
  return { ...log };
}

export function getStressLog(state, id) {
  const log = state.stressLogs.find(l => l.id === id);
  return log ? { ...log } : null;
}

export function listStressLogs(state) {
  return state.stressLogs.map(l => ({ ...l }));
}

export function updateStressLog(state, id, updates) {
  const index = state.stressLogs.findIndex(l => l.id === id);
  if (index === -1) throw new Error(`No stress log found for ${id}`);
  const existing = state.stressLogs[index];
  state.stressLogs[index] = { id, createdAt: existing.createdAt, ...validateStressLog({ ...existing, ...updates }) };
  saveState(state);
  return { ...state.stressLogs[index] };
}

export function deleteStressLog(state, id) {
  const before = state.stressLogs.length;
  state.stressLogs = state.stressLogs.filter(l => l.id !== id);
  if (state.stressLogs.length === before) return false;
  saveState(state);
  return true;
}

/* ---------- JSON export / import ---------- */

export function exportData(state) {
  return JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      ...state,
      skillTotals: computeTotals(state),
      strengths: getStrengths(state),
      weaknesses: getWeaknesses(state)
    },
    null,
    2
  );
}

/** Parse, validate and persist an exported JSON string. Derived fields are recomputed, not trusted. */
export function importData(jsonString) {
  let incoming;
  try {
    incoming = JSON.parse(jsonString);
  } catch {
    throw new Error("Invalid JSON supplied for import");
  }
  if (!incoming || typeof incoming.responses !== "object" || incoming.responses === null) {
    throw new Error("Imported data is missing a 'responses' object");
  }
  const state = normalizeState(incoming);
  state.completed = isAssessmentComplete(state);
  return saveState(state);
}
