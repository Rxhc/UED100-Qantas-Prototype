# Assessment 1 Alignment

## Project Goal

Create a working front-end demonstration for the Qantas website analysed in my UED100 Assessment 1. Incorporate technical specification, justification, responsive HTML/CSS/JavaScript, interactive components and multimedia assests. I have chosen Figma for wireframes, This prototype tests improvements rather than copying the real airline site.

## Assessment 1 evidence and design decision

Travellers book under time pressure, particularly on phones so primary flight search is visible near the top.

Image-heavy pages can load slowly so I added one local vector SVG with explicit width/height with no video or heavy third-party imagery this reduces transferred media bytes and reserves image space.

Unclear progress and errors added a four-step progress indicator and specific invalid-route/date messages this makes system status visible and prevents mistakes.

Cash versus points is confusing added one labelled "Use Qantas Points" this improves transparency for frequent flyers.

Keyboard and screen-reader needs, added semantic headings, landmarks and labels this improves navigation and announcement of dynamic changes.

Session timeout can lose progress so I added pre-expiry warning with "Keep going" action this demonstrates a more reassuring flow. This is not actual session security.

Account security and XSS risks: No tokens in localStorage and text populated with `textContent`; has no login backend this limits client-side injection opportunities in this demonstration.

## Technology selection and justification

- **HTML5:** Landmark elements (`header`, `nav`, `main`, `section`, `footer`), form labels, appropriate `type` values and native controls support usability, keyboard access, and browser validation. A real server would validate every submission again.

- **CSS3:** CSS Grid and Flexbox, custom properties, media queries (1100, 800, 620 px), focus styles, reduced-motion support. This enables responsive content without a JavaScript rendering framework.

- **JavaScript (ES6+):** Event listeners, form validation, accessible step transitions, DOM-based fare building, session warning demo, collapsible navigation, and live feedback. `textContent` also avoids injecting user-provided HTML.

- **Bootstrap 5.3.3:** Grid and form styling from a version-pinned CDN stylesheet, saving development effort while remaining easy to override. The site still has bespoke CSS for consistent branding. Loading over CDN needs internet; if you wanted a fully offline version download a licensed local Bootstrap distribution and update the reference.

- **SVG multimedia:** Custom vector illustration scales crisply, is lightweight, has no external copyright dependencies and can be rendered responsively. It is decorative in the page and therefore receives an empty HTML `alt`.

- **VS Code:** Source editing, file organisation, browser preview through Live Server, git integration and developer-console testing.

- **Git/GitHub:** Version control and auditable changes; publish the project repository.

## Accessibility target

Includes keyboard focus, semantic labels, screen-reader status updates, visible feedback and 44px-ish primary control heights. Test contrast with a tool, mobile zoom at 200% and keyboard navigation.

## Performance target

Minimised JS dependencies, used local SVG and browser caching on hosting, optionally minify CSS/JS for deployment and check LCP/CLS/INP in Lighthouse. No additional stock images are needed. Local vector artwork is loaded as an `<img>` with intrinsic dimensions; because it is above the fold.

## Security distinctions

HTTPS, HTTP-only session cookies and Content Security Policy are server/hosting configurations, not features that can be guaranteed by an HTML file on a local disk. This front-end contains no real login, payment details, cookies, or server session. The timer is UX-only.

## Changes from Assessment 1 recommendations

1. **Payment errors:** No payment process exists, so the prototype uses meaningful flight-search and traveller-form errors instead; payment validation requires a safe mock payment flow or backend.

2. **Two-factor login:** Shown as a non-functional sign-in affordance, rather than inventing a secure authentication system.

3. **Real-time fares and points:** Sample prices demonstrate presentation only; a production system would fetch authorised airline API data securely.

4. **Session security:** The warning demonstrates the interaction but is not a substitute for genuine server-side expiry handling.



Official references
- https://www.w3.org/TR/WCAG22/
- https://developer.mozilla.org/en-US/docs/Web/HTML
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout
- https://developer.mozilla.org/en-US/docs/Web/Security
- https://getbootstrap.com/docs/5.3/getting-started/introduction/
- https://owasp.org/www-project-top-ten/

**Assesment 1 Feedback**

1. **Recognisable shortcuts:** "A four-button quick-task area mirrors the familiar navigation options identified in Assessment 1. Because no airline API is available, buttons explain what the full service would require; they do not claim to open real bookings."

2. **Frequent flyers:** "A separate cash-versus-points selector inside flight results lets users compare the same example fares without returning to the search form. This directly targets the switching friction identified in the analysis."

3. **Leisure travellers:** "Simple airport/date search, legible fares and error prevention remain the primary conversion journey."

4. **Balanced promotions:** "The small travel-inspiration strip is deliberately placed after the flight-booking journey. Removing promotions entirely could weaken commercial discovery; keeping them secondary reduces distraction."

5. **Trade-off for timeouts:** "A warning preserves in-progress browser state when extended, at the cost of additional interface logic; it is an illustrative timer, not secure server-session handling."

6. **Trade-off for performance:** "One vector asset and no advertising trackers reduce page weight; sample fares are static and cannot reproduce a live seat-inventory experience."

**Reference-list feedback:** "When writing the final report, use `(n.d.)` for undated MDN entries and verify the actual publication/update year of the Nielsen article viewed. The original 2024 date should not be treated as confirmed without checking the source."

## My revised design differences and reasons

The real Qantas site has more product tabs and account workflows than this prototype. Those options are represented as familiar shortcuts and a small promotional affordance, while the functioning scope stays focused on flight booking. This limits implementation complexity and avoids pretending a front-end demonstration can perform real airline tasks. Fare price and points are illustrative rather than live API data.
