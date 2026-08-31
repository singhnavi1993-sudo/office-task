# MySlack - Online & Offline Deployment Guide

This guide explains how to run and share the **MySlack** application in both **Online Mode** (for clients anywhere in the world on any Mac or Windows device) and **Offline Mode** (for local Wi-Fi / offline usage without internet).

---

## 🌐 1. ONLINE MODE (Share with Clients Anywhere)

### Option A: Instant Live Tunnel (Easiest - Share directly from your laptop)
1. Double-click [`share-live-online.bat`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/share-live-online.bat) on Windows.
2. It generates a public HTTPS link (e.g., `https://random-name.loca.lt`).
3. Send this link to your client via Email, WhatsApp, or Slack.
4. **Client Experience**: Opens instantly on any MacBook, iMac, Windows PC, iPhone, or Android phone without installing anything!

### Option B: Host Online Permanently (Free 1-Click Hosting)
1. Double-click [`build-production-web.bat`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/build-production-web.bat).
2. Open **[Netlify Drop](https://app.netlify.com/drop)** in your browser.
3. Drag & drop the generated [`myslack-web/dist`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/myslack-web/dist) folder onto Netlify.
4. **Result**: You get a permanent web link (e.g., `https://my-slack-client-demo.netlify.app`).

---

## 🔌 2. OFFLINE MODE (No Internet / Local Wi-Fi)

### On Windows Laptops:
- Double-click [`start-offline-windows.bat`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/start-offline-windows.bat).
- It will automatically launch `http://localhost:5173` on your laptop.
- Other laptops/phones on the same Wi-Fi can open the displayed IP address (e.g., `http://192.168.1.15:5173`).

### On Mac (macOS / MacBook / iMac):
- Double-click [`start-offline-mac.command`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/start-offline-mac.command).
- Automatically opens in Safari/Chrome on Mac.

---

## 🛠 File Summary

| File | Purpose | Platform |
| :--- | :--- | :--- |
| [`share-live-online.bat`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/share-live-online.bat) | Share live public link with clients anywhere | Windows |
| [`build-production-web.bat`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/build-production-web.bat) | Compile static production `dist` build for Netlify/Vercel | Windows |
| [`start-offline-windows.bat`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/start-offline-windows.bat) | Run offline / local Wi-Fi server | Windows |
| [`start-offline-mac.command`](file:///C:/Users/BS%20Jamwal/.gemini/antigravity-ide/scratch/Slack%20Software%20Copy/start-offline-mac.command) | Run offline / local Wi-Fi server | macOS |
