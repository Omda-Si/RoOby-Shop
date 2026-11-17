# RoOby

Homemade sweets shop. The storefront is Arabic RTL. Customers order on WhatsApp. There is no card checkout.

**Live demo:** [https://roobysweets.netlify.app](https://roobysweets.netlify.app)

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
npm run setup
npm run dev
```

Then open:

- Shop: http://localhost:5173
- Admin: http://localhost:5173/admin

Copy `.env.example` to `.env` and set your admin username and password. Do not commit `.env`.

Stop the servers with `Ctrl+C`. That frees ports `5173` (shop) and `4000` (API).

## How admin updates the shop

Sign in at `/admin`.

1. **Today’s products** — mark what is available, set quantity, write today’s news, then click **Publish**.
2. **Special order** — write the custom-order message and keep the checkbox on so customers see it.
3. **Festival / occasion** — turn the festival card on, set a title such as `Eid al-Fitr`, write the note, then publish. Turn it off when the occasion ends.
4. **Products** — add or edit sweets and photos.
5. **Comments** — approve a comment before it appears on the shop.
6. **Settings** — shop name, WhatsApp number, about text, TikTok.
7. **Account** — change the admin username or password (needs the current password).

Edits go live on the shop after you save or publish. Customers can send a special or festival request straight to WhatsApp.

## Deploy (Netlify only)

Everything runs on Netlify: the shop pages, the admin API, and saved data (Netlify Blobs). No Render or Railway.

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

### 2) Deploy on Netlify

1. Open [netlify.com](https://netlify.com) and sign in with GitHub.
2. **Add new site** → **Import an existing project** → choose the `RoOby` repo.
3. Build settings come from `netlify.toml`. Leave **Publish directory** as `client/dist`.
4. Do **not** set `VITE_API_URL`. The site calls `/api` on the same Netlify domain.
5. Site environment variables:
   - `JWT_SECRET` = a long secret string
   - `ADMIN_USERNAME` = your private admin login
   - `ADMIN_PASSWORD` = your private admin password
6. Deploy.

The first request creates shop data in Netlify Blobs using those admin credentials. Later admin account changes are stored in Blobs too.

### URLs after deploy

- Shop: [https://roobysweets.netlify.app](https://roobysweets.netlify.app)
- Admin: [https://roobysweets.netlify.app/admin](https://roobysweets.netlify.app/admin)

When admin changes products, news, special orders, festivals, or approved comments, customers see it on the same site.
