# The Untold Stories
### A narrative museum of women's science fiction beyond the Anglophone canon

**Case study** · Research → dataset → narrative design → interactive site
**Repo:** [github.com/Shellwecode/feminist-scifi](https://github.com/Shellwecode/feminist-scifi)

---

## At a glance

| | |
|---|---|
| **What** | A research-driven interactive web experience — part personal essay, part archive — about women science fiction writers across ten regions and two centuries, and about the systems (translation, classification, prizes, publishing) that decided which of them Anglophone readers ever heard of |
| **Deliverables** | 76-author research dataset · 10 source-language reconnaissance memos · cross-recon synthesis · narrative spec · scroll-driven storybook website |
| **Method** | Source-language-first research (15+ languages) · strict documented-evidence rules · iterative narrative + visual design |
| **Stack** | Vanilla HTML/CSS/JS, no framework — scroll-driven storybook layout, CSS custom-property design system, Google Fonts multilingual pipeline |

---

## Why I started

I was eight when I first read 张晓风 (Zhang Xiaofeng). 《我在》 was the piece that opened my world — an essay built on a single character, 在, *being here, present*. The school curriculum filed her as a 散文家, an essayist. So did every anthology I ever pulled off a shelf.

Decades later I learned she also wrote 《潘渡娜》 — *Pandora* — in 1968. It is now recognised in Taiwanese SF circles as the first piece of Chinese-language science fiction. A year before Le Guin's *The Left Hand of Darkness*. Two men who published their first SF stories that same year became 鼻祖 — founding fathers — of Taiwan SF. The third writer was filed as an essayist and stayed there for fifty years.

In college I took a Weird Fiction class and read Xia Jia's 《百鬼夜行街》 for the first time — in Ken Liu's English translation, before I ever read it in Chinese. I met the translator before I met the author, even though all three of us move between Chinese and English. When I later read the Chinese original, it read like a different text: more poetic, closer to fantasy, pulling me toward 《红楼梦》 rather than toward robots.

Xia Jia calls her own work "porridge SF" — a name she had to invent because the existing categories didn't fit. Little me, reading in Chinese, would have called her work 玄幻 (fantasy), not 科幻 (SF). The genre line had been drawn before I knew to look for it.

I made this project for my own curiosity: I wanted to read more of the feminist science fiction I'd been missing, across decades and languages — and to understand *why* I'd been missing it.

## The questions I was asking

1. **Who wrote science fiction that I never got to read — and why not?** Was the work absent, untranslated, or filed under a different label?
2. **Who draws the genre line, and who gets filed by it?** Why does a man writing speculative fiction at scale get read as 科幻 while a woman writing the same gets read as 玄幻 or 言情?
3. **Whose hand is on the gate?** How much of what I think a translated story *is about* comes from the author, and how much from the translator? What happens to a whole tradition when its English existence depends on one translator's career?
4. **What does an honest map of absence look like?** If a region seems empty, is that history, a sourcing blind spot, or the classification system doing the excluding?

---

## Phase 1 — Building the dataset (76 authors, 7 regions)

I researched and wrote per-author files across seven regions: Anglophone (29), East Asian (12), African + diaspora (9), Latin American (8), European non-English (8), South Asian (5), MENA + other (5).

### Research decisions I made — and why

**Anchor the Anglophone canon deliberately, then stop.** 38% of the dataset is Anglophone — a conscious trade-off. Excluding core anchors (Le Guin, Russ, Butler, Tiptree) would have broken the influence graph everything else connects to. But I capped the region and recorded every "considered and rejected" name rather than silently expanding.

**Strict influence-edge rule: documented statements only.** An influence edge (X influenced Y) required a citable interview, letter, acknowledgement, or scholarly source. Where I was confident but couldn't point to a source, I omitted the edge. This under-counts real influence — interviewers systematically don't ask women about women — but it produces a graph that is smaller than reality and *safe to visualise*. I logged the under-counting as a known limitation instead of papering over it.

**Include cross-media artists where prose markets are thin.** Wanuri Kahiu (film), Sophia Al-Maria (video/essay), Larissa Sansour (film/installation) are not prose-SF writers. I included them anyway, flagged in-file, because in MENA and parts of Africa the living speculative imagination is in film and installation — a pure-prose dataset would over-represent Anglophone publishing conventions and misrepresent where the work actually happens.

**Record the exclusions.** Every region's file lists who was considered and rejected, with reasons: fantasy-primary, space constraints, moral concerns (Marion Zimmer Bradley), or the dataset's own framing (non-binary writers like Akwaeke Emezi and Rivers Solomon, excluded on pronoun-accuracy grounds under a "women writers" brief — an exclusion I flagged as an editorial judgment the project would need to revisit, not a settled fact).

**Keep an honest gaps file.** `gaps.md` is a first-class deliverable, not a bug list: pre-2000 Brazilian women's SF, MENA pre-2010, the ninety-year South Asian gap between Rokeya Hossain (1905) and Manjula Padmanabhan (1997), Korean SF before Djuna (1992), translation-metadata holes, and the framing exclusions above.

---

## Phase 2 — Source-language reconnaissance (10 regions)

Phase 1 was built substantially from English-language sources — and I could feel the bias baked in. So I ran a second research pass with an inverted methodology: **source-language venues first, English only as confirmation**, across ten regions — China (PRC + Taiwan + HK), Japan, Korea, Brazil, Spanish-language Latin America, South Asia (six linguistic traditions), MENA (Arabic/Hebrew/Persian/Turkish), Africa + diaspora, European non-English, and Indigenous traditions worldwide.

### The single most important finding

**~30–40% of the names I'd inherited from English-language summaries were wrong.** Sonia Sant'Anna doesn't write SF. "Nora Naji, Maghrebi SF writer" doesn't exist — the actual Algerian anchor is Safia Ketou. The Mouján Otaño censorship I'd attributed to the Argentine military was actually Spain's Franco-era Tribunal de Orden Público. The claim that Chinese women's novel-length SF is "sparse" is empirically wrong in Chinese — the gap is the *translation pipeline*, not the writing. This error rate became a policy: **no author enters the dataset without confirmation from at least one source-language venue.**

### Structural patterns the recons surfaced

- **The canon-formation event.** In 6 of 10 regions, a single identifiable event — usually a women-edited anthology — marks the moment a tradition becomes visible to itself: *Walking the Clouds* (Indigenous, 2012), *Universo Desconstruído* (Brazil, 2013), 《她：中国女性科幻作家经典作品集》 (China, 2023), *Pramila Kalome Kalpabigyan* (Bangladesh, 2023). Japan did the same work twenty years earlier through critical infrastructure (小谷真理's 1994 *Techno-Gynesis*, the ジェンダーSF研究会, the Sense of Gender Award). Spanish-language Latin America has **no such event** — and the absence is itself a finding.
- **The foundational woman, filed elsewhere.** 8 of 10 regions have a woman at or near the tradition's founding point who was catalogued as "literary," "essayist," or "poet" and missed by genre history: Karin Boye (*Kallocain*, 1940 — nine years before Orwell), Dinah Silveira de Queiroz (1960), 張曉風 (1968), Magdalena Mouján Otaño (1968), Buchi Emecheta (1983). The 张晓风 pattern that started this project turned out to be *the* pattern.
- **Writing gap ≠ translation gap.** Six regions have rich source-language traditions that simply never reached English. Treating "scarce in English" as "scarce" had been quietly distorting the whole dataset.
- **Gendered genre-policing.** On 晋江 (China), women's speculative writing at massive scale is classified as 言情/仙侠/玄幻 — almost never 科幻 — and excluded from the SF canon by definition. Korea's platform split (로판/BL vs SF) mirrors it. Even prestige publishing does it: Bazterrica's *Cadáver Exquisito* is *ciencia ficción* in Argentina and "horror" in the US.
- **Prize asymmetry.** Germany's Kurd Laßwitz best-novel award: **one woman laureate in 45 years.** Maria Galina debuted in 1997 under a male pseudonym to enter Russian SF at all. Recognition skews harder against women than publication does.

The recons also identified ~115 verified Tier-1 candidates for a future 2–3× expansion of the dataset.

---

## Phase 3 — Narrative design: what does the data want to say?

Before building anything, I wrote a synthesis pass over all 76 files + recons and pressure-tested five candidate structures for the "museum": chronological halls, regional rooms, translation-pipeline-as-architecture, thematic zones, and reception-status zones (walking the visitor from the familiar canon outward into progressively less-visible territory, ending at deliberately empty rooms).

### Where the data pushed back — and I revised the story

- **"Feminist SF was always a global conversation" is not supported.** The honest claim: it was a globally *scattered* set of solitary efforts that became a self-aware Anglo-American conversation in the 1970s, and only became visibly global to English readers in the 2010s–20s. I committed to the honest version.
- **"The translation lag is closing" is conditional.** It's closing because 8–10 named translators (Ken Liu, Anton Hur, Megan McDowell, Stephen Snyder…) chose to invest years in specific authors. The site's closing line became: *more is possible, if the conditions hold* — not "more is coming."
- **Four kinds of emptiness, not one.** Historical absence (pre-1980 PRC; Hong Kong genre-SF), sourcing blind spots (South Asia 1905–1997), classificatory exclusion (晋江; Dinah canonised as literary and therefore never as SF), and undocumented influence. The closing section of the site gives each absence its own empty display case, labelled.
- **The most under-told story is the field-builders.** Editors, prize-founders, magazine-runners, translators — 杨潇, 杨枫, 姬少亭, 程婧波, Chinelo Onwualu, Sheree Renée Thomas. The "writer" file flattens the labour that built the venues. They got their own room.

### The final structure

A first-person scroll narrative, not an encyclopedia:

- **Opening** — an illustrated study: a reader at a desk, a wall of postcards. Each postcard is a discoverable author.
- **V1 · 张晓风 · 1968** — my childhood reading; the essayist who wrote the first Chinese-language SF story. *Was the genre invisible to her, or was she invisible to the genre?*
- **Bridge A · Stories filed elsewhere** — five modes of mis-filing across eight regions (already-canonised-as-something-else, pseudonym held, prize-without-genre, state suppression, venue-policing).
- **V2 · 夏笳 / Ken Liu · 2012** — meeting the translator before the author. *How much of what I thought the story was about came from her, and how much from his hand?*
- **Bridge B · Whose hand?** — four modes of gatekeeping: translator-builds-tradition, author-as-translator, editor-as-gateway, publisher-as-gateway.
- **V3 · Porridge SF** — the genre line itself. *Who draws it, and who gets filed by it?*
- **Closing · Absence as answer** — four rooms not yet built (Hong Kong, 晋江, the field-builders, the next decade), with the labels already written, so the visitor knows they are missing.

---

## Phase 4 — Building the site

Three build iterations, each a full working site:

- **v0** — a "narrative museum": opening, three vignettes, closing. Proved the structure; felt like walking past wall text.
- **v1** — storybook vignettes: vertical scroll drives horizontal page-turns inside each vignette (sticky viewport + scroll-mapped `translate3d`); bridges became dense filing-card scrolls with sticky mode-headers — deliberately different in texture from the storybook pages, because the bridges *are* the filing system the vignettes are about.
- **Doodle-style opening** — a hand-drawn illustrated study replaces abstract layout: background art with a wall of postcards, language-cycling title, hotspot popovers per author, peel-away video transition when the visitor first scrolls.

Everything is vanilla HTML/CSS/JS. Accessibility carried through: full keyboard navigation between spreads, `prefers-reduced-motion` fallbacks for every animation, visually-hidden hotspot labels, `lang`-attributed multilingual text.

## Phase 5 — Design system

The visual system went through deliberate, user-tested iterations:

**Typography — one literary voice across five scripts.** Libre Caslon Text (body) / Libre Caslon Display (titles) for Latin; Noto Serif TC, SC, JP, KR for CJK; Public Sans for museum-label UI; per-`[lang]` CSS stacks so Traditional Chinese, Simplified Chinese, Japanese, and Korean each render in their own glyph tradition instead of whichever CJK font loads first. The cycling title ("The Untold Stories" → 未被讲述的故事 → 語られざる物語 → 들려지지 않은 이야기들 → …) is the design system's thesis statement: every language gets set in its own face.

**Color — Flexoki.** After sampling it against the original warm-sepia palette on a single section, I committed to Steph Ango's Flexoki light-mode neutrals: paper `#FFFCF0`, ink `#100F0F`, a disciplined base scale, and Flexoki yellow `#D0A215` as the single warm accent (hotspot glows, case-file annotations).

**Motion — attention as depth-of-field.** A scroll-progress variable drives the opening: image, overlay, title and subtext recede (fade + soft blur) as the visitor scrolls into V1 — the moment you're leaving falls out of focus as you enter the next. The title and subtext ride up briefly, then stick, moving 1:1 with the scroll until the section's edge clips them. Transition experiments taught me the quiet solution wins: after testing white gradient washes and mask fades between the opening and V1, the final treatment is a subtle darkening of the scene's own existing tones — no new color introduced at the seam.

**Postcard interactions — glass on lamplight.** Hotspots glow with per-card lamp-falloff (radial gradients scaled by distance-to-lamp, with breathing animations on individual phase offsets, dust motes on the three cards nearest the light). Hovering reveals a frosted-glass name card (backdrop blur, translucent paper, hairline border); clicking opens a larger glass card with the author's story.

---

## What I learned

1. **The bias is in the sources, not just the canon.** Building from English-language references reproduces the exact exclusions the project set out to document. The 30–40% error rate on inherited names is the strongest argument I have for source-language-first methodology — and it only became visible because Phase 1's assumptions were written down explicitly enough to falsify.
2. **Record what you reject.** The "considered and rejected" lists and `gaps.md` turned out to be the most intellectually valuable files in the repo. The dataset's edges — who's excluded, and by what rule — carry as much of the argument as its contents.
3. **Let the data revise the thesis.** The romantic version ("a global conversation the canon couldn't hear") didn't survive contact with the evidence. The honest version — scattered solitaries, an Anglo-American crystallization, a conditional and fragile translation surge — is a better story *because* it's true.
4. **Absence needs typology.** "Missing" is four different phenomena with four different implications. Designing empty rooms with labels was more honest — and more affecting — than filling them with weak evidence.
5. **In design, the quiet solution usually wins.** Nearly every visual iteration moved from more (washes, outlines, glows, big titles) to less (existing tones deepened, a hairline border, a smaller title in the corner).

## What's next

- **Phase-2 dataset expansion**: ~115 source-language-verified Tier-1 candidates across ten regions (a 2–3× expansion), with new data fields the recons demanded — `primary_medium`, `prize_history`, primary + secondary region, documented vs plausible influence edges, writing-gap vs translation-gap states.
- **Revisit the framing exclusion**: extend the Tidbeck precedent (non-binary inclusion with in-file flag) to the seven flagged 2SQ and non-binary writers whose work is central to the feminist-SF conversation.
- **Finish the rooms**: replace placeholder illustrations in V1–V3 and the closing cases; build out the field-builders room.
- **Verify the load-bearing edge**: 钱莉芳's *《天意》* (2004) → Liu Cixin's *《三体》* — if the verbatim source confirms, a woman's novel is the acknowledged precedent for the most famous work in Chinese SF.
