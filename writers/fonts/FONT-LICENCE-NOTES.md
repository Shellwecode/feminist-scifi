# Font licensing — status as of 11 Sep 2026

| Face | Files | Licence | Clear to ship? |
|---|---|---|---|
| Instrument Serif | `InstrumentSerif-{Regular,Italic}.woff2` | SIL OFL 1.1 | Yes |
| Cotham Sans | `CothamSans.woff2` | SIL OFL 1.1 | Yes |
| **Meta-old-French** | `Meta-old-French-ext.woff2` (our patched build) | **None granted** | **Unresolved** |

## Meta-old-French — what was checked

Source: <https://gitlab.com/Luuse/foundry/meta-old-french> (Luuse, a French libre-font practice).

Evidence it is *meant* to be free:

- Its direct parent is Luuse's own **Hershey-Old-French**, which **is** SIL OFL 1.1 —
  verified by fetching the LICENSE file at
  <https://gitlab.com/Luuse/Villa-Noailles/font-hershey-noailles/-/blob/master/LICENSE>.
  The Meta-old-French README states it is "une évolution et adaptation du dessin de la
  Hershey-Old-French créé par Luuse en 2018".
- It is published from Luuse's public `foundry` group and listed by libre-font
  catalogues (UNCUT.wtf, Velvetyne's Libre Friends) as free for personal and
  commercial use.
- The binary's OS/2 `fsType` is 0 — no technical embedding restriction.

Evidence it is *not actually licensed*:

- **No LICENSE, OFL.txt, COPYING or equivalent anywhere in the repository** — checked
  the full recursive tree (100 files) on both `master` and `main`.
- GitLab's own licence detection reports `license: null`.
- The font binary's `name` table has **no** licence description (ID 13) and **no**
  licence URL (ID 14). The only claim is `Copyright (c) 2019, antoine`.
- `fonts.luuse.io` is "under construction" and states no terms.
- Our build came from the repo's `fonts/work-in-progress/` directory.

## Why the parent being OFL does not settle it

OFL clause 5 requires *licensees* to keep modified versions under the OFL. It does not
bind the original copyright holder. Luuse authored both faces, so they are free to
release this derivative under any terms — or, as here, under none. No licence file
means no licence has been granted, and the default is ordinary copyright.

## Options

1. **Ask Luuse to add the file.** Almost certainly an oversight; it costs them two
   minutes and settles it permanently. Contact via <https://www.luuse.io>.
2. **Use the parent instead.** Hershey-Old-French is explicitly OFL 1.1 and is the
   drawing this face evolved from, so it is the closest visual relative available with
   clean terms today.
3. **Ship as-is and accept the risk.** For a non-commercial research site, crediting
   Luuse, using a font its author publishes publicly as free, the practical exposure is
   low and the remedy would be to take it down. That is a judgement call, not a licence.

## If it turns out to be OFL

Our patched `Meta-old-French-ext.woff2` (see `../tools/build-diacritics.py`, which adds
í, ō and Ō) is a Modified Version. It would then have to be distributed under the OFL
too, carry the licence text, and — if Luuse ever declares a Reserved Font Name — be
renamed. The `-ext` suffix already keeps it distinct from the original.

## Instrument Sans (added 2026-09-11)

Carries the body voice inside the author sheet (14/20 prose, 12/16 glosses).
This is the only font here whose licence is unambiguous.

- Licence: SIL Open Font License 1.1. Published by Instrument on Google Fonts;
  source at github.com/Instrument/instrument-sans. Licence text is in
  `OFL-InstrumentSans.txt`, taken from that repository.
- Files: `InstrumentSans-latin.woff2` (29.9 KB) and `InstrumentSans-latin-ext.woff2`
  (11.1 KB), fetched from fonts.gstatic.com and served locally, so the page still
  makes no third-party request. The `unicode-range` on each is Google's own.
- Variable, wght 400–700. Ō and the other macrons live in the `-ext` subset.
- Not preloaded. The sheet only exists after a click, so these are fetched then
  rather than blocking first paint.
