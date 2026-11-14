# loudrxiv.github.io

[Hugo](https://gohugo.io/) and [PaperMod](https://github.com/adityatelange/hugo-PaperMod), deployed to GitHub Pages by Actions.

```sh
git clone --recurse-submodules https://github.com/loudrxiv/loudrxiv.github.io.git
hugo serve   # Hugo 0.158 or newer
```

`main` deploys. `dev` and pull requests only build.
Update the theme with `git submodule update --remote themes/PaperMod`, and Hugo with `HUGO_VERSION` in `.github/workflows/hugo.yaml`.
How the animated yard, the clouds, the type and the man in the yard work is in [docs/yard.md](docs/yard.md).

Started as a fork of [privsec.dev](https://privsec.dev/).

## License

- Code and config: [PolyForm Noncommercial 1.0.0](LICENSE). Free for noncommercial use, including universities and other research or educational organizations. Companies need to ask.
- Writing in `content/`: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md).
- `themes/PaperMod` keeps its own MIT license.
- The Bitter font in `static/fonts` keeps its own [SIL Open Font License 1.1](static/fonts/OFL-Bitter.txt).
