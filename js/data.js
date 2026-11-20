/**
 * Executive Function Data Layer & Field Guide
 * Sources:
 * - "The Smart but Scattered Guide to Success" by Peg Dawson & Richard Guare (2016)
 * - "Smart but Scattered" by Peg Dawson & Richard Guare (2009)
 */

export const RATING_SCALE = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Tend to disagree" },
  { value: 4, label: "Tend to agree" },
  { value: 5, label: "Agree" },
  { value: 6, label: "Strongly agree" }
];

export const EXECUTIVE_SKILLS = [
  {
    id: "response_inhibition",
    name: "Response Inhibition",
    shortName: "Inhibition",
    dimension: "doing",
    description: "The capacity to think before you act—resisting the urge to say or do something before evaluating the situation.",
    brainMechanic: "The earliest executive skill to emerge (around 7 months) and one of the last to mature. Prefrontal braking circuits inhibit impulsive limbic urges so you can evaluate consequences before acting.",
    highProfile: "Holds fire in heated moments, weighs options carefully, and serves as the voice of reason before speaking or committing.",
    lowProfile: "Blurts out thoughts without filtering, makes snap decisions or impulse purchases, and acts before gathering all the facts.",
    workImpact: "Strength: Weighs risks before acting. Weakness: Shooting from the hip in meetings or sending hasty messages you later regret.",
    homeImpact: "Strength: Follows through on plans without getting sidetracked. Weakness: Abandoning chores mid-task whenever a more appealing idea pops up.",
    pairedPatterns: [
      { partnerSkillId: "emotional_control", insight: "Weakness in both skills means strong feelings trigger immediate unfiltered reactions." },
      { partnerSkillId: "metacognition", insight: "Strong metacognition can act as a safety net—helping you step back and repair fallout after an impulsive move." }
    ],
    environmentMods: [
      "Remove temptations from your immediate environment (e.g., use website blockers, leave credit cards at home, or avoid trigger venues).",
      "Create physical 'speed bumps' between urge and action, such as moving distracting apps off your phone's home screen."
    ],
    taskMods: [
      "Build in mandatory wait time: use a 15-minute draft-and-wait rule before sending high-stakes emails or making purchases.",
      "Use explicit 'If–Then' implementation rules (e.g., 'If provoked in a meeting, then I will take one breath and ask a clarifying question')."
    ],
    items: [
      { id: 1, text: "I don't jump to conclusions." },
      { id: 2, text: "I think before I speak." },
      { id: 3, text: "I make sure I have all the facts before I take action." }
    ],
    copingStrategies: [
      "Introduce a mandatory 5-second pause before replying in high-stakes conversations.",
      "Use a 'draft-and-wait' rule: save important emails or messages as drafts for 15 minutes before sending.",
      "Keep a checklist of required facts to verify before committing to decisions."
    ],
    quickCheck: {
      question: "Which strategy is backed by research for helping impulsive individuals resist an immediate urge?",
      options: [
        "Telling yourself you can never have the reward again",
        "Rehearsing a concrete 'If–Then' rule and postponing the reward until later",
        "Relying purely on willpower at the end of a long workday"
      ],
      answerIndex: 1,
      explanation: "Research shows concrete 'If–Then' implementation plans and postponing gratification reduce cravings far more reliably than flat denial or depleted willpower."
    }
  },
  {
    id: "working_memory",
    name: "Working Memory",
    shortName: "Memory",
    dimension: "thinking",
    description: "The ability to hold information in memory while performing complex tasks and draw on past learning to apply to the present.",
    brainMechanic: "Combines short-term memory storage with active prefrontal manipulation—holding steps in mind while drawing on past experience to guide current actions.",
    highProfile: "Tracks commitments, dates, and details effortlessly without needing constant external reminders.",
    lowProfile: "Loses track of multi-step instructions, double-books appointments, or forgets items the moment a new stimulus interrupts.",
    workImpact: "Strength: Keeps track of project details and promises. Weakness: Forgetting follow-ups or missing steps in routine procedures.",
    homeImpact: "Strength: Remembers household errands and family schedules. Weakness: Misplacing keys/phones or forgetting items requested earlier in the day.",
    pairedPatterns: [
      { partnerSkillId: "organization", insight: "Strong organization compensates for weak working memory by giving every item a fixed physical home." }
    ],
    environmentMods: [
      "Create a single physical 'launch pad' tray by the front door and on your desk for keys, phone, and outgoing items.",
      "Place physical reminders directly in your path (e.g., putting items in front of the door or in the car the night before)."
    ],
    taskMods: [
      "Off-load mental tracking onto written checklists—even airline pilots and surgeons use checklists rather than relying on memory.",
      "Capture commitments immediately into one trusted calendar or inbox at the exact moment they arise."
    ],
    items: [
      { id: 4, text: "I have a good memory for facts, dates, and details." },
      { id: 5, text: "I am very good at remembering the things I have committed to do." },
      { id: 6, text: "I seldom need reminders to complete tasks." }
    ],
    copingStrategies: [
      "Externalize everything immediately into a single capture inbox rather than trusting mental recall.",
      "Set location-based or time-based alarms for commitments the moment you make them.",
      "Place physical cues (keys, tools, documents) directly in your exit path."
    ],
    quickCheck: {
      question: "What is the core principle behind cognitive 'off-loading' for Working Memory?",
      options: [
        "Memorizing checklists through repetition so you no longer need them",
        "Transferring storage duties to external tools (trays, checklists, alarms) so your brain can focus on execution",
        "Practicing computerized memory games for 30 minutes a day"
      ],
      answerIndex: 1,
      explanation: "Off-loading relieves the prefrontal cortex from holding raw data—and research shows brain games rarely transfer to real-world daily recall."
    }
  },
  {
    id: "emotional_control",
    name: "Emotional Control",
    shortName: "Emotion",
    dimension: "doing",
    description: "The ability to manage emotions in order to achieve goals, complete tasks, or control and direct behavior.",
    brainMechanic: "The prefrontal cortex acts as a regulatory brake on the amygdala's fight-or-flight alarm system, using contextual memory and self-talk to down-regulate emotional spikes.",
    highProfile: "Stays calm under pressure, absorbs criticism constructively, and isn't easily baited by provocations or minor setbacks.",
    lowProfile: "Flies off the handle at small inconveniences, ruminates over minor criticism, or gets derailed by anxiety and frustration.",
    workImpact: "Strength: Steady anchor during workplace crises. Weakness: Taking feedback personally or losing composure when understaffed.",
    homeImpact: "Strength: Responds calmly to household chaos. Weakness: Escalating quickly over clutter, tardiness, or family friction.",
    pairedPatterns: [
      { partnerSkillId: "flexibility", insight: "Weak flexibility frequently triggers emotional outbursts whenever plans change unexpectedly." },
      { partnerSkillId: "response_inhibition", insight: "When both are weak, frustration converts instantly into sharp words before you can pause." }
    ],
    environmentMods: [
      "Identify predictable emotional triggers and reduce exposure (e.g., avoid high-friction topics when tired or hungry).",
      "Build restorative buffers into your day—brief physical movement, daylight walks, or quiet decompression time."
    ],
    taskMods: [
      "Use third-person or instructional self-talk ('Step back, take five slow breaths') to quiet amygdala reactivity.",
      "Replace 'all-or-nothing' perfectionism with objective ratios (e.g., reviewing positive vs. corrective feedback in two columns)."
    ],
    items: [
      { id: 7, text: "My emotions seldom get in the way of my job performance." },
      { id: 8, text: "Little things do not affect me emotionally or distract me from the task at hand." },
      { id: 9, text: "When frustrated or angry, I keep my cool." }
    ],
    copingStrategies: [
      "Identify early physical triggers of frustration and step away for a 2-minute physiological sigh or box-breathing reset.",
      "Prepare scripted neutral responses for predictable workplace or household friction points.",
      "Reframe critical feedback as system debugging rather than personal judgment."
    ],
    quickCheck: {
      question: "How does structured self-talk help regulate Emotional Control in the brain?",
      options: [
        "It suppresses the hippocampus permanently",
        "It increases prefrontal cortex engagement while decreasing amygdala alarm activity",
        "It eliminates all negative feelings before they happen"
      ],
      answerIndex: 1,
      explanation: "Neuroimaging shows instructional and second-person self-talk activates frontal control circuits and dampens amygdala reactivity."
    }
  },
  {
    id: "task_initiation",
    name: "Task Initiation",
    shortName: "Initiation",
    dimension: "doing",
    description: "The ability to begin projects without undue procrastination, in an efficient or timely fashion.",
    brainMechanic: "Overcoming the initial activation energy barrier in the prefrontal cortex—shifting out of passive mood repair ('I'll do it later') into physical action.",
    highProfile: "Jumps right into tasks and obligations promptly without waiting for last-minute panic or external nagging.",
    lowProfile: "Puts off tedious or ambiguous tasks until deadlines loom, often stalling due to perfectionism or perceived effort.",
    workImpact: "Strength: Clears work queues early and reliably. Weakness: Delaying reports, emails, or admin tasks until urgent.",
    homeImpact: "Strength: Tackles chores right away to get them over with. Weakness: Putting off bills, emails, or tidying despite feeling stressed about them.",
    pairedPatterns: [
      { partnerSkillId: "goal_directed_persistence", insight: "Strong goal-directed persistence can override weak task initiation when a meaningful long-term prize is attached." },
      { partnerSkillId: "planning_prioritizing", insight: "Strong planning lets you slice a daunting task into tiny 5-minute starters so initiation friction drops." }
    ],
    environmentMods: [
      "Stage the exact materials needed for tomorrow's first task right in the center of your desk or table the night before.",
      "Eliminate competing digital friction (close tabs, silence phone) before your scheduled start time."
    ],
    taskMods: [
      "Cap the initial commitment at 5 to 10 minutes—focus strictly on starting, not finishing ('Done is better than perfect').",
      "Use public commitment (correspondence training): tell a peer or partner the exact time you will start."
    ],
    items: [
      { id: 10, text: "No matter what the task, I believe in getting started as soon as possible." },
      { id: 11, text: "Procrastination is usually not a problem for me." },
      { id: 12, text: "I seldom leave tasks to the last minute." }
    ],
    copingStrategies: [
      "Use the 5-Minute Rule: commit to working on the aversive task for just 5 minutes with permission to stop after.",
      "Define the smallest physical 'first action' (e.g., 'open the file' rather than 'write the report').",
      "Pair an unpleasant start with an immediate environmental cue (specific playlist, cup of tea, or scheduled start alarm)."
    ],
    quickCheck: {
      question: "Why do Dawson & Guare recommend limiting an initial practice session to 5–10 minutes?",
      options: [
        "Because 10 minutes is enough to finish any major project",
        "It isolates Task Initiation from Sustained Attention and keeps initial effort low enough to bypass avoidance",
        "Because timers stop working accurately after 10 minutes"
      ],
      answerIndex: 1,
      explanation: "Keeping the entry bar at 5–10 minutes lowers perceived effort so you overcome the activation barrier without depleting willpower."
    }
  },
  {
    id: "sustained_attention",
    name: "Sustained Attention",
    shortName: "Attention",
    dimension: "doing",
    description: "The capacity to maintain attention to a situation or task in spite of distractibility, fatigue, or boredom.",
    brainMechanic: "Suppressing the brain's Default Mode Network (mind-wandering circuits) so top-down prefrontal focus stays locked onto a purposeful task.",
    highProfile: "Screens out distractions, works steadily through tedious assignments, and resumes easily after interruptions.",
    lowProfile: "Starts strong but runs out of steam mid-task, bounces between half-finished activities, or gets derailed by interruptions.",
    workImpact: "Strength: Deep focus on long analytical tasks. Weakness: Jumping between tabs and leaving projects 80% complete.",
    homeImpact: "Strength: Finishes multi-hour chores in one push. Weakness: Starting to clean one room, getting distracted, and abandoning the rest.",
    pairedPatterns: [
      { partnerSkillId: "flexibility", insight: "High flexibility with low sustained attention works best by rotating across 2–3 tasks in short timed blocks." },
      { partnerSkillId: "task_initiation", insight: "If both are weak, tackle Task Initiation first—you can't sustain focus on a task you haven't started." }
    ],
    environmentMods: [
      "Match acoustic surroundings to your focus style—quiet isolation or instrumental/white noise to mask sudden background chatter.",
      "Keep a physical notepad beside you as a 'Distraction Parking Lot' to capture random thoughts without opening a browser."
    ],
    taskMods: [
      "Use timed work/rest intervals (e.g., 20–25 minutes on, 5 minutes off) with a defined micro-output per sprint.",
      "Leave a 1-sentence 'breadcrumb note' of your exact next action before stepping away for a break or interruption."
    ],
    items: [
      { id: 13, text: "I find it easy to stay focused on my work." },
      { id: 14, text: "Once I start an assignment, I work diligently until it's completed." },
      { id: 15, text: "Even when interrupted, I find it easy to get back and complete the job at hand." }
    ],
    copingStrategies: [
      "Work in timed sprints (e.g., 25 minutes focus / 5 minutes rest) and track completed blocks.",
      "Keep a 'Distraction Parking Lot' notepad nearby to jot down intrusive thoughts without switching browser tabs.",
      "Leave a 'breadcrumb note' describing your exact next step whenever an interruption forces you to pause."
    ],
    quickCheck: {
      question: "What happens in the brain right before a sustained-attention mistake occurs?",
      options: [
        "The Default Mode Network (mind-wandering circuit) reactivates and overrides focused attention",
        "The cerebellum shuts down motor control",
        "Working memory doubles its storage capacity"
      ],
      answerIndex: 0,
      explanation: "Brain imaging shows that when fatigue or boredom sets in, the Default Mode Network takes over up to 30 seconds before an error."
    }
  },
  {
    id: "planning_prioritizing",
    name: "Planning / Prioritizing",
    shortName: "Planning",
    dimension: "thinking",
    description: "The ability to create a roadmap to reach a goal or complete a task, and to make decisions about what is important to focus on.",
    brainMechanic: "Driven by the lateral frontal pole prefrontal cortex—visualizing an end state, sequencing substeps, and filtering high-leverage priorities from noise.",
    highProfile: "Visualizes outcomes clearly, sequences complex multi-step projects, and zeroes in on top priorities under pressure.",
    lowProfile: "Gets bogged down in minor details, struggles to decide where to start on open-ended projects, and treats every task as equally urgent.",
    workImpact: "Strength: Builds clear project roadmaps and timelines. Weakness: Feeling overwhelmed when juggling competing deliverables.",
    homeImpact: "Strength: Plans vacations, meals, and renovations smoothly. Weakness: Jumping into home projects without gathering tools or steps first.",
    pairedPatterns: [
      { partnerSkillId: "organization", insight: "Many people excel at designing plans (Planning) yet struggle to maintain physical/digital tidy systems (Organization)." },
      { partnerSkillId: "time_management", insight: "Pairing strong planning with realistic time estimates prevents overstuffed daily to-do lists." }
    ],
    environmentMods: [
      "Use a visible whiteboard or sticky-note wall so project steps can be physically reordered without friction.",
      "Block dedicated 'email/message windows' so reactive requests don't hijack your top daily priorities."
    ],
    taskMods: [
      "Turn open-ended projects into closed-ended checklists: define the end product, required materials, and ordered steps first.",
      "Cap each day at 3 non-negotiable 'Must-Do' priorities before touching secondary tasks."
    ],
    items: [
      { id: 16, text: "When I start my day, I have a clear plan in mind for what I hope to accomplish." },
      { id: 17, text: "When I have a lot to do, I can easily focus on the most important things." },
      { id: 18, text: "I typically break big tasks down into subtasks and timelines." }
    ],
    copingStrategies: [
      "Limit your daily plan to a maximum of 3 'Must-Do' priorities before checking messages.",
      "Reverse-engineer projects from the target deadline backward into concrete weekly milestones.",
      "Use an Eisenhower matrix (Urgent vs. Important) when feeling overwhelmed by competing demands."
    ],
    quickCheck: {
      question: "How do Dawson & Guare distinguish Planning from Organization?",
      options: [
        "They are the exact same skill",
        "Planning is creating a roadmap and sequencing priorities; Organization is maintaining systems to track materials and information",
        "Planning only applies to children, while Organization applies to adults"
      ],
      answerIndex: 1,
      explanation: "People are frequently great at big-picture planning yet messy with physical organization—treating them separately targets the right fix."
    }
  },
  {
    id: "organization",
    name: "Organization",
    shortName: "Organization",
    dimension: "thinking",
    description: "The ability to create and maintain systems to keep track of information or materials.",
    brainMechanic: "Categorizing, spatial-tagging, and building repeatable external retrieval systems so physical and digital items have predictable locations.",
    highProfile: "Keeps workspaces neat naturally, puts things away immediately after use, and maintains reliable filing systems.",
    lowProfile: "Accumulates paper/digital clutter effortlessly, struggles to maintain systems after setting them up, and wastes time searching for items.",
    workImpact: "Strength: Clean desk, structured files, instant retrieval. Weakness: Piles of unsorted documents and overflowing inboxes.",
    homeImpact: "Strength: Effortlessly tidy living spaces. Weakness: Clutter build-up and friction with neater family members.",
    pairedPatterns: [
      { partnerSkillId: "flexibility", insight: "Very high organization often pairs with lower flexibility—unexpected clutter or disrupted systems feel suffocating." },
      { partnerSkillId: "working_memory", insight: "If both are weak, build ultra-simple visual bins and scheduled 5-minute daily resets." }
    ],
    environmentMods: [
      "Use open, clearly labeled bins, trays, and wall pockets—lids and deep folders add friction that breaks habits.",
      "Take a photo of your ideal clean desk or room to serve as a visual target for reset sessions."
    ],
    taskMods: [
      "Sweep clutter onto a staging surface and spend just 5–10 minutes a day sorting it rather than attempting marathon cleanups.",
      "Build a 5-minute end-of-day 'reset ritual' to return tools and files to their designated homes."
    ],
    items: [
      { id: 19, text: "I am an organized person." },
      { id: 20, text: "It is natural for me to keep my work area neat and organized." },
      { id: 21, text: "I am good at maintaining systems for organizing my work." }
    ],
    copingStrategies: [
      "Assign every physical and digital item a single, labeled 'home' location.",
      "Schedule a 5-minute end-of-day 'reset ritual' to clear your desk and close unused tabs.",
      "Keep organization systems shallow (fewer nested folders, clear visual labels) so maintenance takes zero friction."
    ],
    quickCheck: {
      question: "Why do elaborate organizational systems often fail for people with weak Organization?",
      options: [
        "Because they lack intelligence",
        "High-maintenance systems require too much ongoing effort; shallow, visible bins and short daily resets survive real life",
        "Because digital tools never work for organization"
      ],
      answerIndex: 1,
      explanation: "Complex filing rules collapse once willpower dips—low-friction containers and 5-minute daily resets sustain order."
    }
  },
  {
    id: "time_management",
    name: "Time Management",
    shortName: "Time Mgmt",
    dimension: "thinking",
    description: "The capacity to estimate how much time one has, how to allocate it, and how to stay within time limits and deadlines.",
    brainMechanic: "Internal temporal estimation and prospective pacing—accurately gauging task duration and transition buffers against fixed deadlines.",
    highProfile: "Judges task durations accurately, arrives on time consistently, and paces work to finish without last-minute panic.",
    lowProfile: "Underestimates how long tasks take, tries to squeeze in 'just one more thing' before leaving, and runs chronically late.",
    workImpact: "Strength: Hits deadlines and runs crisp meetings. Weakness: Overcommitting schedules and underestimating deliverable hours.",
    homeImpact: "Strength: Smooth morning/evening family transitions. Weakness: Running late for pickups or events, causing tension with time-conscious partners.",
    pairedPatterns: [
      { partnerSkillId: "flexibility", insight: "Strong time management often pairs with lower flexibility because unexpected surprises force you to recalculate your entire internal schedule." }
    ],
    environmentMods: [
      "Use visual countdown timers (like a Time Timer) so passing time is visible rather than abstract.",
      "Set departure alarms 10–15 minutes before you actually need to walk out the door."
    ],
    taskMods: [
      "Track 'Estimated vs. Actual Minutes' on routine tasks to calibrate optimism bias, then add a 25% buffer to estimates.",
      "Schedule transition buffers between back-to-back commitments."
    ],
    items: [
      { id: 22, text: "At the end of the day, I've usually finished what I set out to do." },
      { id: 23, text: "I am good at estimating how long it takes to do something." },
      { id: 24, text: "I am usually on time for appointments and activities." }
    ],
    copingStrategies: [
      "Log 'Estimated Time vs. Actual Time' on routine tasks for one week to recalibrate optimism bias.",
      "Add a 25% buffer to all task time estimates and transition windows between events.",
      "Use visual countdown timers rather than relying on internal time perception."
    ],
    quickCheck: {
      question: "What common habit trips up people with weak Time Management right before leaving the house or office?",
      options: [
        "Arriving 30 minutes early to every meeting",
        "Underestimating task duration and trying to squeeze in 'just one more thing'",
        "Using too many countdown timers"
      ],
      answerIndex: 1,
      explanation: "Optimism bias about how fast 'one quick task' takes is the #1 cause of chronic lateness."
    }
  },
  {
    id: "flexibility",
    name: "Flexibility",
    shortName: "Flexibility",
    dimension: "doing",
    description: "The ability to revise plans in the face of obstacles, setbacks, new information, or mistakes; adaptability to changing conditions.",
    brainMechanic: "Cognitive set-shifting—disengaging from an expected mental script and generating an alternative path when conditions change.",
    highProfile: "Takes surprises in stride, pivots quickly to Plan B, and thrives with nonlinear or spontaneous problem solving.",
    lowProfile: "Gets thrown for a loop by sudden schedule changes, dislikes open-ended ambiguity, and struggles to pivot when rules shift.",
    workImpact: "Strength: Adapts smoothly to shifting priorities. Weakness: Frustration when workflows change without advance notice.",
    homeImpact: "Strength: Easygoing with spontaneous family changes. Weakness: Getting upset when routines or weekend plans change last-minute.",
    pairedPatterns: [
      { partnerSkillId: "emotional_control", insight: "Inflexibility frequently fuels emotional meltdowns when expectations aren't met—pre-building Plan B calms both." },
      { partnerSkillId: "time_management", insight: "If flexibility is high and time management is low, use lightweight anchors so spontaneity doesn't miss deadlines." }
    ],
    environmentMods: [
      "Build unscheduled buffer blocks into your week to absorb unexpected disruptions without breaking the whole schedule.",
      "Ask partners or teammates for advance 'heads-up' warnings whenever plans might shift."
    ],
    taskMods: [
      "Pre-write a lightweight 'Plan B' and pack redundant backups (e.g., offline maps, spare cables) before key events.",
      "Break open-ended tasks into structured templates or choices to reduce ambiguity."
    ],
    items: [
      { id: 25, text: "I take unexpected events in stride." },
      { id: 26, text: "I easily adjust to changes in plans and priorities." },
      { id: 27, text: "I consider myself to be flexible and adaptive to change." }
    ],
    copingStrategies: [
      "When plans derail, pause and ask: 'Given what is true right now, what is the next best move?'",
      "Reframe the surprise with self-talk: 'This is different, not wrong'—then name one option you still control.",
      "Practice on purpose: once a week, change one small routine (new route, different task order) to build tolerance for change."
    ],
    quickCheck: {
      question: "How can someone with low Flexibility reduce stress around unexpected disruptions?",
      options: [
        "Avoid making any plans ever again",
        "Build unscheduled buffer blocks into the week and pre-define simple 'Plan B' backups in advance",
        "Insist that everyone else follow a rigid minute-by-minute schedule"
      ],
      answerIndex: 1,
      explanation: "Pre-planned redundancies and buffer blocks allow inflexible thinkers to pivot without scrambling under pressure."
    }
  },
  {
    id: "metacognition",
    name: "Metacognition",
    shortName: "Metacognition",
    dimension: "thinking",
    description: "The ability to stand back and take a bird's-eye view of oneself in a situation—self-monitoring and self-evaluation.",
    brainMechanic: "Self-reflective prefrontal monitoring—observing your own problem-solving process, reading social dynamics, and evaluating outcomes objectively.",
    highProfile: "Sees the big picture ('forest over trees'), self-monitors quality accurately, and learns systematically from feedback.",
    lowProfile: "Focuses on isolated concrete details, misses subtle social cues, or struggles to diagnose why a strategy isn't working.",
    workImpact: "Strength: Strategic problem solver and receptive to coaching. Weakness: Missing big-picture alignment or repeating preventable errors.",
    homeImpact: "Strength: Reads family dynamics well and delegates fairly. Weakness: Difficulty stepping back during arguments to see the other side.",
    pairedPatterns: [
      { partnerSkillId: "response_inhibition", insight: "Strong metacognition helps you debrief mistakes and design guardrails even when in-the-moment impulse control slips." }
    ],
    environmentMods: [
      "Post a short '2 Strengths to Lean On / 2 Blindspots to Watch' card at your workspace.",
      "Schedule regular outside-perspective check-ins with a trusted peer, mentor, or partner."
    ],
    taskMods: [
      "Use explicit quality-verification rubrics and checklists before declaring a task complete.",
      "Run a weekly 10-minute Blameless Postmortem: What happened? What cues did I miss? What will I change next time?"
    ],
    items: [
      { id: 28, text: "I routinely evaluate my performance and devise methods for personal improvement." },
      { id: 29, text: "I am able to step back from a situation to make objective decisions." },
      { id: 30, text: "I am a 'big-picture' thinker and enjoy the problem solving that goes with that." }
    ],
    copingStrategies: [
      "Run a weekly 10-minute 'Blameless Postmortem' on one task that went off track (What happened / Missed cues / Next time).",
      "Ask a trusted peer or mentor for an outside perspective before finalizing major decisions.",
      "Use structured checklists to verify output quality against objective criteria before finishing."
    ],
    quickCheck: {
      question: "What are the two core questions at the heart of Metacognition?",
      options: [
        "'How fast can I finish?' and 'Who is to blame?'",
        "'How am I doing right now?' (self-monitoring) and 'How did I do?' (self-evaluation)",
        "'What is everyone else doing?' and 'How do I avoid feedback?'"
      ],
      answerIndex: 1,
      explanation: "Metacognition is active self-monitoring during a task and objective self-evaluation afterward."
    }
  },
  {
    id: "goal_directed_persistence",
    name: "Goal-Directed Persistence",
    shortName: "Persistence",
    dimension: "doing",
    description: "The capacity to have a goal, follow through to the completion of that goal, and not be put off or distracted by competing interests.",
    brainMechanic: "Sustaining long-horizon prefrontal motivation—resisting immediate competing rewards so incremental effort compounds toward a distant outcome.",
    highProfile: "Sets clear long-term targets, pushes through obstacles, and sacrifices short-term distractions to finish what matters.",
    lowProfile: "Lives in the moment, loses momentum on multi-week goals when novelty fades, or gets sidetracked by shiny new interests.",
    workImpact: "Strength: Drives long-term initiatives to completion. Weakness: Leaving long-horizon projects half-finished once initial excitement fades.",
    homeImpact: "Strength: Follows through on fitness, savings, or home renovations. Weakness: Abandoning personal habits or household projects mid-stream.",
    pairedPatterns: [
      { partnerSkillId: "task_initiation", insight: "High goal-directed persistence is the #1 natural override for weak task initiation and sustained attention." }
    ],
    environmentMods: [
      "Keep visual reminders of your target goal and progress streak in plain sight (wallpaper, wall chart, or tracker).",
      "Share your milestone commitments with a supportive accountability partner."
    ],
    taskMods: [
      "Attach small, immediate interim rewards to weekly milestones rather than waiting months for a distant payoff.",
      "Break multi-month goals into short, repeatable daily reps that build automaticity."
    ],
    items: [
      { id: 31, text: "I think of myself as being driven to meet my goals." },
      { id: 32, text: "I easily give up immediate pleasures to work on long-term goals." },
      { id: 33, text: "I believe in setting and achieving high levels of performance." }
    ],
    copingStrategies: [
      "Break multi-month goals into visible weekly milestones with small, immediate rewards attached to each step.",
      "Keep a visual streak tracker or progress bar in plain sight to reinforce daily momentum.",
      "Write down your core 'Why' and review it whenever short-term distractions tempt you off course."
    ],
    quickCheck: {
      question: "In Peg Dawson's university study, how did students with weak Task Initiation still turn in papers on time?",
      options: [
        "They pulled all-nighters every week",
        "They used a strength in Goal-Directed Persistence to override their urge to procrastinate",
        "They dropped the class"
      ],
      answerIndex: 1,
      explanation: "Dawson found Goal-Directed Persistence acts as a gateway strength that can compensate for weaker initiation and attention."
    }
  },
  {
    id: "stress_tolerance",
    name: "Stress Tolerance",
    shortName: "Stress Tol.",
    dimension: "doing",
    description: "The ability to thrive in stressful situations and to cope with uncertainty, change, and performance demands.",
    brainMechanic: "Maintaining prefrontal executive bandwidth under high autonomic arousal—preventing stress overload from shutting down weaker skills ('weak organ theory').",
    highProfile: "Performs at peak under tight deadlines, enjoys fast-paced variety, and handles unpredictability without freezing.",
    lowProfile: "Prefers predictable routines, feels drained or anxious under high pressure, and experiences rapid skill breakdown during overload.",
    workImpact: "Strength: Thrives in high-stakes, fast-moving roles. Weakness: Burnout or cognitive freeze when demands spike unexpectedly.",
    homeImpact: "Strength: Handles family emergencies calmly. Weakness: Feeling overwhelmed when multiple household demands collide at once.",
    pairedPatterns: [
      { partnerSkillId: "emotional_control", insight: "Under overload, your weakest executive skills break down first ('weak organ theory')—stress resets protect the whole system." }
    ],
    environmentMods: [
      "Create predictable low-friction routines and arrive early before peak chaos to conserve executive energy.",
      "Designate a calm decompression space and use soothing sensory cues (music, fresh air, clutter-free zone)."
    ],
    taskMods: [
      "Separate controllable next actions from uncontrollable variables when facing uncertainty.",
      "Practice brief scheduled down-regulation (2-minute box breathing or brisk walking) before high-pressure windows."
    ],
    items: [
      { id: 34, text: "I enjoy working in a highly demanding, fast-paced environment." },
      { id: 35, text: "A certain amount of pressure helps me perform at my best." },
      { id: 36, text: "Jobs that include a fair degree of unpredictability appeal to me." }
    ],
    copingStrategies: [
      "Reduce preventable daily friction by automating or templating repetitive decisions.",
      "Practice brief, scheduled down-regulation techniques (breathwork, brisk walk) before high-pressure windows.",
      "Separate controllable actions from uncontrollable variables when facing ambiguity."
    ],
    quickCheck: {
      question: "What do Dawson & Guare call the 'Weak Organ Theory' of stress?",
      options: [
        "Stress only affects physical muscles, never the brain",
        "Under stress or overload, the executive skills that were weakest to begin with are the first to break down",
        "Stress automatically strengthens your weakest skills"
      ],
      answerIndex: 1,
      explanation: "Recognizing a sudden drop in your weakest skill (like clutter piling up or a short fuse) is an early warning signal of system overload."
    }
  }
];

export const WORKSHEET_SCHEMAS = {
  actionPlan: {
    title: "Executive Skill Action Plan",
    fields: [
      { key: "targetSkillId", label: "Target Executive Skill", type: "select" },
      { key: "situation", label: "Specific activity or situation to work on", type: "text" },
      { key: "currentBaseline", label: "Current level of performance", type: "text" },
      { key: "goal", label: "Goal (outcome you want to achieve)", type: "text" },
      { key: "targetDate", label: "Target completion date", type: "date" },
      { key: "microPractice", label: "What specific micro-habit will you practice?", type: "textarea" },
      { key: "cue", label: "What cue will remind you to follow your plan?", type: "text" },
      { key: "selfStatement", label: "Positive self-statement (Why & Benefits)", type: "textarea" },
      { key: "reward", label: "Motivator / Reward for following the plan", type: "text" }
    ]
  },
  learningFromMistakes: {
    title: "Learning from Mistakes (Blameless Postmortem)",
    fields: [
      { key: "situation", label: "Task or situation", type: "text" },
      { key: "whatWentWrong", label: "What went wrong?", type: "textarea" },
      { key: "whatIDid", label: "What did I do?", type: "textarea" },
      { key: "missedCues", label: "What cues did I miss?", type: "textarea" },
      { key: "nextTime", label: "Next time I will...", type: "textarea" }
    ]
  }
};