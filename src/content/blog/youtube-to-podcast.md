---
title: "Using Podsync to convert YouTube channels to podcasts"
description: "In this blog post, I will walk you through how I migrated 'Frontova Poplava' from YouTube to a podcast format using the Podsync tool. This process allowed me to easily access the content on my watch, making it more convenient for me to enjoy the show. Follow along with my step-by-step instructions to learn how you can do it too!"
pubDate: "Jul 08 2023"
heroImage: "/DALL·E 2023-07-08 18.21.59 - A photo of Michelangelo's sculpture of David wearing headphones djing.jpg"
heroImagePrompt: A photo of Michelangelo's sculpture of David wearing headphones djing (DALL·E 2023-07-08 18.21.59)
tags: [youtube, podcast, docker]
---

**tl;dr**: [commit](https://github.com/KatSick/personal-cloud/commit/2e008510bb7cb01bd04dc9ef966b9174a2065550) that do the job and link to [@Pravonapoplavu as podcast](https://podsync.katsick.cloud/poplava.xml)

---

# Why?

I recently discovered that one of my favorite YouTube show [@Pravonapoplavu](https://www.youtube.com/@Pravonapoplavu) **does not** publish new episodes on podcast platforms anymore.

So I decided to convert the YouTube channel to a podcast format using the [Podsync](https://github.com/mxpv/podsync) tool.

It was very easy to do (except hosting, dns and ssl and debugging), and I will walk you through the steps I took to do it.

# Few notes before we start

[Podsync](https://github.com/mxpv/podsync) is a tool which converts youtube channels into podcast feeds. It allows you to listen to your favorite YouTube channels on any podcast app.

How it works in a nutshell:

1. Run as a background job
2. Fetches YouTube channels and playlists via YouTube Data API
3. Download new videos via [youtube-dl](https://github.com/ytdl-org/youtube-dl)
4. Generate Podcast feed and place audio files in the right order
5. Serves static content

# 1. Setup docker image

```docker title="Dockerfile.podsync" {3-4}
from mxpv/podsync:latest

run pip uninstall yt-dlp
run pip install yt-dlp

copy podsync.toml /app/config.toml
```

> Why do we need custom image and re-install yt-dlp? Because of [this](https://github.com/mxpv/podsync/issues/488) bug

# 2. Setup podsync config

The main poinst here are:

- YouTube Data API key which you can find [here](https://console.cloud.google.com/apis/credentials) (you need to create a project and access to the YouTube Data API)
- `opml = true` which will generate OPML file for you

Of course it will be great to have a custom domain, persistent storage but it's not required.

If you need any customizations, see [example config](https://github.com/mxpv/podsync/blob/main/config.toml.example).

```toml title="podsync.toml" {12, 14-19}
[server]
port = 8080
# Bind a specific IP addresses for server ,"*": bind all IP addresses which is default option, localhost or 127.0.0.1  bind a single IPv4 address
bind_address = "*"
hostname = "https://your_hostname.com"

[storage]
  [storage.local]
  data_dir = "/data/podsync/"

[tokens]
youtube = "PASTE YOUR API KEY HERE"

[feeds]
    [feeds.poplava]
    url = "https://www.youtube.com/channel/UCwCkRo2WQx_9JRWISLC47fw"
    page_size = 2
    format = "audio"
    opml = true
```

# 3. Run it via docker-compose

```yaml title="docker-compose.yml"
version: "3.8"

volumes:
  podsync_data:

services:
  # https://github.com/mxpv/podsync
  podsync:
    container_name: podsync
    restart: unless-stopped
    build:
      context: .
      dockerfile: Dockerfile.podsync
    volumes:
      - podsync_data:/data
```

Test and verify locally before deploying to production.

```bash
docker-compose up
```

It should be available on `http://localhost:8080` and contain the `poplava` folder with .mp3 files in it and `poplava.xml` file which can be passed to the podcast app.
I'm using https://overcast.fm and it works great.

# Fin

Now you need to deploy it to the server in order to access URL from the internet, but it's out of scope of this article, however, I'm using [Traefik Proxy](https://traefik.io/traefik/) and [Linode](https://www.linode.com/) for it. You can explore my [infra here](https://github.com/KatSick/personal-cloud) and here is [commit](https://github.com/KatSick/personal-cloud/commit/2e008510bb7cb01bd04dc9ef966b9174a2065550) which do the steps above.

In my case, final link looks like this: https://podsync.katsick.cloud/poplava.xml
