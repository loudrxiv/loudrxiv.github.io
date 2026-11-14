# The yard

An animated 16-bit yard is drawn on one `<canvas>` fixed behind every page. Each section of text sits on a pixel-art cloud, all text is set in one typeface, and a man keeps the yard on the visitor's clock. It is static files only: no server, library, network request, cookie or storage. `yard: false` under `params` in `hugo.yaml` removes all of it.

Facts here were read from the code at release 1.7.0 (script 27,545 B minified, 12,155 B gzipped). When the code and this page disagree, the code is right.

## Files

| File | Job |
|---|---|
| `assets/js/world.js` | The engine: scenery, ambient motion, clouds, the man. One classic script, no imports. |
| `assets/css/extended/world.css` | The canvas layer, and the cloud colours and spacing. The theme bundles it automatically. |
| `assets/css/extended/type.css` | The type tokens and the Bitter `@font-face`. |
| `static/fonts/bitter-latin.woff2` | Bitter, a variable font (weights 100 to 900) in one file. The italic file sits beside it. |
| `static/fonts/OFL-Bitter.txt` | The font's licence (SIL Open Font License 1.1). |
| `layouts/_partials/extend_head.html` | Loads the fingerprinted script and preloads the font. It overrides the theme's empty hook. |
| `hugo.yaml` | The `yard` switch, and `disableThemeToggle` (dark theme only). |

`themes/PaperMod` is never edited.

## How it draws

- Each art pixel is one entry in an indexed framebuffer (`fb`). Once per frame a palette lookup (`lut`) turns it into RGBA, an offscreen canvas holds it, and it is scaled up by a whole number with `image-rendering:pixelated` (in `world.css`).
- One art pixel is 2, 3 or 4 CSS pixels (viewport under 1280, under 1700, wider), times the device pixel ratio, rounded to whole device pixels. `layout()` publishes the CSS size of an art pixel as `--w-u` on the root; cloud spacing is a multiple of it.
- The loop runs at about 10 frames a second (`ui.fps`). It always runs, and rests only while the tab is hidden (`visibilitychange`).
- `build()` draws the still scenery once per layout from a seeded generator (`mk`, seed 11): lawn, forest edge, the house on its terrace, the stone wall and steps, a fence with a gap, a lamp post, a mailbox, a cobble path, a bench, a flower bed, a big tree and a pond, scattered props on the free lawn, and a stream along the bottom. The bed and bench appear only when there is room.
- Wide layout (viewport at least 1024 px and at least 56 art pixels of margin left of the text column): house in the left margin, tree in the right. Otherwise both share the screen: the house on the left, the tree in a strip at the right.
- The scenery uses one random sequence. A new random draw inside `build()` reshuffles every prop, so new features use their own `mk` seeds.
- Colours: one dark palette (`PAL`) of SNES 15-bit values, five bits per channel.

Art rules the scenery was drawn to (standard pixel-art practice, from the original spike plan):

1. Ramps shift hue: shadows lean blue or violet, highlights lean cool, warmth only near lamps.
2. Shade in clusters of two pixels or more. Single pixels are deliberate glints.
3. No banding: ramp edges never run parallel to a silhouette at a fixed offset. Stone joints are staggered.
4. Contact shadows drop the lawn one ramp step (the `DARK` map), never to black.
5. Dither only for transparency and gradients (`BAYER`, a 4x4 ordered pattern): smoke, fading leaves, the dark top of the margins.
6. Whole art pixels only. Positions are floats and are rounded when drawn.

## Ambient motion

One wind curve (`wind()`, a slow sine plus random gusts) drives everything:

- Grass tufts lean in three frames; trees swap among three pre-sheared frames.
- Leaves spawn in the big tree's canopy, blow left, rest on the lawn and dither out. There are fewer on narrow layouts.
- Chimney smoke drifts with the wind; water is palette-cycled through four colours; the porch lantern flickers.
- Fireflies near the tree, and butterflies in the lawn.

## Clouds

`HOSTS` in `world.js` lists which elements sit on a cloud, in three kinds:

| Kind | Class | Elements |
|---|---|---|
| 0, section cloud | `w-k0` | `.profile_inner`, `.post-single`, `.post-entry`, `.page-header`, `#searchbox`, `.terms-tags`, `.not-found`, `.footer` |
| 1, small cloud on the yard | `w-k1` | `.logo`, `#menu a` |
| 2, small cloud on a cloud | `w-k2` | `.button` |

Every host gets the class `w-host` and a prepended `<canvas class="w-cloud">`, drawn from the element's own box plus puffs along its four edges, shaded toward the underside and outlined (`SK` holds the palettes). A `ResizeObserver` redraws a cloud when its text reflows and a `MutationObserver` adopts new elements, such as search results. To put another element on a cloud, add its selector to `HOSTS`.

`world.css` overrides the theme's colour variables on `.w-host` to dark navy on light, so text contrast comes from the cloud, not the theme. Body text is `#1b2b4b`, titles `#12203d`, secondary text `#34456a`. Against the six cloud fills the contrast ratios run from 15.57 (titles on white) down to 4.79 (secondary text on the darkest blue fill), all above the 4.5 minimum.

## Type

One family for every piece of text on a cloud: Bitter, a sturdy slab serif, self-hosted. Nothing on a cloud is lighter than weight 500 or smaller than 16 px. `type.css` defines the system once as tokens on `:root` (not on `.w-host`, because the script adds that class after parse, which would flash the system font):

- Face and code face: `--t-face`, `--t-mono`.
- Weights: `--t-w-body` 500, `--t-w-ui` 650, `--t-w-strong` 700, `--t-w-head` 700, `--t-w-display` 800.
- Sizes: `--t-s-small` (16 px), `--t-s-body` (17 px on phones, 18 px from 800 px), `--t-s-ui`, `--t-s-button`.

## The man

He lives in `world.js` and keeps a day on the visitor's local clock. The scene is a pure function of the wall-clock instant: `clock()` reads `Date.now()` each frame, `plan()` builds the day's plan from the local day number, and `pose()` places him at the current second. Nothing is stored and nothing is fetched, so every visitor sees the same scene at the same minute, a reload shows the right moment at once, and the details change from day to day.

| Time | What he does |
|---|---|
| 00:00 to 06:20 | Asleep indoors; windows dark, lamp post lit |
| 06:20 to 06:50 | Up indoors |
| 06:50 to 07:45 | Puts out the lamp, then the first chore (sweep the steps and path, or water), then breakfast |
| 07:45 to 08:40 | The second chore, then sits by the stream |
| 08:40 to 09:10 | Tea on the bench |
| 09:10 to 11:20 | The weekly slot (replant, move the pot, or clear the stream), then the bench |
| 11:20 to 12:30 | Checks the mailbox, lunch indoors |
| 12:30 to 14:45 | Midday rest on the bench: a letter on mail days, tea, a nap |
| 14:45 to 16:15 | Afternoon chore, then the bench |
| 16:15 to 17:45 | Waters again, then sits by the stream |
| 17:45 to 20:00 | Lights the lamp, tea on the bench |
| 20:00 to 22:30 | Indoors, windows lit |
| 22:30 to 24:00 | Asleep |

The times are the `DAY` table at the top of his code. He walks at `SPEED` (12 art pixels a second) along a fixed spine from the door down the steps and path to the stream bank, with short legs off it to each place he works, so he never crosses a prop or the fence.

- **Marks he leaves:** fallen leaves gather on the path until his broom passes (faster in autumn, via `fill()`), debris catches on the stepping stones until he clears it, and the lamp and the window glass (`glass()`) follow the clock.
- **Weekly changes, done on screen:** one weekday he replants the bed and the window boxes in that week's colours; another he moves the potted plant to its next place. The weekdays come from the week number.
- **No religion is built into his day,** and he is drawn as a Sa'idi (Upper Egyptian) man: white wrapped turban, warm brown skin, dark hair and moustache, a sand-coloured galabeya. All his colours are one object, `MAN`, at the top of the script.

## Changing things

| To change | Edit |
|---|---|
| His colours | `MAN` in `assets/js/world.js` |
| His day | the `DAY` table and the task lists inside `plan()` |
| How fast he walks | `SPEED` |
| Cloud colours | `SK` (palettes) and the `.w-host` variables in `assets/css/extended/world.css` |
| What sits on a cloud | `HOSTS` |
| Text weights and sizes | the tokens in `assets/css/extended/type.css` |
| Turn the yard off | `yard: false` in `hugo.yaml` |

To see another time of day, run `Date.now=()=>new Date('2026-11-14T14:00:00').getTime()` in the browser console. The man is recomputed from `Date.now()` every frame.

## Decisions

- **Dark theme only.** `disableThemeToggle` is true and the default theme is dark.
- **Canvas, not SVG.** Animated 16-bit scenery is per-frame drawing.
- **The yard always animates and ignores the OS reduced-motion setting** (owner's decision), so it does not meet WCAG 2.2.2 for visitors who asked for less motion. To restore the courtesy, make `want()` return false under `prefers-reduced-motion` and draw one frame. The old frozen-scene mode was removed as dead code in 1.7.0; `git log -S"still" -- assets/js/world.js` finds the commit that held it.
- **No network, no storage, no third-party code.** The font is self-hosted.
- **The man runs on the visitor's real clock, not a compressed day.** A 24-minute day would loop sleep, lamp and tea; the real clock makes rest and night mean something. Each chore is built from small visible steps, so a short visit still shows him moving.
- **One yard on every screen.** There is no phone-only layout and nothing depends on scroll position, so two visitors see the same scene at the same minute. The price is that he is often hidden behind clouds on phones (see Limits).
- **He walks a fixed spine, not a pathfinder.** The route runs door, steps, path, stream bank, with short legs to each place he works. The legs lie in ground the scenery reserves, so no random prop can block a route. The reservation grid says where nothing may be placed, not where walking is allowed, so general pathfinding would need a second map.

## Limits

- Clouds cover most of the yard on phones. Measured at 360 px wide in Chrome during the 1.6.0 work, his whole figure was in view for all of his outdoor time on search, tags and 404, for about 30 percent of it on the home page, the work list and `/info/`, and for almost none of it on `/about/` and long posts. Wide screens show him in the left margin, which no cloud covers.
- Not tested on a real phone, iOS Safari, Firefox or Windows display scaling above 100 percent.
- Southern-hemisphere visitors see northern-hemisphere leaf seasons.
- Not built: clicking him, chat, and a yard that grows with each visit. The plans for those are not in this repo yet.
