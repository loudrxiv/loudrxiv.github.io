# loudrxiv.github.io

[Hugo](https://gohugo.io/) and [PaperMod](https://github.com/adityatelange/hugo-PaperMod), deployed to GitHub Pages by Actions.

```sh
git clone --recurse-submodules https://github.com/loudrxiv/loudrxiv.github.io.git
hugo serve   # Hugo 0.158 or newer
```

`main` deploys. `dev` and pull requests only build.
Update the theme with `git submodule update --remote themes/PaperMod`, and Hugo with `HUGO_VERSION` in `.github/workflows/hugo.yaml`.

Started as a fork of [privsec.dev](https://privsec.dev/). The theme descends from [WonderMod](https://github.com/Wonderfall/hugo-WonderMod), a fork of PaperMod (MIT). Any of my modifications will either follow Apache or also join that designation.
