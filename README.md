# Willow & Jade demo booking site

A fake salon booking system for The Uncommon Business customer service class demos. It looks like Willow & Jade pays for a third-party salon tool called "Velora Salon Suite." Velora is made up.

**This is a class demo.** No real appointments, payments or personal data. Every page carries a demo banner, and search engines are told not to list it.

**What matches the real salon:** the service menu (all 65 services, names, categories and starting prices) and the staff names and tiers, from Willow & Jade's public online booking page on 2026-11-23. The policies and hours match the Willow & Jade knowledge base files. **What's made up:** service lengths, stylist schedules, clients, address and phone. Velora replaces their real booking software in this demo and copies none of its branding.

**For AI agents:** read [AGENT-GUIDE.md](AGENT-GUIDE.md). It has every link, a playbook for each common client email, the guardrails, and the service and stylist IDs.

## Demo logins

| Role | Email | Password |
| --- | --- | --- |
| AI agent (staff) | `agent@willowandjade.example` | `demo1234` |
| Front desk (staff) | `frontdesk@willowandjade.example` | `demo1234` |
| Client (Maya Thompson) | `maya@example.com` | `demo1234` |

The password is optional, and an empty sign-in form enters as the AI agent. The agent's changes show under its own name in the Activity log.

## What you can do

**As a client (public booking site)**
- Browse services, starting prices and the team
- Book: pick a service, a stylist (or any available), a date and an open time
- Look up a booking with its confirmation number (email optional)
- Reschedule, cancel, confirm, or say you're running late, with the fee warning shown first
- Join a waitlist when a day is full

**As staff (Velora front desk portal)**
- Dashboard: today's schedule, unconfirmed bookings, items waiting on Kelley, running-late notices
- Find openings for any service, stylist and day, and book from a time
- Day calendar by stylist. Click an empty slot to book it
- Bookings list with filters and search, plus `#/staff/ref/WJ-1234` to open a booking by number
- Booking detail: confirm, check in, complete, no-show, cancel, restore, change service, stylist or time, notes, history
- Clients, availability and time off, waitlist, activity log, and settings

## Policies the site enforces

- Changes more than 48 hours ahead are free. Within 48 hours: $25. Within 24 hours: $50. No-shows: $50.
- Appointments of 3+ hours hold a nonrefundable upfront payment. Inside 48 hours the salon keeps it instead of the fee, never both.
- Late arrivals are $1 a minute. Guarantee touch-ups within 72 hours. Closed Monday for education day.
- The AI agent can only request fee waivers and refunds. Kelley approves them, using the front desk login in this demo.

## How data works

There is no server. Data saves in the browser that made the change (localStorage). The schedule is built around today's date and rebuilds itself if it's more than 14 days old. **Reset demo data** in the yellow banner starts fresh. Every form field is optional, so an agent never gets stuck on a required field.

For a live demo, run the agent and the presenter in the same Chrome so both see the same bookings.

## Files

`index.html`, `styles.css`, `app.js`, `AGENT-GUIDE.md`. No build step. GitHub Pages serves the repo root.
