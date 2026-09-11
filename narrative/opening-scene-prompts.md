# Immersive opening — Midjourney prompt sheet
Mirror of Paper page "Immersive opening · scene setup", board 04. Written 2026-09-10.

## Style anchor — paste at the end of EVERY prompt
Replace [SREF] with the URL of the uploaded `images/open-1.png`. After P0, add the chosen style-test image as a second --sref and a --seed.

```
loose ink sketch lines with flat gouache washes, risograph grain, limited palette of mustard yellow, plaster cream, dusty blue-grey and dark ink, one warm lamp above and to the left as the only light source, cozy vintage picture-book illustration, quiet, editorial --style raw --stylize 120 --sref [SREF] --sw 250 --no text, letters, watermark, photograph, 3d render, glossy
```

The lamp sentence never changes (exceptions: P7 child room = "morning daylight from a window on the left"; Scene 1 sketch 5 wall = "the window is the only warm light"). Camera angle is stated per prompt. NOTE: the S0–S7 draft and P2/P3 (tall bookcase) are superseded by Shellie's storyboard; see "Scene 1 · per sketch" below.
Character consistency: `--oref [figure sheet] --ow 200` (v7) or `--cref` (v6.1).

## Order
P0 style test → P1 figure sheet → P2 room wide → P3 bookcase tall → P4 hero book → P6 page → P5 spines → P7 child room → P8 air → P9 foreground props.

## Prompts (body only; append the anchor)

P0 · STYLE TEST · 3 grids at --stylize 50 / 120 / 250, pick one
```
a quiet reading-room corner: a wooden bookcase, a desk with a small lamp, a chair with a coat over its back, bare floorboards, seen from a slightly elevated three-quarter view, no people --ar 16:10
```

P1 · FIGURE SHEET (S1, S2, S4)
```
character sheet of a young woman with short dark hair in an oversized muted rose sweater and dark trousers, five poses side by side: standing seen from behind, walking mid-step seen from behind, walking three-quarter back view, reaching up to a high shelf seen from behind, holding a book seen from behind, full body, flat plain cream background, no ground shadow --ar 3:2
```
Then each pose alone with --oref [sheet] --ow 200 at --ar 2:3.

P2 · PLATE A · ROOM WIDE, EMPTY (S1, S2, closing)
```
a large, mostly empty reading room seen from a slightly elevated three-quarter view: a very tall wooden bookcase on the right rising past the top of the frame with a few small red tabs on its shelves, a low desk with a warm lamp on the left, a round rug on bare floorboards, a wall of small pinned prints at the back, generous empty floor in the foreground, no people --ar 16:10
```
Usable if: bookcase leaves the top of frame; floor ≥ 40%; nothing important in top 15%.

P3 · PLATE B · BOOKCASE TALL (S3)
```
looking straight up a towering wooden bookcase from its base, shelves receding upward into warm haze, book spines losing detail toward the top, a few small red tabs on the lower shelves, no people --ar 2:5
```

P4 · HERO BOOK (S4, S5) — 《我在》 is set in CSS, never painted
```
a single worn paperback with a plain cream cover and a faded spine, held in a hand, close-up at a slight angle, blank cover with no title, soft thumb shadow --ar 4:3
```

P5 · SPINES × 8 (S5)
```
eight old book spines standing in a row on a wooden shelf, varying heights and thicknesses, muted cloth colours (dusty blue, mustard, plaster, brick, grey-green), no lettering, straight-on view, even spacing --ar 3:1
```

P6 · PAGE PLATE (S6)
```
an open book filling the entire frame, blank cream pages with visible paper grain, a gentle curl at the gutter, a soft shadow of the reader's thumb at the bottom edge, no text on the pages --ar 16:10
```

P7 · PLATE A · CHILD (S7 → V1) — use PLATE A as an extra --sref
```
the same reading room seen from the same slightly elevated three-quarter view, but a child's version: a low bookcase a child could reach on the right, a bean bag, a round rug printed with the solar system, a small guitar leaning on the wall, morning daylight from a window on the left, no people --ar 16:10
```

P8 · AIR (every shot, screen-blended)
```
sparse floating dust motes and two soft diagonal light rays on a solid black background, fine film grain, nothing else --ar 16:10 --stylize 30
```

P9 · FOREGROUND PROPS (L4)
```
the back of a wooden chair and a potted monstera in a clay pot, side by side, isolated on a flat plain cream background, no ground shadow, seen from slightly above --ar 3:2
```

## Sizes for the build
Plates 2880×1800 (+15% overscan). Bookcase tall 1440×3600. Figure poses 900×1400 PNG alpha. Spines 8 × 300×1200. Air: 10s WebM alpha or 6-frame PNG cycle. Opening budget < 6 MB.


## Scene 1 · per sketch (from the "storyboard" frame, 2026-09-10) — mirror of Paper board 06

Constants (verbatim in every prompt they belong to):
- Narrator, now: a young woman with a chin-length dark bob, oversized muted rose sweater, dark trousers, face simplified to two dots and a small mouth
- Child, small me: a girl about eight with the same chin-length dark bob and straight bangs, white t-shirt, dark shorts, barefoot, face simplified to two dots
- Zhang Xiaofeng, 1968: a young woman in her twenties with short dark hair and bangs, pale cardigan over a blouse; square-grid manuscript paper, fountain pen, conical pendant lamp. A character, not a likeness — no photo refs.
- Figures: "flat plain cream background, no ground shadow". Plates: "no people". Append the anchor to everything.
- Order: sketch 4 pose A first (anchors B, C and the pencil child via --oref), then plates.

### Sketch 1 · me reading in my room (wide, frontal 3/4) — master plate
Plate 16:10:
```
a cozy reading corner seen from a slightly elevated three-quarter view: a tall arched floor lamp with a wide shade on the left, a round bean bag on a big round rug in the centre, a low wooden bookcase and desk behind it with a few books standing on top, a wall of small pinned prints and postcards above the desk, a large monstera in a clay pot on the right, bare floorboards, empty floor in the foreground, no people --ar 16:10
```
Figure A 4:5:
```
a young woman with a chin-length dark bob in an oversized muted rose sweater and dark trousers, sitting cross-legged on a bean bag with an open book in her lap, reading, calm, three-quarter view facing slightly left, face simplified to two dots and a small mouth, full body, flat plain cream background, no ground shadow --ar 4:5
```
Figure B 4:5 (--oref A):
```
the same young woman standing at a low wooden bookcase, reaching to pull one book from the shelf, three-quarter view, full body, flat plain cream background, no ground shadow --ar 4:5
```
Foreground: P9. Transition to 2 = match-cut through the book cover (push in until the cover fills the frame, cover opens into the top-down view).

### Sketch 2 · top-down, me reading an open book (three layers)
Background 16:10:
```
looking straight down at a round woven rug and the crossed knees of someone sitting in dark trousers, soft focus, no book, no hands, no people visible above the knees --ar 16:10
```
Book + hands 16:10:
```
looking straight down at an open paperback held by two hands gripping its outer edges, blank cream pages with faint horizontal guide lines, a slight curl at the gutter, sleeves of a muted rose sweater at the wrists, isolated on a flat plain cream background --ar 16:10
```
Hair 16:10:
```
a fall of straight dark hair entering from the left edge of the frame, seen from above and behind, slightly out of focus, nothing else, isolated on a flat plain cream background --ar 16:10
```
Text on the page is HTML (grey rules → ink as the camera closes).

### Sketch 3 · frame within a frame (the hinge)
Page: reuse P6. Pencil child 4:5 (--oref sketch 4 pose A):
```
a small pencil sketch of a girl with a chin-length bob and straight bangs sitting cross-legged in profile facing left, holding an open book up in both hands, one line weight, unfinished, no colour, drawn on cream paper with visible grain, nothing else on the page --ar 4:5 --stylize 40
```
Profile 4:5:
```
profile of a young woman with a chin-length dark bob looking down, face simplified to a single line and one dot, from the shoulder up, facing right, isolated on a flat plain cream background, no ground shadow --ar 4:5
```
Transition to 4 = pencil child crossfades into gouache child (same pose/size/position); page grain stays as ground.

### Sketch 4 · child (small me) reading
Pose A 4:5 (generate first):
```
a girl about eight years old with a chin-length dark bob and straight bangs, in a white t-shirt and dark shorts, barefoot, sitting cross-legged on the floor in profile facing left, holding an open book up in both hands, reading, face simplified to two dots, full body, flat plain cream background, no ground shadow --ar 4:5
```
Pose B rising / Pose C walking (--oref A --ow 200):
```
the same girl getting up from the floor, one knee still down, the closed book tucked under one arm, profile facing right, full body, flat plain cream background, no ground shadow --ar 4:5
```
```
the same girl walking to the right in profile, holding a closed book against her chest with both arms, mid-step, full body, flat plain cream background, no ground shadow --ar 4:5
```
Transition to 5 = A→B→C cross-faded on scroll; the camera pans right with her (the site's only pan).

### Sketch 5 · child walks to a house with a window
Wall plate 16:10 (swap the anchor's lamp line for "the window is the only warm light"):
```
the side of a simple single-storey house at dusk seen straight on from the path outside, a plain plaster wall, a low tiled roofline, one square window right of centre glowing warm from inside, the window empty and clear with a thin wooden frame, a bare path in the foreground, the window is the only warm light, no people --ar 16:10
```
Sky 16:10 (optional far layer):
```
a dusk sky in dusty blue-grey with a few faint stars over a low dark tree line, flat, no buildings, no people --ar 16:10 --stylize 60
```
Child = pose C at 1/6 frame. The window is a MASK: sketch 6's plate sits behind it; zooming into the window is the same dolly.

### Sketch 6 · Zhang Xiaofeng writing under her lamp
Desk plate 16:10:
```
a writer's desk in 1960s Taiwan seen straight on from across the desk: a plain wooden desk with a stack of square-grid manuscript paper, a fountain pen, a cup of tea, a conical enamel pendant lamp hanging above at the upper left, a dark window behind, an empty wooden chair, no people --ar 16:10
```
Figure 4:5:
```
a young woman in her twenties with short dark hair and bangs, in a pale cardigan over a blouse, 1960s, seated writing with a fountain pen on square-grid manuscript paper, head bowed, face simplified to two dots and a small mouth, seen straight on from across the desk, upper body with hands and paper, flat plain cream background, no ground shadow --ar 4:5
```
Into V1: hold; the caption becomes the vignette's first line; the manuscript page is where the prose sets.
