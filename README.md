# Willow & Jade demo booking site

A fake salon booking system for The Uncommon Business customer service class demos. It looks like Willow & Jade pays for a third-party salon tool called "Velora Salon Suite." Velora is made up.

**This is a class demo.** No real appointments, payments or personal data. Every page carries a demo banner, and search engines are told not to list it.

**What matches the real salon:** the service menu (all 65 services, names, categories and starting prices) and the staff names and tiers, taken from Willow & Jade's public online booking page on 2026-11-23. **What's made up:** service lengths, working hours, schedules, clients, policies, address and phone. Velora replaces their real booking software in this demo and copies none of its branding.

## Demo logins

| Role | Email | Password |
| --- | --- | --- |
| Front desk (staff) | `frontdesk@willowandjade.example` | `demo1234` |
| AI agent (staff) | `agent@willowandjade.example` | `demo1234` |
| Client (Maya Thompson) | `maya@example.com` | `demo1234` |

Use the AI agent login when an agent works the front desk. Its changes show up under its own name in the Activity log.

## What you can do

**As a client (public booking site)**
- Browse services, prices, deposits and the team
- Book: pick a service, a stylist (or any available), a date and an open time
- Look up a booking with its confirmation number and email
- Reschedule, cancel (with the 24-hour late-cancel warning), confirm, or say you're running late
- Join a waitlist when a day is full
- Sign in as Maya to see upcoming and past visits

**As staff (Velora front desk portal)**
- Dashboard: today's schedule, unconfirmed bookings, late cancellation fees, running-late notices
- Day calendar by stylist. Click an empty slot to book it
- Bookings list with filters and search
- Booking detail: confirm, check in, complete, no-show, cancel, restore, change service, stylist or time, refund deposits, waive or charge fees, internal notes, full history
- Clients: contact details, notes, visit history
- Availability: working hours and time off
- Waitlist with live openings and one-click booking
- Activity log: every change, who made it and when
- Settings: cancellation window, fees, deposits, and Reset demo data

## How data works

There is no server. Data saves in the browser that made the change (localStorage). The schedule is built around today's date, and rebuilds itself if it's more than 14 days old. **Reset demo data** in the yellow banner starts fresh.

For a live demo, run the agent and the presenter in the same Chrome so both see the same bookings.

## Files

`index.html`, `styles.css`, `app.js`. No build step. GitHub Pages serves the repo root.
