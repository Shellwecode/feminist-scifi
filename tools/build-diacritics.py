#!/usr/bin/env python3
"""Add í, ō and Ō to Meta-old-French.

The face ships 141 codepoints and carries no combining marks, so Chrome was
splitting these three characters across two fonts and landing the accent by the
fallback's metrics — "Daína" rendered with a detached acute, "Ōhara" with a
macron clipped off the top of the line box.

Every new glyph is assembled from outlines already in the font (the standalone
acute, the hyphen used as a macron bar), translated only, never scaled, so the
stroke weight is the face's own. Placement follows the font's existing habit:
the acute in "aacute" sits 30 units above the x-height, the acute in "Aacute"
10 units above the cap height, and caps reuse the lowercase accent at the same
size rather than a widened one.

Writes Meta-old-French-ext.otf; the original file is not modified.

NOTE: the upstream repo for this typeface ships no licence file. This patch is
fine for local evaluation. Clear the licence with the foundry before the site
ships with either the original or this derivative.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

import os
_HERE = os.path.join(os.path.dirname(__file__), '..', 'fonts')
SRC = os.path.join(_HERE, 'Meta-old-French.otf')
OUT = os.path.join(_HERE, 'Meta-old-French-ext.otf')  # convert to .woff2 after building

X_HEIGHT, CAP_HEIGHT = 429, 629
ACCENT_OVER_XHEIGHT, ACCENT_OVER_CAP = 30, 10   # copied from aacute / Aacute


def split_contours(pen_value):
    """Group a RecordingPen's ops into one list per contour."""
    out, cur = [], []
    for op, args in pen_value:
        if op == 'moveTo' and cur:
            out.append(cur)
            cur = []
        cur.append((op, args))
    if cur:
        out.append(cur)
    return out


def bbox(contour):
    pts = [p for _, args in contour for p in args]
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def main():
    font = TTFont(SRC)
    glyphs = font.getGlyphSet()

    def contours_of(name):
        rp = RecordingPen()
        glyphs[name].draw(rp)
        return split_contours(rp.value)

    def draw(contour, pen, dx=0, dy=0):
        target = TransformPen(pen, Transform().translate(dx, dy)) if (dx or dy) else pen
        for op, args in contour:
            getattr(target, op)(*args)

    acute = contours_of('acute')[0]
    macron = contours_of('hyphen')[0]          # a horizontal stroke of the right weight
    ax0, ay0, ax1, _ = bbox(acute)
    mx0, my0, mx1, _ = bbox(macron)
    acute_cx, macron_cx = (ax0 + ax1) / 2, (mx0 + mx1) / 2

    def centre_of(name, skip=()):
        cs = [c for i, c in enumerate(contours_of(name)) if i not in skip]
        x0 = min(bbox(c)[0] for c in cs)
        x1 = max(bbox(c)[2] for c in cs)
        return (x0 + x1) / 2

    plans = []

    # í — the stem of "i" without its tittle (the accent replaces the dot),
    # plus the acute centred on the stem. Contour 0 is a 1x3-unit stray.
    i_contours = contours_of('i')
    stem = [c for c in i_contours if bbox(c)[3] < 500 and (bbox(c)[2] - bbox(c)[0]) > 10]
    stem_cx = sum((bbox(c)[0] + bbox(c)[2]) / 2 for c in stem) / len(stem)
    plans.append(dict(
        name='iacute', char='í', advance=font['hmtx']['i'][0],
        base=stem,
        accent=(acute, stem_cx - acute_cx, (X_HEIGHT + ACCENT_OVER_XHEIGHT) - ay0),
    ))

    # ō / Ō — the hyphen raised into a macron over the bowl.
    for name, char, base_glyph, top, lift in (
        ('omacron', 'ō', 'o', X_HEIGHT, ACCENT_OVER_XHEIGHT),
        ('Omacron', 'Ō', 'O', CAP_HEIGHT, ACCENT_OVER_CAP),
    ):
        plans.append(dict(
            name=name, char=char, advance=font['hmtx'][base_glyph][0],
            base=contours_of(base_glyph),
            accent=(macron, centre_of(base_glyph) - macron_cx, (top + lift) - my0),
        ))

    cff = font['CFF '].cff
    top_dict = cff[cff.fontNames[0]]
    charstrings = top_dict.CharStrings

    for plan in plans:
        pen = T2CharStringPen(plan['advance'], None)
        for contour in plan['base']:
            draw(contour, pen)
        accent, dx, dy = plan['accent']
        draw(accent, pen, dx, dy)
        cs = pen.getCharString(private=top_dict.Private)

        name = plan['name']
        # CharStrings.__setitem__ only replaces an existing glyph; a new one has
        # to be appended to the index and then named.
        if getattr(charstrings, 'charStringsAreIndexed', False):
            charstrings.charStringsIndex.append(cs)
            charstrings.charStrings[name] = len(charstrings.charStringsIndex) - 1
        else:
            charstrings.charStrings[name] = cs
        if name not in top_dict.charset:
            top_dict.charset.append(name)
        font['hmtx'].metrics[name] = (plan['advance'], min(bbox(c)[0] for c in plan['base']))

    # The CFF charset is the authoritative order; deriving it from anything else
    # left maxp one ahead of the charset and the saved file failed to reopen.
    order = list(top_dict.charset)
    font.setGlyphOrder(order)
    font['maxp'].numGlyphs = len(order)
    assert len(font['hmtx'].metrics) == len(order), (len(font['hmtx'].metrics), len(order))
    for table in font['cmap'].tables:
        if table.isUnicode():
            for plan in plans:
                table.cmap[ord(plan['char'])] = plan['name']

    font.save(OUT)
    print(f"wrote {OUT} — added " + ", ".join(f"{p['char']} ({p['name']})" for p in plans))


if __name__ == '__main__':
    main()
