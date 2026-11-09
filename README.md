# [loudrxiv.github.io](https://loudrxiv.github.io)

Personal site, built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, published with GitHub Pages.

## Layout

| Path | What it is |
| :--- | :--- |
| `hugo.yaml` | Site configuration |
| `content/` | Pages and posts (Markdown) |
| `static/` | Files copied as-is to the site root (favicons, logo) |
| `themes/PaperMod/` | The theme, a git submodule pinned to one commit |
| `.github/workflows/hugo.yaml` | Build and deploy; pins the Hugo version |

`public/` is build output. It is git-ignored; CI builds the site from source.

## Local development

Install [Hugo](https://gohugo.io/installation/) 0.158.0 or newer (the extended edition is not required), then:

```sh
git clone --recurse-submodules https://github.com/loudrxiv/loudrxiv.github.io.git
cd loudrxiv.github.io
hugo serve            # http://localhost:1313, rebuilds on save
hugo --gc --minify    # one-off production build into public/
```

If you cloned without `--recurse-submodules`, run `git submodule update --init`.

## Updating

- **Theme:** `git submodule update --remote themes/PaperMod`, check `hugo serve`, then commit the new submodule pointer.
- **Hugo:** change `HUGO_VERSION` in `.github/workflows/hugo.yaml`. Keep it at or above `module.hugoVersion.min` in `hugo.yaml`.

## Branches and deployment

- `main` deploys to GitHub Pages through the Actions workflow. The repository's Pages source must be set to "GitHub Actions".
- `dev` and pull requests into `main` run the build only, to check the site compiles. Nothing is published from them.

## Credits and licences

The site started as a fork of [privsec.dev](https://privsec.dev/) ([source](https://git.tommytran.io/privsec-dev)), whose content has since been removed. The theme descends from [WonderMod](https://github.com/Wonderfall/hugo-WonderMod), itself forked from [PaperMod](https://github.com/adityatelange/hugo-PaperMod); the site now uses PaperMod directly. PaperMod is MIT licensed. Any of my modifications will either follow Apache or also join that designation.
