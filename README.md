# loudrxiv.dev

## Local Working Environment

1) Install Git and Hugo.

```Most users should simply use the self‑contained Hugo executable for their platform. Linux package managers often provide old versions of Hugo.```

1.1) Clone this repository: 
```git clone --recurse-submodules https://github.com/loudrxiv/loudrxiv.github.io.git```

1.2) Run `hugo serve` to start the local development server at (by default) 
```http://localhost:1313```

1.3) Run `git submodule update --merge` to update the WonderMod theme to the version specified in this repo.

1.4) Run `git submodule update --remote --merge` to update to the upstream master branch of WonderMod.

1.5) Run `./external-blogs.sh` to pull the latest versions of certain posts from their canonical (external) sources.
