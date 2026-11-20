/**
 * EF-Compass UI: profile, assessment, results, friction, execution, and reflection.
 */
import { EXECUTIVE_SKILLS, RATING_SCALE, WORKSHEET_SCHEMAS } from "./data.js";
import {
  EFFORT_LEVELS, SCORE_MAX, SCORE_MIN, TOTAL_ITEMS,
  loadState, saveState, setResponse, computeTotals, getWeaknesses, getStrengths,
  isAssessmentComplete, resetAssessment, getSkillById,
  addFriction, updateFriction, deleteFriction, listFriction,
  ACTION_PLAN_REQUIRED, addActionPlan, deleteActionPlan, listActionPlans,
  validateTimeLog, addTimeLog, deleteTimeLog, listTimeLogs,
  POSTMORTEM_REQUIRED, addPostmortem, deletePostmortem, listPostmortems,
  addStressLog, deleteStressLog, listStressLogs,
  exportData, importData
} from "./state.js";
import { generateRadar } from "./radar.js";

const ITEMS = EXECUTIVE_SKILLS.flatMap(skill => skill.items.map(item => ({ ...item, skillId: skill.id })));
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const effortLabel = e => (e === "high-effort" ? "High-effort" : "Low-effort");

let state = loadState();
let currentStep = 1;
let advanceTimer = null;

const el = {
  navSteps: document.querySelectorAll(".nav-step"),
  stages: { 1: $("stage-profile"), 2: $("stage-assessment"), 3: $("stage-results"), 4: $("stage-friction"), 5: $("stage-execute"), 6: $("stage-reflect"), 7: $("stage-guide") },
  profileName: $("profile-name"), profileAge: $("profile-age"), profileContext: $("profile-context"),
  progressFill: $("progress-fill"), currentQuestion: $("current-question"), totalQuestions: $("total-questions"),
  questionSkill: $("question-skill"), questionText: $("question-text"), questionContext: $("question-context"),
  scaleOptions: $("scale-options"), scaleSelectedLabel: $("scale-selected-label"),
  btnPrev: $("btn-prev-question"), btnNext: $("btn-next-question"), btnSpeech: $("btn-speech"),
  resultsSubtitle: $("results-subtitle"), radarChart: $("radar-chart"), radarLegend: $("radar-legend"), skillsBreakdown: $("skills-breakdown"),
  frictionForm: $("friction-form"), frictionDesc: $("friction-desc"), frictionSkill: $("friction-skill"), frictionEffort: $("friction-effort"),
  frictionList: $("friction-list"), frictionCoping: $("friction-coping"),
  planForm: $("plan-form"), planFields: $("plan-fields"), planList: $("plan-list"), btnSpeakCue: $("btn-speak-cue"),
  timerTask: $("timer-task"), timerEstimate: $("timer-estimate"), stopwatchDisplay: $("stopwatch-display"),
  btnWatchStart: $("btn-watch-start"), btnWatchPause: $("btn-watch-pause"), btnWatchComplete: $("btn-watch-complete"),
  timelogList: $("timelog-list"),
  pmForm: $("pm-form"), pmFields: $("pm-fields"), pmList: $("pm-list"),
  breathOrb: $("breath-orb"), breathLabel: $("breath-label"), breathCount: $("breath-count"), breathClock: $("breath-clock"),
  btnBreathStart: $("btn-breath-start"), btnBreathStop: $("btn-breath-stop"),
  stressForm: $("stress-form"), stressDate: $("stress-date"), stressStrategy: $("stress-strategy"),
  stressDuration: $("stress-duration"), stressNotes: $("stress-notes"), stressList: $("stress-list"),
  guideSelector: $("guide-selector"), guideInterpreter: $("guide-interpreter"), guideTabs: $("guide-tabs"),
  guidePanel: $("guide-panel"), guideQuiz: $("guide-quiz"), guideFeedback: $("guide-feedback"), guideSpeech: $("btn-guide-speech"),
  importFile: $("import-file")
};

/* ---------- navigation ---------- */

function navigateToStep(step) {
  clearTimeout(advanceTimer);
  stopSpeaking();
  stopBreathing();
  currentStep = step;
  el.navSteps.forEach(btn => {
    const s = Number(btn.dataset.step);
    btn.classList.toggle("active", s === step);
    btn.classList.toggle("completed", s < step);
  });
  Object.entries(el.stages).forEach(([s, node]) => node.classList.toggle("active", Number(s) === step));
  if (step === 2) renderQuestion();
  if (step === 3) renderResults();
  if (step === 4) renderFriction();
  if (step === 5) renderExecute();
  if (step === 6) renderReflect();
  if (step === 7) renderGuide();
}

function initialStep() {
  if (isAssessmentComplete(state)) return 3;
  if (Object.keys(state.responses).length > 0) return 2;
  return 1;
}

/* ---------- profile ---------- */

function renderProfile() {
  el.profileName.value = state.profile.name || "";
  el.profileAge.value = state.profile.age || "";
  el.profileContext.value = state.profile.context || "";
}

function updateProfile(field, value) {
  state.profile[field] = value;
  saveState(state);
}

function startAssessment() {
  if (!state.profile.name.trim()) {
    el.profileName.focus();
    return;
  }
  state.currentItem = Math.min(Math.max(state.currentItem, 1), TOTAL_ITEMS);
  saveState(state);
  navigateToStep(2);
}

/* ---------- assessment ---------- */

function renderScale() {
  el.scaleOptions.innerHTML = RATING_SCALE
    .map(r => `<button type="button" class="scale-btn" data-value="${r.value}" title="${esc(r.label)}">${r.value}</button>`)
    .join("");
}

function renderQuestion() {
  const index = state.currentItem;
  const item = ITEMS[index - 1];
  if (!item) return;
  const skill = getSkillById(item.skillId);
  const saved = state.responses[item.id];

  el.progressFill.style.width = `${((index - 1) / TOTAL_ITEMS) * 100}%`;
  el.currentQuestion.textContent = index;
  el.totalQuestions.textContent = TOTAL_ITEMS;
  el.questionSkill.textContent = skill.name;
  el.questionText.textContent = item.text;
  el.questionContext.textContent = skill.description;

  el.scaleOptions.querySelectorAll(".scale-btn").forEach(btn =>
    btn.classList.toggle("selected", Number(btn.dataset.value) === saved));
  el.scaleSelectedLabel.textContent = saved ? RATING_SCALE.find(r => r.value === saved).label : "";

  el.btnPrev.disabled = index === 1;
  el.btnNext.disabled = !saved;
  el.btnNext.firstChild.textContent = index === TOTAL_ITEMS ? "See Results " : "Next ";
  stopSpeaking();
}

function selectResponse(value) {
  const item = ITEMS[state.currentItem - 1];
  if (!item) return;
  setResponse(state, item.id, value);
  renderQuestion();
  clearTimeout(advanceTimer);
  if (state.currentItem < TOTAL_ITEMS) advanceTimer = setTimeout(nextQuestion, 300);
}

function prevQuestion() {
  if (state.currentItem > 1) {
    state.currentItem -= 1;
    saveState(state);
    renderQuestion();
  }
}

function nextQuestion() {
  clearTimeout(advanceTimer);
  if (currentStep !== 2) return;
  if (state.currentItem < TOTAL_ITEMS) {
    state.currentItem += 1;
    saveState(state);
    renderQuestion();
  } else if (isAssessmentComplete(state)) {
    state.completed = true;
    saveState(state);
    navigateToStep(3);
  }
}

/* ---------- speech ---------- */

function speakQuestion() {
  if (!("speechSynthesis" in window)) return;
  if (speechSynthesis.speaking) return stopSpeaking();
  const item = ITEMS[state.currentItem - 1];
  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.rate = 0.9;
  utterance.onstart = () => el.btnSpeech.classList.add("speaking");
  utterance.onend = () => el.btnSpeech.classList.remove("speaking");
  speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  document.querySelectorAll(".speaking").forEach(btn => btn.classList.remove("speaking"));
}

/* ---------- results ---------- */

function scoreClass(total) {
  if (total >= 14) return "high";
  if (total >= 9) return "medium";
  return "low";
}

function renderResults() {
  const totals = computeTotals(state);
  const strengths = getStrengths(state).map(s => getSkillById(s.skillId).name);
  const weaknesses = getWeaknesses(state).map(s => getSkillById(s.skillId).name);

  el.resultsSubtitle.textContent = state.profile.name ? `Profile for ${state.profile.name}` : "";
  el.radarChart.innerHTML = generateRadar(totals);
  el.radarLegend.innerHTML = EXECUTIVE_SKILLS
    .map(s => `<div class="legend-item"><strong>${esc(s.shortName)}</strong> ${esc(s.name)}</div>`).join("");

  const summary = strengths.length
    ? `<div class="skill-card summary-card">
         <p><strong>Top strengths:</strong> ${strengths.map(esc).join(", ")}</p>
         <p><strong>Biggest challenges:</strong> ${weaknesses.map(esc).join(", ")}</p>
       </div>`
    : `<div class="skill-card summary-card"><p>Answer all ${TOTAL_ITEMS} items to see strengths and challenges.</p></div>`;

  el.skillsBreakdown.innerHTML = summary + EXECUTIVE_SKILLS.map(skill => {
    const { total, complete } = totals[skill.id];
    const pct = (total / SCORE_MAX) * 100;
    return `<button type="button" class="skill-card skill-card-link" data-skill-id="${esc(skill.id)}" aria-label="Open ${esc(skill.name)} guide, ${complete ? `${total} out of ${SCORE_MAX}` : "score incomplete"}">
      <span class="skill-header">
        <span class="skill-name">${esc(skill.name)}</span>
        <span class="skill-score">${complete ? total : "–"}/${SCORE_MAX}</span>
      </span>
      <span class="skill-bar"><span class="skill-fill ${complete ? scoreClass(total) : ""}" style="width:${complete ? pct : 0}%"></span></span>
      <span class="skill-description">${esc(skill.description)}</span>
    </button>`;
  }).join("");
}

/* ---------- executive function field guide ---------- */

let guideSkillId = EXECUTIVE_SKILLS[0].id;
let guideTab = "profile";

// Each rule describes the relative rankings required by that specific insight.
// Unconditional/general observations remain available under Brain & Patterns.
const PAIR_RULES = {
  response_inhibition: { emotional_control: ["low", "low"], metacognition: ["low", "high"] },
  working_memory: { organization: ["low", "high"] },
  emotional_control: { flexibility: ["low", "low"], response_inhibition: ["low", "low"] },
  task_initiation: { goal_directed_persistence: ["low", "high"], planning_prioritizing: ["low", "high"] },
  sustained_attention: { flexibility: ["low", "high"], task_initiation: ["low", "low"] },
  planning_prioritizing: { organization: ["high", "low"], time_management: ["high", "high"] },
  organization: { flexibility: ["high", "low"], working_memory: ["low", "low"] },
  time_management: { flexibility: ["high", "low"] },
  flexibility: { emotional_control: ["low", "low"], time_management: ["high", "low"] },
  metacognition: { response_inhibition: ["high", "low"] },
  goal_directed_persistence: { task_initiation: ["high", "low"] }
};

function guideRankings() {
  if (!isAssessmentComplete(state)) return null;
  return {
    high: new Set(getStrengths(state).map(s => s.skillId)),
    low: new Set(getWeaknesses(state).map(s => s.skillId))
  };
}

function activePairPatterns(skill, rankings) {
  if (!rankings) return [];
  return skill.pairedPatterns.filter(pattern => {
    const rule = PAIR_RULES[skill.id]?.[pattern.partnerSkillId];
    return rule && rankings[rule[0]].has(skill.id) && rankings[rule[1]].has(pattern.partnerSkillId);
  });
}

function openGuide(skillId) {
  if (!getSkillById(skillId)) return;
  guideSkillId = skillId;
  navigateToStep(7);
}

function guideList(items) {
  return `<ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function renderGuidePanel(skill) {
  if (guideTab === "profile") {
    el.guidePanel.innerHTML = `<div class="guide-grid">
      <div><h3>When this skill is strong</h3><p>${esc(skill.highProfile)}</p></div>
      <div><h3>When this skill is challenging</h3><p>${esc(skill.lowProfile)}</p></div>
      <div><h3>At work</h3><p>${esc(skill.workImpact)}</p></div>
      <div><h3>At home</h3><p>${esc(skill.homeImpact)}</p></div>
    </div>`;
  } else if (guideTab === "brain") {
    el.guidePanel.innerHTML = `<h3>Dimension: ${esc(skill.dimension)}</h3><p>${esc(skill.brainMechanic)}</p>
      <h3>Patterns to consider</h3>
      ${guideList(skill.pairedPatterns.map(p => `${getSkillById(p.partnerSkillId)?.name || p.partnerSkillId}: ${p.insight}`))}`;
  } else {
    el.guidePanel.innerHTML = `<h3>Adjust the environment</h3>${guideList(skill.environmentMods)}
      <h3>Adapt the task</h3>${guideList(skill.taskMods)}
      <h3>Build coping strategies</h3>${guideList(skill.copingStrategies)}`;
  }
}

function renderGuide() {
  const skill = getSkillById(guideSkillId);
  const score = computeTotals(state)[skill.id];
  const rankings = guideRankings();
  const label = rankings ? (rankings.high.has(skill.id) ? "Strength" : rankings.low.has(skill.id) ? "Friction Area" : "Balanced") : "Not ranked yet";
  const pairs = activePairPatterns(skill, rankings);
  el.guideSelector.innerHTML = EXECUTIVE_SKILLS.map(s =>
    `<button type="button" data-skill-id="${esc(s.id)}" aria-pressed="${s.id === skill.id}">${esc(s.shortName)}</button>`).join("");
  el.guideInterpreter.innerHTML = `<div class="guide-score-card">
    <div class="guide-score-heading"><div><p class="guide-eyebrow">Your skill profile</p><h2>${esc(skill.name)}</h2></div>
      <div class="guide-score">${score.complete ? score.total : "–"}<span> / ${SCORE_MAX}</span></div></div>
    <span class="guide-badge">${esc(label)}</span>
    <p>${esc(skill.description)}</p>
    ${!score.complete ? `<p class="guide-note">Answer all three ${esc(skill.name)} questions to see its score (${score.answered}/3 answered).</p>` : ""}
    ${!rankings ? "<p class=\"guide-note\">Complete all 36 questions to see your relative ranking and matching patterns.</p>" : ""}
    ${rankings ? `<div class="guide-pairs"><h3>Matching paired patterns</h3>${pairs.length ? guideList(pairs.map(p => `${getSkillById(p.partnerSkillId).name}: ${p.insight}`)) : "<p>No listed patterns match your current top and bottom three. Explore other possibilities under Brain &amp; Patterns.</p>"}</div>` : ""}
    <button type="button" class="btn-primary" id="btn-guide-plan">Build Action Plan for this Skill →</button>
  </div>`;
  el.guideTabs.querySelectorAll("button").forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.guideTab === guideTab)));
  renderGuidePanel(skill);
  el.guideQuiz.innerHTML = `<p class="guide-question">${esc(skill.quickCheck.question)}</p><div class="guide-answers">${skill.quickCheck.options.map((option, i) =>
    `<button type="button" data-answer="${i}" aria-pressed="false">${esc(option)}</button>`).join("")}</div>`;
  el.guideFeedback.textContent = "";
}

function onGuideSelection(e) {
  const button = e.target.closest("button[data-skill-id]");
  if (!button || !getSkillById(button.dataset.skillId)) return;
  stopSpeaking();
  guideSkillId = button.dataset.skillId;
  renderGuide();
  el.guideSelector.querySelector(`[data-skill-id="${guideSkillId}"]`).focus();
}

function onGuideTab(e) {
  const button = e.target.closest("button[data-guide-tab]");
  if (!button) return;
  guideTab = button.dataset.guideTab;
  el.guideTabs.querySelectorAll("button").forEach(btn => btn.setAttribute("aria-pressed", String(btn === button)));
  renderGuidePanel(getSkillById(guideSkillId));
}

function onGuideQuiz(e) {
  const button = e.target.closest("button[data-answer]");
  if (!button) return;
  const quiz = getSkillById(guideSkillId).quickCheck;
  const correct = Number(button.dataset.answer) === quiz.answerIndex;
  el.guideQuiz.querySelectorAll("button").forEach(btn => btn.setAttribute("aria-pressed", String(btn === button)));
  el.guideFeedback.textContent = `${correct ? "Correct!" : "Not quite."} ${quiz.explanation}`;
}

function guideToPlan() {
  navigateToStep(5);
  $("plan-targetSkillId").value = guideSkillId;
  planSkillTouched = true;
  $("plan-targetSkillId").focus();
}

/* ---------- friction map ---------- */

function renderFrictionSkillOptions() {
  el.frictionSkill.innerHTML = '<option value="">Select a skill…</option>' +
    EXECUTIVE_SKILLS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
}

function renderFriction() {
  const tasks = listFriction(state);

  el.frictionList.innerHTML = tasks.length
    ? tasks.map(t => `<li class="friction-item" data-task-id="${esc(t.taskId)}">
        <div class="friction-main">
          <span class="friction-desc">${esc(t.description)}</span>
          <span class="friction-skill">${esc(getSkillById(t.skillId).name)}</span>
        </div>
        <button type="button" class="effort-tag ${t.effort}" data-action="toggle" title="Toggle effort level">${effortLabel(t.effort)}</button>
        <button type="button" class="btn-icon" data-action="delete" aria-label="Delete task">✕</button>
      </li>`).join("")
    : '<li class="friction-empty">No tasks yet. Add one above.</li>';

  const weak = getWeaknesses(state);
  if (!weak.length) {
    el.frictionCoping.innerHTML = '<p class="muted">Complete the assessment to see strategies for your lowest-scoring skills.</p>';
    return;
  }
  el.frictionCoping.innerHTML = weak.map(({ skillId, total }) => {
    const skill = getSkillById(skillId);
    const linked = tasks.filter(t => t.skillId === skillId);
    return `<div class="skill-card">
      <div class="skill-header">
        <span class="skill-name">${esc(skill.name)}</span>
        <span class="skill-score">${total}/${SCORE_MAX}</span>
      </div>
      ${linked.length ? `<p class="skill-description">Your tasks: ${linked.map(t => esc(t.description)).join("; ")}</p>` : ""}
      <ul class="coping-list">${skill.copingStrategies.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
    </div>`;
  }).join("");
}

function onFrictionSubmit(e) {
  e.preventDefault();
  try {
    addFriction(state, {
      description: el.frictionDesc.value,
      skillId: el.frictionSkill.value,
      effort: el.frictionEffort.value
    });
  } catch (err) {
    alert(err.message);
    return;
  }
  el.frictionDesc.value = "";
  el.frictionDesc.focus();
  renderFriction();
}

function onFrictionListClick(e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const taskId = btn.closest(".friction-item").dataset.taskId;
  if (btn.dataset.action === "delete") {
    deleteFriction(state, taskId);
  } else {
    const current = state.frictionMappings[taskId].effort;
    const next = EFFORT_LEVELS[(EFFORT_LEVELS.indexOf(current) + 1) % EFFORT_LEVELS.length];
    updateFriction(state, taskId, { effort: next });
  }
  renderFriction();
}

/* ---------- execute: action plan builder ---------- */

const PLAN_FIELDS = WORKSHEET_SCHEMAS.actionPlan.fields;
let planSkillTouched = false;

function renderPlanForm() {
  el.planFields.innerHTML = PLAN_FIELDS.map(({ key, label, type }) => {
    const id = `plan-${key}`;
    const required = ACTION_PLAN_REQUIRED.includes(key);
    const attrs = required ? " required" : "";
    const control = type === "select" ? `<select id="${id}"${attrs}></select>`
      : type === "textarea" ? `<textarea id="${id}" rows="2"${attrs}></textarea>`
      : `<input type="${type}" id="${id}"${attrs}>`;
    return `<div class="form-group"><label for="${id}">${esc(label)}${required ? " *" : ""}</label>${control}</div>`;
  }).join("");
  $("plan-targetSkillId").addEventListener("change", () => { planSkillTouched = true; });
}

/** Weakest skills are listed first and the weakest one is preselected until the user picks something. */
function refreshPlanSkillOptions() {
  const select = $("plan-targetSkillId");
  const weakIds = getWeaknesses(state).map(w => w.skillId);
  const option = s => `<option value="${s.id}">${esc(s.name)}</option>`;
  const weak = weakIds.map(getSkillById);
  const others = EXECUTIVE_SKILLS.filter(s => !weakIds.includes(s.id));
  const previous = select.value;

  select.innerHTML = '<option value="">Select a skill…</option>' +
    (weak.length ? `<optgroup label="Your 3 weakest skills">${weak.map(option).join("")}</optgroup>` : "") +
    `<optgroup label="${weak.length ? "Other skills" : "All skills"}">${others.map(option).join("")}</optgroup>`;

  select.value = planSkillTouched && getSkillById(previous) ? previous : (weakIds[0] || "");
}

function planSpeech({ cue, microPractice }) {
  return [cue, microPractice && `Then: ${microPractice}`].filter(Boolean).join(". ");
}

function speakCue(text, btn) {
  if (!("speechSynthesis" in window)) {
    alert("Speech synthesis is not supported in this browser.");
    return;
  }
  const wasSpeaking = btn.classList.contains("speaking");
  speechSynthesis.cancel();
  document.querySelectorAll(".speaking").forEach(b => b.classList.remove("speaking"));
  if (wasSpeaking) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.onstart = () => btn.classList.add("speaking");
  utterance.onend = utterance.onerror = () => btn.classList.remove("speaking");
  speechSynthesis.speak(utterance);
}

function renderPlanList() {
  const plans = listActionPlans(state).reverse();
  el.planList.innerHTML = plans.length
    ? plans.map(p => `<li class="plan-item" data-plan-id="${esc(p.id)}">
        <div class="friction-main">
          <span class="friction-desc">${esc(p.goal)}</span>
          <span class="friction-skill">${esc(getSkillById(p.targetSkillId).name)} · ${esc(p.situation)}${p.targetDate ? ` · by ${esc(p.targetDate)}` : ""}</span>
          <span class="friction-skill">Cue: ${esc(p.cue)}</span>
        </div>
        <button type="button" class="btn-secondary" data-action="speak">Speak Cue</button>
        <button type="button" class="btn-icon" data-action="delete" aria-label="Delete plan">✕</button>
      </li>`).join("")
    : '<li class="friction-empty">No action plans yet.</li>';
}

function onPlanSubmit(e) {
  e.preventDefault();
  try {
    addActionPlan(state, Object.fromEntries(PLAN_FIELDS.map(({ key }) => [key, $(`plan-${key}`).value])));
  } catch (err) {
    alert(err.message);
    return;
  }
  el.planForm.reset();
  planSkillTouched = false;
  refreshPlanSkillOptions();
  renderPlanList();
}

function onPlanListClick(e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.closest(".plan-item").dataset.planId;
  if (btn.dataset.action === "delete") {
    deleteActionPlan(state, id);
    renderPlanList();
  } else {
    const plan = state.actionPlans.find(p => p.id === id);
    if (plan) speakCue(planSpeech(plan), btn);
  }
}

function onSpeakFormCue() {
  const cue = $("plan-cue").value.trim();
  if (!cue) {
    $("plan-cue").focus();
    return;
  }
  speakCue(planSpeech({ cue, microPractice: $("plan-microPractice").value.trim() }), el.btnSpeakCue);
}

/* ---------- execute: time-estimation calibrator ---------- */

const watch = { status: "idle", accumulatedMs: 0, startedAt: 0, intervalId: null };

const elapsedMs = () => watch.accumulatedMs + (watch.status === "running" ? Date.now() - watch.startedAt : 0);
const fmtMin = n => String(Math.round(n * 100) / 100);

function formatClock(ms) {
  const total = Math.floor(ms / 1000);
  const pad = n => String(n).padStart(2, "0");
  const h = Math.floor(total / 3600);
  return `${h ? `${h}:` : ""}${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

function renderStopwatch() {
  el.stopwatchDisplay.textContent = formatClock(elapsedMs());
  el.btnWatchStart.disabled = watch.status === "running";
  el.btnWatchStart.textContent = watch.status === "paused" ? "Resume" : "Start";
  el.btnWatchPause.disabled = watch.status !== "running";
  el.btnWatchComplete.disabled = watch.status === "idle";
}

function startWatch() {
  if (watch.status === "idle") {
    try {
      validateTimeLog({ taskName: el.timerTask.value, estimatedMinutes: el.timerEstimate.value, actualMinutes: 0 });
    } catch (err) {
      alert(err.message);
      return;
    }
  }
  watch.startedAt = Date.now();
  watch.status = "running";
  watch.intervalId = setInterval(renderStopwatch, 250);
  renderStopwatch();
}

function pauseWatch() {
  if (watch.status !== "running") return;
  watch.accumulatedMs += Date.now() - watch.startedAt;
  watch.status = "paused";
  clearInterval(watch.intervalId);
  renderStopwatch();
}

function completeWatch() {
  if (watch.status === "idle") return;
  try {
    addTimeLog(state, {
      taskName: el.timerTask.value,
      estimatedMinutes: el.timerEstimate.value,
      actualMinutes: elapsedMs() / 60000
    });
  } catch (err) {
    alert(err.message); // clock keeps running so the elapsed time isn't lost
    return;
  }
  clearInterval(watch.intervalId);
  Object.assign(watch, { status: "idle", accumulatedMs: 0, startedAt: 0 });
  el.timerTask.value = "";
  el.timerEstimate.value = "";
  renderStopwatch();
  renderTimeLogs();
}

function renderTimeLogs() {
  const logs = listTimeLogs(state).reverse();
  el.timelogList.innerHTML = logs.length
    ? logs.map(l => {
        const sign = l.variancePct > 0 ? "+" : "";
        const tone = l.variancePct > 0 ? "over" : l.variancePct < 0 ? "under" : "";
        return `<li class="timelog-item" data-log-id="${esc(l.id)}">
          <div class="friction-main">
            <span class="friction-desc">${esc(l.taskName)}</span>
            <span class="friction-skill">Estimated ${fmtMin(l.estimatedMinutes)} min · Actual ${fmtMin(l.actualMinutes)} min</span>
          </div>
          <span class="variance-tag ${tone}">${sign}${l.variancePct.toFixed(1)}%</span>
          <button type="button" class="btn-icon" data-action="delete" aria-label="Delete log">✕</button>
        </li>`;
      }).join("")
    : '<li class="friction-empty">No completed timings yet.</li>';
}

function onTimelogClick(e) {
  const btn = e.target.closest("button[data-action='delete']");
  if (!btn) return;
  deleteTimeLog(state, btn.closest(".timelog-item").dataset.logId);
  renderTimeLogs();
}

function renderExecute() {
  refreshPlanSkillOptions();
  renderPlanList();
  renderStopwatch();
  renderTimeLogs();
}

/* ---------- reflect: blameless postmortem ---------- */

const PM_FIELDS = WORKSHEET_SCHEMAS.learningFromMistakes.fields;

function renderPostmortemForm() {
  el.pmFields.innerHTML = PM_FIELDS.map(({ key, label, type }) => {
    const id = `pm-${key}`;
    const required = POSTMORTEM_REQUIRED.includes(key);
    const attrs = required ? " required" : "";
    const control = type === "textarea"
      ? `<textarea id="${id}" rows="2"${attrs}></textarea>`
      : `<input type="text" id="${id}" maxlength="160"${attrs}>`;
    return `<div class="form-group"><label for="${id}">${esc(label)}${required ? " *" : ""}</label>${control}</div>`;
  }).join("");
}

const fmtDateTime = iso => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

function renderPostmortemList() {
  const items = listPostmortems(state).reverse();
  el.pmList.innerHTML = items.length
    ? items.map(p => `<li class="plan-item pm-item" data-pm-id="${esc(p.id)}">
        <div class="friction-main">
          <span class="friction-desc">${esc(p.situation)}</span>
          <span class="friction-skill">${esc(fmtDateTime(p.createdAt))}</span>
          <dl class="pm-details">
            ${PM_FIELDS.filter(f => f.key !== "situation" && p[f.key])
              .map(f => `<dt>${esc(f.label)}</dt><dd>${esc(p[f.key])}</dd>`).join("")}
          </dl>
        </div>
        <button type="button" class="btn-icon" data-action="delete" aria-label="Delete postmortem">✕</button>
      </li>`).join("")
    : '<li class="friction-empty">No postmortems yet. Review something that went off track — without blame.</li>';
}

function onPostmortemSubmit(e) {
  e.preventDefault();
  try {
    addPostmortem(state, Object.fromEntries(PM_FIELDS.map(({ key }) => [key, $(`pm-${key}`).value])));
  } catch (err) {
    alert(err.message);
    return;
  }
  el.pmForm.reset();
  renderPostmortemList();
}

function onPostmortemListClick(e) {
  const btn = e.target.closest("button[data-action='delete']");
  if (!btn) return;
  deletePostmortem(state, btn.closest(".pm-item").dataset.pmId);
  renderPostmortemList();
}

/* ---------- reflect: box-breathing guide ---------- */

const BREATH_PHASES = [
  { phase: "inhale", label: "Inhale" },
  { phase: "hold-full", label: "Hold" },
  { phase: "exhale", label: "Exhale" },
  { phase: "hold-empty", label: "Hold" }
];
const BREATH_PHASE_MS = 4000;
const BREATH_TOTAL_MS = 120000;
const breath = { running: false, startedAt: 0, intervalId: null };

function localToday() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function setBreathIdle(label = "Ready") {
  el.breathOrb.classList.remove("is-running");
  el.breathOrb.dataset.phase = "idle";
  el.breathLabel.textContent = label;
  el.breathCount.textContent = "";
  el.breathClock.textContent = formatClock(BREATH_TOTAL_MS);
  el.btnBreathStart.disabled = false;
  el.btnBreathStop.disabled = true;
}

function tickBreathing() {
  const elapsed = Date.now() - breath.startedAt;
  if (elapsed >= BREATH_TOTAL_MS) return finishBreathing();
  const step = Math.floor(elapsed / BREATH_PHASE_MS);
  const current = BREATH_PHASES[step % BREATH_PHASES.length];
  if (el.breathOrb.dataset.phase !== current.phase) el.breathOrb.dataset.phase = current.phase;
  el.breathLabel.textContent = current.label;
  el.breathCount.textContent = String(BREATH_PHASE_MS / 1000 - Math.floor((elapsed % BREATH_PHASE_MS) / 1000));
  el.breathClock.textContent = formatClock(Math.ceil((BREATH_TOTAL_MS - elapsed) / 1000) * 1000);
}

function startBreathing() {
  if (breath.running) return;
  breath.running = true;
  breath.startedAt = Date.now();
  el.btnBreathStart.disabled = true;
  el.btnBreathStop.disabled = false;
  // Restart the CSS cycle at the beginning of the first inhale.
  el.breathOrb.classList.remove("is-running");
  void el.breathOrb.offsetWidth;
  el.breathOrb.classList.add("is-running");
  tickBreathing();
  breath.intervalId = setInterval(tickBreathing, 200);
}

function stopBreathing() {
  if (!breath.running) return;
  clearInterval(breath.intervalId);
  breath.running = false;
  setBreathIdle();
}

/** Completed the full 2 minutes: offer a pre-filled log entry (the user still has to submit it). */
function finishBreathing() {
  clearInterval(breath.intervalId);
  breath.running = false;
  // Don't overwrite a practice the user has already started entering.
  const date = el.stressDate.value;
  const canPrefill = (!date || date === localToday()) && !el.stressStrategy.value.trim()
    && !el.stressDuration.value && !el.stressNotes.value.trim();
  setBreathIdle(canPrefill ? "Done — review your practice log" : "Done — your log was left unchanged");
  if (canPrefill) {
    el.stressDate.value = localToday();
    el.stressStrategy.value = "Box breathing";
    el.stressDuration.value = "2";
  }
}

/* ---------- reflect: stress-reset log ---------- */

function renderStressList() {
  const logs = listStressLogs(state).reverse().sort((a, b) => b.date.localeCompare(a.date));
  el.stressList.innerHTML = logs.length
    ? logs.map(l => `<li class="timelog-item" data-stress-id="${esc(l.id)}">
        <div class="friction-main">
          <span class="friction-desc">${esc(l.strategy)}</span>
          <span class="friction-skill">${esc(l.date)} · ${fmtMin(l.durationMinutes)} min</span>
          ${l.notes ? `<span class="friction-skill">${esc(l.notes)}</span>` : ""}
        </div>
        <button type="button" class="btn-icon" data-action="delete" aria-label="Delete practice log">✕</button>
      </li>`).join("")
    : '<li class="friction-empty">No practices logged yet.</li>';
}

function onStressSubmit(e) {
  e.preventDefault();
  try {
    addStressLog(state, {
      date: el.stressDate.value,
      strategy: el.stressStrategy.value,
      durationMinutes: el.stressDuration.value,
      notes: el.stressNotes.value
    });
  } catch (err) {
    alert(err.message);
    return;
  }
  el.stressForm.reset();
  el.stressDate.value = localToday();
  renderStressList();
}

function onStressListClick(e) {
  const btn = e.target.closest("button[data-action='delete']");
  if (!btn) return;
  deleteStressLog(state, btn.closest(".timelog-item").dataset.stressId);
  renderStressList();
}

function renderReflect() {
  if (!el.stressDate.value) el.stressDate.value = localToday();
  setBreathIdle();
  renderPostmortemList();
  renderStressList();
}

/* ---------- theme / import / export ---------- */

function applyTheme(theme) {
  if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  else document.documentElement.removeAttribute("data-theme");
}

function toggleTheme() {
  const effective = document.documentElement.getAttribute("data-theme")
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  state.theme = effective === "dark" ? "light" : "dark";
  applyTheme(state.theme);
  saveState(state);
}

function downloadExport() {
  const blob = new Blob([exportData(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: `ef-compass-${Date.now()}.json` });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    state = importData(await file.text());
    applyTheme(state.theme);
    renderProfile();
    navigateToStep(initialStep());
  } catch (err) {
    alert(`Failed to import data: ${err.message}`);
  }
  e.target.value = "";
}

function retake() {
  if (!confirm("Retake the assessment? Your scores will be cleared (friction tasks are kept).")) return;
  resetAssessment(state);
  navigateToStep(2);
}

/* ---------- keyboard ---------- */

function onKeydown(e) {
  if (currentStep !== 2 || e.target.matches("input, select, textarea")) return;
  const n = Number(e.key);
  if (n >= 1 && n <= RATING_SCALE.length) selectResponse(n);
  else if (e.key === "ArrowLeft" && !el.btnPrev.disabled) prevQuestion();
  else if (e.key === "ArrowRight" && !el.btnNext.disabled) nextQuestion();
}

/* ---------- init ---------- */

function init() {
  renderScale();
  renderFrictionSkillOptions();
  renderProfile();
  applyTheme(state.theme);

  el.navSteps.forEach(btn => btn.addEventListener("click", () => navigateToStep(Number(btn.dataset.step))));
  $("btn-theme").addEventListener("click", toggleTheme);
  $("btn-export").addEventListener("click", downloadExport);
  $("btn-import").addEventListener("click", () => el.importFile.click());
  el.importFile.addEventListener("change", handleImport);

  el.profileName.addEventListener("input", e => updateProfile("name", e.target.value));
  el.profileAge.addEventListener("change", e => updateProfile("age", e.target.value));
  el.profileContext.addEventListener("change", e => updateProfile("context", e.target.value));
  $("btn-start-assessment").addEventListener("click", startAssessment);

  el.scaleOptions.addEventListener("click", e => {
    const btn = e.target.closest(".scale-btn");
    if (btn) selectResponse(Number(btn.dataset.value));
  });
  el.btnPrev.addEventListener("click", prevQuestion);
  el.btnNext.addEventListener("click", nextQuestion);
  el.btnSpeech.addEventListener("click", speakQuestion);

  $("btn-retake").addEventListener("click", retake);
  $("btn-save-results").addEventListener("click", downloadExport);
  const onResultSkillClick = e => {
    const link = e.target.closest("[data-skill-id]");
    if (!link) return;
    e.preventDefault();
    openGuide(link.dataset.skillId);
  };
  el.skillsBreakdown.addEventListener("click", onResultSkillClick);
  el.radarChart.addEventListener("click", onResultSkillClick);

  el.guideSelector.addEventListener("click", onGuideSelection);
  el.guideTabs.addEventListener("click", onGuideTab);
  el.guideQuiz.addEventListener("click", onGuideQuiz);
  el.guideInterpreter.addEventListener("click", e => {
    if (e.target.closest("#btn-guide-plan")) guideToPlan();
  });
  el.guideSpeech.addEventListener("click", () => {
    const skill = getSkillById(guideSkillId);
    speakCue(`${skill.name}. ${skill.description} When this skill is strong: ${skill.highProfile} When it is challenging: ${skill.lowProfile}`, el.guideSpeech);
  });
  $("btn-guide-back").addEventListener("click", () => navigateToStep(3));

  el.frictionForm.addEventListener("submit", onFrictionSubmit);
  el.frictionList.addEventListener("click", onFrictionListClick);
  $("btn-friction-back").addEventListener("click", () => navigateToStep(3));

  renderPlanForm();
  el.planForm.addEventListener("submit", onPlanSubmit);
  el.planList.addEventListener("click", onPlanListClick);
  el.btnSpeakCue.addEventListener("click", onSpeakFormCue);
  el.btnWatchStart.addEventListener("click", startWatch);
  el.btnWatchPause.addEventListener("click", pauseWatch);
  el.btnWatchComplete.addEventListener("click", completeWatch);
  el.timelogList.addEventListener("click", onTimelogClick);
  $("btn-execute-back").addEventListener("click", () => navigateToStep(4));

  renderPostmortemForm();
  el.pmForm.addEventListener("submit", onPostmortemSubmit);
  el.pmList.addEventListener("click", onPostmortemListClick);
  el.btnBreathStart.addEventListener("click", startBreathing);
  el.btnBreathStop.addEventListener("click", stopBreathing);
  el.stressForm.addEventListener("submit", onStressSubmit);
  el.stressList.addEventListener("click", onStressListClick);
  $("btn-reflect-back").addEventListener("click", () => navigateToStep(5));

  document.addEventListener("keydown", onKeydown);
  navigateToStep(initialStep());
}

init();
