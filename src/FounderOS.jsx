import { useState } from "react";

// ─── CSS injected as a style tag ───────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f0ede8;
    --card: #ffffff;
    --card2: #f7f5f2;
    --ink: #1a1814;
    --ink2: #6b6560;
    --ink3: #a09a94;
    --accent: #2d5be3;
    --accent2: #e85d2f;
    --accent3: #2ecc8a;
    --gold: #f5a623;
    --radius: 20px;
    --shadow: 0 2px 24px rgba(0,0,0,0.07);
    --shadow-lg: 0 8px 48px rgba(0,0,0,0.12);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }

  .os-root {
    min-height: 100vh;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 20%, rgba(45,91,227,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 80%, rgba(232,93,47,0.05) 0%, transparent 60%);
  }

  /* ── NAV ── */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 32px;
    background: rgba(240,237,232,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-logo {
    font-family: 'Instrument Serif', serif;
    font-size: 20px; letter-spacing: -0.5px; color: var(--ink);
    display: flex; align-items: center; gap: 8px;
  }
  .nav-logo span { color: var(--accent); }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: var(--ink2);
    transition: all 0.2s;
  }
  .nav-tab.active { background: var(--card); color: var(--ink); box-shadow: var(--shadow); }
  .nav-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: white;
  }

  /* ── ONBOARDING ── */
  .onboard-wrap {
    max-width: 680px; margin: 0 auto;
    padding: 48px 24px 80px;
  }
  .ob-progress {
    display: flex; gap: 6px; margin-bottom: 40px;
  }
  .ob-progress-bar {
    height: 3px; border-radius: 2px; flex: 1;
    background: rgba(0,0,0,0.1);
    transition: background 0.4s;
  }
  .ob-progress-bar.done { background: var(--accent); }
  .ob-progress-bar.active { background: var(--accent); opacity: 0.5; }

  .ob-step { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ob-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(45,91,227,0.1); color: var(--accent);
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 6px; margin-bottom: 16px;
  }
  .ob-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(28px, 5vw, 42px); line-height: 1.15;
    color: var(--ink); margin-bottom: 10px; letter-spacing: -0.5px;
  }
  .ob-title em { color: var(--accent); font-style: italic; }
  .ob-sub {
    font-size: 15px; color: var(--ink2); line-height: 1.6;
    margin-bottom: 32px; max-width: 520px;
  }

  .ob-illustration {
    width: 100%; border-radius: var(--radius);
    background: var(--card); padding: 32px;
    margin-bottom: 28px; box-shadow: var(--shadow);
    display: flex; justify-content: center; align-items: center;
    min-height: 140px;
  }

  .ob-textarea {
    width: 100%; min-height: 130px;
    background: var(--card); border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 14px; padding: 18px 20px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink);
    resize: none; outline: none; line-height: 1.6;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: var(--shadow);
  }
  .ob-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(45,91,227,0.12);
  }
  .ob-textarea::placeholder { color: var(--ink3); }

  .ob-input {
    width: 100%;
    background: var(--card); border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 14px; padding: 14px 18px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: var(--shadow);
  }
  .ob-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(45,91,227,0.12);
  }

  .ob-prompt {
    background: rgba(45,91,227,0.06); border-left: 3px solid var(--accent);
    border-radius: 0 10px 10px 0;
    padding: 12px 16px; margin-top: 14px;
    font-size: 13px; color: var(--accent); line-height: 1.5;
    font-style: italic;
  }

  .ob-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
  .ob-chip {
    padding: 9px 16px; border-radius: 40px;
    border: 1.5px solid rgba(0,0,0,0.1);
    background: var(--card); font-size: 13px; cursor: pointer;
    transition: all 0.2s; color: var(--ink2); font-weight: 500;
    box-shadow: var(--shadow);
  }
  .ob-chip.selected {
    background: var(--accent); border-color: var(--accent);
    color: white;
  }

  .ob-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .ob-field label {
    display: block; font-size: 12px; font-weight: 600; color: var(--ink2);
    margin-bottom: 7px; letter-spacing: 0.04em; text-transform: uppercase;
  }

  .ob-btn-row { display: flex; gap: 12px; margin-top: 28px; }
  .ob-btn {
    flex: 1; padding: 15px; border-radius: 14px; font-size: 15px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s;
  }
  .ob-btn.primary {
    background: var(--ink); color: white;
  }
  .ob-btn.primary:hover { background: #2a2520; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,0,0,0.2); }
  .ob-btn.secondary {
    background: var(--card); color: var(--ink2);
    border: 1.5px solid rgba(0,0,0,0.08);
  }

  /* ── DASHBOARD ── */
  .dash-wrap { padding: 28px 28px 60px; }
  .dash-header { margin-bottom: 28px; }
  .dash-header h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 28px; letter-spacing: -0.5px; color: var(--ink);
  }
  .dash-header p { font-size: 14px; color: var(--ink2); margin-top: 4px; }

  .dash-grid {
    display: grid;
    grid-template-columns: 340px 1fr 280px;
    grid-template-rows: auto auto;
    gap: 18px;
  }

  .card {
    background: var(--card); border-radius: var(--radius);
    padding: 24px; box-shadow: var(--shadow);
  }
  .card-label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--ink3); margin-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-label span { color: var(--ink3); }

  /* Vision card */
  .vision-card {
    grid-column: 1; grid-row: 1;
    background: linear-gradient(135deg, #1a1814 0%, #2d2520 100%);
    color: white; position: relative; overflow: hidden;
  }
  .vision-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at top right, rgba(45,91,227,0.3), transparent 60%);
  }
  .vision-card .card-label { color: rgba(255,255,255,0.4); }
  .vision-card h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 22px; line-height: 1.3; color: white;
    position: relative; z-index: 1;
  }
  .vision-card p {
    font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 10px;
    line-height: 1.6; position: relative; z-index: 1;
  }
  .vision-gain {
    margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .gain-pill {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px; padding: 5px 12px; font-size: 12px; color: rgba(255,255,255,0.8);
  }

  /* KPI card */
  .kpi-card { grid-column: 2; grid-row: 1; }
  .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .kpi-item {
    background: var(--card2); border-radius: 14px; padding: 16px;
  }
  .kpi-item .label { font-size: 11px; color: var(--ink3); font-weight: 500; margin-bottom: 6px; }
  .kpi-item .value { font-size: 26px; font-weight: 600; color: var(--ink); letter-spacing: -1px; }
  .kpi-item .target { font-size: 12px; color: var(--ink3); margin-top: 2px; }
  .kpi-bar { height: 4px; border-radius: 2px; background: rgba(0,0,0,0.07); margin-top: 10px; }
  .kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

  /* Rocks card */
  .rocks-card { grid-column: 3; grid-row: 1 / 3; }
  .rock-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .rock-item:last-child { border-bottom: none; }
  .rock-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .rock-text { flex: 1; }
  .rock-text strong { font-size: 13px; font-weight: 600; display: block; color: var(--ink); }
  .rock-text span { font-size: 12px; color: var(--ink3); }
  .rock-progress { margin-top: 6px; height: 3px; border-radius: 2px; background: rgba(0,0,0,0.07); }
  .rock-progress-fill { height: 100%; border-radius: 2px; }

  /* Habit tracker */
  .habit-card { grid-column: 1 / 3; grid-row: 2; }
  .habit-grid {
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    gap: 5px; margin-top: 4px;
  }
  .habit-cell {
    aspect-ratio: 1; border-radius: 5px;
    background: rgba(0,0,0,0.06);
    transition: all 0.2s;
    cursor: pointer;
  }
  .habit-cell.done-3 { background: var(--accent); opacity: 0.9; }
  .habit-cell.done-2 { background: var(--accent); opacity: 0.55; }
  .habit-cell.done-1 { background: var(--accent); opacity: 0.25; }
  .habit-cell.today { outline: 2px solid var(--accent); outline-offset: 1px; }

  .habit-legend { display: flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 11px; color: var(--ink3); }
  .habit-legend-dots { display: flex; gap: 3px; }
  .habit-legend-dot { width: 10px; height: 10px; border-radius: 3px; }

  /* ── 3D ILLUSTRATIONS (CSS/SVG) ── */
  .il-rocket { font-size: 72px; filter: drop-shadow(0 8px 20px rgba(45,91,227,0.3)); animation: float 3s ease-in-out infinite; }
  .il-rock { font-size: 64px; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.2)); animation: float 3.5s ease-in-out infinite 0.5s; }
  .il-mountain { font-size: 68px; filter: drop-shadow(0 8px 20px rgba(46,204,138,0.3)); animation: float 4s ease-in-out infinite 1s; }
  .il-star { font-size: 60px; filter: drop-shadow(0 6px 18px rgba(245,166,35,0.4)); animation: spin-float 6s ease-in-out infinite; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes spin-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-8px) rotate(15deg); }
  }

  .il-cluster { display: flex; gap: 24px; align-items: center; justify-content: center; }

  .step-visual {
    display: flex; flex-direction: column; align-items: center;
    gap: 8px;
  }
  .step-visual p { font-size: 12px; color: var(--ink3); font-weight: 500; }

  /* responsive */
  @media (max-width: 900px) {
    .dash-grid { grid-template-columns: 1fr 1fr; }
    .rocks-card { grid-column: 1 / 3; grid-row: 3; }
    .habit-card { grid-column: 1 / 3; }
  }
  @media (max-width: 600px) {
    .dash-grid { grid-template-columns: 1fr; }
    .rocks-card { grid-column: 1; grid-row: auto; }
    .habit-card { grid-column: 1; }
    .kpi-card { grid-column: 1; }
    .vision-card { grid-column: 1; }
    .ob-row { grid-template-columns: 1fr; }
  }

  .badge {
    display: inline-flex; align-items: center;
    background: rgba(46,204,138,0.12); color: var(--accent3);
    font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px;
  }

  .section-divider {
    height: 1px; background: rgba(0,0,0,0.06); margin: 20px 0;
  }

  .weekly-bar-wrap { margin-top: 16px; }
  .weekly-bar-row {
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
  }
  .weekly-bar-label { font-size: 12px; color: var(--ink2); width: 90px; flex-shrink: 0; }
  .weekly-bar-track { flex: 1; height: 8px; background: rgba(0,0,0,0.07); border-radius: 4px; }
  .weekly-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .weekly-bar-val { font-size: 12px; font-weight: 600; color: var(--ink); width: 32px; text-align: right; }

  .ob-welcome {
    text-align: center; padding: 40px 0;
  }
  .ob-welcome .big-emoji { font-size: 80px; margin-bottom: 20px; display: block; animation: float 3s ease-in-out infinite; }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "dream",     label: "Dream",     icon: "🚀" },
  { id: "vision5",  label: "5 Years",   icon: "🏔️" },
  { id: "vision1",  label: "1 Year",    icon: "🎯" },
  { id: "quarters", label: "Quarterly", icon: "🪨" },
  { id: "kpis",     label: "KPIs",      icon: "📊" },
  { id: "blocks",   label: "Challenges",icon: "⚡" },
];

const FREEDOM_OPTIONS = ["Time freedom", "Location freedom", "Financial freedom", "Creative freedom", "Team freedom", "Impact at scale"];
const CHALLENGE_OPTIONS = ["Sales & revenue", "Team & hiring", "Marketing & leads", "Focus & clarity", "Systems & processes", "Burnout & energy", "Pricing", "Mindset"];

const HABIT_DATA = Array.from({ length: 91 }, (_, i) => {
  const rand = Math.random();
  if (i > 80) return "empty";
  if (rand > 0.75) return "done-3";
  if (rand > 0.5) return "done-2";
  if (rand > 0.3) return "done-1";
  return "empty";
});

const ROCKS = [
  { icon: "🚀", label: "Launch new offer", pct: 72, color: "var(--accent)" },
  { icon: "🪨", label: "Build SOPs for ops", pct: 40, color: "var(--accent2)" },
  { icon: "🏔️", label: "Hit €25k MRR", pct: 58, color: "var(--accent3)" },
  { icon: "⭐", label: "Hire 2 team members", pct: 20, color: "var(--gold)" },
];

const KPIS = [
  { label: "Revenue this week", value: "€8.4k", target: "€10k", pct: 84, color: "var(--accent)" },
  { label: "New leads", value: "12", target: "15", pct: 80, color: "var(--accent3)" },
  { label: "Calls booked", value: "5", target: "8", pct: 62, color: "var(--gold)" },
  { label: "Content pieces", value: "3", target: "5", pct: 60, color: "var(--accent2)" },
];

// ─── ILLUSTRATIONS ──────────────────────────────────────────────────────────
function StepIllustration({ step }) {
  if (step === "dream")    return <div className="il-cluster"><span className="il-rocket">🚀</span><span className="il-star">⭐</span></div>;
  if (step === "vision5")  return <div className="il-cluster"><span className="il-mountain">🏔️</span></div>;
  if (step === "vision1")  return <div className="il-cluster"><span className="il-rocket" style={{fontSize:56}}>🎯</span><span className="il-rock">🪨</span></div>;
  if (step === "quarters") return <div className="il-cluster"><span className="il-rock">🪨</span><span className="il-rock" style={{fontSize:48,animationDelay:'0.3s'}}>🪨</span><span className="il-rock" style={{fontSize:40,animationDelay:'0.7s'}}>🪨</span></div>;
  if (step === "kpis")     return <div className="il-cluster"><span style={{fontSize:64,animation:'float 3s ease-in-out infinite'}}>📊</span></div>;
  if (step === "blocks")   return <div className="il-cluster"><span style={{fontSize:64,animation:'float 3s ease-in-out infinite'}}>⚡</span></div>;
  return null;
}

// ─── ONBOARDING STEPS ────────────────────────────────────────────────────────
function OnboardStep({ stepId, data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  const toggleChip = (key, val) => {
    const arr = data[key] || [];
    set(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  if (stepId === "dream") return (
    <div className="ob-step" key="dream">
      <div className="ob-tag">✦ Your Foundation</div>
      <h2 className="ob-title">If your business gave you <em>everything</em> — what does that life look like?</h2>
      <p className="ob-sub">Don't think about revenue yet. Think about your Tuesdays. Where are you? Who are you with? What does freedom mean to you?</p>
      <div className="ob-illustration"><StepIllustration step="dream" /></div>
      <textarea className="ob-textarea" placeholder="I wake up without an alarm. I'm in Lisbon with my family, working 4 hours a day on things I love..." value={data.dream || ""} onChange={e => set("dream", e.target.value)} />
      <div className="ob-prompt">💡 Go deeper — what feeling are you really after? Is it peace, pride, presence, adventure?</div>
      <div style={{marginTop:20}}>
        <div className="card-label">What kind of freedom matters most to you?</div>
        <div className="ob-chips">
          {FREEDOM_OPTIONS.map(o => <div key={o} className={`ob-chip ${(data.freedoms||[]).includes(o)?'selected':''}`} onClick={()=>toggleChip("freedoms",o)}>{o}</div>)}
        </div>
      </div>
    </div>
  );

  if (stepId === "vision5") return (
    <div className="ob-step" key="vision5">
      <div className="ob-tag">🏔️ 5-Year Vision</div>
      <h2 className="ob-title">Where is your business in <em>5 years</em>?</h2>
      <p className="ob-sub">Be specific and bold. Revenue, team size, clients, geography — paint the full picture.</p>
      <div className="ob-illustration"><StepIllustration step="vision5" /></div>
      <textarea className="ob-textarea" placeholder="My agency does €5M/year with a team of 12. We work with 30 premium clients. I'm involved only in strategy..." value={data.vision5 || ""} onChange={e => set("vision5", e.target.value)} />
      <div className="ob-prompt">💡 What would you need to believe about yourself to make this real? What version of you exists in that future?</div>
      <div className="ob-row" style={{marginTop:20}}>
        <div className="ob-field"><label>Revenue Target (5yr)</label><input className="ob-input" placeholder="€5,000,000" value={data.rev5||""} onChange={e=>set("rev5",e.target.value)} /></div>
        <div className="ob-field"><label>Team Size</label><input className="ob-input" placeholder="12 people" value={data.team5||""} onChange={e=>set("team5",e.target.value)} /></div>
      </div>
    </div>
  );

  if (stepId === "vision1") return (
    <div className="ob-step" key="vision1">
      <div className="ob-tag">🎯 1-Year Target</div>
      <h2 className="ob-title">What needs to be true by <em>end of this year</em>?</h2>
      <p className="ob-sub">This is your bridge from now to the 5-year vision. Make it ambitious but achievable.</p>
      <div className="ob-illustration"><StepIllustration step="vision1" /></div>
      <textarea className="ob-textarea" placeholder="By December I have €25k MRR, a full-time team member, and a predictable lead system..." value={data.vision1 || ""} onChange={e => set("vision1", e.target.value)} />
      <div className="ob-prompt">💡 If you hit ONLY this one thing this year, would it feel like a win? If not — adjust it.</div>
      <div className="ob-row" style={{marginTop:20}}>
        <div className="ob-field"><label>Revenue Target (1yr)</label><input className="ob-input" placeholder="€300,000" value={data.rev1||""} onChange={e=>set("rev1",e.target.value)} /></div>
        <div className="ob-field"><label>#1 Priority this year</label><input className="ob-input" placeholder="Build a scalable offer" value={data.priority1||""} onChange={e=>set("priority1",e.target.value)} /></div>
      </div>
    </div>
  );

  if (stepId === "quarters") return (
    <div className="ob-step" key="quarters">
      <div className="ob-tag">🪨 Quarterly Rocks</div>
      <h2 className="ob-title">What are your <em>3 big rocks</em> this quarter?</h2>
      <p className="ob-sub">A rock is a significant goal that moves the needle. Not tasks — outcomes. What 3 things, if done, make this quarter a win?</p>
      <div className="ob-illustration"><StepIllustration step="quarters" /></div>
      {[1,2,3].map(n => (
        <div key={n} style={{marginBottom:12}}>
          <div className="ob-field"><label>Rock {n}</label>
            <input className="ob-input" placeholder={["Launch my new premium offer","Hire a full-time operations person","Build and launch a lead gen system"][n-1]} value={data[`rock${n}`]||""} onChange={e=>set(`rock${n}`,e.target.value)} />
          </div>
        </div>
      ))}
      <div className="ob-prompt">💡 Rocks should scare you a little. If they're easy, they're tasks — not rocks.</div>
    </div>
  );

  if (stepId === "kpis") return (
    <div className="ob-step" key="kpis">
      <div className="ob-tag">📊 Weekly KPIs</div>
      <h2 className="ob-title">What numbers will you <em>track every week</em>?</h2>
      <p className="ob-sub">These are your vital signs. What you measure, you move. Pick 3–5 numbers that tell you if the business is healthy.</p>
      <div className="ob-illustration"><StepIllustration step="kpis" /></div>
      {[1,2,3,4].map(n => (
        <div className="ob-row" key={n} style={{marginBottom:0}}>
          <div className="ob-field"><label>KPI {n} Name</label><input className="ob-input" placeholder={["Revenue","Leads generated","Sales calls","Content pieces"][n-1]} value={data[`kpiName${n}`]||""} onChange={e=>set(`kpiName${n}`,e.target.value)} /></div>
          <div className="ob-field"><label>Weekly Target</label><input className="ob-input" placeholder={["€10,000","10","5","4"][n-1]} value={data[`kpiTarget${n}`]||""} onChange={e=>set(`kpiTarget${n}`,e.target.value)} /></div>
        </div>
      ))}
    </div>
  );

  if (stepId === "blocks") return (
    <div className="ob-step" key="blocks">
      <div className="ob-tag">⚡ Challenges</div>
      <h2 className="ob-title">What's <em>blocking you</em> right now?</h2>
      <p className="ob-sub">Be honest. The things you avoid naming have the most power. Let's name them.</p>
      <div className="ob-illustration"><StepIllustration step="blocks" /></div>
      <div className="ob-chips">
        {CHALLENGE_OPTIONS.map(o => <div key={o} className={`ob-chip ${(data.challenges||[]).includes(o)?'selected':''}`} onClick={()=>toggleChip("challenges",o)}>{o}</div>)}
      </div>
      <textarea className="ob-textarea" style={{marginTop:16}} placeholder="The biggest thing standing between me and my next level is..." value={data.mainBlock || ""} onChange={e => set("mainBlock", e.target.value)} />
      <div className="ob-prompt">💡 Is this really the block — or is the real block something deeper? Fear of success? Imposter syndrome? Write the truth.</div>
    </div>
  );

  return null;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ founderData }) {
  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <h1>Good morning, {founderData?.name || "Founder"} 👋</h1>
        <p>Week 23 · Q2 2026 · <span style={{color:"var(--accent3)",fontWeight:600}}>72% toward your quarterly rocks</span></p>
      </div>

      <div className="dash-grid">
        {/* Vision card */}
        <div className="card vision-card">
          <div className="card-label" style={{color:'rgba(255,255,255,0.35)'}}>YOUR WHY</div>
          <h2>"{founderData?.dream?.slice(0,80) || "Build a business that gives me time, freedom and impact — not just revenue."}"</h2>
          <p>{founderData?.vision1 || "€25k MRR by December. A team I trust. A life I love."}</p>
          <div className="vision-gain">
            {(founderData?.freedoms || ["Time freedom","Financial freedom","Impact at scale"]).map(f => (
              <span key={f} className="gain-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* KPI card */}
        <div className="card kpi-card">
          <div className="card-label">This Week's KPIs <span className="badge">Live</span></div>
          <div className="kpi-grid">
            {KPIS.map(k => (
              <div key={k.label} className="kpi-item">
                <div className="label">{k.label}</div>
                <div className="value">{k.value}</div>
                <div className="target">Target: {k.target}</div>
                <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:`${k.pct}%`,background:k.color}} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Rocks */}
        <div className="card rocks-card">
          <div className="card-label">Q2 Rocks</div>
          {ROCKS.map(r => (
            <div key={r.label} className="rock-item">
              <div className="rock-icon" style={{background:`${r.color}18`}}>{r.icon}</div>
              <div className="rock-text">
                <strong>{r.label}</strong>
                <span>{r.pct}% complete</span>
                <div className="rock-progress"><div className="rock-progress-fill" style={{width:`${r.pct}%`,background:r.color}} /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Habit tracker */}
        <div className="card habit-card">
          <div className="card-label">Focus Streak — Last 13 Weeks <span style={{color:'var(--accent)',fontWeight:700}}>🔥 14 days</span></div>
          <div className="habit-grid">
            {HABIT_DATA.map((d, i) => (
              <div key={i} className={`habit-cell ${d} ${i === 88 ? 'today' : ''}`} />
            ))}
          </div>
          <div className="habit-legend">
            <span>Less</span>
            <div className="habit-legend-dots">
              {["rgba(0,0,0,0.06)","rgba(45,91,227,0.25)","rgba(45,91,227,0.55)","rgba(45,91,227,0.9)"].map((c,i) => (
                <div key={i} className="habit-legend-dot" style={{background:c}} />
              ))}
            </div>
            <span>More</span>
          </div>

          <div className="section-divider" />
          <div className="card-label" style={{marginBottom:12}}>KPI Trend — Last 4 Weeks</div>
          <div className="weekly-bar-wrap">
            {[{l:"Week 20",p:55},{l:"Week 21",p:68},{l:"Week 22",p:74},{l:"Week 23",p:84}].map(w=>(
              <div key={w.l} className="weekly-bar-row">
                <div className="weekly-bar-label">{w.l}</div>
                <div className="weekly-bar-track"><div className="weekly-bar-fill" style={{width:`${w.p}%`,background:'var(--accent)'}}/></div>
                <div className="weekly-bar-val">{w.p}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function FounderOS() {
  const [view, setView] = useState("onboard"); // onboard | dashboard
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "Alex", freedoms: ["Time freedom","Financial freedom"] });

  const isLast = step === STEPS.length - 1;

  return (
    <>
      <style>{styles}</style>
      <div className="os-root">
        <nav className="nav">
          <div className="nav-logo">Founder<span>OS</span></div>
          <div className="nav-tabs">
            <button className={`nav-tab ${view==="onboard"?"active":""}`} onClick={()=>setView("onboard")}>Onboarding</button>
            <button className={`nav-tab ${view==="dashboard"?"active":""}`} onClick={()=>setView("dashboard")}>Dashboard</button>
          </div>
          <div className="nav-avatar">A</div>
        </nav>

        {view === "onboard" && (
          <div className="onboard-wrap">
            {/* Progress */}
            <div className="ob-progress">
              {STEPS.map((s, i) => (
                <div key={s.id} className={`ob-progress-bar ${i < step ? "done" : i === step ? "active" : ""}`} />
              ))}
            </div>

            {/* Step label */}
            <div style={{display:'flex',gap:8,marginBottom:28}}>
              {STEPS.map((s,i) => (
                <div key={s.id} style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:i<=step?'var(--accent)':'var(--ink3)',fontWeight:i===step?600:400,cursor:'pointer'}} onClick={()=>setStep(i)}>
                  <span>{s.icon}</span>
                  <span style={{display: i>0&&window.innerWidth<500?'none':'inline'}}>{s.label}</span>
                  {i < STEPS.length-1 && <span style={{marginLeft:4,color:'var(--ink3)'}}>·</span>}
                </div>
              ))}
            </div>

            <OnboardStep stepId={STEPS[step].id} data={data} onChange={setData} />

            <div className="ob-btn-row">
              {step > 0 && <button className="ob-btn secondary" onClick={()=>setStep(s=>s-1)}>← Back</button>}
              <button className="ob-btn primary" onClick={()=>{ if(isLast){setView("dashboard")}else{setStep(s=>s+1)} }}>
                {isLast ? "Launch my OS 🚀" : "Continue →"}
              </button>
            </div>
          </div>
        )}

        {view === "dashboard" && <Dashboard founderData={data} />}
      </div>
    </>
  );
}
