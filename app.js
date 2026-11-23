/*
  Willow & Jade demo booking site, styled as if it runs on "Velora Salon Suite".
  Velora is made-up software. This is a class demo: no server, no real bookings.
  All data lives in this browser's localStorage and can be reset at any time.
*/
(() => {
'use strict';

/* ---------------- constants ---------------- */
const STORE_KEY = 'velora-wj-demo-v1';
const SESSION_KEY = 'velora-wj-session-v1';
const GUEST_KEY = 'velora-wj-guest-v1';
const RESEED_AFTER_DAYS = 14;
const STEP = 15;

const ACCOUNTS = [
  { email: 'frontdesk@willowandjade.example', password: 'demo1234', role: 'staff', name: 'Front Desk' },
  { email: 'agent@willowandjade.example', password: 'demo1234', role: 'staff', name: 'AI Front Desk Agent' },
  { email: 'maya@example.com', password: 'demo1234', role: 'client', name: 'Maya Thompson' },
];

const SALON = {
  name: 'Willow & Jade',
  tag: 'Hair studio',
  address: '123 Demo Street, Suite 4, Anytown, USA',
  phone: '(555) 555-0142',
  email: 'hello@willowandjade.example',
  hours: { 0: null, 1: null, 2: ['09:00', '19:00'], 3: ['09:00', '19:00'], 4: ['09:00', '19:00'], 5: ['09:00', '19:00'], 6: ['08:00', '16:00'] },
};
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEK_ORDER = [2, 3, 4, 5, 6, 0, 1];

const SERVICES = [
  { id: 'cut-style', cat: 'Cuts & styling', name: "Women's cut & style", dur: 75, price: 85, desc: 'Consultation, wash, precision cut and blow-dry finish.' },
  { id: 'mens-cut', cat: 'Cuts & styling', name: "Men's cut", dur: 45, price: 45, desc: 'Clipper or scissor cut with wash and style.' },
  { id: 'kids-cut', cat: 'Cuts & styling', name: 'Kids cut (12 and under)', dur: 30, price: 30, desc: 'A quick, gentle cut for little clients.' },
  { id: 'blowout', cat: 'Cuts & styling', name: 'Blowout', dur: 45, price: 55, desc: 'Wash and a smooth or full-volume blow-dry.' },
  { id: 'root-touchup', cat: 'Color', name: 'Root touch-up', dur: 90, price: 110, desc: 'Single-process color at the roots, up to 6 weeks of growth.' },
  { id: 'all-over', cat: 'Color', name: 'All-over color', dur: 120, price: 150, desc: 'Single-process color from roots to ends.' },
  { id: 'balayage', cat: 'Color', name: 'Balayage', dur: 180, price: 260, desc: 'Hand-painted highlights with toner and style.' },
  { id: 'gloss', cat: 'Color', name: 'Gloss & tone', dur: 45, price: 60, desc: 'Shine and tone refresh between color visits.' },
  { id: 'deep-cond', cat: 'Treatments', name: 'Deep conditioning', dur: 30, price: 35, desc: 'Moisture mask with a scalp massage.' },
  { id: 'keratin', cat: 'Treatments', name: 'Keratin smoothing', dur: 150, price: 300, desc: 'Frizz-control treatment that lasts up to 12 weeks.' },
  { id: 'consult', cat: 'Consultations', name: 'Free color consultation', dur: 15, price: 0, desc: 'Talk through goals, timing and price before a color service.' },
  { id: 'bridal-trial', cat: 'Consultations', name: 'Bridal trial', dur: 90, price: 150, desc: 'A practice run of your wedding-day style.' },
];

const STYLISTS = [
  { id: 'avery', name: 'Avery Lin', title: 'Owner and master stylist', color: '#2f6f5e', services: 'all',
    hours: { 2: ['09:00', '17:00'], 3: ['09:00', '17:00'], 4: ['11:00', '19:00'], 5: ['09:00', '17:00'], 6: ['08:00', '14:00'] } },
  { id: 'marisol', name: 'Marisol Reyes', title: 'Color specialist', color: '#8a5a83',
    services: ['cut-style', 'root-touchup', 'all-over', 'balayage', 'gloss', 'deep-cond', 'keratin', 'consult'],
    hours: { 2: ['10:00', '18:00'], 3: ['10:00', '18:00'], 4: ['10:00', '18:00'], 6: ['08:00', '16:00'] } },
  { id: 'jordan', name: 'Jordan Pike', title: 'Stylist', color: '#b8743a',
    services: ['cut-style', 'mens-cut', 'kids-cut', 'blowout', 'gloss', 'deep-cond', 'bridal-trial', 'consult'],
    hours: { 3: ['11:00', '19:00'], 4: ['11:00', '19:00'], 5: ['11:00', '19:00'], 6: ['08:00', '16:00'] } },
  { id: 'tess', name: 'Tess Okafor', title: 'Junior stylist', color: '#4a6fa5',
    services: ['mens-cut', 'kids-cut', 'blowout', 'deep-cond', 'consult'],
    hours: { 2: ['09:00', '15:00'], 4: ['13:00', '19:00'], 5: ['09:00', '17:00'], 6: ['08:00', '16:00'] } },
];

const CLIENT_NAMES = ['Maya Thompson', 'Priya Shah', 'Noah Bennett', 'Chloe Nguyen', 'Ethan Wallace', 'Zoe Patel', 'Lucas Moreno',
  'Isabel Ortiz', 'Ben Harper', 'Nora Quinn', 'Leo Walsh', 'Ruby Chen', 'Max Ivanov', 'Ella Fischer', 'Sam Ortega', 'Iris Novak',
  'Theo Grant', 'Mila Duarte', 'Jack Rowan', 'Hazel Brooks'];

const STATUS = { booked: 'Booked', confirmed: 'Confirmed', 'checked-in': 'Checked in', completed: 'Completed', cancelled: 'Cancelled', 'no-show': 'No-show' };
const ACTIVE = new Set(['booked', 'confirmed', 'checked-in', 'completed']);
const SOURCES = ['Phone', 'Walk-in', 'Front desk', 'Email', 'Text message', 'Instagram DM', 'Online'];
const CANCEL_REASONS = ['Schedule conflict', 'Feeling sick', 'Booked by mistake', 'Found a better time', 'Salon cancelled', 'Other'];

const LOGO = '<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="currentColor"/><path d="M9 11l4 11 3-8 3 8 4-11" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------------- utilities ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDT = s => {
  const [a, b = '00:00'] = String(s).split('T');
  const [y, m, d] = a.split('-').map(Number);
  const [h, mi] = b.split(':').map(Number);
  return new Date(y, m - 1, d, h, mi);
};
const hm2m = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const m2hm = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const today0 = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const nowMin = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
const fmtTime = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const fmtT = hm => fmtTime(parseDT('2000-01-01T' + hm));
const fmtDay = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const fmtLong = d => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const fmtWhen = s => { const d = parseDT(s); return `${fmtLong(d)} at ${fmtTime(d)}`; };
const fmtShortWhen = s => { const d = parseDT(s); return `${fmtDay(d)}, ${fmtTime(d)}`; };
const fmtStamp = iso => { const d = new Date(iso); return `${fmtDay(d)}, ${fmtTime(d)}`; };
const money = n => (n === 0 ? 'Free' : '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }));
const durLabel = m => { const h = Math.floor(m / 60), r = m % 60; return [h ? `${h} hr` : '', r ? `${r} min` : ''].filter(Boolean).join(' '); };
const uid = p => p + Math.random().toString(36).slice(2, 10);
const initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2);
const firstName = n => n.split(' ')[0];
const qs = obj => { const p = new URLSearchParams(); Object.entries(obj).forEach(([k, v]) => { if (v != null && v !== '') p.set(k, v); }); const s = p.toString(); return s ? '?' + s : ''; };
const go = path => { location.hash = '#' + path; };
const isPast = (key, time) => parseDT(`${key}T${time}`) < new Date();

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- state ---------------- */
let state;

const svcById = id => SERVICES.find(s => s.id === id);
const stById = id => state.stylists.find(s => s.id === id);
const clById = id => state.clients.find(c => c.id === id);
const bkById = id => state.bookings.find(b => b.id === id);
const canDo = (st, sid) => !!st && (st.services === 'all' || st.services.includes(sid));
const depositFor = svc => (svc && svc.price >= state.settings.depositMin ? Math.round(svc.price * state.settings.depositPct / 100) : 0);

function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: demo still runs */ } }

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const age = (today0() - parseDT(s.seededOn)) / 864e5;
      if (s.version === 1 && age <= RESEED_AFTER_DAYS) return s;
    }
  } catch (e) { /* fall through to a fresh seed */ }
  const s = seed();
  state = s; save();
  return s;
}

function windowFor(st, key) {
  if (!st) return null;
  const dow = parseDT(key).getDay();
  const sh = SALON.hours[dow], h = st.hours[dow];
  if (!sh || !h) return null;
  const a = Math.max(hm2m(h[0]), hm2m(sh[0])), b = Math.min(hm2m(h[1]), hm2m(sh[1]));
  return a < b ? [a, b] : null;
}

function busy(stId, key, ignoreId) {
  const r = [];
  for (const b of state.bookings) {
    if (b.stylistId !== stId || b.id === ignoreId || !ACTIVE.has(b.status) || b.start.slice(0, 10) !== key) continue;
    r.push([hm2m(b.start.slice(11)), hm2m(b.end.slice(11))]);
  }
  for (const k of state.blocks) if (k.stylistId === stId && k.date === key) r.push([hm2m(k.start), hm2m(k.end)]);
  return r;
}

function isFree(stId, key, startM, dur, ignoreId) {
  const w = windowFor(stById(stId), key);
  if (!w || startM < w[0] || startM + dur > w[1]) return false;
  return !busy(stId, key, ignoreId).some(([a, b]) => startM < b && startM + dur > a);
}

function slotsFor(key, svcId, stSel, { ignoreId = null, staff = false } = {}) {
  const svc = svcById(svcId);
  if (!svc || !key) return [];
  const tk = dKey(new Date());
  if (key < tk) return [];
  let minStart = -1;
  if (key === tk) minStart = Math.ceil((nowMin() + (staff ? 0 : 60)) / STEP) * STEP;
  const list = stSel && stSel !== 'any' ? [stById(stSel)].filter(Boolean) : state.stylists;
  const map = new Map();
  for (const st of list) {
    if (!canDo(st, svcId)) continue;
    const w = windowFor(st, key);
    if (!w) continue;
    const bz = busy(st.id, key, ignoreId);
    for (let t = w[0]; t + svc.dur <= w[1]; t += STEP) {
      if (t < minStart || map.has(t)) continue;
      if (bz.some(([a, b]) => t < b && t + svc.dur > a)) continue;
      map.set(t, st.id);
    }
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([m, s]) => ({ m, time: m2hm(m), stylistId: s }));
}

/* ---------------- seed data (relative to today) ---------------- */
function seed() {
  const rnd = mulberry32(5150);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const t0 = today0();
  const s = {
    version: 1, seededOn: dKey(t0), refSeq: 4180,
    stylists: JSON.parse(JSON.stringify(STYLISTS)),
    clients: [], bookings: [], blocks: [], waitlist: [], activity: [],
    settings: { cancelWindowHours: 24, lateFeePct: 50, depositMin: 150, depositPct: 25, graceMinutes: 15 },
  };
  state = s;

  CLIENT_NAMES.forEach((n, i) => {
    const [f, l] = n.toLowerCase().split(' ');
    s.clients.push({ id: 'c' + (i + 1), name: n, email: i === 0 ? 'maya@example.com' : `${f}.${l}@example.com`,
      phone: `(555) 555-01${pad(10 + i)}`, notes: '', createdAt: dKey(addDays(t0, -240 + i * 9)) });
  });
  s.clients[0].notes = 'Prefers Avery. Sensitive scalp, patch test on file. Likes a morning slot.';
  s.clients[3].notes = 'Often runs 10 minutes late. Send a reminder the morning of.';
  s.clients[7].notes = 'Bridal party in spring. Ask about a group booking.';
  s.clients[11].notes = 'Allergic to fragrance. Use the fragrance-free line.';

  const mk = (o) => {
    const svc = svcById(o.serviceId);
    const startM = hm2m(o.time);
    const b = { id: uid('b'), ref: 'WJ-' + (s.refSeq += 7 + Math.floor(rnd() * 5)), clientId: o.clientId, serviceId: o.serviceId,
      stylistId: o.stylistId, start: `${o.key}T${o.time}`, end: `${o.key}T${m2hm(startM + svc.dur)}`, status: o.status,
      source: o.source || 'Online', notes: o.notes || '', staffNotes: '', createdAt: o.createdAt, updatedAt: o.createdAt,
      deposit: null, lateCancel: false, fee: null, cancelReason: '', lateNotice: null, history: [] };
    const dep = depositFor(svc);
    if (dep) b.deposit = { amount: dep, status: { completed: 'applied', cancelled: 'refunded', 'no-show': 'forfeited' }[o.status] || 'held' };
    if (o.status === 'cancelled') b.cancelReason = pick(CANCEL_REASONS.slice(0, 4));
    b.history.push({ at: o.createdAt, actor: o.source === 'Online' ? 'Client (online)' : 'Front Desk', text: `Booked ${svc.name} with ${stById(o.stylistId).name} (${b.source})` });
    if (o.status === 'confirmed') b.history.push({ at: o.createdAt, actor: 'Velora reminders', text: 'Client confirmed by text reply' });
    if (o.status === 'cancelled') b.history.push({ at: o.createdAt, actor: 'Client (online)', text: `Cancelled: ${b.cancelReason}` });
    s.bookings.push(b);
    return b;
  };
  const nextWorkDay = (st, from, dir = 1) => { let d = from; for (let i = 0; i < 14 && !windowFor(st, dKey(d)); i++) d = addDays(d, dir); return d; };
  const clampTime = (st, key, want, dur) => { const w = windowFor(st, key); let t = Math.max(hm2m(want), w[0]); if (t + dur > w[1]) t = w[1] - dur; return m2hm(t); };
  const iso = d => new Date(d.getTime() + 9 * 36e5).toISOString();

  // Time off first, so generated bookings avoid it.
  const mar = stById('marisol'), avery = stById('avery');
  const marOff = nextWorkDay(mar, addDays(t0, 6));
  const marWin = windowFor(mar, dKey(marOff));
  s.blocks.push({ id: uid('k'), stylistId: 'marisol', date: dKey(marOff), start: m2hm(marWin[0]), end: m2hm(marWin[1]), reason: 'Vacation day' });
  const avClass = nextWorkDay(avery, addDays(t0, 3));
  s.blocks.push({ id: uid('k'), stylistId: 'avery', date: dKey(avClass), start: '13:00', end: '15:00', reason: 'Color education class' });

  // Maya's fixed history and upcoming visits (the demo client login).
  const fixed = [
    { days: -63, st: 'avery', svc: 'balayage', time: '10:00', status: 'completed', dir: -1 },
    { days: -35, st: 'avery', svc: 'cut-style', time: '09:00', status: 'completed', dir: -1 },
    { days: -14, st: 'marisol', svc: 'gloss', time: '11:00', status: 'completed', dir: -1 },
    { days: 1, st: 'avery', svc: 'cut-style', time: '10:00', status: 'confirmed', dir: 1 },
    { days: 9, st: 'marisol', svc: 'root-touchup', time: '10:30', status: 'booked', dir: 1 },
  ];
  for (const f of fixed) {
    const st = stById(f.st);
    const d = nextWorkDay(st, addDays(t0, f.days), f.dir);
    const key = dKey(d);
    const time = clampTime(st, key, f.time, svcById(f.svc).dur);
    if (!isFree(st.id, key, hm2m(time), svcById(f.svc).dur, null)) continue;
    mk({ clientId: 'c1', serviceId: f.svc, stylistId: st.id, key, time, status: f.status, source: 'Online', createdAt: iso(addDays(d, -12)) });
  }

  // Busy, realistic schedule: 3 weeks back, 2 weeks ahead.
  const weights = { 'cut-style': 6, 'mens-cut': 4, 'kids-cut': 2, blowout: 4, 'root-touchup': 4, 'all-over': 2, balayage: 2, gloss: 3, 'deep-cond': 1, keratin: 1, consult: 1, 'bridal-trial': 1 };
  const now = new Date();
  for (let d = -21; d <= 14; d++) {
    const day = addDays(t0, d), key = dKey(day);
    for (const st of s.stylists) {
      const w = windowFor(st, key);
      if (!w) continue;
      const pool = [];
      SERVICES.forEach(sv => { if (canDo(st, sv.id)) for (let i = 0; i < (weights[sv.id] || 1); i++) pool.push(sv.id); });
      const fill = d < 0 ? 0.62 : d <= 3 ? 0.55 : 0.33;
      let t = w[0];
      while (t + 30 <= w[1]) {
        if (rnd() < fill) {
          const svcId = pick(pool), svc = svcById(svcId);
          if (t + svc.dur <= w[1] && isFree(st.id, key, t, svc.dur, null)) {
            const start = parseDT(`${key}T${m2hm(t)}`), end = new Date(start.getTime() + svc.dur * 6e4);
            let status;
            const r = rnd();
            if (end < now) status = r < 0.84 ? 'completed' : r < 0.93 ? 'cancelled' : 'no-show';
            else if (start < now) status = 'checked-in';
            else status = r < 0.55 ? 'confirmed' : r < 0.94 ? 'booked' : 'cancelled';
            const src = rnd();
            mk({ clientId: 'c' + (2 + Math.floor(rnd() * (CLIENT_NAMES.length - 1))), serviceId: svcId, stylistId: st.id, key,
              time: m2hm(t), status, source: src < 0.6 ? 'Online' : src < 0.85 ? 'Phone' : 'Instagram DM',
              createdAt: iso(addDays(day, -(2 + Math.floor(rnd() * 20)))) });
            t += svc.dur + (rnd() < 0.35 ? 15 : 0);
            continue;
          }
        }
        t += 30;
      }
    }
  }

  // Waitlist.
  const sat = nextWorkDay(mar, addDays(t0, 4));
  s.waitlist.push({ id: uid('w'), clientId: 'c2', serviceId: 'balayage', stylistId: 'marisol', date: dKey(sat), timePref: 'Any time', status: 'open', createdAt: iso(addDays(t0, -2)), note: 'Wants to finish before a wedding that weekend.' });
  const fri = addDays(t0, ((5 - t0.getDay() + 7) % 7) || 7);
  s.waitlist.push({ id: uid('w'), clientId: 'c3', serviceId: 'mens-cut', stylistId: 'any', date: dKey(fri), timePref: 'Evening (after 5 PM)', status: 'open', createdAt: iso(addDays(t0, -1)), note: '' });

  // Recent activity.
  const mayaNext = s.bookings.filter(b => b.clientId === 'c1' && b.status === 'confirmed')[0];
  const recent = [
    { at: new Date(Date.now() - 50 * 6e4).toISOString(), actor: 'Velora reminders', action: "Sent tomorrow's appointment reminders by text", ref: '' },
    { at: new Date(Date.now() - 3 * 36e5).toISOString(), actor: 'Client (online)', action: 'Joined the waitlist: Balayage with Marisol Reyes', ref: '' },
  ];
  if (mayaNext) recent.push({ at: new Date(Date.now() - 26 * 36e5).toISOString(), actor: 'Maya Thompson (client)', action: `Confirmed ${svcById(mayaNext.serviceId).name} by text reply`, ref: mayaNext.ref, bookingId: mayaNext.id });
  s.activity = recent.map(a => ({ id: uid('a'), bookingId: '', ...a }));
  return s;
}

/* ---------------- session ---------------- */
function session() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; } }
function setSession(v) { try { v ? localStorage.setItem(SESSION_KEY, JSON.stringify(v)) : localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ } }
const isStaff = () => { const s = session(); return !!s && s.role === 'staff'; };
function currentClient() { const s = session(); if (!s || s.role !== 'client') return null; return state.clients.find(c => c.email.toLowerCase() === s.email); }
function guestIds() { try { return JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]'); } catch (e) { return []; } }
function grantGuest(id) { try { const g = guestIds(); if (!g.includes(id)) g.push(id); sessionStorage.setItem(GUEST_KEY, JSON.stringify(g)); } catch (e) { /* ignore */ } }
function canView(b) {
  if (!b) return false;
  if (isStaff()) return true;
  const c = currentClient();
  if (c && c.id === b.clientId) return true;
  return guestIds().includes(b.id);
}
function actorName() { const s = session(); if (!s) return 'Client (online)'; return s.role === 'staff' ? s.name : `${s.name} (client)`; }

/* ---------------- mutations ---------------- */
function log(action, b) {
  state.activity.unshift({ id: uid('a'), at: new Date().toISOString(), actor: actorName(), action, ref: b ? b.ref : '', bookingId: b ? b.id : '' });
  if (state.activity.length > 500) state.activity.length = 500;
}
function hist(b, text) { const at = new Date().toISOString(); b.history.push({ at, actor: actorName(), text }); b.updatedAt = at; }
const describe = b => `${svcById(b.serviceId).name} with ${stById(b.stylistId).name}, ${fmtShortWhen(b.start)}`;

function createBooking(o) {
  const svc = svcById(o.serviceId);
  if (!svc) return { error: 'Pick a service.' };
  if (!o.key || !o.time) return { error: 'Pick a date and time.' };
  if (isPast(o.key, o.time)) return { error: 'That time has already passed.' };
  let stId = o.stylistId;
  if (!stId || stId === 'any') {
    const slot = slotsFor(o.key, o.serviceId, 'any', { staff: o.staff }).find(x => x.time === o.time);
    if (!slot) return { error: 'That time was just taken. Pick another one.' };
    stId = slot.stylistId;
  }
  const st = stById(stId);
  if (!canDo(st, svc.id)) return { error: `${st.name} doesn't offer ${svc.name}.` };
  if (!isFree(stId, o.key, hm2m(o.time), svc.dur)) return { error: `That time isn't open for ${st.name}. Pick another one.` };
  state.refSeq += 7 + Math.floor(Math.random() * 5);
  const now = new Date().toISOString();
  const b = { id: uid('b'), ref: 'WJ-' + state.refSeq, clientId: o.clientId, serviceId: svc.id, stylistId: stId,
    start: `${o.key}T${o.time}`, end: `${o.key}T${m2hm(hm2m(o.time) + svc.dur)}`, status: o.status || 'booked',
    source: o.source || 'Online', notes: o.notes || '', staffNotes: '', createdAt: now, updatedAt: now,
    deposit: null, lateCancel: false, fee: null, cancelReason: '', lateNotice: null, history: [] };
  const dep = depositFor(svc);
  if (dep) b.deposit = { amount: dep, status: 'held' };
  hist(b, `Booked ${describe(b)} (${b.source})`);
  state.bookings.push(b);
  log(`Created booking: ${describe(b)}`, b);
  save();
  return { booking: b };
}

function moveBooking(b, { key, time, stylistId, serviceId }) {
  const svcId = serviceId || b.serviceId, svc = svcById(svcId);
  let stId = stylistId || b.stylistId;
  if (!key || !time) return { error: 'Pick a date and time.' };
  if (stId === 'any') {
    const slot = slotsFor(key, svcId, 'any', { ignoreId: b.id, staff: isStaff() }).find(x => x.time === time);
    if (!slot) return { error: 'That time was just taken. Pick another one.' };
    stId = slot.stylistId;
  }
  if (svcId === b.serviceId && stId === b.stylistId && `${key}T${time}` === b.start) return { unchanged: true };
  if (!canDo(stById(stId), svcId)) return { error: `${stById(stId).name} doesn't offer ${svc.name}.` };
  if (isPast(key, time)) return { error: 'That time has already passed.' };
  if (!isFree(stId, key, hm2m(time), svc.dur, b.id)) return { error: 'That time overlaps another booking, time off, or is outside working hours.' };
  const before = describe(b);
  b.serviceId = svcId; b.stylistId = stId; b.start = `${key}T${time}`; b.end = `${key}T${m2hm(hm2m(time) + svc.dur)}`;
  if (!b.deposit || b.deposit.status === 'held') { const dep = depositFor(svc); b.deposit = dep ? { amount: dep, status: 'held' } : null; }
  b.lateNotice = null;
  hist(b, `Changed from ${before} to ${describe(b)}`);
  log(`Rescheduled to ${describe(b)} (was ${before})`, b);
  save();
  return { booking: b };
}

function lateInfo(b) {
  const hrs = (parseDT(b.start) - new Date()) / 36e5;
  const late = hrs < state.settings.cancelWindowHours;
  return { late, fee: Math.round(svcById(b.serviceId).price * state.settings.lateFeePct / 100) };
}

function cancelBooking(b, reason) {
  const { late, fee } = lateInfo(b);
  b.status = 'cancelled'; b.cancelReason = reason || 'Other'; b.lateCancel = late; b.lateNotice = null;
  if (late && fee > 0) { b.fee = { amount: fee, status: 'pending' }; if (b.deposit && b.deposit.status === 'held') b.deposit.status = 'kept toward fee'; }
  else if (b.deposit && b.deposit.status === 'held') b.deposit.status = 'refunded';
  hist(b, `Cancelled (${b.cancelReason})${late ? ', inside the cancellation window' : ''}`);
  log(`Cancelled ${describe(b)}. Reason: ${b.cancelReason}${late ? '. Late cancellation.' : ''}`, b);
  save();
  return { late, fee };
}

function setStatus(b, status) {
  const prev = b.status;
  if (prev === status) return;
  b.status = status;
  if (status === 'completed' && b.deposit && b.deposit.status === 'held') b.deposit.status = 'applied';
  if (status === 'no-show' && b.deposit && b.deposit.status === 'held') b.deposit.status = 'forfeited';
  if (status !== 'checked-in') b.lateNotice = null;
  hist(b, `Status changed from ${STATUS[prev]} to ${STATUS[status]}`);
  log(`Marked ${STATUS[status].toLowerCase()}: ${describe(b)}`, b);
  save();
}

function restoreBooking(b) {
  const svc = svcById(b.serviceId);
  const key = b.start.slice(0, 10), time = b.start.slice(11);
  if (isPast(key, time)) return { error: 'That appointment time has passed. Make a new booking instead.' };
  if (!isFree(b.stylistId, key, hm2m(time), svc.dur, b.id)) return { error: 'That time has been booked by someone else. Reschedule instead.' };
  b.status = 'booked'; b.lateCancel = false; b.fee = null; b.cancelReason = '';
  if (b.deposit && b.deposit.status !== 'applied') b.deposit.status = 'held';
  hist(b, 'Restored cancelled booking');
  log(`Restored ${describe(b)}`, b);
  save();
  return { booking: b };
}

/* ---------------- shared bits ---------------- */
const pill = s => `<span class="pill pill-${s}">${STATUS[s]}</span>`;
const stDot = st => `<span class="dot" style="--c:${st.color}"></span>`;
function hoursSummary() { return 'Tue to Fri 9 AM to 7 PM · Sat 8 AM to 4 PM'; }
function workDays(st) { return WEEK_ORDER.filter(d => st.hours[d] && SALON.hours[d]).map(d => DAYS[d].slice(0, 3)).join(', '); }
function servicesByCat() { const m = new Map(); SERVICES.forEach(s => { if (!m.has(s.cat)) m.set(s.cat, []); m.get(s.cat).push(s); }); return m; }
function upcomingActive(b) { return ['booked', 'confirmed'].includes(b.status) && parseDT(b.start) > new Date(); }
function depositText(b) {
  if (!b.deposit) return 'No deposit';
  return `${money(b.deposit.amount)} deposit · ${b.deposit.status}`;
}
function emptyState(text, action = '') { return `<div class="empty"><p>${text}</p>${action}</div>`; }

function dateStrip(base, params, svcId, stSel, opts = {}) {
  const t0 = today0();
  const from = params.from ? parseDT(params.from) : t0;
  const start = from < t0 ? t0 : from;
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = addDays(start, i), k = dKey(d);
    const n = slotsFor(k, svcId, stSel, opts).length;
    const closed = !SALON.hours[d.getDay()];
    const sel = params.date === k;
    const label = closed ? 'Closed' : n ? `${n} open` : 'Full';
    const cls = `day ${sel ? 'is-selected' : ''} ${!n ? 'is-disabled' : ''}`;
    const inner = `<span class="day-wd">${d.toLocaleDateString('en-US', { weekday: 'short' })}</span><span class="day-num">${d.getDate()}</span><span class="day-mo">${d.toLocaleDateString('en-US', { month: 'short' })}</span><span class="day-n">${label}</span>`;
    days.push(n ? `<a class="${cls}" href="${base}${qs({ ...params, date: k, time: '' })}" aria-label="${fmtLong(d)}, ${label}">${inner}</a>` : `<span class="${cls}" aria-label="${fmtLong(d)}, ${label}">${inner}</span>`);
  }
  const prev = addDays(start, -14) < t0 ? (start > t0 ? dKey(t0) : '') : dKey(addDays(start, -14));
  const nextD = addDays(start, 14);
  const next = nextD <= addDays(t0, 60) ? dKey(nextD) : '';
  return `<div class="strip-nav">
      ${prev ? `<a class="btn btn-ghost btn-small" href="${base}${qs({ ...params, from: prev, date: '', time: '' })}">Earlier dates</a>` : '<span></span>'}
      <span class="muted small">${fmtDay(start)} to ${fmtDay(addDays(start, 13))}</span>
      ${next ? `<a class="btn btn-ghost btn-small" href="${base}${qs({ ...params, from: next, date: '', time: '' })}">Later dates</a>` : '<span></span>'}
    </div><div class="date-strip">${days.join('')}</div>`;
}

function slotGrid(base, params, slots, stSel) {
  const groups = [['Morning', s => s.m < 720], ['Afternoon', s => s.m >= 720 && s.m < 1020], ['Evening', s => s.m >= 1020]];
  return groups.map(([label, fn]) => {
    const list = slots.filter(fn);
    if (!list.length) return '';
    return `<div class="slot-group"><h4>${label}</h4><div class="slots">${list.map(x =>
      `<a class="slot ${params.time === x.time ? 'is-selected' : ''}" href="${base}${qs({ ...params, time: x.time })}" aria-label="${fmtT(x.time)}${stSel === 'any' ? ' with ' + esc(stById(x.stylistId).name) : ''}">${fmtT(x.time)}</a>`).join('')}</div></div>`;
  }).join('');
}

/* ---------------- public pages ---------------- */
function publicShell(inner, active) {
  const s = session();
  let acct;
  if (!s) acct = `<a href="#/login" class="btn btn-ghost btn-small">Sign in</a>`;
  else if (s.role === 'staff') acct = `<a href="#/staff" class="btn btn-ghost btn-small">Staff portal</a><button type="button" class="btn btn-ghost btn-small" data-action="logout">Sign out</button>`;
  else acct = `<a href="#/account" class="nav-link ${active === 'account' ? 'is-active' : ''}">My appointments</a><button type="button" class="btn btn-ghost btn-small" data-action="logout">Sign out</button>`;
  const nav = (href, key, label) => `<a href="${href}" class="nav-link ${active === key ? 'is-active' : ''}">${label}</a>`;
  return `
  <header class="vendor-bar"><div class="wrap vendor-inner"><span class="velora">${LOGO}<span>Velora</span></span><span class="vendor-sub">Online booking</span></div></header>
  <header class="salon-header"><div class="wrap salon-inner">
    <a href="#/" class="salon-brand" aria-label="Willow & Jade home"><span class="salon-mark">W&amp;J</span><span class="salon-words"><span class="salon-name">Willow &amp; Jade</span><span class="salon-tag">Hair studio</span></span></a>
    <nav class="salon-nav" aria-label="Main">${nav('#/book', 'book', 'Book now')}${nav('#/manage', 'manage', 'Change or cancel')}${nav('#/policies', 'policies', 'Policies')}${acct}</nav>
  </div></header>
  <main class="wrap main" id="main">${inner}</main>
  <footer class="site-footer"><div class="wrap footer-inner">
    <div><b>Willow &amp; Jade</b><br>${esc(SALON.address)}<br>${esc(SALON.phone)} · ${esc(SALON.email)}</div>
    <div class="muted small">Online booking powered by Velora Salon Suite.<br>Velora is fictional software made for a class demo.</div>
  </div></footer>`;
}

function pageHome() {
  let svcHtml = '';
  for (const [cat, list] of servicesByCat()) {
    svcHtml += `<div class="svc-group"><h3>${esc(cat)}</h3><ul class="svc-list">${list.map(s => `
      <li class="svc-row"><div><div class="svc-name">${esc(s.name)}</div><div class="svc-desc">${esc(s.desc)}</div>
      <div class="svc-meta">${durLabel(s.dur)} · ${money(s.price)}${depositFor(s) ? ` · ${money(depositFor(s))} deposit` : ''}</div></div>
      <a class="btn btn-secondary btn-small" href="#/book${qs({ service: s.id })}" aria-label="Book ${esc(s.name)}">Book</a></li>`).join('')}</ul></div>`;
  }
  const team = state.stylists.map(st => `<li class="team-card"><span class="avatar" style="--c:${st.color}">${initials(st.name)}</span>
      <div class="team-body"><div class="team-name">${esc(st.name)}</div><div class="team-title">${esc(st.title)}</div><div class="muted small">Works ${workDays(st)}</div></div>
      <a class="btn btn-ghost btn-small" href="#/book${qs({ stylist: st.id })}">Book with ${esc(firstName(st.name))}</a></li>`).join('');
  return `
  <section class="hero">
    <div class="hero-copy"><p class="eyebrow">Book online, any time</p><h1 class="display">Hair, color and care at Willow &amp; Jade</h1>
      <p class="lead">Pick a service, choose your stylist and grab a time that works for you. Need to move or cancel? You can do that here too.</p>
      <div class="hero-actions"><a class="btn btn-primary" href="#/book">Book an appointment</a><a class="btn btn-secondary" href="#/manage">Change or cancel a booking</a></div></div>
    <dl class="hero-facts card"><div><dt>Hours</dt><dd>${hoursSummary()}<br><span class="muted">Closed Sunday and Monday</span></dd></div>
      <div><dt>Call or text</dt><dd>${esc(SALON.phone)}</dd></div><div><dt>Find us</dt><dd>${esc(SALON.address)}</dd></div></dl>
  </section>
  <section class="section"><div class="section-head"><h2>Services and prices</h2><a class="link" href="#/policies">Deposits and cancellation policy</a></div><div class="svc-cols">${svcHtml}</div></section>
  <section class="section"><h2>Our team</h2><ul class="team">${team}</ul></section>`;
}

function pageBook(q) {
  const p = { service: q.get('service') || '', stylist: q.get('stylist') || '', date: q.get('date') || '', time: q.get('time') || '', from: q.get('from') || '' };
  const svc = svcById(p.service);
  if (svc && p.stylist && p.stylist !== 'any' && !canDo(stById(p.stylist), svc.id)) { p.stylist = ''; p.date = ''; p.time = ''; }
  const base = '#/book';
  const presetSt = !svc && p.stylist && p.stylist !== 'any' ? stById(p.stylist) : null;
  let h = `<div class="page-head"><h1>Book an appointment</h1><p class="muted">Four quick steps. You'll get a confirmation number at the end.</p></div><ol class="steps">`;

  // Step 1: service
  h += `<li class="step ${svc ? 'is-done' : 'is-current'}" id="step-1"><h2 class="step-title"><span class="step-num">1</span>Choose a service</h2>`;
  if (svc) {
    h += `<div class="chosen"><div><b>${esc(svc.name)}</b> <span class="muted">· ${durLabel(svc.dur)} · ${money(svc.price)}</span></div><a class="link" href="${base}${qs({ stylist: p.stylist })}">Change</a></div>`;
  } else {
    if (presetSt) h += `<p class="muted">Showing services ${esc(presetSt.name)} offers.</p>`;
    for (const [cat, list] of servicesByCat()) {
      const avail = list.filter(s => !presetSt || canDo(presetSt, s.id));
      if (!avail.length) continue;
      h += `<h3 class="opt-cat">${esc(cat)}</h3><div class="options">${avail.map(s => `
        <a class="option" href="${base}${qs({ service: s.id, stylist: p.stylist })}"><span class="opt-main"><span class="opt-name">${esc(s.name)}</span><span class="opt-desc">${esc(s.desc)}</span></span>
        <span class="opt-side"><span>${money(s.price)}</span><span class="muted small">${durLabel(s.dur)}</span></span></a>`).join('')}</div>`;
    }
  }
  h += '</li>';

  // Step 2: stylist
  h += `<li class="step ${!svc ? 'is-locked' : p.stylist ? 'is-done' : 'is-current'}" id="step-2"><h2 class="step-title"><span class="step-num">2</span>Choose a stylist</h2>`;
  if (svc && p.stylist) {
    const name = p.stylist === 'any' ? 'Any available stylist' : stById(p.stylist).name;
    h += `<div class="chosen"><div><b>${esc(name)}</b></div><a class="link" href="${base}${qs({ service: p.service })}">Change</a></div>`;
  } else if (svc) {
    const elig = state.stylists.filter(st => canDo(st, svc.id));
    h += `<div class="options options-tight"><a class="option" href="${base}${qs({ service: p.service, stylist: 'any' })}"><span class="opt-main"><span class="opt-name">Any available stylist</span><span class="opt-desc">See the most open times</span></span></a>
      ${elig.map(st => `<a class="option" href="${base}${qs({ service: p.service, stylist: st.id })}"><span class="avatar avatar-sm" style="--c:${st.color}">${initials(st.name)}</span><span class="opt-main"><span class="opt-name">${esc(st.name)}</span><span class="opt-desc">${esc(st.title)} · works ${workDays(st)}</span></span></a>`).join('')}</div>`;
  }
  h += '</li>';

  // Step 3: date and time
  h += `<li class="step ${!(svc && p.stylist) ? 'is-locked' : p.time ? 'is-done' : 'is-current'}" id="step-3"><h2 class="step-title"><span class="step-num">3</span>Pick a date and time</h2>`;
  if (svc && p.stylist) {
    if (p.time && p.date) {
      h += `<div class="chosen"><div><b>${fmtLong(parseDT(p.date))} at ${fmtT(p.time)}</b></div><a class="link" href="${base}${qs({ ...p, time: '' })}">Change</a></div>`;
    } else {
      h += dateStrip(base, p, svc.id, p.stylist);
      if (p.date) {
        const slots = slotsFor(p.date, svc.id, p.stylist);
        h += `<div id="times" class="times"><h3 class="times-title">Open times on ${fmtLong(parseDT(p.date))}</h3>`;
        h += slots.length ? slotGrid(base, p, slots, p.stylist)
          : emptyState('No openings that day.', `<a class="btn btn-secondary btn-small" href="#/waitlist${qs({ service: svc.id, stylist: p.stylist, date: p.date })}">Join the waitlist</a>`);
        h += '</div>';
      } else {
        h += `<p class="muted small">Pick a day to see open times. Can't find one that works? <a class="link" href="#/waitlist${qs({ service: svc.id, stylist: p.stylist })}">Join the waitlist</a>.</p>`;
      }
    }
  }
  h += '</li>';

  // Step 4: details
  h += `<li class="step ${p.time ? 'is-current' : 'is-locked'}" id="step-4"><h2 class="step-title"><span class="step-num">4</span>Your details</h2>`;
  if (svc && p.stylist && p.date && p.time) {
    const slot = slotsFor(p.date, svc.id, p.stylist).find(x => x.time === p.time);
    if (!slot) {
      h += emptyState('That time was just taken.', `<a class="btn btn-secondary btn-small" href="${base}${qs({ ...p, time: '' })}">Pick another time</a>`);
    } else {
      const st = stById(slot.stylistId);
      const c = currentClient();
      const dep = depositFor(svc);
      h += `<div class="summary card"><div class="summary-row"><span>Service</span><b>${esc(svc.name)}</b></div>
        <div class="summary-row"><span>Stylist</span><b>${esc(st.name)}${p.stylist === 'any' ? ' <span class="muted">(first available)</span>' : ''}</b></div>
        <div class="summary-row"><span>When</span><b>${fmtLong(parseDT(p.date))} at ${fmtT(p.time)}</b></div>
        <div class="summary-row"><span>Length</span><b>${durLabel(svc.dur)}</b></div>
        <div class="summary-row"><span>Price</span><b>${money(svc.price)}</b></div>
        ${dep ? `<div class="summary-row"><span>Deposit today</span><b>${money(dep)} <span class="muted">(demo, nothing is charged)</span></b></div>` : ''}</div>
      ${c ? '' : `<p class="muted small">Been here before? <a class="link" href="#/login${qs({ next: location.hash.slice(1) })}">Sign in</a> to fill this in for you.</p>`}
      <form class="form" data-form="book-confirm" novalidate>
        <input type="hidden" name="service" value="${svc.id}"><input type="hidden" name="stylist" value="${esc(p.stylist)}">
        <input type="hidden" name="date" value="${p.date}"><input type="hidden" name="time" value="${p.time}">
        <div class="form-grid">
          <label class="field"><span>Full name</span><input id="bk-name" name="name" autocomplete="name" required value="${esc(c ? c.name : '')}"></label>
          <label class="field"><span>Email</span><input id="bk-email" name="email" type="email" autocomplete="email" required value="${esc(c ? c.email : '')}" ${c ? 'readonly' : ''}></label>
          <label class="field"><span>Mobile phone</span><input id="bk-phone" name="phone" type="tel" autocomplete="tel" value="${esc(c ? c.phone : '')}" placeholder="(555) 555-0100"></label>
          <label class="field field-wide"><span>Anything your stylist should know? (optional)</span><textarea id="bk-notes" name="notes" rows="3" placeholder="Hair goals, allergies, inspiration photos to bring..."></textarea></label>
        </div>
        <label class="check"><input type="checkbox" name="agree" id="bk-agree" required aria-label="I agree to the cancellation policy"> <span>I agree to the <a class="link" href="#/policies" target="_blank">cancellation policy</a>: cancel or change at least ${state.settings.cancelWindowHours} hours ahead, or a ${state.settings.lateFeePct}% fee may apply.</span></label>
        <p class="muted small">Demo site: please use made-up details, not real personal information.</p>
        <button type="submit" class="btn btn-primary btn-lg">Confirm booking</button>
      </form>`;
    }
  }
  h += '</li></ol>';
  pendingScroll = p.time ? 'step-4' : p.date ? 'times' : p.stylist && svc ? 'step-3' : svc ? 'step-2' : null;
  return h;
}

function pageConfirmed(id) {
  const b = bkById(id);
  if (!b || !canView(b)) return notFound();
  const svc = svcById(b.serviceId), st = stById(b.stylistId);
  return `<div class="confirm card">
    <div class="confirm-icon" aria-hidden="true">✓</div>
    <h1>You're booked!</h1>
    <p class="lead">Confirmation number <b class="ref">${b.ref}</b></p>
    <div class="summary"><div class="summary-row"><span>Service</span><b>${esc(svc.name)}</b></div>
      <div class="summary-row"><span>Stylist</span><b>${esc(st.name)}</b></div>
      <div class="summary-row"><span>When</span><b>${fmtWhen(b.start)}</b></div>
      <div class="summary-row"><span>Price</span><b>${money(svc.price)}</b></div>
      ${b.deposit ? `<div class="summary-row"><span>Deposit</span><b>${money(b.deposit.amount)} held (demo)</b></div>` : ''}</div>
    <p class="muted">We'd text a reminder the day before. Need to change it? Use your confirmation number and email on the Change or cancel page.</p>
    <div class="btn-row"><a class="btn btn-primary" href="#/appointment/${b.id}">Manage this booking</a>
      <button type="button" class="btn btn-secondary" data-action="ics" data-id="${b.id}">Add to calendar</button>
      <a class="btn btn-ghost" href="#/book">Book another</a></div></div>`;
}

function pageManage() {
  const maya = state.bookings.filter(b => b.clientId === 'c1' && upcomingActive(b)).sort((a, b) => a.start.localeCompare(b.start))[0];
  return `<div class="narrow">
    <div class="page-head"><h1>Change or cancel a booking</h1><p class="muted">Enter your confirmation number and the email you booked with.</p></div>
    <form class="form card" data-form="manage-lookup">
      <label class="field"><span>Confirmation number</span><input id="mg-ref" name="ref" required placeholder="WJ-1234" autocomplete="off"></label>
      <label class="field"><span>Email</span><input id="mg-email" name="email" type="email" required autocomplete="email"></label>
      <button type="submit" class="btn btn-primary">Find my booking</button>
    </form>
    <p class="muted small">Have an account? <a class="link" href="#/login">Sign in</a> to see all your appointments.</p>
    ${maya ? `<div class="hint"><b>Demo tip:</b> try confirmation number <code>${maya.ref}</code> with <code>maya@example.com</code>.</div>` : ''}
  </div>`;
}

function pageAppointment(id) {
  const b = bkById(id);
  if (!b) return notFound();
  if (!canView(b)) return `<div class="narrow">${emptyState('Sign in or look up this booking with its confirmation number to see it.', '<a class="btn btn-primary btn-small" href="#/manage">Look up a booking</a>')}</div>`;
  const svc = svcById(b.serviceId), st = stById(b.stylistId), c = clById(b.clientId);
  const up = upcomingActive(b);
  const li = lateInfo(b);
  let actions = '';
  if (up) {
    actions = `<div class="btn-row">
      <a class="btn btn-primary" href="#/reschedule/${b.id}">Reschedule</a>
      <button type="button" class="btn btn-danger-ghost" data-action="cancel-open" data-id="${b.id}">Cancel appointment</button>
      ${b.status === 'booked' ? `<button type="button" class="btn btn-secondary" data-action="client-confirm" data-id="${b.id}">Confirm I'm coming</button>` : ''}
      ${parseDT(b.start) - new Date() < 6 * 36e5 ? `<button type="button" class="btn btn-secondary" data-action="late-open" data-id="${b.id}">I'm running late</button>` : ''}
      <button type="button" class="btn btn-ghost" data-action="ics" data-id="${b.id}">Add to calendar</button></div>`;
  } else if (['cancelled', 'completed', 'no-show'].includes(b.status)) {
    actions = `<div class="btn-row"><a class="btn btn-primary" href="#/book${qs({ service: b.serviceId, stylist: b.stylistId })}">Book again</a></div>`;
  }
  return `<div class="narrow">
    <p><a class="link" href="${currentClient() ? '#/account' : '#/manage'}">← Back</a></p>
    <div class="card appt">
      <div class="appt-head"><div><p class="eyebrow">Booking ${b.ref}</p><h1>${esc(svc.name)}</h1></div>${pill(b.status)}</div>
      <dl class="details">
        <div><dt>When</dt><dd>${fmtWhen(b.start)}</dd></div>
        <div><dt>Stylist</dt><dd>${stDot(st)} ${esc(st.name)}</dd></div>
        <div><dt>Length</dt><dd>${durLabel(svc.dur)}</dd></div>
        <div><dt>Price</dt><dd>${money(svc.price)}</dd></div>
        <div><dt>Deposit</dt><dd>${depositText(b)}</dd></div>
        <div><dt>Booked for</dt><dd>${esc(c ? c.name : '')}</dd></div>
      </dl>
      ${b.lateNotice ? `<div class="alert info">You told us you're running about ${b.lateNotice.minutes} minutes late. Thanks for the heads up.</div>` : ''}
      ${b.status === 'cancelled' ? `<div class="alert ${b.lateCancel ? 'warn' : 'info'}">Cancelled${b.cancelReason ? ` (${esc(b.cancelReason)})` : ''}.${b.fee ? ` Late cancellation fee: ${money(b.fee.amount)}, ${b.fee.status}.` : ''}</div>` : ''}
      ${up && li.late ? `<div class="alert warn">This appointment is less than ${state.settings.cancelWindowHours} hours away. Cancelling now may mean a ${money(li.fee)} fee.</div>` : ''}
      ${actions}
      ${up ? `<form class="form note-form" data-form="client-note" data-id="${b.id}">
        <label class="field"><span>Note for your stylist</span><textarea name="notes" rows="2" placeholder="e.g. bringing a photo, want to go shorter">${esc(b.notes)}</textarea></label>
        <button type="submit" class="btn btn-secondary btn-small">Save note</button></form>` : ''}
    </div>
    <p class="muted small">Questions? Call or text ${esc(SALON.phone)}. See our <a class="link" href="#/policies">policies</a>.</p>
  </div>`;
}

function pageReschedule(id, q) {
  const b = bkById(id);
  if (!b || !canView(b)) return notFound();
  if (!upcomingActive(b) && !(isStaff() && ACTIVE.has(b.status) && b.status !== 'completed')) return `<div class="narrow">${emptyState('This appointment can no longer be changed online.', `<a class="btn btn-primary btn-small" href="#/book">Book a new one</a>`)}</div>`;
  const svc = svcById(b.serviceId);
  const p = { stylist: q.get('stylist') || b.stylistId, date: q.get('date') || '', time: q.get('time') || '', from: q.get('from') || '' };
  const base = `#/reschedule/${b.id}`;
  const opts = { ignoreId: b.id, staff: isStaff() };
  const elig = state.stylists.filter(st => canDo(st, svc.id));
  let h = `<div class="narrow-wide"><p><a class="link" href="${isStaff() ? '#/staff/booking/' + b.id : '#/appointment/' + b.id}">← Back to booking</a></p>
    <div class="page-head"><h1>Reschedule</h1><p class="muted">Now: ${esc(describe(b))}</p></div>
    <div class="card"><h2 class="h3">Stylist</h2><div class="chips">
      ${[...elig.map(st => [st.id, st.name + (st.id === b.stylistId ? ' (current)' : '')]), ['any', 'Any available']].map(([v, l]) =>
        `<a class="chip ${p.stylist === v ? 'is-selected' : ''}" href="${base}${qs({ stylist: v })}">${esc(l)}</a>`).join('')}</div>
    <h2 class="h3">New date</h2>${dateStrip(base, p, svc.id, p.stylist, opts)}`;
  if (p.date) {
    const slots = slotsFor(p.date, svc.id, p.stylist, opts);
    h += `<div id="times"><h3 class="times-title">Open times on ${fmtLong(parseDT(p.date))}</h3>${slots.length ? slotGrid(base, p, slots, p.stylist) : emptyState('No openings that day.')}</div>`;
    const slot = slots.find(x => x.time === p.time);
    if (slot) {
      const st = stById(slot.stylistId);
      h += `<div class="confirm-move" id="confirm-move"><p>Move to <b>${fmtLong(parseDT(p.date))} at ${fmtT(p.time)}</b> with <b>${esc(st.name)}</b>?</p>
        <button type="button" class="btn btn-primary" data-action="do-reschedule" data-id="${b.id}" data-date="${p.date}" data-time="${p.time}" data-stylist="${slot.stylistId}">Confirm new time</button></div>`;
    }
  }
  h += '</div></div>';
  pendingScroll = p.time ? 'confirm-move' : p.date ? 'times' : null;
  return h;
}

function pageAccount() {
  const c = currentClient();
  if (!c) { go('/login?next=/account'); return ''; }
  const mine = state.bookings.filter(b => b.clientId === c.id);
  const up = mine.filter(b => ACTIVE.has(b.status) && b.status !== 'completed' && parseDT(b.end) > new Date()).sort((a, b) => a.start.localeCompare(b.start));
  const past = mine.filter(b => !up.includes(b)).sort((a, b) => b.start.localeCompare(a.start));
  const wl = state.waitlist.filter(w => w.clientId === c.id && w.status === 'open');
  const card = b => { const svc = svcById(b.serviceId), st = stById(b.stylistId); return `<li class="appt-row"><div><div class="appt-when">${fmtShortWhen(b.start)}</div><div>${esc(svc.name)} with ${esc(st.name)}</div><div class="muted small">${b.ref}</div></div><div class="appt-side">${pill(b.status)}<a class="btn btn-secondary btn-small" href="#/appointment/${b.id}">View</a></div></li>`; };
  return `<div class="narrow-wide">
    <div class="page-head"><h1>Hi, ${esc(firstName(c.name))}</h1><p class="muted">Your appointments at Willow &amp; Jade.</p></div>
    <div class="grid-2">
      <section class="card"><div class="section-head"><h2 class="h3">Upcoming</h2><a class="btn btn-primary btn-small" href="#/book">Book</a></div>
        ${up.length ? `<ul class="appt-list">${up.map(card).join('')}</ul>` : emptyState('No upcoming appointments.')}</section>
      <section class="card"><h2 class="h3">Your details</h2>
        <form class="form" data-form="client-profile">
          <label class="field"><span>Name</span><input name="name" value="${esc(c.name)}" required></label>
          <label class="field"><span>Email</span><input name="email" value="${esc(c.email)}" readonly></label>
          <label class="field"><span>Mobile phone</span><input name="phone" value="${esc(c.phone)}"></label>
          <button type="submit" class="btn btn-secondary btn-small">Save details</button></form></section>
    </div>
    ${wl.length ? `<section class="card"><h2 class="h3">Waitlist</h2><ul class="appt-list">${wl.map(w => `<li class="appt-row"><div><div class="appt-when">${fmtLong(parseDT(w.date))}</div><div>${esc(svcById(w.serviceId).name)} · ${w.stylistId === 'any' ? 'any stylist' : esc(stById(w.stylistId).name)} · ${esc(w.timePref)}</div></div><button type="button" class="btn btn-ghost btn-small" data-action="wl-remove" data-id="${w.id}">Leave waitlist</button></li>`).join('')}</ul></section>` : ''}
    <section class="card"><h2 class="h3">Past and cancelled</h2>${past.length ? `<ul class="appt-list">${past.map(card).join('')}</ul>` : emptyState('Nothing here yet.')}</section>
  </div>`;
}

function pageWaitlist(q) {
  const c = currentClient();
  const svcId = q.get('service') || '', stSel = q.get('stylist') || 'any', date = q.get('date') || dKey(addDays(today0(), 1));
  return `<div class="narrow">
    <div class="page-head"><h1>Join the waitlist</h1><p class="muted">If a spot opens up, we'll text you first.</p></div>
    <form class="form card" data-form="waitlist">
      <label class="field"><span>Service</span><select name="service" required>${SERVICES.map(s => `<option value="${s.id}" ${s.id === svcId ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
      <label class="field"><span>Stylist</span><select name="stylist"><option value="any">Any stylist</option>${state.stylists.map(st => `<option value="${st.id}" ${st.id === stSel ? 'selected' : ''}>${esc(st.name)}</option>`).join('')}</select></label>
      <label class="field"><span>Date you want</span><input type="date" name="date" value="${date}" min="${dKey(today0())}" required></label>
      <label class="field"><span>Best time</span><select name="timePref"><option>Any time</option><option>Morning (before noon)</option><option>Afternoon (noon to 5 PM)</option><option>Evening (after 5 PM)</option></select></label>
      <label class="field"><span>Full name</span><input name="name" required value="${esc(c ? c.name : '')}"></label>
      <label class="field"><span>Email</span><input name="email" type="email" required value="${esc(c ? c.email : '')}" ${c ? 'readonly' : ''}></label>
      <label class="field"><span>Mobile phone</span><input name="phone" type="tel" value="${esc(c ? c.phone : '')}"></label>
      <button type="submit" class="btn btn-primary">Join the waitlist</button>
    </form></div>`;
}

function pagePolicies() {
  const s = state.settings;
  return `<div class="narrow prose">
    <div class="page-head"><h1>Salon policies</h1><p class="muted">The short version, so there are no surprises.</p></div>
    <div class="card"><h2 class="h3">Changing or cancelling</h2><ul>
      <li>Change or cancel at least <b>${s.cancelWindowHours} hours</b> before your appointment at no charge.</li>
      <li>Inside ${s.cancelWindowHours} hours, a fee of <b>${s.lateFeePct}% of the service price</b> may apply.</li>
      <li>You can reschedule or cancel online any time with your confirmation number.</li></ul></div>
    <div class="card"><h2 class="h3">Deposits</h2><ul>
      <li>Services ${money(s.depositMin)} and up need a <b>${s.depositPct}% deposit</b> when you book.</li>
      <li>Your deposit goes toward your service on the day.</li>
      <li>Cancel with ${s.cancelWindowHours} hours' notice and we refund it in full. Late cancellations and no-shows keep the deposit.</li></ul></div>
    <div class="card"><h2 class="h3">Running late</h2><ul>
      <li>We hold your spot for <b>${s.graceMinutes} minutes</b>. Let us know online or by text if you're running behind.</li>
      <li>After that, we may need to shorten the service or move you to a new time.</li></ul></div>
    <div class="card"><h2 class="h3">Not happy with your service?</h2><ul>
      <li>Tell us within 7 days and we'll fix it at no charge.</li>
      <li>Product returns are accepted unopened within 14 days.</li></ul></div>
    <p class="muted small">Demo policies for a class. Not Willow &amp; Jade's real terms.</p></div>`;
}

function pageLogin(q) {
  const next = q.get('next') || '';
  return `<div class="narrow">
    <div class="page-head"><h1>Sign in</h1><p class="muted">Clients see their appointments. Staff go to the Velora front desk portal.</p></div>
    <form class="form card" data-form="login" data-next="${esc(next)}">
      <label class="field"><span>Email</span><input id="login-email" name="email" type="email" autocomplete="username" required></label>
      <label class="field"><span>Password</span><input id="login-password" name="password" type="password" autocomplete="current-password" required></label>
      <button type="submit" class="btn btn-primary" id="login-submit">Sign in</button>
    </form>
    <div class="card demo-accounts"><h2 class="h3">Demo accounts</h2><p class="muted small">This is a demo. Only these made-up accounts work.</p>
      <table class="table"><thead><tr><th>Role</th><th>Email</th><th>Password</th><th></th></tr></thead><tbody>
      ${ACCOUNTS.map(a => `<tr><td>${a.role === 'staff' ? esc(a.name) : 'Client (Maya)'}</td><td><code>${a.email}</code></td><td><code>${a.password}</code></td><td><button type="button" class="btn btn-ghost btn-small" data-action="fill-login" data-email="${a.email}" data-password="${a.password}">Use</button></td></tr>`).join('')}
      </tbody></table></div></div>`;
}

function notFound() { return `<div class="narrow">${emptyState('We couldn’t find that page.', '<a class="btn btn-primary btn-small" href="#/">Go home</a>')}</div>`; }

/* ---------------- staff pages ---------------- */
function staffShell(inner, active) {
  const s = session();
  const items = [['dashboard', 'Dashboard'], ['calendar', 'Calendar'], ['bookings', 'Bookings'], ['clients', 'Clients'], ['availability', 'Availability'], ['waitlist', 'Waitlist'], ['activity', 'Activity log'], ['settings', 'Settings']];
  const wlOpen = state.waitlist.filter(w => w.status === 'open').length;
  return `<div class="staff">
    <header class="staff-top"><span class="velora light">${LOGO}<span>Velora</span><span class="velora-tag">Salon Suite</span></span>
      <span class="staff-salon">Willow &amp; Jade</span><span class="spacer"></span>
      <a href="#/" class="staff-link">Booking site</a><span class="staff-user">Signed in as <b>${esc(s.name)}</b></span>
      <button type="button" class="btn btn-small btn-on-dark" data-action="logout">Sign out</button></header>
    <div class="staff-body">
      <nav class="staff-nav" aria-label="Staff">
        <button type="button" class="btn btn-primary btn-block" data-action="new-booking">+ New booking</button>
        ${items.map(([k, l]) => `<a href="#/staff/${k}" class="snav ${active === k ? 'is-active' : ''}">${l}${k === 'waitlist' && wlOpen ? ` <span class="count">${wlOpen}</span>` : ''}</a>`).join('')}
      </nav>
      <main class="staff-main" id="main">${inner}</main>
    </div></div>`;
}

function staffDashboard() {
  const tk = dKey(today0());
  const todays = state.bookings.filter(b => b.start.startsWith(tk) && b.status !== 'cancelled').sort((a, b) => a.start.localeCompare(b.start));
  const in48 = new Date(Date.now() + 48 * 36e5);
  const unconfirmed = state.bookings.filter(b => b.status === 'booked' && parseDT(b.start) > new Date() && parseDT(b.start) < in48).sort((a, b) => a.start.localeCompare(b.start));
  const fees = state.bookings.filter(b => b.fee && b.fee.status === 'pending');
  const late = state.bookings.filter(b => b.lateNotice && b.start.startsWith(tk));
  const wl = state.waitlist.filter(w => w.status === 'open');
  const weekStart = addDays(today0(), -6);
  const cancels = state.bookings.filter(b => b.status === 'cancelled' && new Date(b.updatedAt) >= weekStart).length;
  const revenue = todays.filter(b => b.status !== 'no-show').reduce((s, b) => s + svcById(b.serviceId).price, 0);
  const row = b => {
    const svc = svcById(b.serviceId), st = stById(b.stylistId), c = clById(b.clientId);
    let act = '';
    if (b.status === 'booked' || b.status === 'confirmed') act = `<button type="button" class="btn btn-secondary btn-small" data-action="set-status" data-id="${b.id}" data-status="checked-in">Check in</button>`;
    else if (b.status === 'checked-in') act = `<button type="button" class="btn btn-secondary btn-small" data-action="set-status" data-id="${b.id}" data-status="completed">Complete</button>`;
    return `<tr><td class="nowrap">${fmtTime(parseDT(b.start))}</td><td><a class="link" href="#/staff/client/${c.id}">${esc(c.name)}</a>${b.lateNotice ? ` <span class="tag warn">${b.lateNotice.minutes} min late</span>` : ''}</td><td>${esc(svc.name)}</td><td>${stDot(st)} ${esc(firstName(st.name))}</td><td>${pill(b.status)}</td><td class="right"><a class="btn btn-ghost btn-small" href="#/staff/booking/${b.id}">Open</a> ${act}</td></tr>`;
  };
  const attn = [];
  late.forEach(b => attn.push(`<li><span class="tag warn">Running late</span> ${esc(clById(b.clientId).name)} is about ${b.lateNotice.minutes} min late for ${fmtTime(parseDT(b.start))}. <a class="link" href="#/staff/booking/${b.id}">Open</a></li>`));
  fees.forEach(b => attn.push(`<li><span class="tag warn">Late cancel</span> ${esc(clById(b.clientId).name)}, ${esc(describe(b))}. Fee ${money(b.fee.amount)} pending. <button type="button" class="btn btn-ghost btn-small" data-action="fee" data-id="${b.id}" data-to="waived">Waive</button><button type="button" class="btn btn-ghost btn-small" data-action="fee" data-id="${b.id}" data-to="charged">Charge</button></li>`));
  unconfirmed.slice(0, 5).forEach(b => attn.push(`<li><span class="tag">Unconfirmed</span> ${esc(clById(b.clientId).name)}, ${esc(describe(b))}. <button type="button" class="btn btn-ghost btn-small" data-action="set-status" data-id="${b.id}" data-status="confirmed">Mark confirmed</button></li>`));
  if (unconfirmed.length > 5) attn.push(`<li><a class="link" href="#/staff/bookings${qs({ status: 'booked' })}">See all ${unconfirmed.length} unconfirmed bookings</a></li>`);
  if (wl.length) attn.push(`<li><span class="tag">Waitlist</span> ${wl.length} client${wl.length > 1 ? 's' : ''} waiting for a spot. <a class="link" href="#/staff/waitlist">See waitlist</a></li>`);
  return `<div class="page-head row"><div><h1>Today</h1><p class="muted">${fmtLong(today0())}</p></div><a class="btn btn-secondary" href="#/staff/calendar">Open calendar</a></div>
    <div class="stats">
      <div class="stat"><span class="stat-n">${todays.length}</span><span class="stat-l">Appointments today</span></div>
      <div class="stat"><span class="stat-n">$${revenue.toLocaleString('en-US')}</span><span class="stat-l">Booked revenue today</span></div>
      <div class="stat"><span class="stat-n">${unconfirmed.length}</span><span class="stat-l">Unconfirmed, next 48 hrs</span></div>
      <div class="stat"><span class="stat-n">${cancels}</span><span class="stat-l">Cancellations, last 7 days</span></div>
    </div>
    <div class="grid-2 wide-left">
      <section class="card"><h2 class="h3">Today's schedule</h2>${todays.length ? `<table class="table"><thead><tr><th>Time</th><th>Client</th><th>Service</th><th>Stylist</th><th>Status</th><th></th></tr></thead><tbody>${todays.map(row).join('')}</tbody></table>` : emptyState(SALON.hours[today0().getDay()] ? 'No appointments today.' : 'The salon is closed today.')}</section>
      <section class="card"><div class="section-head"><h2 class="h3">Needs attention</h2>${unconfirmed.length > 1 ? '<button type="button" class="btn btn-ghost btn-small" data-action="confirm-all">Confirm all</button>' : ''}</div>${attn.length ? `<ul class="attn">${attn.join('')}</ul>` : emptyState('All caught up.')}</section>
    </div>`;
}

function staffCalendar(q) {
  const key = q.get('date') || dKey(today0());
  const d = parseDT(key);
  const sh = SALON.hours[d.getDay()];
  const open = sh ? hm2m(sh[0]) : 8 * 60, close = sh ? hm2m(sh[1]) : 19 * 60;
  const rowH = 14, rows = (close - open) / STEP;
  const times = [];
  for (let m = open; m < close; m += 60) times.push(`<div class="cal-hour" style="top:${(m - open) / STEP * rowH}px">${fmtT(m2hm(m))}</div>`);
  const cols = state.stylists.map(st => {
    const w = windowFor(st, key);
    let shade = '';
    if (!w) shade = `<div class="cal-off" style="top:0;height:${rows * rowH}px"><span>Not working</span></div>`;
    else {
      if (w[0] > open) shade += `<div class="cal-off" style="top:0;height:${(w[0] - open) / STEP * rowH}px"></div>`;
      if (w[1] < close) shade += `<div class="cal-off" style="top:${(w[1] - open) / STEP * rowH}px;height:${(close - w[1]) / STEP * rowH}px"></div>`;
    }
    const blocks = state.blocks.filter(k => k.stylistId === st.id && k.date === key).map(k =>
      `<div class="cal-block" style="top:${(hm2m(k.start) - open) / STEP * rowH}px;height:${(hm2m(k.end) - hm2m(k.start)) / STEP * rowH}px"><b>Time off</b> ${esc(k.reason)}</div>`).join('');
    let cells = '';
    if (w && sh) for (let m = w[0]; m < w[1]; m += STEP) cells += `<button type="button" class="cal-cell" style="top:${(m - open) / STEP * rowH}px;height:${rowH}px" data-action="new-booking" data-stylist="${st.id}" data-date="${key}" data-time="${m2hm(m)}" aria-label="New booking with ${esc(st.name)} at ${fmtT(m2hm(m))}"></button>`;
    const evs = state.bookings.filter(b => b.stylistId === st.id && b.start.startsWith(key) && b.status !== 'cancelled').map(b => {
      const s0 = hm2m(b.start.slice(11)), e0 = hm2m(b.end.slice(11)), svc = svcById(b.serviceId), c = clById(b.clientId);
      return `<a class="cal-event st-${b.status}" href="#/staff/booking/${b.id}" style="--c:${st.color};top:${(s0 - open) / STEP * rowH}px;height:${(e0 - s0) / STEP * rowH - 2}px" title="${esc(c.name)}, ${esc(svc.name)}">
        <b>${fmtT(b.start.slice(11))} ${esc(c.name)}</b><span>${esc(svc.name)}</span>${b.status !== 'booked' && b.status !== 'confirmed' ? `<span class="ev-st">${STATUS[b.status]}</span>` : ''}</a>`;
    }).join('');
    return `<div class="cal-col"><div class="cal-colhead">${stDot(st)} ${esc(st.name)}</div><div class="cal-colbody" style="height:${rows * rowH}px">${shade}${cells}${blocks}${evs}</div></div>`;
  }).join('');
  const prev = dKey(addDays(d, -1)), next = dKey(addDays(d, 1));
  let nextOpen = '';
  if (!sh) { let n = addDays(d, 1); for (let i = 0; i < 7 && !SALON.hours[n.getDay()]; i++) n = addDays(n, 1); nextOpen = dKey(n); }
  return `<div class="page-head row"><div><h1>Calendar</h1><p class="muted">${fmtLong(d)}${sh ? '' : ` · Salon closed · <a class="link" href="#/staff/calendar${qs({ date: nextOpen })}">Jump to ${fmtDay(parseDT(nextOpen))}</a>`}</p></div>
    <div class="cal-nav"><a class="btn btn-ghost btn-small" href="#/staff/calendar${qs({ date: prev })}">← Previous day</a>
      <a class="btn btn-ghost btn-small" href="#/staff/calendar">Today</a>
      <a class="btn btn-ghost btn-small" href="#/staff/calendar${qs({ date: next })}">Next day →</a>
      <label class="sr-only" for="cal-date">Go to date</label><input id="cal-date" type="date" value="${key}" data-nav="/staff/calendar" data-param="date"></div></div>
    <p class="muted small">Click an empty slot to book it. Click an appointment to open it.</p>
    <div class="cal card"><div class="cal-times"><div class="cal-colhead"></div><div class="cal-colbody" style="height:${rows * rowH}px">${times.join('')}</div></div><div class="cal-cols">${cols}</div></div>`;
}

function staffBookings(q) {
  const view = q.get('view') || 'upcoming', status = q.get('status') || '', stf = q.get('stylist') || '', term = (q.get('q') || '').trim().toLowerCase();
  const now = new Date();
  let list = state.bookings.slice();
  if (view === 'upcoming') list = list.filter(b => parseDT(b.end) >= now);
  if (view === 'past') list = list.filter(b => parseDT(b.end) < now);
  if (status) list = list.filter(b => b.status === status);
  if (stf) list = list.filter(b => b.stylistId === stf);
  if (term) list = list.filter(b => { const c = clById(b.clientId); return b.ref.toLowerCase().includes(term) || c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || svcById(b.serviceId).name.toLowerCase().includes(term); });
  list.sort((a, b) => (view === 'past' ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start)));
  const shown = list.slice(0, 200);
  return `<div class="page-head row"><div><h1>Bookings</h1><p class="muted">${list.length} match${list.length === 1 ? '' : 'es'}</p></div><button type="button" class="btn btn-primary" data-action="new-booking">+ New booking</button></div>
    <form class="filters card" data-form="filter" data-base="/staff/bookings">
      <label class="field"><span>Show</span><select name="view" data-autosubmit>${[['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'All']].map(([v, l]) => `<option value="${v}" ${v === view ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label class="field"><span>Status</span><select name="status" data-autosubmit><option value="">Any status</option>${Object.entries(STATUS).map(([v, l]) => `<option value="${v}" ${v === status ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label class="field"><span>Stylist</span><select name="stylist" data-autosubmit><option value="">Any stylist</option>${state.stylists.map(st => `<option value="${st.id}" ${st.id === stf ? 'selected' : ''}>${esc(st.name)}</option>`).join('')}</select></label>
      <label class="field grow"><span>Search</span><input name="q" value="${esc(q.get('q') || '')}" placeholder="Name, email, service or WJ- number"></label>
      <button type="submit" class="btn btn-secondary">Search</button></form>
    <div class="card">${shown.length ? `<table class="table"><thead><tr><th>Ref</th><th>When</th><th>Client</th><th>Service</th><th>Stylist</th><th>Status</th><th>Source</th></tr></thead><tbody>
      ${shown.map(b => { const c = clById(b.clientId), st = stById(b.stylistId); return `<tr><td><a class="link" href="#/staff/booking/${b.id}">${b.ref}</a></td><td class="nowrap">${fmtShortWhen(b.start)}</td><td>${esc(c.name)}</td><td>${esc(svcById(b.serviceId).name)}</td><td>${stDot(st)} ${esc(firstName(st.name))}</td><td>${pill(b.status)}${b.fee && b.fee.status === 'pending' ? ' <span class="tag warn">Fee</span>' : ''}</td><td class="muted">${esc(b.source)}</td></tr>`; }).join('')}
      </tbody></table>${list.length > shown.length ? `<p class="muted small">Showing the first ${shown.length}. Narrow the filters to see more.</p>` : ''}` : emptyState('No bookings match those filters.')}</div>`;
}

function timeFields({ service, stylist, date, current }) {
  return `<label class="field"><span>Service</span><select name="service" data-recalc-field>${SERVICES.map(s => `<option value="${s.id}" ${s.id === service ? 'selected' : ''}>${esc(s.name)} · ${durLabel(s.dur)} · ${money(s.price)}</option>`).join('')}</select></label>
    <label class="field"><span>Stylist</span><select name="stylist" data-recalc-field><option value="any" ${stylist === 'any' ? 'selected' : ''}>Any available</option>${state.stylists.map(st => `<option value="${st.id}" ${st.id === stylist ? 'selected' : ''}>${esc(st.name)}</option>`).join('')}</select></label>
    <label class="field"><span>Date</span><input type="date" name="date" value="${date}" min="${dKey(today0())}" required data-recalc-field></label>
    <label class="field"><span>Time</span><select name="time" required data-current="${current || ''}"></select><small class="muted" data-slot-hint></small></label>`;
}

function fillTimes(f) {
  const svc = f.elements.service.value, st = f.elements.stylist.value, key = f.elements.date.value, ignore = f.dataset.ignore || null;
  const sel = f.elements.time;
  const keep = sel.value || sel.dataset.current || '';
  const hint = f.querySelector('[data-slot-hint]');
  if (st !== 'any' && !canDo(stById(st), svc)) {
    sel.innerHTML = '<option value="">This stylist doesn’t offer that service</option>';
    if (hint) hint.textContent = '';
    return;
  }
  const slots = slotsFor(key, svc, st, { ignoreId: ignore, staff: true });
  sel.innerHTML = slots.length ? slots.map(x => `<option value="${x.time}" ${x.time === keep ? 'selected' : ''}>${fmtT(x.time)}${st === 'any' ? ` · ${esc(stById(x.stylistId).name)}` : ''}</option>`).join('') : '<option value="">No openings that day</option>';
  if (hint) hint.textContent = slots.length ? `${slots.length} open start times` : '';
}

function staffBooking(id) {
  const b = bkById(id);
  if (!b) return notFound();
  const svc = svcById(b.serviceId), st = stById(b.stylistId), c = clById(b.clientId);
  const started = parseDT(b.start) <= new Date();
  const btn = (status, label, cls = 'btn-secondary') => `<button type="button" class="btn ${cls} btn-small" data-action="set-status" data-id="${b.id}" data-status="${status}">${label}</button>`;
  let actions = [];
  if (b.status === 'booked') actions.push(btn('confirmed', 'Mark confirmed'));
  if (['booked', 'confirmed'].includes(b.status)) actions.push(btn('checked-in', 'Check in'));
  if (b.status === 'checked-in') actions.push(btn('completed', 'Complete visit', 'btn-primary'));
  if (['booked', 'confirmed'].includes(b.status) && started) actions.push(btn('no-show', 'Mark no-show'));
  if (['booked', 'confirmed', 'checked-in'].includes(b.status)) actions.push(`<button type="button" class="btn btn-danger-ghost btn-small" data-action="cancel-open" data-id="${b.id}">Cancel booking</button>`);
  if (['cancelled', 'no-show'].includes(b.status)) actions.push(`<button type="button" class="btn btn-secondary btn-small" data-action="restore" data-id="${b.id}">Restore booking</button>`);
  if (['booked', 'confirmed'].includes(b.status) && !started) actions.push(`<a class="btn btn-ghost btn-small" href="#/reschedule/${b.id}">Pick a new time</a>`);
  const editable = ['booked', 'confirmed'].includes(b.status) && !started;
  const dep = b.deposit;
  return `<p><a class="link" href="#/staff/bookings">← All bookings</a></p>
    <div class="page-head row"><div><p class="eyebrow">Booking ${b.ref}</p><h1>${esc(c.name)} · ${esc(svc.name)}</h1><p class="muted">${fmtWhen(b.start)} with ${esc(st.name)}</p></div>${pill(b.status)}</div>
    ${b.lateNotice ? `<div class="alert warn">Client says they're running about ${b.lateNotice.minutes} minutes late (sent ${fmtStamp(b.lateNotice.at)}). <button type="button" class="btn btn-ghost btn-small" data-action="clear-late" data-id="${b.id}">Clear</button></div>` : ''}
    ${b.fee ? `<div class="alert ${b.fee.status === 'pending' ? 'warn' : 'info'}">Late cancellation fee ${money(b.fee.amount)}: <b>${b.fee.status}</b>. ${b.fee.status === 'pending' ? `<button type="button" class="btn btn-ghost btn-small" data-action="fee" data-id="${b.id}" data-to="waived">Waive fee</button><button type="button" class="btn btn-ghost btn-small" data-action="fee" data-id="${b.id}" data-to="charged">Charge fee (demo)</button>` : ''}</div>` : ''}
    <div class="btn-row">${actions.join('')}</div>
    <div class="grid-2">
      <section class="card"><h2 class="h3">Details</h2><dl class="details">
        <div><dt>Client</dt><dd><a class="link" href="#/staff/client/${c.id}">${esc(c.name)}</a><br><span class="muted small">${esc(c.email)} · ${esc(c.phone)}</span></dd></div>
        <div><dt>Service</dt><dd>${esc(svc.name)} · ${durLabel(svc.dur)} · ${money(svc.price)}</dd></div>
        <div><dt>Stylist</dt><dd>${stDot(st)} ${esc(st.name)}</dd></div>
        <div><dt>When</dt><dd>${fmtWhen(b.start)} to ${fmtTime(parseDT(b.end))}</dd></div>
        <div><dt>Booked via</dt><dd>${esc(b.source)} · ${fmtStamp(b.createdAt)}</dd></div>
        <div><dt>Deposit</dt><dd>${depositText(b)}${dep && ['held', 'kept toward fee', 'forfeited'].includes(dep.status) ? ` <button type="button" class="btn btn-ghost btn-small" data-action="deposit" data-id="${b.id}" data-to="refunded">Refund deposit</button>` : ''}</dd></div>
        ${b.cancelReason ? `<div><dt>Cancel reason</dt><dd>${esc(b.cancelReason)}${b.lateCancel ? ' · late cancellation' : ''}</dd></div>` : ''}
        ${b.notes ? `<div><dt>Client note</dt><dd>${esc(b.notes)}</dd></div>` : ''}
        ${c.notes ? `<div><dt>Client profile note</dt><dd>${esc(c.notes)}</dd></div>` : ''}
      </dl></section>
      <section class="card"><h2 class="h3">${editable ? 'Change service, stylist or time' : 'Change booking'}</h2>
        ${editable ? `<form class="form" data-form="staff-edit" data-id="${b.id}" data-ignore="${b.id}" data-recalc>
          ${timeFields({ service: b.serviceId, stylist: b.stylistId, date: b.start.slice(0, 10), current: b.start.slice(11) })}
          <button type="submit" class="btn btn-primary btn-small">Save changes</button></form>` : '<p class="muted">Only upcoming booked or confirmed appointments can be changed. Restore a cancelled booking first, or make a new one.</p>'}
        <form class="form" data-form="staff-notes" data-id="${b.id}"><label class="field"><span>Internal note (staff only)</span><textarea name="staffNotes" rows="3">${esc(b.staffNotes)}</textarea></label><button type="submit" class="btn btn-secondary btn-small">Save note</button></form>
      </section>
    </div>
    <section class="card"><h2 class="h3">History</h2><ol class="timeline">${b.history.slice().reverse().map(h => `<li><span class="muted small">${fmtStamp(h.at)} · ${esc(h.actor)}</span><div>${esc(h.text)}</div></li>`).join('')}</ol></section>`;
}

function staffClients(q) {
  const term = (q.get('q') || '').trim().toLowerCase();
  const now = new Date();
  let list = state.clients.slice().sort((a, b) => a.name.localeCompare(b.name));
  if (term) list = list.filter(c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.phone.includes(term));
  return `<div class="page-head row"><div><h1>Clients</h1><p class="muted">${state.clients.length} clients</p></div><button type="button" class="btn btn-primary" data-action="new-client">+ New client</button></div>
    <form class="filters card" data-form="filter" data-base="/staff/clients"><label class="field grow"><span>Search</span><input name="q" value="${esc(q.get('q') || '')}" placeholder="Name, email or phone"></label><button type="submit" class="btn btn-secondary">Search</button></form>
    <div class="card"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Next visit</th><th>Visits</th></tr></thead><tbody>
    ${list.map(c => { const mine = state.bookings.filter(b => b.clientId === c.id); const next = mine.filter(b => ['booked', 'confirmed'].includes(b.status) && parseDT(b.start) > now).sort((a, b) => a.start.localeCompare(b.start))[0]; const visits = mine.filter(b => b.status === 'completed').length;
      return `<tr><td><a class="link" href="#/staff/client/${c.id}">${esc(c.name)}</a></td><td>${esc(c.email)}</td><td class="nowrap">${esc(c.phone)}</td><td class="nowrap">${next ? fmtShortWhen(next.start) : '<span class="muted">None</span>'}</td><td>${visits}</td></tr>`; }).join('')}
    </tbody></table></div>`;
}

function staffClient(id) {
  const c = clById(id);
  if (!c) return notFound();
  const now = new Date();
  const mine = state.bookings.filter(b => b.clientId === c.id);
  const up = mine.filter(b => parseDT(b.end) >= now && b.status !== 'cancelled').sort((a, b) => a.start.localeCompare(b.start));
  const past = mine.filter(b => !up.includes(b)).sort((a, b) => b.start.localeCompare(a.start));
  const spent = mine.filter(b => b.status === 'completed').reduce((s, b) => s + svcById(b.serviceId).price, 0);
  const tbl = list => list.length ? `<table class="table"><thead><tr><th>Ref</th><th>When</th><th>Service</th><th>Stylist</th><th>Status</th></tr></thead><tbody>${list.map(b => `<tr><td><a class="link" href="#/staff/booking/${b.id}">${b.ref}</a></td><td class="nowrap">${fmtShortWhen(b.start)}</td><td>${esc(svcById(b.serviceId).name)}</td><td>${esc(stById(b.stylistId).name)}</td><td>${pill(b.status)}</td></tr>`).join('')}</tbody></table>` : emptyState('None.');
  return `<p><a class="link" href="#/staff/clients">← All clients</a></p>
    <div class="page-head row"><div><h1>${esc(c.name)}</h1><p class="muted">Client since ${fmtDay(parseDT(c.createdAt))} · ${mine.filter(b => b.status === 'completed').length} visits · ${money(spent)} spent</p></div>
      <button type="button" class="btn btn-primary" data-action="new-booking" data-client="${c.id}">+ Book for ${esc(firstName(c.name))}</button></div>
    <div class="grid-2 wide-left">
      <section class="card"><h2 class="h3">Upcoming</h2>${tbl(up)}<h2 class="h3">Past and cancelled</h2>${tbl(past)}</section>
      <section class="card"><h2 class="h3">Contact and notes</h2><form class="form" data-form="client-edit" data-id="${c.id}">
        <label class="field"><span>Name</span><input name="name" value="${esc(c.name)}" required></label>
        <label class="field"><span>Email</span><input name="email" type="email" value="${esc(c.email)}" required></label>
        <label class="field"><span>Phone</span><input name="phone" value="${esc(c.phone)}"></label>
        <label class="field"><span>Notes (allergies, preferences)</span><textarea name="notes" rows="4">${esc(c.notes)}</textarea></label>
        <button type="submit" class="btn btn-secondary btn-small">Save client</button></form></section>
    </div>`;
}

function staffAvailability() {
  const order = WEEK_ORDER;
  const stCards = state.stylists.map(st => `<section class="card"><h2 class="h3">${stDot(st)} ${esc(st.name)} <span class="muted small">${esc(st.title)}</span></h2>
    <form class="form" data-form="hours" data-id="${st.id}"><table class="table hours"><thead><tr><th>Day</th><th>Working</th><th>Start</th><th>End</th></tr></thead><tbody>
    ${order.map(d => { const h = st.hours[d], salonOpen = !!SALON.hours[d]; return `<tr class="${salonOpen ? '' : 'muted'}"><td>${DAYS[d]}</td>
      <td><input type="checkbox" name="on-${d}" ${h && salonOpen ? 'checked' : ''} ${salonOpen ? '' : 'disabled'} aria-label="${esc(st.name)} works ${DAYS[d]}"></td>
      <td><input type="time" name="start-${d}" value="${h ? h[0] : (SALON.hours[d] || ['09:00'])[0]}" step="900" ${salonOpen ? '' : 'disabled'} aria-label="${DAYS[d]} start"></td>
      <td><input type="time" name="end-${d}" value="${h ? h[1] : (SALON.hours[d] || ['09:00', '17:00'])[1]}" step="900" ${salonOpen ? '' : 'disabled'} aria-label="${DAYS[d]} end"></td></tr>`; }).join('')}
    </tbody></table><p class="muted small">Salon is closed Sunday and Monday.</p><button type="submit" class="btn btn-secondary btn-small">Save ${esc(firstName(st.name))}'s hours</button></form></section>`).join('');
  const tk = dKey(today0());
  const blocks = state.blocks.filter(k => k.date >= tk).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  return `<div class="page-head"><h1>Availability</h1><p class="muted">Working hours and time off control what clients can book online.</p></div>
    <section class="card"><h2 class="h3">Block time off</h2><form class="form form-inline" data-form="block-add">
      <label class="field"><span>Stylist</span><select name="stylistId">${state.stylists.map(st => `<option value="${st.id}">${esc(st.name)}</option>`).join('')}</select></label>
      <label class="field"><span>Date</span><input type="date" name="date" value="${dKey(addDays(today0(), 1))}" min="${tk}" required></label>
      <label class="field"><span>From</span><input type="time" name="start" value="12:00" step="900"></label>
      <label class="field"><span>To</span><input type="time" name="end" value="13:00" step="900"></label>
      <label class="check"><input type="checkbox" name="allDay" aria-label="Block the whole day"> <span>All day</span></label>
      <label class="field grow"><span>Reason</span><input name="reason" placeholder="Lunch, appointment, training..." value="Personal time"></label>
      <button type="submit" class="btn btn-primary">Block time</button></form>
      ${blocks.length ? `<table class="table"><thead><tr><th>Stylist</th><th>Date</th><th>Time</th><th>Reason</th><th></th></tr></thead><tbody>${blocks.map(k => `<tr><td>${esc(stById(k.stylistId).name)}</td><td>${fmtDay(parseDT(k.date))}</td><td class="nowrap">${fmtT(k.start)} to ${fmtT(k.end)}</td><td>${esc(k.reason)}</td><td class="right"><button type="button" class="btn btn-ghost btn-small" data-action="block-remove" data-id="${k.id}">Remove</button></td></tr>`).join('')}</tbody></table>` : emptyState('No upcoming time off.')}
    </section>
    <div class="grid-2">${stCards}</div>`;
}

function staffWaitlist() {
  const open = state.waitlist.filter(w => w.status === 'open').sort((a, b) => a.date.localeCompare(b.date));
  const done = state.waitlist.filter(w => w.status !== 'open');
  return `<div class="page-head"><h1>Waitlist</h1><p class="muted">Clients waiting for a spot. Openings are checked live against the schedule.</p></div>
    <div class="card">${open.length ? `<table class="table"><thead><tr><th>Client</th><th>Service</th><th>Stylist</th><th>Date</th><th>Best time</th><th>Openings</th><th></th></tr></thead><tbody>
    ${open.map(w => { const c = clById(w.clientId); const n = slotsFor(w.date, w.serviceId, w.stylistId, { staff: true }).length;
      return `<tr><td><a class="link" href="#/staff/client/${c.id}">${esc(c.name)}</a>${w.note ? `<div class="muted small">${esc(w.note)}</div>` : ''}</td><td>${esc(svcById(w.serviceId).name)}</td><td>${w.stylistId === 'any' ? 'Any' : esc(stById(w.stylistId).name)}</td><td class="nowrap">${fmtDay(parseDT(w.date))}</td><td>${esc(w.timePref)}</td><td>${n ? `<span class="tag ok">${n} open</span>` : '<span class="muted">Full</span>'}</td>
      <td class="right nowrap"><button type="button" class="btn btn-secondary btn-small" data-action="new-booking" data-client="${c.id}" data-service="${w.serviceId}" data-stylist="${w.stylistId}" data-date="${w.date}" data-waitlist="${w.id}">Book</button> <button type="button" class="btn btn-ghost btn-small" data-action="wl-remove" data-id="${w.id}">Remove</button></td></tr>`; }).join('')}
    </tbody></table>` : emptyState('Nobody is waiting right now.')}</div>
    ${done.length ? `<p class="muted small">${done.length} waitlist request${done.length > 1 ? 's' : ''} already booked or removed.</p>` : ''}`;
}

function staffActivity(q) {
  const who = q.get('actor') || '';
  const actors = [...new Set(state.activity.map(a => a.actor))].sort();
  const list = state.activity.filter(a => !who || a.actor === who);
  return `<div class="page-head"><h1>Activity log</h1><p class="muted">Every change, who made it and when. Useful for checking what an AI agent did.</p></div>
    <form class="filters card" data-form="filter" data-base="/staff/activity"><label class="field"><span>Who</span><select name="actor" data-autosubmit><option value="">Everyone</option>${actors.map(a => `<option ${a === who ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select></label></form>
    <div class="card">${list.length ? `<table class="table"><thead><tr><th>When</th><th>Who</th><th>What happened</th><th>Booking</th></tr></thead><tbody>${list.map(a => `<tr><td class="nowrap muted">${fmtStamp(a.at)}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td><td>${a.bookingId && bkById(a.bookingId) ? `<a class="link" href="#/staff/booking/${a.bookingId}">${a.ref}</a>` : esc(a.ref)}</td></tr>`).join('')}</tbody></table>` : emptyState('No activity yet.')}</div>`;
}

function staffSettings() {
  const s = state.settings;
  return `<div class="page-head"><h1>Settings</h1><p class="muted">Booking rules for Willow &amp; Jade.</p></div>
    <section class="card"><h2 class="h3">Cancellation and deposits</h2><form class="form form-inline" data-form="settings">
      <label class="field"><span>Free cancellation window (hours)</span><input type="number" name="cancelWindowHours" min="0" max="168" value="${s.cancelWindowHours}"></label>
      <label class="field"><span>Late cancellation fee (%)</span><input type="number" name="lateFeePct" min="0" max="100" value="${s.lateFeePct}"></label>
      <label class="field"><span>Deposit needed from ($)</span><input type="number" name="depositMin" min="0" value="${s.depositMin}"></label>
      <label class="field"><span>Deposit (%)</span><input type="number" name="depositPct" min="0" max="100" value="${s.depositPct}"></label>
      <label class="field"><span>Late arrival grace (minutes)</span><input type="number" name="graceMinutes" min="0" max="60" value="${s.graceMinutes}"></label>
      <button type="submit" class="btn btn-primary">Save settings</button></form></section>
    <section class="card"><h2 class="h3">Demo data</h2><p class="muted">Bookings live in this browser only. Reset to start the demo fresh, with appointments rebuilt around today's date.</p>
      <div class="btn-row"><button type="button" class="btn btn-danger" data-action="reset-demo">Reset demo data</button><button type="button" class="btn btn-ghost" data-action="export">Download data (JSON)</button></div></section>`;
}

/* ---------------- modals ---------------- */
const modal = () => $('#modal');
function openModal(html) {
  const m = modal();
  m.innerHTML = `<div class="modal-card"><button type="button" class="modal-x" data-action="close-modal" aria-label="Close">×</button>${html}</div>`;
  if (!m.open) m.showModal();
  m.querySelectorAll('form[data-recalc]').forEach(fillTimes);
  const first = m.querySelector('input:not([type=hidden]):not([readonly]),select,textarea');
  if (first) first.focus();
}
function closeModal() { const m = modal(); if (m.open) m.close(); }

function newBookingModal(d = {}) {
  const t0 = dKey(today0());
  let date = d.date || t0;
  if (date < t0) date = t0;
  const clients = state.clients.slice().sort((a, b) => a.name.localeCompare(b.name));
  const presetSt = d.stylist && d.stylist !== 'any' ? stById(d.stylist) : null;
  const service = d.service || (presetSt && !canDo(presetSt, 'cut-style') ? SERVICES.find(s => canDo(presetSt, s.id)).id : 'cut-style');
  openModal(`<h2>New booking</h2>
    <form class="form" data-form="staff-new" data-recalc data-waitlist="${d.waitlist || ''}">
      <label class="field"><span>Client</span><select name="clientId" data-client-select><option value="new">+ New client</option>${clients.map(c => `<option value="${c.id}" ${c.id === d.client ? 'selected' : ''}>${esc(c.name)} · ${esc(c.email)}</option>`).join('')}</select></label>
      <div class="new-client" ${d.client ? 'hidden' : ''}>
        <label class="field"><span>New client name</span><input name="newName" ${d.client ? '' : 'required'}></label>
        <label class="field"><span>Email</span><input name="newEmail" type="email"></label>
        <label class="field"><span>Phone</span><input name="newPhone" type="tel"></label></div>
      ${timeFields({ service, stylist: d.stylist || 'any', date, current: d.time || '' })}
      <label class="field"><span>Booked via</span><select name="source">${SOURCES.map(s => `<option ${s === 'Phone' ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <label class="field"><span>Note</span><textarea name="notes" rows="2"></textarea></label>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Create booking</button></div>
    </form>`);
}

/* ---------------- actions ---------------- */
let pendingScroll = null;
const ACTIONS = {
  'close-modal': () => closeModal(),
  logout: () => { setSession(null); toast('Signed out.'); go('/'); render(); },
  'fill-login': d => { const e = $('#login-email'), p = $('#login-password'); if (e && p) { e.value = d.email; p.value = d.password; $('#login-submit').focus(); } },
  'reset-demo': () => {
    openModal(`<h2>Reset demo data?</h2><p>This wipes every change made in this browser and rebuilds the demo schedule around today.</p>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="close-modal">Keep my changes</button><button type="button" class="btn btn-danger" data-action="reset-confirm">Reset</button></div>`);
  },
  'reset-confirm': () => { state = seed(); save(); closeModal(); toast('Demo data reset.'); render(); },
  export: () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); dl(blob, `velora-demo-data-${dKey(new Date())}.json`); },
  ics: d => {
    const b = bkById(d.id); if (!b) return;
    const svc = svcById(b.serviceId), st = stById(b.stylistId);
    const f = s => s.replace(/[-:]/g, '') + '00';
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Velora Demo//EN', 'BEGIN:VEVENT', `UID:${b.id}@velora-demo`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART:${f(b.start)}`, `DTEND:${f(b.end)}`,
      `SUMMARY:${svc.name} at Willow & Jade (demo)`, `DESCRIPTION:Booking ${b.ref} with ${st.name}. Class demo only.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    dl(new Blob([ics], { type: 'text/calendar' }), `${b.ref}.ics`);
  },
  'cancel-open': d => {
    const b = bkById(d.id); if (!b) return;
    const { late, fee } = lateInfo(b);
    const staff = isStaff();
    openModal(`<h2>Cancel this appointment?</h2><p>${esc(describe(b))}</p>
      ${late && fee ? `<div class="alert warn"><b>Late cancellation.</b> This is less than ${state.settings.cancelWindowHours} hours away, so a ${money(fee)} fee may apply.${staff ? ' You can waive it afterward.' : ''}</div>` : `<p class="muted">${b.deposit ? `The ${money(b.deposit.amount)} deposit will be refunded.` : 'No fee applies.'}</p>`}
      <form class="form" data-form="cancel" data-id="${b.id}"><label class="field"><span>Reason</span><select name="reason" id="cancel-reason">${CANCEL_REASONS.filter(r => staff || r !== 'Salon cancelled').map(r => `<option>${r}</option>`).join('')}</select></label>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="close-modal">Keep appointment</button><button type="submit" class="btn btn-danger">Cancel appointment</button></div></form>`);
  },
  'late-open': d => {
    openModal(`<h2>Running late?</h2><p>We hold your spot for ${state.settings.graceMinutes} minutes. Let the salon know how late you'll be.</p>
      <form class="form" data-form="late" data-id="${d.id}"><label class="field"><span>About how late?</span><select name="minutes"><option value="5">5 minutes</option><option value="10" selected>10 minutes</option><option value="15">15 minutes</option><option value="20">20 minutes or more</option></select></label>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="close-modal">Never mind</button><button type="submit" class="btn btn-primary">Tell the salon</button></div></form>`);
  },
  'client-confirm': d => { const b = bkById(d.id); if (!b) return; setStatus(b, 'confirmed'); toast("Thanks! You're confirmed."); render(); },
  'do-reschedule': d => {
    const b = bkById(d.id); if (!b) return;
    const r = moveBooking(b, { key: d.date, time: d.time, stylistId: d.stylist });
    if (r.error) { toast(r.error, 'err'); render(); return; }
    toast(r.unchanged ? 'No change needed.' : 'Appointment moved.');
    go(isStaff() ? `/staff/booking/${b.id}` : `/appointment/${b.id}`);
  },
  'set-status': d => { const b = bkById(d.id); if (!b) return; setStatus(b, d.status); toast(`Marked ${STATUS[d.status].toLowerCase()}.`); render(); },
  'confirm-all': () => {
    const in48 = new Date(Date.now() + 48 * 36e5);
    const list = state.bookings.filter(b => b.status === 'booked' && parseDT(b.start) > new Date() && parseDT(b.start) < in48);
    list.forEach(b => setStatus(b, 'confirmed'));
    toast(`Confirmed ${list.length} booking${list.length === 1 ? '' : 's'}.`); render();
  },
  restore: d => { const b = bkById(d.id); const r = restoreBooking(b); toast(r.error || 'Booking restored.', r.error ? 'err' : 'ok'); render(); },
  deposit: d => { const b = bkById(d.id); if (!b || !b.deposit) return; b.deposit.status = d.to; hist(b, `Deposit ${d.to}`); log(`Deposit ${money(b.deposit.amount)} ${d.to}: ${describe(b)}`, b); save(); toast(`Deposit ${d.to} (demo, no money moved).`); render(); },
  fee: d => { const b = bkById(d.id); if (!b || !b.fee) return; b.fee.status = d.to; hist(b, `Late cancellation fee ${d.to}`); log(`Late cancellation fee ${money(b.fee.amount)} ${d.to}: ${describe(b)}`, b); save(); toast(`Fee ${d.to} (demo, no money moved).`); render(); },
  'clear-late': d => { const b = bkById(d.id); if (!b) return; b.lateNotice = null; hist(b, 'Cleared running-late notice'); save(); render(); },
  'new-booking': d => newBookingModal(d),
  'new-client': () => openModal(`<h2>New client</h2><form class="form" data-form="client-new">
      <label class="field"><span>Name</span><input name="name" required></label><label class="field"><span>Email</span><input name="email" type="email" required></label>
      <label class="field"><span>Phone</span><input name="phone" type="tel"></label><label class="field"><span>Notes</span><textarea name="notes" rows="2"></textarea></label>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Add client</button></div></form>`),
  'block-remove': d => { const k = state.blocks.find(x => x.id === d.id); state.blocks = state.blocks.filter(x => x.id !== d.id); if (k) log(`Removed time off for ${stById(k.stylistId).name} on ${fmtDay(parseDT(k.date))}`); save(); toast('Time off removed.'); render(); },
  'wl-remove': d => { const w = state.waitlist.find(x => x.id === d.id); if (w) { w.status = 'removed'; log(`Removed ${clById(w.clientId).name} from the waitlist`); save(); } toast('Removed from waitlist.'); render(); },
};

function dl(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

const FORMS = {
  login: (f, d) => {
    const email = (d.email || '').trim().toLowerCase();
    const acct = ACCOUNTS.find(a => a.email === email && a.password === d.password);
    if (!acct) { toast('That email and password don’t match a demo account.', 'err'); return; }
    setSession({ email: acct.email, role: acct.role, name: acct.name });
    toast(`Signed in as ${acct.name}.`);
    const next = f.dataset.next;
    go(next || (acct.role === 'staff' ? '/staff' : '/account'));
  },
  filter: (f, d) => { go(f.dataset.base + qs(d)); },
  'book-confirm': (f, d) => {
    const email = (d.email || '').trim().toLowerCase();
    if (!d.name || !d.name.trim()) { toast('Please add your name.', 'err'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast('Please add a valid email.', 'err'); return; }
    if (!d.agree) { toast('Please agree to the cancellation policy.', 'err'); return; }
    let c = state.clients.find(x => x.email.toLowerCase() === email);
    if (!c) { c = { id: uid('c'), name: d.name.trim(), email, phone: (d.phone || '').trim(), notes: '', createdAt: dKey(new Date()) }; state.clients.push(c); }
    else if (d.phone && !c.phone) c.phone = d.phone.trim();
    const r = createBooking({ clientId: c.id, serviceId: d.service, stylistId: d.stylist, key: d.date, time: d.time, source: 'Online', notes: (d.notes || '').trim() });
    if (r.error) { toast(r.error, 'err'); render(); return; }
    grantGuest(r.booking.id);
    go('/confirmed/' + r.booking.id);
  },
  'manage-lookup': (f, d) => {
    const ref = (d.ref || '').trim().toUpperCase().replace(/^WJ(\d)/, 'WJ-$1');
    const email = (d.email || '').trim().toLowerCase();
    const b = state.bookings.find(x => x.ref.toUpperCase() === ref && clById(x.clientId).email.toLowerCase() === email);
    if (!b) { toast('We couldn’t find a booking with that number and email.', 'err'); return; }
    grantGuest(b.id); go('/appointment/' + b.id);
  },
  cancel: (f, d) => {
    const b = bkById(f.dataset.id); if (!b) return;
    const r = cancelBooking(b, d.reason);
    closeModal();
    toast(r.late && r.fee ? `Cancelled. A ${money(r.fee)} late fee may apply.` : 'Appointment cancelled.');
    render();
  },
  late: (f, d) => {
    const b = bkById(f.dataset.id); if (!b) return;
    b.lateNotice = { minutes: Number(d.minutes), at: new Date().toISOString() };
    hist(b, `Client is running about ${d.minutes} minutes late`); log(`Running ${d.minutes} min late: ${describe(b)}`, b); save();
    closeModal(); toast('Thanks, we let the salon know.'); render();
  },
  'client-note': (f, d) => { const b = bkById(f.dataset.id); if (!b) return; b.notes = (d.notes || '').trim(); hist(b, 'Client updated their note'); log(`Client note updated: ${describe(b)}`, b); save(); toast('Note saved.'); render(); },
  'client-profile': (f, d) => { const c = currentClient(); if (!c) return; c.name = d.name.trim() || c.name; c.phone = (d.phone || '').trim(); log(`${c.name} updated their contact details`); save(); toast('Details saved.'); render(); },
  waitlist: (f, d) => {
    const email = (d.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email) || !d.name.trim()) { toast('Please add your name and email.', 'err'); return; }
    let c = state.clients.find(x => x.email.toLowerCase() === email);
    if (!c) { c = { id: uid('c'), name: d.name.trim(), email, phone: (d.phone || '').trim(), notes: '', createdAt: dKey(new Date()) }; state.clients.push(c); }
    state.waitlist.push({ id: uid('w'), clientId: c.id, serviceId: d.service, stylistId: d.stylist, date: d.date, timePref: d.timePref, status: 'open', createdAt: new Date().toISOString(), note: '' });
    log(`${c.name} joined the waitlist: ${svcById(d.service).name}, ${fmtDay(parseDT(d.date))}`);
    save(); toast("You're on the waitlist. We'll text you if a spot opens.");
    go(currentClient() ? '/account' : '/');
  },
  'staff-new': (f, d) => {
    let cid = d.clientId;
    if (cid === 'new') {
      if (!d.newName || !d.newName.trim()) { toast('Add the new client’s name.', 'err'); return; }
      const c = { id: uid('c'), name: d.newName.trim(), email: (d.newEmail || '').trim().toLowerCase(), phone: (d.newPhone || '').trim(), notes: '', createdAt: dKey(new Date()) };
      state.clients.push(c); cid = c.id; log(`Added client ${c.name}`);
    }
    if (!d.time) { toast('Pick an open time.', 'err'); return; }
    const r = createBooking({ clientId: cid, serviceId: d.service, stylistId: d.stylist, key: d.date, time: d.time, source: d.source, notes: (d.notes || '').trim(), staff: true, status: 'confirmed' });
    if (r.error) { toast(r.error, 'err'); fillTimes(f); return; }
    const wlId = f.dataset.waitlist;
    if (wlId) { const w = state.waitlist.find(x => x.id === wlId); if (w) { w.status = 'booked'; save(); } }
    closeModal(); toast(`Booked ${r.booking.ref}.`); go('/staff/booking/' + r.booking.id);
  },
  'staff-edit': (f, d) => {
    const b = bkById(f.dataset.id); if (!b) return;
    if (!d.time) { toast('Pick an open time.', 'err'); return; }
    const r = moveBooking(b, { key: d.date, time: d.time, stylistId: d.stylist, serviceId: d.service });
    if (r.error) { toast(r.error, 'err'); return; }
    toast(r.unchanged ? 'Nothing changed.' : 'Booking updated.'); render();
  },
  'staff-notes': (f, d) => { const b = bkById(f.dataset.id); if (!b) return; b.staffNotes = (d.staffNotes || '').trim(); hist(b, 'Internal note updated'); log(`Internal note updated: ${describe(b)}`, b); save(); toast('Note saved.'); render(); },
  'client-edit': (f, d) => { const c = clById(f.dataset.id); if (!c) return; Object.assign(c, { name: d.name.trim(), email: d.email.trim().toLowerCase(), phone: (d.phone || '').trim(), notes: (d.notes || '').trim() }); log(`Updated client ${c.name}`); save(); toast('Client saved.'); render(); },
  'client-new': (f, d) => { const c = { id: uid('c'), name: d.name.trim(), email: d.email.trim().toLowerCase(), phone: (d.phone || '').trim(), notes: (d.notes || '').trim(), createdAt: dKey(new Date()) }; state.clients.push(c); log(`Added client ${c.name}`); save(); closeModal(); toast('Client added.'); go('/staff/client/' + c.id); },
  hours: (f, d) => {
    const st = stById(f.dataset.id); if (!st) return;
    const hours = {};
    for (const day of WEEK_ORDER) {
      if (!SALON.hours[day] || !d['on-' + day]) continue;
      const a = d['start-' + day], b = d['end-' + day];
      if (!a || !b || hm2m(a) >= hm2m(b)) { toast(`${DAYS[day]}: end time must be after start time.`, 'err'); return; }
      hours[day] = [a, b];
    }
    st.hours = hours;
    const outside = state.bookings.filter(b => b.stylistId === st.id && ['booked', 'confirmed'].includes(b.status) && parseDT(b.start) > new Date() && !isFree(st.id, b.start.slice(0, 10), hm2m(b.start.slice(11)), svcById(b.serviceId).dur, b.id)).length;
    log(`Updated working hours for ${st.name}`); save();
    toast(outside ? `Hours saved. ${outside} upcoming booking${outside > 1 ? 's' : ''} now fall outside them. Check the calendar.` : 'Hours saved.', outside ? 'err' : 'ok');
    render();
  },
  'block-add': (f, d) => {
    const st = stById(d.stylistId);
    let start = d.start, end = d.end;
    if (d.allDay) { const w = windowFor(st, d.date) || [hm2m('08:00'), hm2m('19:00')]; start = m2hm(w[0]); end = m2hm(w[1]); }
    if (!start || !end || hm2m(start) >= hm2m(end)) { toast('End time must be after start time.', 'err'); return; }
    const clash = state.bookings.filter(b => b.stylistId === st.id && ACTIVE.has(b.status) && b.start.startsWith(d.date) && hm2m(b.start.slice(11)) < hm2m(end) && hm2m(b.end.slice(11)) > hm2m(start));
    if (clash.length) {
      openModal(`<h2>Bookings in the way</h2><p>${esc(st.name)} has ${clash.length} booking${clash.length > 1 ? 's' : ''} during that time. Move or cancel ${clash.length > 1 ? 'them' : 'it'} first.</p>
        <ul class="attn">${clash.map(b => `<li><a class="link" href="#/staff/booking/${b.id}" data-action="close-modal-nav">${b.ref}</a> ${esc(clById(b.clientId).name)}, ${esc(describe(b))}</li>`).join('')}</ul>
        <div class="modal-actions"><button type="button" class="btn btn-primary" data-action="close-modal">OK</button></div>`);
      return;
    }
    state.blocks.push({ id: uid('k'), stylistId: st.id, date: d.date, start, end, reason: (d.reason || 'Time off').trim() });
    log(`Blocked time off for ${st.name}: ${fmtDay(parseDT(d.date))}, ${fmtT(start)} to ${fmtT(end)}`); save();
    toast('Time off added.'); render();
  },
  settings: (f, d) => {
    const s = state.settings;
    ['cancelWindowHours', 'lateFeePct', 'depositMin', 'depositPct', 'graceMinutes'].forEach(k => { const v = Number(d[k]); if (!Number.isNaN(v) && v >= 0) s[k] = v; });
    log('Updated booking settings'); save(); toast('Settings saved.'); render();
  },
};

/* ---------------- toast ---------------- */
let toastTimer;
function toast(msg, kind = 'ok') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `toast show ${kind}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, 3600);
}

/* ---------------- router ---------------- */
let lastPath = null;
function route() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [path, query] = h.split('?');
  return { path, parts: path.split('/').filter(Boolean), q: new URLSearchParams(query || '') };
}

function render() {
  const { path, parts, q } = route();
  const s = session();
  pendingScroll = null;
  let html, title = 'Online booking';
  if (parts[0] === 'staff') {
    if (!s || s.role !== 'staff') { go('/login' + qs({ next: location.hash.slice(1) })); return; }
    const page = parts[1] || 'dashboard';
    const map = {
      dashboard: () => staffDashboard(), calendar: () => staffCalendar(q), bookings: () => staffBookings(q),
      booking: () => staffBooking(parts[2]), clients: () => staffClients(q), client: () => staffClient(parts[2]),
      availability: () => staffAvailability(), waitlist: () => staffWaitlist(), activity: () => staffActivity(q), settings: () => staffSettings(),
    };
    html = staffShell((map[page] || notFound)(), page === 'booking' ? 'bookings' : page === 'client' ? 'clients' : page);
    title = 'Front desk';
  } else {
    const page = parts[0] || 'home';
    const map = {
      home: () => pageHome(), book: () => pageBook(q), confirmed: () => pageConfirmed(parts[1]), manage: () => pageManage(),
      appointment: () => pageAppointment(parts[1]), reschedule: () => pageReschedule(parts[1], q), account: () => pageAccount(),
      waitlist: () => pageWaitlist(q), policies: () => pagePolicies(), login: () => pageLogin(q),
    };
    const inner = (map[page] || notFound)();
    if (page === 'account' && !inner) return;
    html = publicShell(inner, page);
    title = { book: 'Book', manage: 'Change or cancel', policies: 'Policies', login: 'Sign in', account: 'My appointments' }[page] || title;
  }
  document.title = `${title} · Willow & Jade (demo)`;
  $('#app').innerHTML = html;
  document.body.classList.toggle('is-staff', parts[0] === 'staff');
  document.querySelectorAll('#app form[data-recalc]').forEach(fillTimes);
  const samePage = path === lastPath;
  if (!samePage) window.scrollTo(0, 0);
  if (pendingScroll) {
    const el = document.getElementById(pendingScroll);
    if (el) el.scrollIntoView({ behavior: samePage ? 'smooth' : 'auto', block: 'start' });
  }
  lastPath = path;
}

/* ---------------- events ---------------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'close-modal-nav') { closeModal(); return; }
  const fn = ACTIONS[el.dataset.action];
  if (fn) { e.preventDefault(); fn({ ...el.dataset }, el, e); }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]');
  if (!f) return;
  e.preventDefault();
  const d = {};
  new FormData(f).forEach((v, k) => { d[k] = v; });
  const fn = FORMS[f.dataset.form];
  if (fn) fn(f, d);
});
document.addEventListener('change', e => {
  const el = e.target;
  const f = el.closest('form');
  if (f && f.hasAttribute('data-recalc') && el.hasAttribute('data-recalc-field')) fillTimes(f);
  if (el.hasAttribute('data-client-select')) {
    const box = f.querySelector('.new-client');
    const isNew = el.value === 'new';
    box.hidden = !isNew;
    f.elements.newName.required = isNew;
  }
  if (el.hasAttribute('data-autosubmit')) f.requestSubmit();
  if (el.dataset.nav && el.value) go(el.dataset.nav + qs({ [el.dataset.param]: el.value }));
});
modal().addEventListener('click', e => { if (e.target === modal()) closeModal(); });
window.addEventListener('hashchange', render);

state = load();
render();
})();
