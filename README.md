# Farid Sunkar — Portfolio (Orbit)

Static site. No build step needed to serve it: copy these files to the root of the
`portforlio` repo and enable GitHub Pages on the default branch. Every link is relative,
so it works under `https://faridsunkar777.github.io/portforlio/`. The one exception is
`404.html`, which uses `/portforlio/` paths because GitHub serves it at any depth.

## Pages
- `index.html`: home
- `works.html`: works index
- `about.html`: about
- `contact.html`: contact
- `work/luna.html`, `work/cabby.html`, `work/swiftsekai.html`, `work/peekashape.html`,
  `work/monos.html`, `work/moneybud.html`: case studies
- `luna.html`, `cabby.html`, `SwiftSekai.html`, `peekashape.html`, `monos.html`, `feli.html`:
  redirects from the old URLs

## Editing links
All external links are in `assets/js/config.js`. A link left as `null` is hidden.
Open TODOs:
- App Store URLs for Luna, SwiftSekai and MONOS (`appStore`)
- Peek-A-Shape prototype (`prototype.peekashape`)
- CV: the current link is a Canva **edit** link. Swap it for a view-only link or a PDF.

If the repo is renamed, update `BASE` in the generator (or search-and-replace
`faridsunkar777.github.io/portforlio/` in the HTML, sitemap.xml and robots.txt, and
`/portforlio/` in 404.html).

## Stack
Vanilla HTML/CSS/JS, self-hosted GSAP 3.13 (ScrollTrigger, SplitText), Lenis 1.3,
and Archivo / JetBrains Mono variable fonts. Images are AVIF with WebP fallback.
Respects `prefers-reduced-motion`.
