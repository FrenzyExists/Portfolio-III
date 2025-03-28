---
title: Fixing Docker Errors on Mac
status: 'Blog'
description: 'A fix for that one nasty "Docker will damage your computer" pop-up on MacOS'
readTime: '2min'
date: 'March 28th, 2025'
tags: ['Shell', 'Docker', 'Error']
---

So, while on my Capstone I kept getting this pop-up:

![]()

I hit the cancel or move to bin and the pop-up still comes back and doesn't go. Tried to ignore it but the annoyance was too much and when I wanted to install docker again I couldn't. If this is you don't worry, I fixed the issue, and will show you how. Still pretty annoying tho ngl.

First try to unninstall it via brew:

```sh
brew uninstall --cask docker --force
brew uninstall --formula docker --force
```

This will remove residual files from docker. If you still get issues, kill the task, look for `docker.app` or anything with the name docker.

If that STILL doesn't work delete the daemons which are on `/Library/LaunchDaemons/`. Docker daemons start like this: `com.docker`. Restart your computer. Reinstall Docker with  `brew install docker`.

If during instalation or run you get something like this:

```sh
error getting credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH, out: ``
```

Then you'll have to rename a line called `credsStore` to `credStore` at `~/.docker/config.json`.

You should be good now and run docker normally.