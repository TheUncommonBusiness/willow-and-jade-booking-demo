# Booking System Agent Guide

Owner: Ashleigh Watrous, Guest Hospitality Specialist (sign-off: Kelley Cover, Owner) · Last updated: 2026-11-24 · Source of truth: the Willow & Jade online booking site (Velora Salon Suite, class demo) · Review by: 2027-02-21

> Class demo. This booking site stands in for the salon's real booking system. It holds no real appointments, payments or personal data.

## Instructions for the Agent

- Sign in as the AI Front Desk Agent before you change anything. Every change you make shows under that name in the Activity log.
- Find the booking before you act. If a name matches more than one client, use the email or the confirmation number.
- Read the yellow warning on a booking before you change or cancel it. Put the exact charge in your reply.
- You can't waive fees or refund upfront payments. Request them for Kelley, then tell the client the team will follow up.
- Never book Nikki G or Kelley yourself. Owner appointments go through the front desk: reply that Ashleigh will check what's possible, and hand the request to her. Kelley's chair also needs an in-person consultation first.
- Quote prices only from the Pricing Rate Card, using the starting price for the chosen stylist's level. This guide lists no prices on purpose. If a service isn't on the Rate Card, give no price and pass the question to Ashleigh.
- New color and extension clients get the consultation link before their first color or extension visit. Never book that first visit for them.
- After every change, reply with the confirmation number, the service, the stylist, the new day and time, and any charge.
- Every form field is optional in this demo. Fill in what the email gives you and leave the rest blank.

## Getting in

Base URL: https://theuncommonbusiness.github.io/willow-and-jade-booking-demo/

Sign in at `#/login`. Leave both fields blank and press **Sign in** to enter as the AI agent.

Demo accounts:
- **AI Front Desk Agent** (`agent@willowandjade.example`): you. All staff tools, with the Kelley guardrails.
- **Front Desk** (`frontdesk@willowandjade.example`): a human at the front desk. Can approve Kelley's decisions.
- **Client, Maya Thompson** (`maya@example.com`): for seeing the site the way a client does.

## How links work

- Every page is a link that starts with `#/`. Add it to the end of the base URL.
- Dates are `YYYY-MM-DD`. Times are 24-hour `HH:MM` in 15-minute steps, like `14:30`.
- Use the IDs at the end of this guide for `service` and `stylist`. Use `any` for any stylist.
- Booking pages use an internal ID. To jump straight from a confirmation number, use `#/staff/ref/WJ-1234`.

## Link map

### Staff tools (signed in as the agent)

- **Today at a glance:** `#/staff`. Today's schedule, unconfirmed bookings, items waiting on Kelley and running-late notices.
- **Check availability:** `#/staff/openings?service=haircut-blowout&stylist=any&date=2026-11-25`. Open start times per stylist for one day, plus a 7-day count. Click a time to book it.
- **Day calendar:** `#/staff/calendar?date=2026-11-25`. One column per stylist. Click an empty slot to book it, or click a booking to open it.
- **Booking by confirmation number:** `#/staff/ref/WJ-1234`. Opens that booking's page.
- **Search bookings:** `#/staff/bookings?view=all&q=maya@example.com`. `view` is `upcoming`, `past` or `all`. `q` matches a name, email, service or WJ number. Add `status=booked` or `stylist=julez` to filter.
- **Booking page:** `#/staff/booking/<id>`. Confirm, check in, cancel, restore, change the service, stylist or time, notes and full history.
- **Find a client:** `#/staff/clients?q=maya@example.com`. Search by name, email or phone.
- **Client page:** `#/staff/client/<id>`. Contact details, notes, upcoming and past visits, and a Book button.
- **New booking, pre-filled:** `#/staff/new?client=maya@example.com&service=perm&stylist=any&date=2026-11-27&time=10:00`. Opens the New booking form. `client` takes an email or client ID. Leave out `time` to choose from every open time.
- **Pick a new time:** `#/reschedule/<id>?stylist=julez&date=2026-11-27`. Date strip and open times, then **Confirm new time**.
- **Waitlist:** `#/staff/waitlist`. Each request with live openings, plus Book and Remove.
- **Hours and time off:** `#/staff/availability`. Stylist working hours and blocked time.
- **Your activity:** `#/staff/activity?actor=AI%20Front%20Desk%20Agent`. Everything you changed, newest first.
- **Settings:** `#/staff/settings`. Fee amounts. Don't change these.

### Client pages (links you can send)

- **Book online:** `#/book`. Pre-filled example: `#/book?service=haircut-blowout&stylist=julez&date=2026-11-27`
- **Change or cancel:** `#/manage`. The client enters their WJ number. Email is optional.
- **Booking policies:** `#/policies`
- **Join the waitlist:** `#/waitlist`. Pre-filled example: `#/waitlist?service=lived-in-full&stylist=stephanie&date=2026-11-28`

New color and extension clients need a consultation before their first color or extension visit. Brides and wedding parties go to the weddings inquiry form and are never booked here.

## Playbooks for common emails

### "Do you have anything Friday afternoon?" (check availability)

1. Open `#/staff/openings?service=<service-id>&stylist=<stylist-id or any>&date=<date>`.
2. If the day is full, the 7-day chips show the next days with openings.
3. Reply with two or three times that fit what they asked for. Don't book until the client picks one.

### "Can I book a haircut with Julez?" (new booking)

1. If they asked for Nikki G or Kelley, stop here. Reply that owner appointments go through the front desk and Ashleigh will check what's possible, then hand the request to Ashleigh.
2. If they're a new color or extension client, send the consultation link instead of booking.
3. Look the client up with `#/staff/clients?q=<email>`. Skip this for a brand-new client.
4. Open `#/staff/new?client=<email>&service=<service-id>&stylist=<stylist-id>&date=<date>&time=<HH:MM>`.
5. Check the time, set **Booked via** to Email, and press **Create booking**.
6. Reply with the WJ number, service, stylist, day and time, and the starting price for that stylist's level from the Pricing Rate Card. For a 3+ hour service, say an upfront payment holds the chair and applies to the final balance.

Tape-in work only goes to Alanna, Nikki V, Cristina, Stephanie and Kelley (Kelley only through Ashleigh). Pick anyone else and the Time list says that stylist doesn't offer the service.

### "I need to move my appointment" (reschedule)

1. Open `#/staff/ref/WJ-xxxx`, or search `#/staff/bookings?view=upcoming&q=<email>`.
2. Read the yellow warning. Within 48 hours the change costs $25, within 24 hours $50. If the booking has an upfront payment, the salon keeps that instead.
3. In **Change service, stylist or time**, pick the date. The Time list only shows open times. Press **Save changes**. You can also use **Pick a new time** to see a date strip.
4. Reply with the new details and any charge. If the change was more than 48 hours out, say there's no charge.

### "Please cancel my appointment" (cancel)

1. Open the booking.
2. Press **Cancel booking**, pick a reason, and press **Cancel appointment**.
3. Reply to confirm. State the charge, or that the upfront payment is nonrefundable and was kept. Offer the booking link if they want a new time.

### "Just confirming I'll be there" (confirm)

1. Open the booking and press **Mark confirmed**.
2. Reply with a short thank-you and the day and time.

### "Running 10 minutes late!" (late arrival)

1. Open `#/appointment/<id>`. The **I'm running late** button shows within 6 hours of the start.
2. Pick the number of minutes and press **Tell the salon**. The booking page and dashboard now show the notice.
3. Reply that late arrivals are $1 a minute, and if the stylist can't fit them in, they may need to reschedule.

### "Can you waive the fee?" or "Can I get my deposit back?" (exceptions)

1. Open the booking.
2. Press **Ask Kelley to waive** or **Ask Kelley to refund**. It appears on the dashboard under Needs Kelley.
3. Reply that the request is with the team and Kelley will follow up. Never promise a waiver or a refund.

### "Is there a waitlist?" (full day)

1. Open `#/waitlist?service=<service-id>&stylist=<stylist-id>&date=<date>`, add the client's name and email, and press **Join the waitlist**.
2. When a spot opens, `#/staff/waitlist` shows it with a live count. Press **Book** to book it.
3. Reply that they're on the list and the salon will reach out when a spot opens.

### "When is my next appointment?" or "Please update my phone number" (client details)

1. Open `#/staff/clients?q=<email>` and click the client.
2. Upcoming visits are at the top. Edit contact details on the right and press **Save client**.
3. Reply with the details they asked for.

### The client didn't show up (no-show)

1. Open the booking and press **Mark no-show**. The system charges $50, or keeps the upfront payment.
2. Only do this when the front desk confirms the client didn't arrive.

## Policies the system enforces

- **Changes and cancellations:** free more than 48 hours ahead. $25 within 48 hours. $50 within 24 hours. Moving an appointment counts as a change. Charges go to the card on file.
- **No-shows:** $50.
- **Upfront payments:** appointments of 3+ hours hold one on the card. It applies to the final balance and is nonrefundable. Inside 48 hours the salon keeps it instead of charging $25 or $50, never both. Moving it more than 48 hours out carries it to the new date.
- **Late arrivals:** $1 a minute. The stylist decides if the service still fits.
- **Guarantee:** reach out within 72 hours and book a touch-up within a week with the original stylist, at no extra charge. It covers the look agreed at consultation. There are no refunds.
- **Hours:** Tue 10 to 7, Wed 10 to 8, Thu 11 to 8, Fri 10 to 8, Sat and Sun 9 to 5. Closed Monday for education day.

## Who decides what

- **Kelley:** fee waivers, refund-type requests, upfront payment exceptions, and any charge on a $200+ appointment
- **Nikki G:** color disputes
- **Ashleigh:** front desk handoffs, owner (Nikki G and Kelley) booking requests, and bridal inquiries

## Screen elements you can rely on

- Sign-in fields: `#login-email`, `#login-password`, `#login-submit`
- Client booking form: `#bk-name`, `#bk-email`, `#bk-phone`, `#bk-notes`, `#bk-agree`
- Booking lookup: `#mg-ref`, `#mg-email`
- Cancel reason: `#cancel-reason`
- Find openings: `#op-service`, `#op-stylist`, `#op-date`
- Calendar date: `#cal-date`
- Buttons use plain words: **Create booking**, **Save changes**, **Cancel booking**, **Mark confirmed**, **Check in**, **Complete visit**, **Mark no-show**, **Restore booking**, **Confirm new time**, **Ask Kelley to waive**, **Ask Kelley to refund**.
- A short message pops up at the bottom of the screen after every action. Read it to confirm what happened.

## Demo notes

- Bookings save in the browser that made them. Work in the same Chrome as the presenter so you both see the same schedule.
- **Reset demo data** in the yellow banner rebuilds the schedule around today. Confirmation numbers change after a reset, so look them up instead of reusing old ones.
- Maya Thompson (`maya@example.com`) is the demo client with past and upcoming visits.
- Service lengths and stylist schedules are demo estimates. Service names, staff names and tiers match the salon's real booking menu. Prices come from the Pricing Rate Card.

## Service IDs

No prices here on purpose: quote from the Pricing Rate Card. "Upfront payment" marks a 3+ hour service.

### New Clients Click Here (Color or Extension Clients)

- `color-consultation`: Color Consultation · 30 min
- `extensions-consultation`: Extensions Consultation (only nikki-v, kelley, alanna, stephanie, cristina) · 30 min

### Haircoloring

- `glaze`: Glaze (No Haircut and/or Blowout) · 1 hr
- `root-touch-up`: Single Process Color Root Touch Up (No Haircut and/or Blowout) · 1 hr 15 min
- `face-frame-highlight`: Face Frame Highlight · 2 hr
- `full-foil-highlight`: Full Foil Highlight · 3 hr · upfront payment
- `lived-in-face-frame`: Lived-in Face Frame Highlight · 2 hr 30 min
- `lived-in-full`: Lived-in Full Highlight · 3 hr 30 min · upfront payment
- `lived-in-partial`: Lived-in Partial Highlight · 3 hr · upfront payment
- `glaze-cut`: Glaze with Haircut and/or Blowout · 1 hr 45 min
- `lived-in-partial-nape`: Lived-in Partial Highlight with Lightness at the Nape · 3 hr 15 min · upfront payment
- `partial-highlight`: Partial Highlight · 2 hr 45 min
- `partial-foils-nape`: Partial w/ Foils at the Nape · 2 hr 30 min
- `t-zone`: Single Process "T-Zone" Hairline Touch-Up · 45 min
- `single-process-glaze`: Single Process Color with Glaze · 2 hr
- `root-touch-up-cut`: Single Process Root Touch Up with Haircut or Blowout · 2 hr

### Blowouts, Styling, & Makeup

- `basic-blowout`: Basic Blowout · 45 min
- `brush-set-blowout`: Brush Set Blowout · 1 hr
- `evening-style`: Evening Style · 1 hr
- `extended-blowout`: Extended Blowout | Thick or Long Hair · 1 hr
- `extension-blowout`: Extension Blowout · 1 hr
- `eye-makeup`: Eye Makeup Only · 30 min
- `full-makeup`: Full Makeup Application · 1 hr 15 min
- `nuface`: Nuface treatment · 15 min
- `updo`: Updo · 1 hr 15 min
- `velcro-roller-set`: Velcro Roller Set Blowout · 1 hr

### Haircut

- `bang-trim`: Bang Trim · 15 min
- `barber-cut`: Barber Cut/Clipper Cut · 30 min
- `calligraphy-barber`: Calligraphy Barber Cut · 45 min
- `calligraphy-cut-blowout`: Calligraphy Cut with Blowout · 1 hr 15 min
- `clean-up-undercut`: Clean Up or Undercut · 15 min
- `extended-calligraphy`: Extended Calligraphy Cut and Blowout | Thick or Long Hair · 1 hr 30 min
- `extended-haircut-blowout`: Extended Haircut and Blowout | Thick/Long Hair OR Transformation Cut · 1 hr 30 min
- `haircut-blowout`: Haircut & Blowout · 1 hr
- `pixie-cut`: Pixie Cut · 45 min
- `razor-haircut`: Razor Haircut & Style · 1 hr
- `shag-haircut`: Shag Haircut · 1 hr 15 min
- `shag-extra-long`: Shag Haircut - Extra Long Shag · 1 hr 30 min
- `youth-barber`: Youth Barber Cut (under 10) · 30 min
- `youth-haircut`: Youth Haircut & Blowdry (under 10) · 30 min
- `scalp-massage-add`: Scalp Massage + Haircut and/or Blowout · 30 min
- `the-revival`: The Revival ❋ A Treatment Haircut · 1 hr 30 min

### Naturally Curly Hair Packages & Services

- `curly-maintenance`: Curly Hair Maintenance Cut · 1 hr 15 min
- `curly-lesson`: Curly Hair Styling Lesson · 1 hr
- `curly-lesson-xl`: Curly Hair Styling Lesson | Extra long/extra thick hair · 1 hr 30 min
- `curly-first-time`: First Time Curly Haircut Package · 2 hr
- `curly-first-time-xl`: First Time Curly Haircut Package - Extra long/thick hair · 2 hr 30 min

### Perms & Keratins

- `full-keratin`: Full Keratin Treatment · 3 hr · upfront payment
- `keratin-express`: Keratin Express Blowout · 2 hr
- `perm`: Perm · 2 hr 30 min
- `perm-consultation`: Perm Consultation · 15 min

### Extensions

- `tape-in-removal`: Tape-In Extension Removal (only alanna, stephanie, nikki-v, cristina, kelley) · 1 hr

### Consultations

- `product-consultation`: Product Consultation · 15 min

## Stylist IDs

Never book `nikki-g` or `kelley` yourself. Pass owner requests to Ashleigh.

- `emma-s`: Emma S · Rising Stylist · Tue 10:00-18:00, Wed 12:00-20:00, Fri 10:00-18:00, Sun 09:00-17:00
- `alanna`: Alanna · Willow Stylist · Tue 10:00-19:00, Wed 10:00-18:00, Thu 11:00-19:00, Sat 09:00-17:00
- `julez`: Julez · Jade Stylist · Wed 12:00-20:00, Thu 12:00-20:00, Fri 12:00-20:00, Sat 09:00-17:00
- `nicolette`: Nicolette · Willow Stylist · Tue 10:00-18:00, Thu 11:00-19:00, Fri 10:00-18:00, Sun 09:00-17:00
- `kelley`: Kelley · Sage Stylist (owner, through Ashleigh only) · Tue 10:00-18:00, Wed 10:00-18:00, Thu 11:00-19:00, Fri 10:00-18:00
- `nikki-v`: Nikki V · Jade Stylist · Tue 10:00-16:00, Wed 10:00-16:00, Thu 11:00-17:00
- `cristina`: Cristina · Willow Stylist · Wed 10:00-18:00, Thu 12:00-20:00, Fri 12:00-20:00, Sat 09:00-17:00
- `nikki-g`: Nikki G · Sage Stylist (owner, through Ashleigh only) · Tue 11:00-19:00, Thu 11:00-19:00, Fri 10:00-18:00, Sat 09:00-17:00
- `sam-h`: Sam H · Willow Stylist · Tue 10:00-18:00, Wed 10:00-18:00, Fri 12:00-20:00, Sun 09:00-17:00
- `stephanie`: Stephanie · Jade Stylist · Wed 10:00-18:00, Thu 11:00-19:00, Fri 10:00-18:00, Sat 09:00-17:00
