# /writers — design decisions

## The author sheet (2026-09-11)

Clicking a writer used to download their `.md` file. It now opens that file,
typeset, in a modal sheet, and the download is one action in the sheet's footer.

**Direction: a centred sheet over a dimmed index.** Designed in Paper,
"Archive Page UI" → "Modal · pop-up sheet (improved)". Every value in
`writers-modal.css` is lifted from that frame's computed styles.

- 784px wide, 8px radius, hairlines at the rule colour's low alpha
- header carries the portrait at 75×71, the name, and the years, nothing else
- 148px label lane, labels at 12px Cotham Sans
- body prose in Instrument Sans 14/20; work titles in Instrument Serif italic
  20/24, with the form line in serif 16/22 and the gloss in sans 12/16
- footer: filename, hairline, download

**Rejected: a margin reading column.** The right filter margin widened into a
reading column, index still live beside it, searchable while reading. It lost on
one number: it narrows the index to about 630px, so the long names wrap, and
below 900px it has to become a sheet from the right anyway — two layouts to
maintain for a reading mode that the sheet already serves. Worth revisiting if
the index ever grows a compare-two-writers need.

**Sections.** The Paper frame shows four: brief bio, writing language,
monumental work, themes. Those four lead, in that order. The file's remaining
six follow in file order in the same treatment, rather than being dropped.

## Non-Latin scripts (2026-09-11)

Thirty-six of the seventy-six writers carry non-Latin text across seven scripts.
All five loaded faces are Latin-only, so every one of those runs was falling
through to a per-machine fallback, wearing whatever style its surrounding run
asked for. Hebrew was rendering in a synthetic italic. The space vanished at
every right-to-left boundary. Kana measured 21% taller than the Latin beside it.

**Approach: segment by script, not by field.** Parsing the work title into
native/romanisation/English fields was tried first and rejected — across 280
work entries there are twelve distinct title shapes, and the native title comes
first in some and second in others. Script segmentation does not care about order.

Each non-Latin run now carries its own `lang`, a font stack chosen in the serif
register, `font-style: normal` (none of these scripts has an italic), and
`unicode-bidi: isolate` so it stops reordering its neighbours. Optical sizes were
measured against Instrument Serif's 14.4px cap-height at 20px.

Cyrillic is deliberately untreated: it falls through to Georgia, which has a real
Cyrillic italic, so it belongs in the italic run with the Latin.
