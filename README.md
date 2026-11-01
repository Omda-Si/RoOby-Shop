# RoOby

Homemade sweets shop. The storefront is Arabic RTL. Customers order on WhatsApp. There is no card checkout.

The shop and the admin dashboard live in the same site:

- Shop: `/`
- Admin: `/admin`

Prices are in Sudanese Pound (SDG).

## What customers see

- Today’s available sweets
- Daily news written by admin
- Special-order card (custom cakes and trays)
- Festival / occasion card (Eid, Ramadan, and similar)
- Categories, comments (after admin approval), and WhatsApp ordering
- TikTok link in the footer

## Local setup

```bash
npm install
npm run setup
npm run dev
```

Then open:

- Shop: http://localhost:5173
- Admin: http://localhost:5173/admin
- Default login: `admin` / `rooby2026`

Stop the servers with `Ctrl+C`. That frees ports `5173` (shop) and `4000` (API).

## How admin updates the shop

Sign in at `/admin`.

1. **Today’s products** — mark what is available, set quantity, write today’s news, then click **Publish**.
2. **Special order** — write the custom-order message and keep the checkbox on so customers see it.
3. **Festival / occasion** — turn the festival card on, set a title such as `Eid al-Fitr`, write the note, then publish. Turn it off when the occasion ends.
4. **Products** — add or edit sweets and photos.
5. **Comments** — approve a comment before it appears on the shop.
6. **Settings** — shop name, WhatsApp number, about text, TikTok.

Edits go live on the shop after you save or publish. Customers can send a special or festival request straight to WhatsApp.

## Deploy (GitHub + Netlify + Render)

The customer page and the admin page are one app. Upload the repo once.

1. **Netlify** hosts the pages.
2. **Render** or **Railway** hosts the API, because admin changes must be saved.

Netlify alone cannot keep products, comments, or settings, because it only serves static files.

### 1) Push to GitHub

```bash
git init
git add .
git commit -m "RoOby shop"
```

Create a repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USER/RoOby.git
git branch -M main
git push -u origin main
```

Later code pushes to `main` rebuild the Netlify site automatically if the site is connected to that branch.

### 2) Deploy the API on Render

1. Open [render.com](https://render.com) and sign in with GitHub.
2. **New +** → **Web Service** → choose the `RoOby` repo.
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Environment variables:
   - `CLIENT_ORIGIN` = the Netlify URL, for example `https://rooby.netlify.app`
   - `JWT_SECRET` = a long secret string
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = your password
5. Create the service and copy the URL, for example `https://rooby-api.onrender.com`.

The free Render plan sleeps after idle time and can wipe files. For lasting admin data, add a **Persistent Disk** or use Railway.

### 3) Deploy the pages on Netlify

1. Open [netlify.com](https://netlify.com) and sign in with GitHub.
2. **Add new site** → **Import an existing project** → choose the same `RoOby` repo.
3. Build settings come from `netlify.toml`.
4. Add environment variable:
   - `VITE_API_URL` = the Render URL, for example `https://rooby-api.onrender.com`
5. Deploy.

When the Netlify URL is ready, set `CLIENT_ORIGIN` on Render to that URL and restart the API.

### URLs after deploy

- Shop: `https://YOUR-SITE.netlify.app`
- Admin: `https://YOUR-SITE.netlify.app/admin`

Both talk to the same API. When admin changes products, news, special orders, festivals, or approved comments, customers see it on the shop.
