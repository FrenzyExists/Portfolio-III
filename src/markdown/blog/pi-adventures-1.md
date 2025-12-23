---
title: Pi Adventures Pt. 1
status: 'Testing'
date: 'December 21th, 2025'
description: 'Multi-part series on using my Raspberry Pi 5 for uh, stuff. Part 1 is No Ads Plz'
tags: ['Hardware', 'Linux', 'Raspberry-pi']
---

While visiting family in NY I really wanted to try a few of my gadgets before going back to the work grind, and I felt like putting my Freenove Raspberry Pi finally to some good use. This article is a multi-part series, because of course it is. Everyone is doing it so hey don't complain.

Anyway, this is going to be into like, idk, 2, 3 or 4 parts probably? It's 2:30am on a Monster Energy drink while hearing Three Days Grace and I'm not gonna revise this. Diary of Jane kinda cool song btw.

- Part 1 is pihole, no ads or whatever
- Part 2 is PiVPN with Duck DNS (cause why not)
- Part 3 Freenove IO uh thing idk
- Part 4 (if I dont forget) Its turning the Pi into a mini NAS server

## Part 1 No Ads Plz

So yeah, uh, this first part is about pihole, we're making a hole for ads n stuff. (Hearing Stroke God + Millionare from Dance Gavin Dance). We will use Pihole for that. Its a free, open-source network-wide ad and tracker blocker that acts as a DNS sinkhole, preventing unwanted content from reaching any device on your network. So, like ublock, but better.

It works by intercepting DNS requests and blocking known ad/tracker domains, improving privacy, speeding up browsing, and reducing data usage by stopping ads and malicious requests at the source.

### Hardware Requirements

- A Raspberry Pi 5
- At least a 32GB SD Card (I got a 128GB one)
- Internet (duh!)
- Some extra device (smartphone or laptop works)

### Prequisites

Your raspberry Pi should already be running some version of Debian. Here's my rig

```
       _,met$$$$$gg.          pikachu@pipboy 
    ,g$$$$$$$$$$$$$$$P.       -------------- 
  ,g$$P"     """Y$$.".        OS: Debian GNU/Linux 13 (trixie) aarch64 
 ,$$P'              `$$$.     Host: Raspberry Pi 5 Model B Rev 1.0 
',$$P       ,ggs.     `$$b:   Kernel: 6.12.47+rpt-rpi-2712 
`d$$'     ,$P"'   .    $$$    Uptime: 2 days, 16 hours, 43 mins 
 $$P      d$'     ,    $$P    Packages: 1925 (dpkg) 
 $$:      $$.   -    ,d$$'    Shell: bash 5.2.37 
 $$;      Y$b._   _,d$P'      Resolution: 1920x1080 
 Y$$.    `.`"Y$$$$P"'         DE: labwc:wlroots 
 `$$b      "-.__              Theme: PiXtrix [GTK3] 
  `Y$$                        Icons: PiXtrix [GTK3] 
   `Y$$.                      Terminal: x-terminal-emul 
     `$$b.                    CPU: (4) @ 2.400GHz 
       `Y$$b.                 Memory: 6542MiB / 8059MiB 
          `"Y$b._
              `""" 
```

### Installing Pihole

Check your Pi's IP address. There's a couple of ways you can see it. Open the terminal and type:

```sh
ip addr
```

Write the Pi's IP, you'll need it

Then in the same terminal update your system:

```
sudo apt update && sudo apt upgrade -y
```

Then run the wizard installer, uh thing

```ssh
curl -sSL https://install.pi-hole.net | bash
```

(ha! sike, i fell asleep and ended up doing this in the afternoon so now its not as chaotic as before muahahahaha!)

You'll get a instalation wizard with a bunch of options n stuff.

- Network interface : wlan0 (wifi) or eth0 (network cable)
- DNS upstream provider : I chose Cloudfare cause is the fastest, or so they say
- Logging : Take everything cause we need to do some checks

After those settings just keep hitting enter or next, dont need to touch any other setting

By the end you gonna end up with a CLI window like thisn one

```
┌──────────────────────Installation Complete!────────────────────────┐
│ Configure your devices to use the Pi-hole as their DNS server      │
│ using:                                                             │
│                                                                    │
│ IPv4: 192.xxx.x.xx                                                 │
│ IPv6: fd11:xxx:bad:c0de::xxx:xxxx                                  │
│ If you have not done so already, the above IP should be set to     │
│ static.                                                            │
│ View the web interface at http://pi.hole:80/admin or               │
│ http://192.xxx.x.xx:80/admin                                       │
│                                                                    │
│ Your Admin Webpage login password is SOME_RANDOM_AHH_PWD           │
│                                                                    │
│                                                                    │
│ To allow your user to use all CLI functions without                │
│ authentication,                                                    │
│ refer to https://docs.pi-hole.net/main/post-install/		          │
└────────────────────────────────────────────────────────────────────┘
```

Go to the admin page `https://192.xxx.x.xx:80/admin`. Chances are the site will ask for HTTPS Encryption or something, we'll deal with that later. 

### DNS Settings (pick your poison)

Two routes here. Pick one, whichever suits your need

#### Option A: Client-side (per device)

- On each device, set the DNS to the Pi's IP (the one you wrote down). Leave gateway as-is.
- Quick Linux example (NetworkManager):
  ```sh
  nmcli connection show            # find your connection name
  nmcli connection modify "Home" ipv4.dns "192.xxx.x.xx" ipv4.ignore-auto-dns yes
  nmcli connection up "Home"
  ```
- Windows/macOS/iOS/Android all have “Manual DNS” fields—drop the Pi IP there. If IPv6 is enabled and you got an IPv6 from the install screen, add that too; otherwise turn off “automatic DNS” so the ISP DNS doesn’t sneak back in.

#### Option B: Router-level (set-and-forget)

- Log into the router, hunt for LAN/DHCP settings, and set the primary DNS to the Pi IP (and the Pi IPv6 if you’re living that life).
- If the router wants two DNS entries, make both your Pi so it doesn’t fail over to the ISP. Bonus: give the Pi a DHCP reservation/static lease so its IP never drifts.

#### Make sure the world is actually using your Pi

On the Pi (server):
```sh
hostname -I             # confirm the IP you expect
pihole status           # should say "Active"
pihole -t               # live log, ctrl+c to bail
```

On any client (after you set DNS):
```sh
nslookup google.com         # "Server" line should show 192.xxx.x.xx (your Pi)
nslookup pi.hole            # should resolve to your Pi’s IP
dig @192.xxx.x.xx google.com +short  # forces query to Pi-hole
```

Compare: the “Server” IP in `nslookup` should match the Pi IP from `hostname -I`. If you see your router or some random ISP resolver, your settings didn’t stick. Flush caches if needed:
```sh
sudo systemd-resolve --flush-caches   # Linux
ipconfig /flushdns                    # Windows
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder  # macOS
```

Is blocking alive? Ask a known ad domain:

```sh
nslookup doubleclick.net
```
If it comes back `0.0.0.0` or `0.0.0.0#/0.0.0.0 (NXDOMAIN)`, the sinkhole is doing its thing. If you see a real IP, something’s off (probably still talking to ISP DNS).

If you’re stuck without router access and don’t want to touch every device, you *might* spoof DHCP/DNS with something like dnsmasq/odhcpd to hand out your Pi as DNS, but that’s another episode of this cursed show.

### Improving the blocking part

Go to https://firebog.net/ where links n stuff that can be blocked are found. Take whatever list you see fit and add it to the list.

### Enabling HTTPS

You've noticed that when entering the admin page in the login you get a message saying to use the https version so you get an encrypted connection. Got tired of seeing that? Me too so let's fix that.

Reason we get that message too is cause for security sake we should set up a real TLS cert (Let’s Encrypt), cause when you don't and click the https version Chrome will get a stroke saying that its unencrypted and is dangerous... cause it kinda is.

Make sure IPv6 stays on

```sh
sudo sysctl -w net.ipv6.conf.all.forwarding=1
sudo sysctl -w net.ipv6.conf.default.forwarding=1
```

Then make it persistent:

```sh
sudo tee -a /etc/sysctl.conf >/dev/null <<'EOF'
net.ipv6.conf.all.forwarding = 1
net.ipv6.conf.default.forwarding = 1
EOF
```

Reload sysctl:

```sh
sudo sysctl -p
```

Install certbot + lighttpd SSL tools

```sh
sudo apt install -y certbot python3-certbot-lighttpd
```

Point DNS for your Pi to a real hostname

Create an A/AAAA record (e.g., `pihole.example.com`) pointing to your Pi’s public IP. Make sure port 80 is reachable temporarily for the HTTP-01 challenge.

Get the certificate

```sh
sudo certbot certonly --webroot -w /var/www/html -d pihole.example.com
```

Cert files land in `/etc/letsencrypt/live/pihole.example.com/`.

Wire lighttpd to use the cert

```sh
sudo tee /etc/lighttpd/conf-enabled/https-pihole.conf >/dev/null <<'EOF'
$SERVER["socket"] == ":443" {
  ssl.engine  = "enable"
  ssl.pemfile = "/etc/letsencrypt/live/pihole.example.com/fullchain.pem"
  ssl.privkey = "/etc/letsencrypt/live/pihole.example.com/privkey.pem"
  server.name = "pihole.example.com"
}
EOF
```

Restart lighttpd:

```sh
sudo systemctl restart lighttpd
```

Auto-renew (Let’s Encrypt)

```sh
echo "0 4 * * * root certbot renew --quiet && systemctl reload lighttpd" | sudo tee /etc/cron.d/certbot-lighttpd
```

Sanity checks

```sh
sudo lighttpd -tt                      # config syntax
sudo systemctl status lighttpd         # service healthy?
sudo certbot renew --dry-run           # renewal works?
curl -I https://pihole.example.com/admin
```

You should see an HTTP 200/301 with a valid cert. If the browser still shows “Not secure”, double-check the hostname you’re visiting matches the cert CN/SAN, and that port 443 is open on your network edge.

> Next part is getting a VPN running in the Pi using PiVPN


### Sources

- https://docs.pi-hole.net/

