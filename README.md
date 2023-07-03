# PIERSON TARRANTINO LIMAS (FE-FOCUS)
## How to start
### clone repo and install dependencies

```
git clone https://github.com/pear25/tech_FE.git
cd tech_FE
npm install
```
### dev mode
```
npm run dev (start on localhost:5173)
```

### Build mode
```
npm run build
npm run preview
```
> ## How to generate GOOGLE MAPS API KEY
1. Go to the Google Maps Platform > Credentials page.

2. On the Credentials page, click Create credentials > API key.
The API key created dialog displays your newly created API key.
Click Close.

3. The new API key is listed on the Credentials page under API keys.
4. Replace newly generated key with "YOUR_API_KEY_HERE" in line 99 (/src/components/Map)

> ## FAQs
### HOSTED AT: https://tech-fe.vercel.app/ --> still not working due to internal server issues
### GOOGLE_MAP_API_KEY not restricted in .env, issues with Google Maps API
### API IS STILL USING (http://localhost:8080; see below)

> ## !!!IMPORTANT!!!

I have encountered some issues when using the mock api provided (https://mock-api.dev.lalamove.com)
<img width="678" alt="image" src="https://github.com/pear25/tech_FE/assets/82131191/c2e46758-2a6d-4e81-b7f2-67ef2282d3ea">
<img width="678" alt="image" src="https://github.com/pear25/tech_FE/assets/82131191/bbf12fa8-0161-418c-9c82-8efda6f3a5fb">
<img width="560" alt="image" src="https://github.com/pear25/tech_FE/assets/82131191/d342ce68-e8ae-48c5-afdb-054e80cfdb5f">

And so, I have used the localhost URL (http://localhost:8080) instead of the remote URL:

I have defined the usage of the remote URL at /src/api/index.js
<br />
but I have used localhost:8080 instead as seen in /src/components/Form.jsx
<br />
GET REQUEST --> see Line 35 & 36
<br />
POST REQUEST --> see Line 66 & 67

On another note, Polyline removal works in production build but not dev mode





