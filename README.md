# In Regards to [My Website](https://loudrxiv.github.io)

This was built on top of the [HUGO](https://gohugo.io/) framework; HUGO is the "world's fastest" framework for building websites and is used here for two main reasons: 
	1. I don't know HMTL/CSS/Javascript (as of 2023-03-01) and I do NOT want to learn...
	2. I (begrudgingly) know Markdown, and don't have time to do this in [Org](https://orgmode.org/) (I have already tried)
	
If you like the format of my website, I wish I could take credit, but I simply cannot; this was all forked from [this](https://privsec.dev/) website and corresponding [git](https://git.tommytran.io/privsec-dev) repo.

I am working off the [WonderMod](https://github.com/Wonderfall/hugo-WonderMod) theme (of which was itself forked from the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme), both of which are licsenced under MIT. Any of my modifications will either follow APACHE or also join that designation.

## Local Working Environment

If you are interested in forking this for local development, here are the instructions (also this if for me too lol):

* Install Git and Hugo.

* Clone this repository (the submodule flag is for the WonderMod theme): 

```git clone --recurse-submodules https://github.com/loudrxiv/loudrxiv.github.io.git```

* Run `hugo serve` to start the local development server at (defaults to ```http://localhost:1313```)

* Run `git submodule update --merge` to update the WonderMod theme to the version specified in this repo.

* Run `git submodule update --remote --merge` to update to the upstream master branch of WonderMod.

* Run `./external-blogs.sh` to pull the latest versions of certain posts from their canonical (external) sources.
