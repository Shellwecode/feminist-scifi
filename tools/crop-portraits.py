#!/usr/bin/env python3
"""Crop the name caption off the author portraits and file them by manifest stem.

Source images (~/Downloads/authors/*.png) are a halftone portrait, a fully
transparent gap, then the writer's name in small type. The portrait is the only
dense block of rows in the alpha channel — the caption never approaches the
density of the halftone — so taking the dense block and its own column extent
drops the caption without needing a fixed pixel offset, which matters because
every image has different dimensions.

Each crop is then flattened onto its own corner colour and quantised to 128
colours. The artwork is duotone, so this is visually identical and cut the set
from 3.25 MB to 1.23 MB.

Output filenames are the author's manifest stem, which is what lets
media-between-text.js derive the path instead of hand-maintaining a map.
"""
from PIL import Image
import numpy as np, json, os, glob, subprocess, sys, unicodedata

# Pass a source folder as the first argument; defaults to the first batch.
SRC = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '~/Downloads/authors')
OUT = os.path.join(os.path.dirname(__file__), '..', 'media')
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')


def name_to_stem():
    js = ("const w={};global.window=w;require('./proto/archive-data.js');"
          "const m={};w.ARCHIVE_DATA.AUTHORS.forEach(a=>m[a.name]=a.file.replace(/\\.md$/,''));"
          "process.stdout.write(JSON.stringify(m));")
    raw = json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))
    # macOS writes filenames decomposed (NFD) while the manifest holds them
    # composed, so "Ogawa Yōko" would never match on a raw string compare.
    return {unicodedata.normalize('NFC', k): v for k, v in raw.items()}


def portrait_box(im):
    a = np.array(im)[:, :, 3]
    rows = np.where((a > 8).mean(axis=1) > 0.35)[0]
    top, bot = int(rows.min()), int(rows.max())
    cols = np.where((a[top:bot + 1] > 8).mean(axis=0) > 0.35)[0]
    return int(cols.min()), top, int(cols.max()) + 1, bot + 1


def main():
    stems, missing = name_to_stem(), []
    for path in sorted(glob.glob(os.path.join(SRC, '*.png'))):
        name = unicodedata.normalize('NFC', os.path.splitext(os.path.basename(path))[0])
        stem = stems.get(name)
        if not stem:
            missing.append(name)
            continue
        im = Image.open(path).convert('RGBA')
        crop = im.crop(portrait_box(im))
        flat = Image.new('RGB', crop.size, tuple(int(v) for v in np.array(crop)[0, 0, :3]))
        flat.paste(crop, mask=crop.split()[3])
        flat.quantize(colors=128, dither=Image.NONE).save(
            os.path.join(OUT, stem + '.png'), optimize=True)
        print(f"  {name:38} → {stem}.png")
    if missing:
        print("\nNo manifest match (filename must equal the author's name):", missing)


if __name__ == '__main__':
    main()
