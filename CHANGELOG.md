# Changelog

## 1.4.0 (2026-11-13)
- The yard now fills every page, edge to edge, on phones too. The gray column and the phone strip are gone.
- Each section (profile, post, work card, search, footer) sits on a light pixel-art cloud with dark text. The logo, menu links and buttons are small clouds.
- The yard always animates. The pause button is gone and the OS reduced-motion setting is ignored; it only rests while the tab is hidden.

## 1.3.0 (2026-11-13)
- An animated 16-bit yard behind every page: grass, a house with cobble steps, trees, a pond and a stream, all moving in one wind.
- Phones get it as a strip below the content. Reduced motion shows one still frame, and a pause button stops the animation.
- `yard: false` in `hugo.yaml` removes it.

## 1.2.0 (2026-11-13)
- Dark theme only.
- Noncommercial licenses: PolyForm Noncommercial 1.0.0 for code, CC BY-NC-SA 4.0 for writing.
- `/posts/` is now `/work/`; old links redirect.
- Dependabot for Actions and the theme submodule.
- The iOS home-screen icon is now the lR logo.

## 1.1.0 (2026-11-09)
- Pages for PhD, DAAE, scPrinter on cow mammary gland, and bioZone. Shorter About.
- Home: Work button replaces bioZone. Professional description and keywords.
- Leaner config, README and workflow. No dates, breadcrumbs or previous/next links.

## 1.0.0 (2026-11-09)
- Hugo 0.111.2 to 0.169.0. WonderMod to PaperMod, as a submodule.
- CI pins Hugo, and builds `dev` and pull requests without deploying.
- Removed the privsec.dev pages and files, and the committed build output.
