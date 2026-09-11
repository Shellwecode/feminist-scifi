# IA variations — The Untold Stories

Three structurally different information architectures for the whole site, each judged against what is actually built and against a hard two-day budget. Written from the files only (no browser).

---

## 0. What exists versus what the spec proposes

**Built and working (as of `index.html`, `archive.html`, `archive.js`, `script.js`):**

| Piece | State |
|---|---|
| Opening — illustrated study, language-cycling title, peel-away video, 8 postcard hotspots (Zhang Xiaofeng, Xia Jia, Hao Jingfang, Bora Chung, Karin Boye, Marlen Haushofer, Léonora Miano, Misha Nogha) with popovers; "Meet the writers" `<details>` list linking to `archive.html?search=…` | Done; the one finished illustration (`open-1.png`, `open-scrolled.mp4`) |
| V1 · 张晓风 · 1968 — 3 storybook spreads | Prose done; 1 of 3 figures real (`reading-1.mp4`), 2 placeholders |
| Bridge A · Stories filed elsewhere — intro spread + 5 modes / 9 filing cards | Done, text-only |
| V2 · 夏笳 / Ken Liu · 2012 — 3 spreads | Prose done; 3 placeholders |
| Bridge B · Whose hand? — intro + hook + 4 modes / 7 cards | Done, text-only |
| V3 · Porridge SF — 2 spreads | Prose done; 2 placeholders |
| Closing · Absence as answer — intro + 4 empty cases | Prose done; 4 placeholder cases |
| Archive coda + footer; site chrome (Story / Archive / Guide, progress line); reading-guide dialog with 6 stops; arrow-key spread navigation; reduced-motion fallbacks | Done |
| `archive.html` — search, filters (region → 8 groups, language, first-active period → 4 buckets, theme, sort), 76-card grid, dialog that fetches `authors-raw/*.md`, `?author=` / `?search=` / filter deep links | Done |
| 4 "reading pathway" cards for featured writers with no research file (Zhang Xiaofeng, Boye, Miano, Misha), linking back to `index.html#…` | Done — an honest stub, not data |

**Dataset facts the IA has to respect:**

- 76 author files, one manifest row each: `file, name, language, region, years, themes` (+ derived `firstYear`). Files have consistent H2 sections (name, language, region, years active, monumental works, themes, influences, influenced, translation history, notable recognition, brief bio, sources).
- The manifest covers **7 dataset regions** (Anglophone 29, East Asian 12, African + diaspora 9, Latin American 8, European non-English 8, South Asian 5, MENA + other 5); the archive groups them into 8 filter buckets by splitting out "Indigenous Americas" (Roanhorse alone). **"10 regions" is the recon coverage, not the dataset** — Taiwan, Hong Kong, Indigenous-beyond-Roanhorse, Brazil-pre-2000 and Turkish/Persian MENA exist only in `recon/`.
- 9 writers who carry the narrative have **no archive file**: Zhang Xiaofeng, Dinah Silveira de Queiroz, Léonora Miano, Maria Galina, Julia Verlanger, Karin Boye, Magdalena Mouján Otaño, Misha, Sheree Renée Thomas. Bridge B's gatekeepers (Ken Liu, Anton Hur, Megan McDowell, the Indigenous presses) are not author-shaped at all.
- Story → archive links today: the nav item, the opening `<details>` list, the coda, the guide. Archive → story links: only the 4 pathway cards. **No bridge case links to a file; no file says where it appears in the story.**

**Specified but not built:**

- Bridge A variants A.1–A.4 (Anglophone summary error, magical-realism absorption, the recanonisers roster, first-woman-to-win lag-bar) and Bridge B variants B.1–B.4 (anthology-as-canon-formation lag-bar, translator collective, critic-as-gatekeeper, self-translation).
- The synthesis's five zone options (chronological halls, regional rooms, translation pipeline, thematic rooms, reception-status zones), the recommended E + D hybrid, the lag table and translator-cluster table as installations, the field-builders room.
- 11 figure placeholders; the four closing "cases" as drawn objects.
- Phase-2 expansion (~115 Tier-1 candidates; `primary_medium`, `prize_history`, primary + secondary region, documented vs plausible edges, writing-gap vs translation-gap states).

Everything below treats the bridge variants and Phase-2 expansion as out of scope for two days, and asks only how the *existing* content should be arranged and joined.

---

## Variation 1 — "The Reading": one route, appendix behind

### Thesis

Optimises for a single uninterrupted first-person read of roughly fifteen minutes. The site is an essay you walk top to bottom; the museum is the metaphor for that walk, not a building to explore. The Archive is an **appendix**: reachable from the end, from the Guide, and from small file-marks in the text, but it never competes with the scroll and never appears as a peer destination. This is the IA the case study already argues for ("you are about to walk through the act, not the survey") and the one the current build is closest to; the work is to finish the joints rather than restructure.

### Sitemap

```
index.html — The Reading (single continuous scroll)
├─ Site chrome: wordmark · progress line · Guide (dialog)            [Archive removed from chrome]
├─ 00  Opening — the study
│     ├─ postcard wall (8 hotspots → glass card; card gains a "File ↗" line when a file exists,
│     │   "not yet filed" when it does not)
│     └─ "Meet the writers in this room" list → appendix anchors, not archive.html
├─ 01  V1 · 张晓风 · 1968                       (3 spreads)
├─ 02  Bridge A · Stories filed elsewhere        (intro + 5 modes / 9 cards)
│        each case-name carries a file-mark → same glass card as the postcards
├─ 03  V2 · 夏笳 / Ken Liu · 2012               (3 spreads)
├─ 04  Bridge B · Whose hand?                    (intro + hook + 4 modes / 7 cards)
├─ 05  V3 · Porridge SF                         (2 spreads)
├─ 06  Closing · Absence as answer              (intro + 4 empty cases)
├─ 07  Appendix
│     ├─ Catalogue note (existing archive-coda, retitled "Appendix")
│     ├─ Files cited in this reading — every writer named above, in reading order, grouped by
│     │   the section they appear in; each row → archive.html?author=… or "not yet filed"
│     └─ Method & gaps — three paragraphs from CASE-STUDY.md + link to gaps.md on GitHub
└─ Footer — "Return to the first room"

archive.html — Appendix proper (unchanged UI)
├─ header back-link reads "← Return to the reading" (exists)
├─ search · filters · 76-card grid · file dialog (?author=)
├─ each card + dialog gains one line: "Appears in the reading: Bridge A · Mode 3" → index.html#bridge-a
└─ 4 pathway cards for un-filed featured writers (exist)
```

### Navigation model

- **Linear.** The only in-page navigation is the scroll, arrow keys, and the Guide's six stops. The Guide is the table of contents; the progress line is the page number.
- **Story is the site; Archive is a layer.** Removing "Archive" from the chrome is the deliberate move: the archive is entered through the text (file-marks), the end (appendix list), or the Guide's last link — never from the top.
- **Postcards and cases share one component.** The existing `.postcard-popover` glass card becomes the universal "who is this" surface: hover/tap on a postcard or a bridge case-name shows name, language, region, years, and either "Open file ↗" (deep link with `?author=`) or "Not yet filed — see gaps". The reader never has to leave the page to know who Haushofer is.
- **Round trip.** `archive.html` cards carry an `appearsIn` anchor so a reader who arrives from a file-mark can return to the exact spread.

### First-time visitor journey

1. Lands on the lamp-lit study; the title cycles through five scripts; hovers two postcards, learns Karin Boye wrote a dystopia in 1940.
2. Clicks "Begin with Zhang Xiaofeng"; the study peels away; reads V1 across three page-turns.
3. Scrolls into Bridge A; taps the file-mark on Haushofer; the glass card says German · Austria · 1946–1970 · Open file ↗. Doesn't open it — keeps reading.
4. V2, Bridge B, V3: the questions accumulate (invisible to the genre? whose hand? who draws the line?).
5. Closing: four empty cases, labelled. "More is possible, if the conditions hold."
6. Appendix: "Files cited in this reading" — 27 names in the order they were met; notices nine say "not yet filed". Clicks Xia Jia → `archive.html?author=xia-jia`.
7. File dialog opens over the archive grid; reads the translation history; the card says "Appears in the reading: V2 · Bridge B hook". Closes the dialog, filters East Asia, opens Tang Fei.
8. "← Return to the reading" lands them at the appendix, not the top.

### Content mapping

| Existing | Goes to |
|---|---|
| All of `index.html` sections 00–06 | Unchanged, in order |
| `archive-coda` | Becomes the Appendix header |
| `archive.html` + `archive.js` | Unchanged UI; gains `appearsIn` |
| `RELATED_PATHWAYS` (4) | Kept; extended to the other 5 un-filed writers so the appendix list has an honest target for all nine |
| Reading-guide dialog | Unchanged; "Open the research archive" stays as the guide's only archive link |
| CASE-STUDY.md "Why I started" + "What I learned" §1–2 | Excerpted into Appendix "Method & gaps" |

**New to build:** a ~25-row `appearsIn` map in `archive.js` (author file → section id + label); file-mark markup on 16 case-names that have files; glass-card reuse for cases (the popover positioning code exists; it needs a second trigger set); the appendix list (static HTML, ~30 rows); one "Appears in" line in `cardMarkup` and the dialog meta. Nothing new to write except ~150 words of appendix framing.

### Effort against two days

About **one day**. Half a day for file-marks + glass-card reuse + `appearsIn`; a quarter day for the appendix list and chrome change; a quarter day for keyboard/focus and reduced-motion checks on the new popover triggers. Day two is slack: spend it on giving the 11 placeholders one consistent "study not yet drawn" treatment so the reading looks finished rather than half-built.

**Cut to fit:** nothing structural. If the glass-card reuse fights the sticky bridge headers, fall back to plain `?author=` links on case-names and keep the popover only on postcards.

### Risks

- The archive becomes hard to find: it sits behind a ~20-screen scroll and a dialog. Acceptable if the audience is readers; not if the audience is researchers or hiring managers who want to see the dataset first.
- The IA work is invisible as IA — it reads as polish of the current site. If the goal of this exercise is to demonstrate a structural decision, this variation demonstrates restraint, not structure.
- The storybook's horizontal page-turn (sticky viewport + scroll-mapped translate) already deters skimmers; a strictly linear IA offers them no alternative.
- Eleven placeholders inside a "finished reading" are more conspicuous than inside a hub, where a room can be visibly "closed for installation".

---

## Variation 2 — "The Floor": rooms off a lobby

### Thesis

Optimises for choice and for the second visit. The visitor is in a building: the illustrated study is the **lobby**, a floor plan lists the rooms, and rooms can be entered in any order. Vignettes are rooms, bridges are the corridors between them, the closing is the unbuilt wing, and the Archive is the **catalogue desk** — a room on the same floor, a peer of the vignettes rather than an afterthought. The narrative sequence survives as a *recommended route* drawn on the plan, but the plan, not the scroll, is the primary structure. This is the IA that gives the bridge variants (A.1–A.4, B.1–B.4) somewhere to live later: alcoves off the corridors.

### Sitemap

```
index.html — Lobby
├─ the study (existing opening art + title + postcards)
│     postcards become the directory: click → the room where that writer is exhibited,
│     or the catalogue card if they only exist as a file
├─ Floor plan (replaces the reading-guide list; drawn, or a labelled list styled as a plan)
│     ├─ Room 1 · The essayist          → rooms/room-1.html
│     ├─ Corridor A · Filed elsewhere   → rooms/corridor-a.html
│     ├─ Room 2 · The translator        → rooms/room-2.html
│     ├─ Corridor B · Whose hand        → rooms/corridor-b.html
│     ├─ Room 3 · The genre line        → rooms/room-3.html
│     ├─ The unbuilt wing               → rooms/wing.html
│     └─ Catalogue desk                 → archive.html
│     recommended route drawn as a dotted line 1 → A → 2 → B → 3 → wing
└─ Chrome: wordmark · Floor plan (mini-map toggle) · Catalogue

rooms/room-1.html    V1 (3 spreads)      doors at end: → Corridor A · → Catalogue (East Asia)
rooms/corridor-a.html Bridge A (9 cards) doors: → Room 2 · ← Room 1 · [alcoves A.1–A.4: "closed"]
rooms/room-2.html    V2 (3 spreads)      doors: → Corridor B · → Catalogue (?author=xia-jia)
rooms/corridor-b.html Bridge B (7 cards) doors: → Room 3 · [alcoves B.1–B.4: "closed"]
rooms/room-3.html    V3 (2 spreads)      doors: → The unbuilt wing · → Catalogue (theme: language)
rooms/wing.html      Closing (4 cases)   each case has its own door:
                                           HK → catalogue, region East Asia (shows the absence)
                                           晋江 → Room 3
                                           field-builders → catalogue search "editor"
                                           next decade → Corridor B
archive.html — Catalogue desk (existing UI)
└─ new facet "Room": Lobby wall · Room 1 · Corridor A · Room 2 · Corridor B · Room 3 · Wing · Not exhibited
```

### Navigation model

- **Hub and spoke.** The lobby is the hub; every page carries a mini-map (the floor plan, small) in the chrome so the visitor always knows which room they are in and can jump. "Story" in the nav becomes "Floor plan".
- **Archive is a destination.** The catalogue desk is one of seven stations on the plan, same weight as a room. It is where the walk *ends* on the recommended route, but nothing prevents entering it first.
- **Doors, not scroll.** Each room ends with two or three doors; a door is a large link with the destination's plaque text. The recommended door is visually primary; the catalogue door is always secondary.
- **Authors link across via a facet.** The manifest gains a `room` field; the catalogue can be filtered by "Room 2" and shows Xia Jia, Hao Jingfang, Chi Hui, Tang Fei. Each file dialog says "Exhibited in Room 2 · Corridor B" with links. The lobby postcards use the same field to decide where a click goes.

### First-time visitor journey

1. Lands in the lobby; the postcards glow; the floor plan sits below the fold with a dotted recommended route and one line: "Start with the essayist, or go anywhere."
2. Follows the route into Room 1; reads V1 across three page-turns; at the end two doors: "Corridor A — Stories filed elsewhere" (primary) and "Catalogue: East Asian files".
3. Corridor A: nine filing cards under sticky mode headers; taps Boye's card's "catalogue" mark, sees she is "not exhibited — no file yet"; the alcove doors A.1–A.4 are marked closed.
4. Door to Room 2; reads V2; the mini-map shows they are halfway across the floor.
5. Curiosity wins: opens the mini-map and jumps straight to the unbuilt wing. Four empty cases. Each case has a door; the 晋江 case sends them *back* to Room 3, which they skipped.
6. Reads Room 3; the closing questions now land.
7. Door to the catalogue desk; the "Room" facet is preselected to Room 3; they widen it to everything, filter Korean, open Bora Chung, read the translation history.
8. Mini-map → lobby; on the way out the postcards now read as a directory of rooms visited.

### Content mapping

| Existing | Goes to |
|---|---|
| Opening section | Lobby (art, title, postcards unchanged; CTA becomes the floor plan) |
| Reading-guide dialog (6 stops) | Becomes the floor plan — same six stops plus the catalogue, drawn |
| V1 / V2 / V3 sections | `rooms/room-1..3.html`, each carrying the storybook CSS/JS for its own spreads |
| Bridge A / B intro + cards | `rooms/corridor-a.html`, `rooms/corridor-b.html` |
| Closing intro + 4 cases | `rooms/wing.html`; each case gains a door |
| Archive coda | Dissolved — its job is done by the catalogue-desk door in every room |
| `archive.html` | Catalogue desk; gains the `room` facet and "Exhibited in" line |
| `RELATED_PATHWAYS` | Become "Not exhibited / not filed" entries under the Room facet |

**New to build:** the floor plan (a drawn SVG in the study's doodle style, or a typographic plan — the second is the two-day version); the mini-map chrome; a door component; six room page shells (split `index.html`; `script.js` assumes one page — the storybook driver works per page, but arrow-key navigation, the progress line and `Home`/`End` become per-room and the cross-room order has to be re-expressed as doors); `room` values for ~30 manifest rows; the wing's four doors (one needs a search query for "editor", which currently matches nothing in the manifest — it would match file bodies only if search covered them, which it does not).

**New to write:** door plaque copy (~15 lines), a lobby line, the "closed" alcove labels.

### Effort against two days

**Two to three days as drawn.** The page split is the cost: six shells, per-page chrome, retested keyboard and reduced-motion behaviour on each, and a floor plan that has to sit next to `open-1.png` without looking like a wireframe.

**Cut to fit (~1.5 days):** keep one page. Turn the reading-guide dialog into the floor plan (typographic, with the recommended route as a numbered dotted list and the catalogue as stop 07); add door blocks at the end of each existing section (anchors, not pages); add the `room` facet and "Exhibited in" line to the archive; rename nav "Story" → "Floor plan" and make it open the dialog. Drop alcoves, mini-map, and the drawn plan. The building metaphor is then a navigation overlay on the linear page — weaker, but coherent.

### Risks

- **The "I" fragments.** V1, V2, V3 are one biography — a child, a student, an adult. Entered out of order, the first person loses its arc and the closing questions land on a visitor who has not been set up for them. The recommended route mitigates, but a hub invites ignoring it.
- **A second illustration at the quality bar of the first.** The study took three build iterations; a floor plan drawn to match is real illustration time, and a typographic plan next to that art risks looking like a fallback.
- **Multi-page breaks the working parts.** Progress line, arrow keys, `Home`/`End`, scroll-position restore and the peel-away transition all assume one document. The single-page cut avoids this and is the only version that fits.
- **Empty rooms read as broken when reached first.** The unbuilt wing is the museum's strongest beat *after* V3 and its weakest as an entry point; the closed alcoves add more "not yet" signage to a site that already carries eleven placeholders.
- **Search cannot yet support the wing's doors** (manifest-only search; "editor" and "field-builder" are not manifest terms).

---

## Variation 3 — "The Catalogue": the story as a pinned route through the files

### Thesis

Optimises for the researcher, the return visit, and for scale. The wall of 76 files is what you land on — the lamp-lit study, but every postcard is a card — and the narrative is **three curated routes** pinned through that wall. The vignette prose becomes route interstitials; the bridge cards become annotations on the files they cite; the closing's four absences become four **empty drawers** in the catalogue, first-class entries with labels but no file. Story is a layer over data, not the other way round. This is the only IA that still works unchanged when Phase 2 triples the dataset: routes are data, so a fourth route (field-builders, or Variant A.3's recanonisers) is a list, not a page.

### Sitemap

```
index.html — The wall (archive UI as the landing)
├─ the study art as background; 76 cards laid on the wall in the postcard treatment
├─ search · filters (region · language · period · theme) · sort
├─ Routes — three chips; selecting one reorders the wall into route order, dims everything
│  not on the route, and reveals the interstitials between cards
│  ├─ Route 1 · Filed elsewhere
│  │     opening text → V1 (3 interstitials) → Bridge A cards, in mode order:
│  │     Dinah SdQ* · Miano* · Burdekin · Galina* · Verlanger* · Haushofer · Boye* ·
│  │     Mouján Otaño* · Misha*                    (* = stub card, no file)
│  ├─ Route 2 · Whose hand
│  │     V2 (3 interstitials) → Bridge B cards: Xia Jia · Tang Fei · Chi Hui · Hao Jingfang ·
│  │     Bora Chung · Kim Bo-Young · Djuna · Kim Choyeop · Schweblin · Bazterrica ·
│  │     Gorodischer (with Le Guin) · Tidbeck · Vonarburg · Singh · Onwualu · Thomas* ·
│  │     [presses] — gatekeepers appear as annotations on the card, not as cards
│  └─ Route 3 · The genre line
│        V3 (2 interstitials) → four empty drawers → "more is possible, if the conditions hold"
├─ Empty drawers — four entries of type "absence" (HK · 晋江 · the field-builders · the next decade)
│  filterable via a fifth filter "Kind: writer / absence / not yet filed"
├─ File dialog (?author=)  + "On routes: 1, 2 · step 4 of 12" + prev / next on route
└─ About — CASE-STUDY.md rendered (method, error rate, gaps)

route.html?r=1|2|3 — Route reader (the cut version folds this into the wall; see effort)
├─ linear scroll of steps: interstitial spreads (existing storybook CSS) alternating with cards
└─ ends with a door to the next route and a "back to the wall, route still selected" link
```

### Navigation model

- **Archive is the hub and the home.** Nav: Wall · Routes (1, 2, 3) · About. There is no "Story" item; the story is what the Routes chips do to the wall.
- **Story is a layer.** A route is an ordered list of steps `{kind: card | interstitial | drawer, ref, annotation}` in `archive.js`. Selecting a route is a filter + sort + reveal, not a page change. The route reader page is the "read it as a book" affordance for the same list.
- **Author ↔ story linking is native.** Route membership is data on the card, so every file dialog knows its routes and its neighbours; every route step knows its file. Postcards, cards and route steps are one entity.
- **Absence gets an entity type.** The four closing cases become drawers with a label, a one-paragraph answer (existing closing prose), and a "kind: absence" badge, so the wall itself shows what is missing when you filter East Asia and see the Hong Kong drawer beside 12 files.

### First-time visitor journey

1. Lands on the wall: 76 cards under the lamp, three route chips above them, the subtext "I made this site for my own curiosity…" as the only prose.
2. Filters Korean; four cards remain; opens Bora Chung; the dialog says "On Route 2 · Whose hand · step 5 of 16" with a "Follow the route" button.
3. Follows it: the wall reorders into Route 2; the V2 interstitials appear as spreads between cards; reads the translator-before-author story, then Ken Liu's table as the annotation on Xia Jia's card.
4. Steps through Hur's four Korean cards; the annotation is the bridge text; the file is one click deeper.
5. Route 2 ends: "Continue to Route 3 — the genre line."
6. Route 3: two V3 interstitials, then four empty drawers; the 晋江 drawer's answer is the closing prose.
7. "Back to the wall, route still selected" — they clear the route, filter "Kind: absence", and see the four drawers alone on the wall.
8. Opens About; reads the 30–40 % error-rate finding; leaves with the dataset, not the essay, as the memory.

### Content mapping

| Existing | Goes to |
|---|---|
| `archive.html` / `archive.js` / `archive.css` | Become the landing (`index.html`); the current `index.html` is retired or kept as `reading.html` |
| Opening art + postcard treatment | Wall background and card styling; the 8 hotspots are replaced by 76 cards |
| V1 / V2 / V3 spreads | Route interstitials (kind: interstitial), reusing `.page` / `.spread-prose` CSS |
| Bridge A / B cards | Per-step `annotation` text on the relevant file (16 with files, 9 stubs) |
| Bridge intros and codas | Route opening and closing interstitials |
| Closing intro + 4 cases | Route 3 interstitial + 4 drawer entries |
| `RELATED_PATHWAYS` | Become the stub-card type ("not yet filed"), extended from 4 to 9 |
| CASE-STUDY.md | About page (rendered with the existing markdown renderer) |
| Reading-guide dialog | Dropped; routes replace it |

**New to build:** the route data (~45 steps across three routes, each with a ref and annotation lifted from the bridges); route mode in `archive.js` (reorder, dim, reveal interstitials, prev/next in dialog); the drawer and stub entity types in `cardMarkup`; the "Kind" filter; the wall layout (cards over the study art — the current grid is a plain paper grid); the route reader if built as a page; About page rendering.

**New to write:** nine stub cards (name, language, region, years, one line — all available in the bridges and recons); three route intros (~60 words each); drawer labels (exist).

### Effort against two days

**Two to two-and-a-half days as drawn.** The route reader, the wall-over-art layout and the entity types are each half a day; the data entry is a quarter; the landing swap and About are a quarter; the last half day is the part that always overruns — making interstitial spreads feel like the storybook inside a data UI.

**Cut to fit (~1.5 days):** no route reader page and no wall-over-art. Keep the archive's paper grid as the landing; build routes as a sort/filter mode that orders cards by step, shows the annotation on the card face, and inserts the interstitials as full-width rows in the grid; link "Read this route as an essay" to the corresponding anchor in the retained `reading.html`. Drop the drawer entity — link the Route 3 end to `reading.html#s-closing-intro` instead. Add the nine stubs.

### Risks

- **It demotes the reason the project exists.** The case study records that v0 "felt like walking past wall text" and that the doodle study fixed it; archive-first puts the eight-year-old reading 在 back into an interstitial row between data cards. The intimacy is the thesis; this IA makes it a footnote to the filter bar.
- **The Anglophone weighting is the first impression.** 29 of 76 cards are Anglophone; a wall of files opens with Atwood, Butler, Le Guin and Russ before any of the writers the title is about. The linear IA controls this by starting with Zhang Xiaofeng; the wall cannot, short of a default filter that hides the anchors.
- **Nine stub cards contradict the archive's current honesty.** The pathway cards exist precisely because there is no file; making stubs look like cards blurs "researched" and "named in passing" — the exact filing failure the bridges describe.
- **No "begin" affordance.** A search box is not an invitation; first-time visitors who do not pick a route chip get an index, and the analytics-free site has no way to learn that.
- **Two entity types and a route mode in a 540-line vanilla script** is the largest code change of the three, with the most surface for keyboard and `aria-live` regressions.

---

## Comparison

| | 1 · The Reading | 2 · The Floor | 3 · The Catalogue |
|---|---|---|---|
| Structure | Linear scroll, appendix | Hub (lobby + floor plan) with rooms and corridors | Data wall with three pinned routes |
| Archive is… | A layer behind the text; reached through file-marks and the end | A destination — one of seven rooms | The home; the story is a mode of it |
| First-person arc | Intact, enforced | Recommended, not enforced | Present only inside routes |
| Story → author link | Glass card on every case-name | Catalogue door per room + Room facet | Native: route steps are cards |
| Author → story link | "Appears in the reading" line | "Exhibited in Room n" line | "On routes 1, 2 · step k" |
| Empty rooms | Closing beat (best position) | A wing anyone can enter first | Drawer entities on the wall |
| Handles Phase-2 growth | Poorly (appendix list grows) | Adequately (new rooms) | Well (routes are data) |
| Reuses current build | ~95 % | ~70 % as single page, ~50 % multi-page | ~60 % |
| New illustration needed | None | Floor plan | Wall-over-art layout |
| Effort as drawn | ~1 day | 2–3 days | 2–2.5 days |
| Effort after cuts | ~1 day + slack | ~1.5 days | ~1.5 days |
| Biggest risk | Looks like polish, not IA | The "I" fragments; placeholders multiply | Demotes the vignettes; Anglophone wall first |
| Best when | Audience reads; you want the essay finished | Bridge variants are about to be written | Dataset expansion is the next milestone |

## Recommendation for the two-day window

**Build Variation 1, and borrow the one cheap idea from Variation 3.**

The site's argument, its finished illustration, its scroll mechanics and its accessibility work are all built around a single first-person route; the two-day budget is not enough to move that centre of gravity without leaving both halves half-done, and Variations 2 and 3 each need a new illustration or layout to look intentional. Variation 1 finishes the joint that is actually missing — story and archive currently touch in four places and never at the level of a writer — and it does so with components that already exist (the glass card, `?author=` deep links, the archive coda).

The borrowing: make the story ↔ archive link **data** rather than markup. An `appearsIn` map in `archive.js` (author file → section anchor + label) drives both the "Appears in the reading" line on cards and the file-marks in the bridges, and is the same structure Variation 3 would call a route step. When Phase 2 lands and the field-builders room or a bridge variant gets written, that map is already the seam to hang it on; if the site ever does move archive-first, the routes are half-populated.

Suggested split of the two days:

- **Day 1 morning** — `appearsIn` map (~25 rows), "Appears in" line on archive cards and dialog, extend `RELATED_PATHWAYS` to all nine un-filed writers.
- **Day 1 afternoon** — file-marks on the 16 filed case-names, reuse the postcard glass card as their popover, remove "Archive" from the chrome, retitle the coda as Appendix and add the "Files cited in this reading" list.
- **Day 2 morning** — keyboard, focus-return and reduced-motion pass on the new triggers; `?author=` round-trip that returns to the spread the reader left.
- **Day 2 afternoon** — one consistent treatment for the 11 placeholders and the four closing cases so the reading looks finished; if time remains, turn the Guide's six stops into a typographic floor plan (Variation 2's cut) — it costs an afternoon and gives the linear page a map without breaking its order.

What this defers, explicitly: the bridge variants, any new room, the drawn floor plan, route mode, drawer entities, and every Phase-2 data field. None of those are lost by choosing the linear IA; all of them are harder to add to a site whose story and archive still don't know about each other at the writer level.
