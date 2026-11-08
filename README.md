# UED100 Assessment 2 — Qantas-inspired flight booking UX prototype

 Uploading this to GitHub so just noting this is not the official Qantas website, not affiliated with Qantas, and not connected to flight or payment services. All fare names, amounts, flight times and booking states are illustrative. Original SVG artwork is supplied locally.

## How to run in Visual Studio Code

1. Extract the ZIP and open the `Qantas_UED100_Prototype` folder in VS Code.
2. Install the **Live Server** VS Code extension (optional but recommended).
3. Right-click `index.html` → **Open with Live Server**, or open `index.html` directly in your browser.
4. Try the booking flow and contact form. Internet access is needed only for the Bootstrap CDN stylesheet; the custom styles and JavaScript are local.
5. Open `wireframes/wireframes.html` to view annotated low-fidelity planning layouts. Recreate these in **Figma or Adobe XD** and capture wireframe screenshots for the assessment, as the brief requires that design tool explicitly.

## Features

- Choose Return or One way and set route, dates, passenger count, and cash or points mode.
- Select **Search flights**. Invalid inputs show contextual messages; valid inputs display **sample** fare options.
- Select a fare, enter **fictional** traveller details, review your trip, and complete the demonstration (no purchase).
- Use the mobile-width browser inspector to test the responsive navigation.
- Try invalid email, missing contact fields, and messages shorter than 10 characters.
- If you want to test the session warning quickly, temporarily change `INITIAL_NOTICE_DELAY_MS` in `js/app.js` from `180000` to `10000` (10 seconds); restore `180000` before submitting. A 60-second warning window is simulated.
- Keyboard-only path using Tab, Shift+Tab, Enter, and Space

## Source file structure

```
Qantas_UED100_Prototype/
  index.html                 HTML and all page sections
  css/styles.css             Responsive styles and focus/contrast rules
  js/app.js                  Validation, mobile nav, fare UI, progress, session demo
  assets/hero-flight.svg     Original lightweight aviation illustration
  wireframes/wireframes.html Annotated low-fidelity desktop/mobile planning wireframes
  docs/ Assessment 1 Alignment.md  Assessment 1 Alignment
  README.md                  Setup and usage
```



## Limitations

The UI is not a production-ready airline booking service. Client-side validation can be bypassed, and real deployments would require validated server APIs, secure HTTP-only cookies, CSRF protection, HTTPS, rate limiting, secure payment integrations, appropriate CSP and error handling. The simulated session timer is not authentication security. No user input or PII is intentionally saved or transmitted by the custom app JavaScript.


## Open in Visual Studio Code

1. Extract this ZIP, then select **File → Open Folder…** and open `Qantas_UED100_Prototype`.
2. VS Code may suggest the **Live Server** extension from `.vscode/extensions.json`. Install it if needed.
3. Right-click `index.html` and select **Open with Live Server**. Your browser should open at `http://127.0.0.1:5500/`.
4. If you don't use Live Server, open the VS Code Terminal and run `python3 -m http.server 5500`, then visit `http://localhost:5500`.

