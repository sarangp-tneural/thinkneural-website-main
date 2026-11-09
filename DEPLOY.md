# Deploying thinkneural.ai (Vite static site)

This project builds to plain static files (`dist/`). nginx serves them directly. There is no Node process, no pm2 and no port. It replaces the old Next.js app (pm2 `thinkneural-3d`, port 3001) on `thinkneural.ai`.

Server: the same Ubuntu EC2 instance, nginx with Certbot SSL. `poc.thinkneural.ai` keeps running untouched. GoDaddy DNS already points at the instance, so no DNS change is needed.

Values like paths come from the team's deploy notes. Check them on the box before relying on them.

**Checked on the server (Node v20.20.2, 4.6 GB free disk, pm2 `thinkneural-3d` online, nginx files `thinkneural` = thinkneural.ai and `thinkneural-3d` = poc):** the Node version and disk space are fine. Only edit `/etc/nginx/sites-available/thinkneural`; leave `thinkneural-3d` (poc) and the other sites alone. The old Next app lives in `/var/www/thinkneural-website-3d/`; this guide uses a separate folder, `/var/www/thinkneural-website/`, so the two never collide.

---

## 0. What you need once

| Item | Where it comes from |
|---|---|
| GitHub repo for this project | This repo has **no remote yet**. Create an empty repo on GitHub, then see step 1. |
| EmailJS keys (3 values) | `.env.local` on your laptop (copy the values; never commit the file) |
| Node 20.19+ (or 22.12+) on the server | `node -v` on the box. Vite 8 needs it. The old Next app already needs Node 20+, but check the minor version. |
| SSH key | `resturant.pem` |

---

## 1. Push the code (local machine)

First time only: create the GitHub repo, then

```bash
cd ~/Documents/thinkneural-website
git remote add origin git@github.com:<org>/<repo>.git
git branch -M main
git push -u origin main
```

Every update after that:

```bash
git push origin main        # the server deploys main
```

The server only sees what is on GitHub.

---

## 2. Fresh deploy (first time)

### 2.1 Connect and check the box

```bash
ssh -i "resturant.pem" ubuntu@ec2-13-203-174-188.ap-south-1.compute.amazonaws.com
node -v                      # must be >= 20.19
df -h /                      # a few hundred MB free is plenty
pm2 list                     # note thinkneural-3d and its port
ls /etc/nginx/sites-enabled /etc/nginx/sites-available
```

If Node is too old: `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs`
(upgrade carefully; the old Next app and poc site run on this Node too. If unsure, build on your laptop instead: see section 5.)

### 2.2 Get the code

```bash
sudo mkdir -p /var/www/thinkneural-website
sudo chown ubuntu:ubuntu /var/www/thinkneural-website
git clone git@github.com:<org>/<repo>.git /var/www/thinkneural-website/src
cd /var/www/thinkneural-website/src
```

(The repo goes in `src/`; built releases go in `releases/`; nginx serves `current/`. They are all inside `/var/www/thinkneural-website/`.)

### 2.3 Add the EmailJS keys

```bash
cp .env.example .env.local
nano .env.local              # fill in the 3 VITE_EMAILJS_* values (+ optional VITE_GA_ID, VITE_META_PIXEL_ID)
```

These are baked into the JavaScript at build time, so the file must exist **before** every build.

### 2.4 First build and publish

```bash
./scripts/deploy.sh
```

This runs `git pull`, `npm ci`, `npm run build`, copies `dist/` to `/var/www/thinkneural-website/releases/<timestamp>/` and points `/var/www/thinkneural-website/current` at it.

Check the files exist:

```bash
ls /var/www/thinkneural-website/current          # index.html, assets/, blog/, sitemap.xml, robots.txt ...
```

### 2.5 Switch nginx from the Next app to the static site

Back up first:

```bash
# a thinkneural.backup already exists on the server, so use a dated name and do not overwrite it
sudo cp /etc/nginx/sites-available/thinkneural /etc/nginx/sites-available/thinkneural.pre-vite.$(date +%Y%m%d)
sudo nano /etc/nginx/sites-available/thinkneural
```

In the `thinkneural.ai` server block (port 443) **replace** the old `root`/`index`/`location /` (or the `proxy_pass` to 3001) with the following. Keep the Certbot-managed `listen 443 ssl`, certificate lines and the port-80 redirect block exactly as they are.

```nginx
    root /var/www/thinkneural-website/current;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml text/plain application/xml;

    # pages: always revalidate so a new deploy shows up immediately
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    # hashed build files never change: cache for a year
    location /assets/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # photos and logos
    location /img/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=2592000";
    }

    error_page 404 /index.html;   # optional: unknown paths show the home page
```

Notes:
- `try_files $uri $uri/` is what makes `/blog/<slug>/` work (each article is a real folder with an `index.html`).
- Remove the old `.html` redirect and PHP `location` blocks only if the old static site is fully retired.
- `thinkneural.ai` and `poc.thinkneural.ai` must not both be `server_name` in the same enabled file.

**Optional: keep old URLs working** (search engines may have indexed the Next app's paths). Add inside the same server block, above `location /`. Check the real old URLs first; these are the ones the old footer used:

```nginx
    location = /contactus                   { return 301 /#contact; }
    location = /products/spacezap           { return 301 /#spacezap; }
    location = /products/sakshi             { return 301 /#sakshi; }
    location = /products/datadime           { return 301 /#datadime; }
    location = /about                       { return 301 /#about; }
    location ~ ^/policies/(privacy-policy|platform-licence-agreement|content-rules|cookies-policy|copyright-policy)/?$ { return 301 /#$1; }
```

### 2.6 Test and reload

```bash
sudo nginx -t                 # must say "syntax is ok"
sudo systemctl reload nginx
```

### 2.7 Verify

```bash
curl -I https://thinkneural.ai
curl -I https://thinkneural.ai/blog/spacezap-fitout-minutes/
curl -s https://thinkneural.ai/sitemap.xml | head
curl -s https://thinkneural.ai/robots.txt
```

In the browser (hard refresh):
- Home: hero scene loads, scroll through the 8 stages; About, Events, Careers, Blog and a policy page open.
- Phone width: menu opens, sticky "Request a demo" bar appears after the hero.
- Contact form: send a test request and confirm the email arrives. If you restricted allowed domains in EmailJS, make sure `thinkneural.ai` is allowed.
- View source of a blog article: it contains the article text and a `<link rel="canonical">`.

### 2.8 Retire the old app (after a day or two of watching)

```bash
pm2 stop thinkneural-3d       # frees memory and port 3001; do not delete yet
pm2 save
```

Delete it later (`pm2 delete thinkneural-3d`) once you are sure you will not roll back. `poc.thinkneural.ai` is unaffected: leave its nginx file and process alone.

### 2.9 SEO follow-up (once live)

In Google Search Console for `thinkneural.ai`, submit `https://thinkneural.ai/sitemap.xml`.

---

## 3. Redeploy on update (normal flow)

On your laptop:

```bash
git add -A && git commit -m "..." && git push origin main
```

On the server:

```bash
ssh -i "resturant.pem" ubuntu@ec2-13-203-174-188.ap-south-1.compute.amazonaws.com
cd /var/www/thinkneural-website/src
./scripts/deploy.sh
```

That is all: no pm2 restart and no nginx reload, because nginx just serves whichever release `current` points to. The switch is atomic, so visitors never see a half-built site. Hard-refresh to check.

When to do more:
- Changed an EmailJS key: edit `.env.local` on the server first, then deploy (they are compiled in).
- Changed the nginx config: `sudo nginx -t && sudo systemctl reload nginx`.
- Changed `SITE` in `vite.config.js` (domain for canonical tags and the sitemap): just deploy.

Useful commands:

```bash
git log --oneline -3                                   # what is being deployed
ls -1t /var/www/thinkneural-website/releases           # releases, newest first
readlink -f /var/www/thinkneural-website/current       # which one is live
```

---

## 4. Rollback

Instant, no rebuild:

```bash
cd /var/www/thinkneural-website
ls -1t releases                                        # pick the previous one
ln -sfn "$PWD/releases/<previous-timestamp>" current.new && mv -Tf current.new current
```

The last 5 releases are kept (`KEEP=10 ./scripts/deploy.sh` to keep more).

To go back to the **old Next app** entirely:

```bash
sudo cp /etc/nginx/sites-available/thinkneural.pre-vite.<date> /etc/nginx/sites-available/thinkneural
sudo nginx -t && sudo systemctl reload nginx
pm2 start thinkneural-3d          # if you stopped it in 2.8
pm2 status
```

---

## 5. Alternative: build on your laptop, upload the files

Use this if the server's Node is too old or the box is short on memory. The build needs `.env.local` on your laptop (it already has it).

```bash
cd ~/Documents/thinkneural-website
npm ci && npm run build
REL=$(date +%Y%m%d-%H%M%S)
rsync -az --delete -e "ssh -i resturant.pem" dist/ ubuntu@ec2-13-203-174-188.ap-south-1.compute.amazonaws.com:/var/www/thinkneural-website/releases/$REL/
ssh -i resturant.pem ubuntu@ec2-13-203-174-188.ap-south-1.compute.amazonaws.com \
  "cd /var/www/thinkneural-website && ln -sfn \$PWD/releases/$REL current.new && mv -Tf current.new current"
```

(`releases/` must exist: `mkdir -p /var/www/thinkneural-website/releases` once.)

---

## 6. Troubleshooting

| Symptom | Check |
|---|---|
| 502 Bad Gateway | nginx still has `proxy_pass` to 3001 and the Next app is stopped. Finish step 2.5. |
| 403 / 404 on `/` | `ls /var/www/thinkneural-website/current/index.html`; `root` path in nginx; file permissions (`chmod -R a+rX /var/www/thinkneural-website`). |
| Blog article 404 | `try_files $uri $uri/ =404;` missing, or the build is older than the blog. |
| Old site still showing | Wrong server block edited, or browser cache: `curl -I https://thinkneural.ai` and compare. |
| Contact form shows the "send by email instead" fallback | `.env.local` was missing or empty at build time. Fix it and run `./scripts/deploy.sh` again. |
| `npm run build` fails with a Node error | `node -v` is below 20.19. Upgrade, or use section 5. |
| `nginx -t` conflict on `server_name` | `thinkneural.ai` listed in two enabled files. |





cd ~/Documents/thinkneural-website
git add -A
git commit -m "describe the change"
git push origin main


ssh -i "resturant.pem" ubuntu@ec2-13-203-174-188.ap-south-1.compute.amazonaws.com
cd /var/www/thinkneural-website
git pull
npm ci
npm run build
