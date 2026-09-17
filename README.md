# ForgeMind — Website + Admin Panel

This is the ForgeMind website (Home + About) with a full admin panel bolted
on top, so you and your team can edit every piece of text, every image, and
add/remove things like services, products, team members and core values —
all without touching code.

It replaces the old static `index.html` / `about.html` files with a small
Node.js app: the same pixel-perfect design, but the content now lives in a
database and is edited through `/admin`.

## Requirements

- [Node.js](https://nodejs.org) version 18 or newer (check with `node -v`).
  That's the only thing you need installed — everything else comes from `npm install`.

## First-time setup

Open a terminal in this folder and run:

```
npm install
npm start
```

- `npm install` downloads the app's dependencies (one time only, or whenever
  you pull a code update).
- `npm start` creates the database (first time only) and fills it with the
  site's current content and your admin login, then starts the website.
  This is safe to run every time — it never overwrites content you've
  already edited, it only fills in anything missing.

The very first time you run it, it prints an admin email + password in the
terminal — copy that password down, you'll need it to log in (see "Your
login" below). (If you ever need to re-run just that step by itself, it's
`npm run seed`.)

Once it's running:

- Website: **http://localhost:3000**
- Admin panel: **http://localhost:3000/admin**

Leave the terminal window open while you want the site running. Press
`Ctrl+C` in that terminal to stop it, and `npm start` again to bring it back.

## Your login

The seed script creates one admin account using the email
`himel@polygontechlimited.com` with a random generated password that was
printed in your terminal the first time you ran `npm run seed`. If you
missed it, don't worry — log in isn't possible without it, so reset it from
a terminal in this folder:

```
node -e "require('./db/users').updateUserPassword(1, 'your-new-password')"
```

(Assuming yours is the first/only user, id `1`. Run `node -e "console.log(require('./db/users').listUsers())"` if you need to check.)

Once logged in, go to **Users** in the sidebar to add teammates — give each
person their own login rather than sharing one. "Admin" accounts can manage
users; "Editor" accounts can edit all content but can't touch the Users page.

## What you can edit

- **Every section's text** — headlines, paragraphs, button labels — from
  the sidebar (Hero Section, About Hero, CEO Message, etc).
- **Every section's images** — just choose a new file, the old one is
  replaced automatically. Nothing to rename or re-upload elsewhere.
- **Collections** (Products, Services, Core Values, Team Members) — add new
  cards, edit or delete existing ones, drag to reorder, or hide one without
  deleting it (the "visible on the live site" checkbox).
- **Media Library** — every image you've ever uploaded, in one place, with
  a delete button for ones you no longer need.

Changes go live immediately — there's no separate "publish" step.

## Known limitations (things intentionally left out of v1)

- The navigation bar links (Home / About Us / Services / Blog / Contact Us)
  and the footer's "Quick Links" are fixed — Services/Blog/Contact Us don't
  point anywhere yet, matching the original design. Editing those targets
  would need actual destination pages first.
- The footer's "Our Services" list is generated automatically from your
  first five active Services entries, so you don't have to keep two lists
  in sync.
- Two backgrounds (the home page contact card and the About page's closing
  banner) currently use a plain placeholder gradient, since there were no
  real photos for those yet — upload real ones any time from **Contact
  Section** and **Call To Action** in the sidebar.
- Right now this runs on your own computer (`localhost`), so only people on
  this machine can reach `/admin` or the site. See "Going live" below for
  exact steps to put it on the internet on Railway.

## Going live: deploying to Railway

This app is ready to deploy as-is — it just needs a place to run and one
persistent folder for its database and uploaded images (so they survive
future redeploys instead of getting wiped). [Railway](https://railway.app)
is a hosting platform that gives you both with very little setup, so that's
what these steps use.

**1. Put the code on GitHub.** Railway deploys from a GitHub repo. If this
project isn't already in one:

```
cd forgemind-cms
git init
git add .
git commit -m "ForgeMind CMS"
```

Then create a new empty repository on [github.com/new](https://github.com/new)
and push to it (GitHub shows you the exact `git remote add` / `git push`
commands right after you create it).

**2. Create a Railway account.** Go to [railway.app](https://railway.app)
and sign up — "Login with GitHub" is the quickest, and it's what lets
Railway see your repos in the next step.

**3. Create a new project from your repo.** From the Railway dashboard:
**New Project → Deploy from GitHub repo** → pick the repo you just pushed.
Railway detects it's a Node app automatically (via `railway.json` and
`package.json` in this project) and starts a first build. It will likely
fail or the site will come up empty at this point — that's expected, because
it doesn't have a persistent volume or its environment variables yet. Keep
going.

**4. Add a persistent Volume.** Open the service Railway created → the
**Volumes** tab → **New Volume**. Set the **mount path** to exactly `/data`.
This is the folder that survives every future deploy — without it, every
redeploy would reset the site's content and delete uploaded images.

**5. Set environment variables.** In the same service, open the
**Variables** tab and add:

| Variable | Value |
|---|---|
| `DATA_DIR` | `/data` |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | any long random string (e.g. generate one at [1password.com/password-generator](https://1password.com/password-generator) or run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` on your own computer) |

Saving these triggers a fresh deploy automatically.

**6. Get your admin login.** Once that deploy finishes, open the
**Deployments** tab → the latest deployment → **View logs**. The very first
boot creates the database on the new volume and prints an admin
email + password, the same way it does locally — copy the password from
there. (After this first time, re-deploys reuse the existing database and
won't print it again.)

**7. Open the site.** Back in the service's **Settings** tab, under
**Networking**, click **Generate Domain** to get a public
`something.up.railway.app` URL — that's your live site, and
`<that-url>/admin` is your live admin panel. Log in with the credentials
from step 6.

**8. (Optional) Connect your own domain.** In that same **Networking**
section, **Custom Domain** lets you add a domain you own — Railway shows
you a CNAME record to add at your domain registrar/DNS provider, and the
domain goes live once that DNS change propagates (usually minutes to a
few hours).

From then on, deploying an update is just `git push` to that GitHub repo —
Railway rebuilds and redeploys automatically, and your content and uploaded
images stay untouched on the volume.

## Project structure (if you're curious)

```
app.js              — the server: routes, sessions, middleware
db/                  — SQLite database + helper functions
  forgemind.sqlite   — your actual data (content, users, uploads list)
routes/              — admin.js (the CMS), auth.js (login), public.js (the site)
views/               — EJS templates for both the admin panel and the site
public/
  css/site.css       — the site's original design, unchanged
  css/admin.css      — the admin panel's styling
  icons/             — small local icon set (replaced the old temporary
                        Figma preview links, which would have expired)
  uploads/           — every image, including the ones already on the site
config/sections.js   — defines what shows up in the admin sidebar
scripts/seed.js       — the one-time content/database seeder
```

## Backing up

Your entire site's content lives in one file: `db/forgemind.sqlite`. Copy
that file somewhere safe now and then (especially before a big content
change) and you can always restore it by putting the copy back.
