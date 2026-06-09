import { useState, useEffect, useRef } from "react";

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
    --shadow-lg: 0 8px 48px rgba(0,0,0,0.14);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }

  .os-root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 20% 20%, rgba(45,91,227,0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 80%, rgba(232,93,47,0.05) 0%, transparent 60%);
    position: relative;
    overflow-x: hidden;
  }

  /* ── RAINBOW FROG OVERLAY ── */
  .rainbow-overlay {
    pointer-events: none;
    position: fixed; inset: 0; z-index: 200;
    opacity: 0;
    transition: opacity 1.2s ease;
    background: linear-gradient(
      135deg,
      rgba(255,0,128,0.07) 0%,
      rgba(255,100,0,0.06) 15%,
      rgba(255,220,0,0.07) 30%,
      rgba(0,220,100,0.06) 45%,
      rgba(0,180,255,0.07) 60%,
      rgba(100,0,255,0.06) 75%,
      rgba(255,0,180,0.07) 100%
    );
    backdrop-filter: blur(0px);
  }
  .rainbow-overlay.active {
    opacity: 1;
    animation: rainbowPulse 4s ease-in-out forwards;
  }
  @keyframes rainbowPulse {
    0%   { opacity: 0; }
    20%  { opacity: 1; }
    70%  { opacity: 0.8; }
    100% { opacity: 0; }
  }
  .rainbow-overlay::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom right,
      rgba(255,255,255,0.18) 0%,
      rgba(255,255,255,0) 50%,
      rgba(255,255,255,0.1) 100%
    );
  }

  /* ── CONFETTI ── */
  .confetti-wrap {
    pointer-events: none;
    position: fixed; inset: 0; z-index: 201;
    overflow: hidden;
  }
  .confetti-piece {
    position: absolute; top: -20px;
    width: 8px; height: 8px; border-radius: 2px;
    animation: confettiFall linear forwards;
  }
  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  /* ── NAV ── */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 28px;
    background: rgba(240,237,232,0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-logo {
    font-family: 'Instrument Serif', serif;
    font-size: 20px; letter-spacing: -0.5px; color: var(--ink);
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
    font-size: 13px; font-weight: 700; color: white; cursor: pointer;
  }

  /* ── DASHBOARD ── */
  .dash-wrap { padding: 28px 28px 100px; max-width: 1400px; margin: 0 auto; }
  .dash-header { margin-bottom: 28px; }
  .dash-header h1 {
    font-family: 'Instrument Serif', serif;
    font-size: 30px; letter-spacing: -0.5px; color: var(--ink);
  }
  .dash-header p { font-size: 14px; color: var(--ink2); margin-top: 4px; }

  .dash-grid {
    display: grid;
    grid-template-columns: 320px 1fr 260px;
    gap: 18px;
  }

  .card {
    background: var(--card); border-radius: var(--radius);
    padding: 22px; box-shadow: var(--shadow);
  }
  .card-label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--ink3); margin-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .vision-card {
    grid-column: 1; grid-row: 1;
    background: linear-gradient(140deg, #1a1814 0%, #2a2040 100%);
    color: white; position: relative; overflow: hidden;
  }
  .vision-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at top right, rgba(45,91,227,0.35), transparent 65%);
  }
  .vision-card .card-label { color: rgba(255,255,255,0.35); }
  .vision-card h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 20px; line-height: 1.35; color: white; position: relative; z-index: 1;
  }
  .vision-card p { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 8px; line-height: 1.6; position: relative; z-index: 1; }
  .vision-gain { margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap; position: relative; z-index: 1; }
  .gain-pill {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px; padding: 4px 11px; font-size: 11px; color: rgba(255,255,255,0.75);
  }
  .locked-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 6px; padding: 3px 8px; font-size: 10px; color: rgba(255,255,255,0.4);
    margin-top: 14px; position: relative; z-index: 1;
  }

  .kpi-card { grid-column: 2; grid-row: 1; }
  .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .kpi-item { background: var(--card2); border-radius: 14px; padding: 14px; }
  .kpi-item .label { font-size: 11px; color: var(--ink3); font-weight: 500; margin-bottom: 4px; }
  .kpi-item .value { font-size: 24px; font-weight: 600; color: var(--ink); letter-spacing: -0.5px; }
  .kpi-item .target { font-size: 11px; color: var(--ink3); margin-top: 2px; }
  .kpi-bar { height: 3px; border-radius: 2px; background: rgba(0,0,0,0.07); margin-top: 8px; }
  .kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }

  .rocks-card { grid-column: 3; grid-row: 1 / 3; }
  .rock-item { display: flex; align-items: flex-start; gap: 11px; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .rock-item:last-child { border-bottom: none; }
  .rock-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .rock-text strong { font-size: 13px; font-weight: 600; display: block; color: var(--ink); }
  .rock-text span { font-size: 11px; color: var(--ink3); }
  .rock-progress { margin-top: 5px; height: 3px; border-radius: 2px; background: rgba(0,0,0,0.07); }
  .rock-progress-fill { height: 100%; border-radius: 2px; }

  .habit-card { grid-column: 1 / 3; grid-row: 2; }
  .habit-grid { display: grid; grid-template-columns: repeat(13, 1fr); gap: 5px; margin-top: 4px; }
  .habit-cell { aspect-ratio: 1; border-radius: 4px; background: rgba(0,0,0,0.06); cursor: pointer; transition: all 0.2s; }
  .habit-cell.done-3 { background: var(--accent); opacity: 0.9; }
  .habit-cell.done-2 { background: var(--accent); opacity: 0.55; }
  .habit-cell.done-1 { background: var(--accent); opacity: 0.25; }
  .habit-cell.today { outline: 2px solid var(--accent); outline-offset: 1px; }
  .habit-legend { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 11px; color: var(--ink3); }
  .habit-legend-dots { display: flex; gap: 3px; }
  .habit-legend-dot { width: 10px; height: 10px; border-radius: 3px; }

  .section-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 18px 0; }
  .weekly-bar-wrap { margin-top: 12px; }
  .weekly-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 9px; }
  .weekly-bar-label { font-size: 12px; color: var(--ink2); width: 80px; flex-shrink: 0; }
  .weekly-bar-track { flex: 1; height: 7px; background: rgba(0,0,0,0.07); border-radius: 4px; }
  .weekly-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .weekly-bar-val { font-size: 12px; font-weight: 600; color: var(--ink); width: 32px; text-align: right; }

  .badge { display: inline-flex; align-items: center; background: rgba(46,204,138,0.12); color: var(--accent3); font-size: 10px; font-weight: 600; padding: 3px 7px; border-radius: 6px; }

  /* ── DAILY TAB ── */
  .daily-wrap { padding: 28px 28px 100px; max-width: 900px; margin: 0 auto; }
  .daily-header { margin-bottom: 24px; }
  .daily-header h1 { font-family: 'Instrument Serif', serif; font-size: 28px; letter-spacing: -0.5px; }
  .daily-header p { font-size: 14px; color: var(--ink2); margin-top: 4px; }

  .morning-card {
    background: linear-gradient(135deg, #fffbf0, #fff8e8);
    border: 1.5px solid rgba(245,166,35,0.2);
    border-radius: var(--radius); padding: 22px; margin-bottom: 20px;
    box-shadow: 0 2px 20px rgba(245,166,35,0.08);
  }
  .morning-card h3 { font-family: 'Instrument Serif', serif; font-size: 18px; color: var(--ink); margin-bottom: 4px; }
  .morning-card p { font-size: 13px; color: var(--ink2); margin-bottom: 14px; line-height: 1.6; }
  .morning-entry {
    width: 100%; min-height: 80px; background: rgba(255,255,255,0.8);
    border: 1.5px solid rgba(245,166,35,0.2); border-radius: 12px;
    padding: 14px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--ink); resize: none; outline: none; line-height: 1.6;
  }
  .morning-entry:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(245,166,35,0.1); }
  .morning-entry::placeholder { color: var(--ink3); }

  /* Task input */
  .task-input-wrap { display: flex; gap: 10px; margin-bottom: 20px; }
  .task-input {
    flex: 1; background: var(--card); border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 14px; padding: 14px 18px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    outline: none; box-shadow: var(--shadow); transition: border-color 0.2s;
  }
  .task-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,91,227,0.1); }
  .task-input::placeholder { color: var(--ink3); }
  .task-add-btn {
    padding: 14px 22px; background: var(--ink); color: white;
    border: none; border-radius: 14px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .task-add-btn:hover { background: #2a2520; transform: translateY(-1px); }

  /* Task type modal */
  .type-modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.25);
    backdrop-filter: blur(4px); z-index: 150;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .type-modal {
    background: var(--card); border-radius: 24px; padding: 28px;
    width: 420px; max-width: 90vw; box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .type-modal h3 { font-family: 'Instrument Serif', serif; font-size: 22px; margin-bottom: 6px; }
  .type-modal p { font-size: 13px; color: var(--ink2); margin-bottom: 20px; line-height: 1.5; }
  .type-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .type-option {
    padding: 16px; border-radius: 14px; border: 1.5px solid rgba(0,0,0,0.08);
    cursor: pointer; transition: all 0.2s; text-align: left;
    background: var(--card2);
  }
  .type-option:hover { border-color: var(--accent); background: rgba(45,91,227,0.04); transform: translateY(-1px); }
  .type-option .type-emoji { font-size: 28px; display: block; margin-bottom: 6px; }
  .type-option .type-name { font-size: 13px; font-weight: 600; color: var(--ink); display: block; }
  .type-option .type-desc { font-size: 11px; color: var(--ink3); margin-top: 2px; display: block; line-height: 1.4; }

  /* Task list */
  .task-section { margin-bottom: 24px; }
  .task-section-label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--ink3); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .task-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.06); }

  .task-item {
    display: flex; align-items: center; gap: 12px;
    background: var(--card); border-radius: 14px; padding: 14px 16px;
    margin-bottom: 8px; box-shadow: var(--shadow); transition: all 0.3s;
    border: 1.5px solid transparent;
  }
  .task-item.frog { border-color: rgba(46,204,138,0.3); background: rgba(46,204,138,0.03); }
  .task-item.done { opacity: 0.5; }
  .task-item.done .task-title { text-decoration: line-through; color: var(--ink3); }

  .task-check {
    width: 22px; height: 22px; border-radius: 50%;
    border: 2px solid rgba(0,0,0,0.15); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.2s; background: transparent;
  }
  .task-check:hover { border-color: var(--accent3); }
  .task-check.checked { background: var(--accent3); border-color: var(--accent3); }
  .task-check.checked::after { content: '✓'; color: white; font-size: 11px; font-weight: 700; }

  .task-emoji { font-size: 18px; flex-shrink: 0; }
  .task-title { flex: 1; font-size: 14px; font-weight: 500; color: var(--ink); }
  .task-type-badge {
    font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 6px;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .badge-frog { background: rgba(46,204,138,0.12); color: var(--accent3); }
  .badge-block { background: rgba(45,91,227,0.1); color: var(--accent); }
  .badge-mosquito { background: rgba(160,154,148,0.15); color: var(--ink3); }
  .badge-distraction { background: rgba(232,93,47,0.1); color: var(--accent2); }

  .task-delete {
    background: none; border: none; color: var(--ink3); cursor: pointer;
    font-size: 16px; padding: 2px 4px; border-radius: 6px; transition: all 0.2s; opacity: 0;
  }
  .task-item:hover .task-delete { opacity: 1; }
  .task-delete:hover { color: var(--accent2); background: rgba(232,93,47,0.08); }

  /* Progress bar */
  .progress-bar-wrap { background: var(--card); border-radius: 14px; padding: 16px 18px; margin-bottom: 20px; box-shadow: var(--shadow); }
  .progress-bar-track { height: 8px; background: rgba(0,0,0,0.07); border-radius: 4px; margin: 8px 0; }
  .progress-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--accent3), var(--accent)); transition: width 0.6s ease; }
  .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--ink2); }

  /* Evening reflection */
  .evening-card {
    background: linear-gradient(135deg, #f0f0ff, #ebe8ff);
    border: 1.5px solid rgba(100,80,220,0.15);
    border-radius: var(--radius); padding: 22px; margin-top: 20px;
    box-shadow: 0 2px 20px rgba(100,80,220,0.06);
  }
  .evening-card h3 { font-family: 'Instrument Serif', serif; font-size: 18px; color: var(--ink); margin-bottom: 4px; }
  .evening-card p { font-size: 13px; color: var(--ink2); margin-bottom: 14px; line-height: 1.6; }
  .evening-entry {
    width: 100%; min-height: 80px; background: rgba(255,255,255,0.7);
    border: 1.5px solid rgba(100,80,220,0.15); border-radius: 12px;
    padding: 14px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--ink); resize: none; outline: none; line-height: 1.6;
    margin-bottom: 10px;
  }
  .evening-entry:focus { border-color: #6450dc; box-shadow: 0 0 0 3px rgba(100,80,220,0.1); }
  .evening-entry::placeholder { color: var(--ink3); }
  .save-btn {
    padding: 11px 22px; background: var(--ink); color: white;
    border: none; border-radius: 11px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .save-btn:hover { background: #2a2520; transform: translateY(-1px); }

  /* ── CHATBOT ── */
  .chat-bubble {
    position: fixed; bottom: 28px; right: 28px; z-index: 300;
    width: 54px; height: 54px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #5b3de8);
    box-shadow: 0 4px 24px rgba(45,91,227,0.4);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 22px;
    transition: all 0.3s; border: none;
    animation: bubblePulse 3s ease-in-out infinite;
  }
  @keyframes bubblePulse {
    0%, 100% { box-shadow: 0 4px 24px rgba(45,91,227,0.4); }
    50%       { box-shadow: 0 4px 36px rgba(45,91,227,0.6); }
  }
  .chat-bubble:hover { transform: scale(1.08); }
  .chat-bubble .notif-dot {
    position: absolute; top: 2px; right: 2px;
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--accent2); border: 2px solid white;
  }

  .chat-panel {
    position: fixed; bottom: 96px; right: 28px; z-index: 300;
    width: 360px; max-height: 560px;
    background: var(--card); border-radius: 24px;
    box-shadow: var(--shadow-lg); display: flex; flex-direction: column;
    overflow: hidden;
    animation: chatSlideUp 0.3s ease;
  }
  @keyframes chatSlideUp {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .chat-header {
    padding: 16px 20px; display: flex; align-items: center; gap: 12px;
    background: linear-gradient(135deg, var(--accent), #5b3de8);
    color: white;
  }
  .chat-header-avatar { font-size: 22px; }
  .chat-header-text strong { display: block; font-size: 14px; font-weight: 600; }
  .chat-header-text span { font-size: 11px; opacity: 0.7; }
  .chat-close {
    margin-left: auto; background: rgba(255,255,255,0.15);
    border: none; color: white; width: 28px; height: 28px;
    border-radius: 8px; cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .chat-close:hover { background: rgba(255,255,255,0.25); }

  .chat-messages {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 10px;
    scroll-behavior: smooth;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }

  .msg { max-width: 85%; animation: msgPop 0.25s ease; }
  @keyframes msgPop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .msg.bot { align-self: flex-start; }
  .msg.user { align-self: flex-end; }
  .msg-bubble {
    padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.55;
  }
  .msg.bot .msg-bubble {
    background: var(--card2); color: var(--ink);
    border-radius: 4px 16px 16px 16px;
  }
  .msg.user .msg-bubble {
    background: var(--accent); color: white;
    border-radius: 16px 4px 16px 16px;
  }
  .msg-time { font-size: 10px; color: var(--ink3); margin-top: 3px; padding: 0 4px; }
  .msg.user .msg-time { text-align: right; }

  .chat-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
  .chat-chip {
    padding: 7px 13px; border-radius: 20px;
    border: 1.5px solid rgba(45,91,227,0.2);
    background: rgba(45,91,227,0.05); font-size: 12px;
    color: var(--accent); cursor: pointer; font-weight: 500;
    transition: all 0.2s;
  }
  .chat-chip:hover { background: var(--accent); color: white; border-color: var(--accent); }

  .chat-input-row {
    padding: 12px 14px; border-top: 1px solid rgba(0,0,0,0.06);
    display: flex; gap: 8px;
  }
  .chat-input {
    flex: 1; background: var(--card2); border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 10px; padding: 9px 13px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink);
    outline: none; transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--accent); }
  .chat-input::placeholder { color: var(--ink3); }
  .chat-send {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--accent); border: none; color: white;
    cursor: pointer; font-size: 14px; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .chat-send:hover { background: #2448c0; }

  /* typing indicator */
  .typing { display: flex; gap: 4px; align-items: center; padding: 6px 0; }
  .typing span {
    width: 6px; height: 6px; border-radius: 50%; background: var(--ink3);
    animation: typingBounce 1.2s ease-in-out infinite;
  }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  /* floating animations */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes spin-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%       { transform: translateY(-6px) rotate(12deg); }
  }
  .il-rocket { font-size: 68px; filter: drop-shadow(0 8px 18px rgba(45,91,227,0.3)); animation: float 3s ease-in-out infinite; }
  .il-rock    { font-size: 60px; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.18)); animation: float 3.5s ease-in-out infinite 0.5s; }
  .il-mountain{ font-size: 64px; filter: drop-shadow(0 8px 18px rgba(46,204,138,0.3)); animation: float 4s ease-in-out infinite 1s; }
  .il-star    { font-size: 56px; filter: drop-shadow(0 6px 16px rgba(245,166,35,0.4)); animation: spin-float 6s ease-in-out infinite; }
  .il-cluster { display: flex; gap: 20px; align-items: center; justify-content: center; }

  @media (max-width: 1000px) {
    .dash-grid { grid-template-columns: 1fr 1fr; }
    .rocks-card { grid-column: 1 / 3; grid-row: 3; }
    .habit-card { grid-column: 1 / 3; }
  }
  @media (max-width: 640px) {
    .dash-grid { grid-template-columns: 1fr; }
    .rocks-card, .habit-card, .kpi-card, .vision-card { grid-column: 1; grid-row: auto; }
    .chat-panel { width: calc(100vw - 32px); right: 16px; }
    .nav { padding: 12px 16px; }
    .dash-wrap, .daily-wrap { padding: 18px 16px 100px; }
  }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const HABIT_DATA = Array.from({ length: 91 }, (_, i) => {
  if (i > 83) return "empty";
  const r = Math.random();
  if (r > 0.72) return "done-3";
  if (r > 0.48) return "done-2";
  if (r > 0.28) return "done-1";
  return "empty";
});

const ROCKS = [
  { icon: "🚀", label: "Launch new offer",    pct: 72, color: "var(--accent)" },
  { icon: "🪨", label: "Build SOPs for ops",   pct: 40, color: "var(--accent2)" },
  { icon: "🏔️", label: "Hit €25k MRR",        pct: 58, color: "var(--accent3)" },
  { icon: "⭐", label: "Hire 2 team members",  pct: 20, color: "var(--gold)" },
];

const KPIS = [
  { label: "Revenue this week", value: "€8.4k", target: "€10k", pct: 84, color: "var(--accent)" },
  { label: "New leads",         value: "12",    target: "15",   pct: 80, color: "var(--accent3)" },
  { label: "Calls booked",      value: "5",     target: "8",    pct: 62, color: "var(--gold)" },
  { label: "Content pieces",    value: "3",     target: "5",    pct: 60, color: "var(--accent2)" },
];

const TASK_TYPES = [
  { id: "frog",        emoji: "🐸", name: "Frog",        desc: "Most important thing today — do this first", badge: "badge-frog" },
  { id: "block",       emoji: "🧱", name: "Building block", desc: "Directly moves a quarterly rock forward", badge: "badge-block" },
  { id: "mosquito",    emoji: "🦟", name: "Mosquito",    desc: "Necessary admin — just has to be done", badge: "badge-mosquito" },
  { id: "distraction", emoji: "🌀", name: "Distraction", desc: "Nice to have, not a must — watch out", badge: "badge-distraction" },
];

const TYPE_ORDER = ["frog", "block", "mosquito", "distraction"];

const BOT_FLOWS = {
  morning: [
    { id: "m1", bot: "Good morning! ☀️ Before the day begins — what are you genuinely grateful for right now? Even one small thing.", field: "gratitude" },
    { id: "m2", bot: "Love that. Now set your intention: what would make today feel like a real win, regardless of how much you get done?", field: "intention" },
    { id: "m3", bot: "Perfect. Go build it. Your tasks are ready below. 🚀", field: null, final: true },
  ],
  evening: [
    { id: "e1", bot: "Day's wrapping up 🌙 — how do you feel about what you got done today? Honest answer.", field: "feeling" },
    { id: "e2", bot: "What was the most meaningful thing that happened or that you moved forward today?", field: "win" },
    { id: "e3", bot: "Anything left unfinished that's weighing on you? We can carry it forward to tomorrow.", field: "carryover" },
    { id: "e4", bot: "Good. Rest well — you showed up. See you tomorrow morning. 🌟", field: null, final: true },
  ],
  weekly: [
    { id: "w1", bot: "Weekly check-in time! 📊 Looking at your KPIs — what went well this week?", field: "weekWin" },
    { id: "w2", bot: "What didn't move as much as you'd like? What was in the way?", field: "weekBlock" },
    { id: "w3", bot: "What's the single most important thing you need to accomplish next week?", field: "weekFocus" },
    { id: "w4", bot: "Brilliant. I've updated your dashboard. You're on track — keep the momentum. 💪", field: null, final: true },
  ],
};

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ["#2d5be3","#e85d2f","#2ecc8a","#f5a623","#e040fb","#00bcd4"][i % 6],
    delay: Math.random() * 0.8,
    duration: 1.8 + Math.random() * 1.2,
    size: 6 + Math.random() * 6,
  }));
  return (
    <div className="confetti-wrap">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, background: p.color,
          width: p.size, height: p.size,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }} />
      ))}
    </div>
  );
}

// ── CHATBOT ───────────────────────────────────────────────────────────────────
function ChatBot({ open, onClose, flowType, onFlowComplete }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [flowStep, setFlowStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState([]);
  const bottomRef = useRef(null);
  const flow = BOT_FLOWS[flowType] || BOT_FLOWS.morning;

  useEffect(() => {
    if (open) {
      setMessages([]);
      setFlowStep(0);
      setInput("");
      setTimeout(() => pushBot(flow[0].bot, flow[0].chips), 400);
    }
  }, [open, flowType]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const pushBot = (text, newChips = []) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now(), role: "bot", text }]);
      setChips(newChips);
    }, 900);
  };

  const handleSend = (text) => {
    const val = text || input.trim();
    if (!val) return;
    setInput("");
    setChips([]);
    setMessages(m => [...m, { id: Date.now(), role: "user", text: val }]);
    const next = flowStep + 1;
    if (next < flow.length) {
      setFlowStep(next);
      pushBot(flow[next].bot, flow[next].chips);
      if (flow[next].final) setTimeout(() => onFlowComplete && onFlowComplete(), 1800);
    }
  };

  if (!open) return null;
  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-avatar">🤖</div>
        <div className="chat-header-text">
          <strong>Founder Coach</strong>
          <span>Your daily clarity engine</span>
        </div>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className="msg-bubble">{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="msg bot">
            <div className="msg-bubble"><div className="typing"><span/><span/><span/></div></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {chips.length > 0 && (
        <div className="chat-chips">
          {chips.map(c => <button key={c} className="chat-chip" onClick={() => handleSend(c)}>{c}</button>)}
        </div>
      )}

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Type your answer…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button className="chat-send" onClick={() => handleSend()}>→</button>
      </div>
    </div>
  );
}

// ── TASK TYPE MODAL ───────────────────────────────────────────────────────────
function TaskTypeModal({ taskTitle, onSelect, onCancel }) {
  return (
    <div className="type-modal-backdrop" onClick={onCancel}>
      <div className="type-modal" onClick={e => e.stopPropagation()}>
        <h3>What kind of task is this?</h3>
        <p>"{taskTitle}"</p>
        <div className="type-options">
          {TASK_TYPES.map(t => (
            <div key={t.id} className="type-option" onClick={() => onSelect(t.id)}>
              <span className="type-emoji">{t.emoji}</span>
              <span className="type-name">{t.name}</span>
              <span className="type-desc">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DAILY VIEW ────────────────────────────────────────────────────────────────
function DailyView({ onFrogDone }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Send proposal to Mia", type: "frog",        done: false },
    { id: 2, title: "Record intro video for new offer", type: "block", done: false },
    { id: 3, title: "Reply to client emails", type: "mosquito",  done: false },
    { id: 4, title: "Browse new design tools", type: "distraction", done: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [pendingTask, setPendingTask] = useState(null);
  const [gratitude, setGratitude] = useState("");
  const [reflection, setReflection] = useState("");
  const [halfCelebrated, setHalfCelebrated] = useState(false);

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const addTask = () => {
    const val = newTask.trim();
    if (!val) return;
    setNewTask("");
    setPendingTask(val);
  };

  const confirmType = (type) => {
    const task = { id: Date.now(), title: pendingTask, type, done: false };
    setTasks(prev => {
      const sorted = [...prev, task].sort((a, b) =>
        TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)
      );
      return sorted;
    });
    setPendingTask(null);
  };

  const toggle = (id) => {
    let frogJustDone = false;
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.done && t.type === "frog") frogJustDone = true;
        return { ...t, done: !t.done };
      }
      return t;
    }));
    if (frogJustDone) onFrogDone();
    const newDone = tasks.filter(t => t.done).length + 1;
    if (!halfCelebrated && newDone >= Math.ceil(total / 2)) {
      setHalfCelebrated(true);
    }
  };

  const grouped = TYPE_ORDER.map(type => ({
    type, tasks: tasks.filter(t => t.type === type),
  })).filter(g => g.tasks.length > 0);

  const typeInfo = (id) => TASK_TYPES.find(t => t.id === id);

  return (
    <div className="daily-wrap">
      {pendingTask && <TaskTypeModal taskTitle={pendingTask} onSelect={confirmType} onCancel={() => setPendingTask(null)} />}

      <div className="daily-header">
        <h1>Today's work 🗓️</h1>
        <p>{new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" })}</p>
      </div>

      {/* Morning card */}
      <div className="morning-card">
        <h3>☀️ Morning intention</h3>
        <p>Start with gratitude. What are you thankful for right now?</p>
        <textarea className="morning-entry" placeholder="I'm grateful for…" value={gratitude} onChange={e => setGratitude(e.target.value)} />
        <p style={{marginTop:12}}>What would make today feel like a real win?</p>
        <textarea className="morning-entry" placeholder="Today is a win if I…" value={reflection} onChange={e => setReflection(e.target.value)} />
      </div>

      {/* Progress */}
      <div className="progress-bar-wrap">
        <div className="progress-label">
          <span style={{fontWeight:600,fontSize:13}}>
            {pct === 100 ? "🎉 All done — incredible work!" : pct >= 50 ? "🔥 Over halfway there!" : `${done} of ${total} tasks complete`}
          </span>
          <span style={{fontWeight:700,color:"var(--accent)"}}>{pct}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{width:`${pct}%`}} />
        </div>
      </div>

      {/* Add task */}
      <div className="task-input-wrap">
        <input
          className="task-input"
          placeholder="Add a task for today…"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
        />
        <button className="task-add-btn" onClick={addTask}>+ Add</button>
      </div>

      {/* Task list */}
      {grouped.map(({ type, tasks: tlist }) => {
        const t = typeInfo(type);
        return (
          <div key={type} className="task-section">
            <div className="task-section-label">{t.emoji} {t.name}</div>
            {tlist.map(task => (
              <div key={task.id} className={`task-item ${task.type} ${task.done ? "done" : ""}`}>
                <div className={`task-check ${task.done ? "checked" : ""}`} onClick={() => toggle(task.id)} />
                <span className="task-emoji">{t.emoji}</span>
                <span className="task-title">{task.title}</span>
                <span className={`task-type-badge ${t.badge}`}>{t.name}</span>
                <button className="task-delete" onClick={() => setTasks(prev => prev.filter(x => x.id !== task.id))}>×</button>
              </div>
            ))}
          </div>
        );
      })}

      {/* Evening */}
      <div className="evening-card">
        <h3>🌙 End of day reflection</h3>
        <p>Before you close the laptop — what deserves to be acknowledged today?</p>
        <textarea className="evening-entry" placeholder="Today I'm proud of…" rows={3} />
        <textarea className="evening-entry" placeholder="Tomorrow I'll carry forward…" rows={2} />
        <button className="save-btn">Save reflection ✓</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ founderData }) {
  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <h1>Good morning, {founderData?.name || "Founder"} 👋</h1>
        <p>Week 23 · Q2 2026 · <span style={{color:"var(--accent3)",fontWeight:600}}>72% toward quarterly rocks</span></p>
      </div>

      <div className="dash-grid">
        <div className="card vision-card">
          <div className="card-label" style={{color:"rgba(255,255,255,0.3)"}}>YOUR WHY</div>
          <h2>"{founderData?.dream?.slice(0,90) || "Build something that gives me time, freedom and impact — not just revenue."}"</h2>
          <p>{founderData?.vision1 || "€25k MRR by December. A team I trust. A life I genuinely love."}</p>
          <div className="vision-gain">
            {(founderData?.freedoms || ["Time freedom","Financial freedom","Impact"]).map(f => (
              <span key={f} className="gain-pill">{f}</span>
            ))}
          </div>
          <div className="locked-badge">🔒 Locked · set on onboarding</div>
        </div>

        <div className="card kpi-card">
          <div className="card-label">This Week's KPIs <span className="badge">Live</span></div>
          <div className="kpi-grid">
            {KPIS.map(k => (
              <div key={k.label} className="kpi-item">
                <div className="label">{k.label}</div>
                <div className="value">{k.value}</div>
                <div className="target">Target: {k.target}</div>
                <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:`${k.pct}%`,background:k.color}}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card rocks-card">
          <div className="card-label">Q2 Rocks</div>
          {ROCKS.map(r => (
            <div key={r.label} className="rock-item">
              <div className="rock-icon" style={{background:`${r.color}18`}}>{r.icon}</div>
              <div className="rock-text">
                <strong>{r.label}</strong>
                <span>{r.pct}% complete</span>
                <div className="rock-progress"><div className="rock-progress-fill" style={{width:`${r.pct}%`,background:r.color}}/></div>
              </div>
            </div>
          ))}
        </div>

        <div className="card habit-card">
          <div className="card-label">Focus Streak — 13 Weeks <span style={{color:"var(--accent)",fontWeight:700}}>🔥 14 days</span></div>
          <div className="habit-grid">
            {HABIT_DATA.map((d, i) => (
              <div key={i} className={`habit-cell ${d} ${i===86?"today":""}`} />
            ))}
          </div>
          <div className="habit-legend">
            <span>Less</span>
            <div className="habit-legend-dots">
              {["rgba(0,0,0,0.06)","rgba(45,91,227,0.25)","rgba(45,91,227,0.55)","rgba(45,91,227,0.9)"].map((c,i) => (
                <div key={i} className="habit-legend-dot" style={{background:c}}/>
              ))}
            </div>
            <span>More</span>
          </div>

          <div className="section-divider"/>
          <div className="card-label" style={{marginBottom:10}}>KPI Trend — Last 4 Weeks</div>
          <div className="weekly-bar-wrap">
            {[{l:"Week 20",p:55},{l:"Week 21",p:68},{l:"Week 22",p:74},{l:"Week 23",p:84}].map(w=>(
              <div key={w.l} className="weekly-bar-row">
                <div className="weekly-bar-label">{w.l}</div>
                <div className="weekly-bar-track"><div className="weekly-bar-fill" style={{width:`${w.p}%`,background:"var(--accent)"}}/></div>
                <div className="weekly-bar-val">{w.p}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function FounderOS() {
  const [view, setView] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFlow, setChatFlow] = useState("morning");
  const [rainbow, setRainbow] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const founderData = { name: "Alex", dream: "Build something that gives me time, freedom and impact — not just revenue.", freedoms: ["Time freedom","Financial freedom","Impact at scale"] };

  const triggerFrogDone = () => {
    setRainbow(true);
    setConfetti(true);
    setTimeout(() => setRainbow(false), 4200);
    setTimeout(() => setConfetti(false), 3200);
  };

  const openFlow = (flow) => {
    setChatFlow(flow);
    setChatOpen(true);
    setHasNotif(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="os-root">
        {/* Rainbow frog overlay */}
        <div className={`rainbow-overlay ${rainbow ? "active" : ""}`} />
        <Confetti active={confetti} />

        {/* Nav */}
        <nav className="nav">
          <div className="nav-logo">Founder<span>OS</span></div>
          <div className="nav-tabs">
            <button className={`nav-tab ${view==="dashboard"?"active":""}`} onClick={()=>setView("dashboard")}>Dashboard</button>
            <button className={`nav-tab ${view==="daily"?"active":""}`} onClick={()=>setView("daily")}>Today</button>
          </div>
          <div className="nav-avatar" onClick={() => openFlow("weekly")}>A</div>
        </nav>

        {/* Views */}
        {view === "dashboard" && <Dashboard founderData={founderData} />}
        {view === "daily"     && <DailyView onFrogDone={triggerFrogDone} />}

        {/* Chatbot bubble */}
        <button className="chat-bubble" onClick={() => chatOpen ? setChatOpen(false) : openFlow(chatFlow)}>
          {chatOpen ? "✕" : "🤖"}
          {hasNotif && !chatOpen && <div className="notif-dot" />}
        </button>

        {/* Chatbot panel */}
        <ChatBot
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          flowType={chatFlow}
          onFlowComplete={() => setTimeout(() => setChatOpen(false), 600)}
        />
      </div>
    </>
  );
}
