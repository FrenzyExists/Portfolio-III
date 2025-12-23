---
title: Pi Adventures Pt. 2
status: Developing
date: December 22th, 2025
description: Multi-part series on using my Raspberry Pi 5 for uh, stuff. Part 2 is VPN Go Brr
tags:
  - hardware
  - linux
  - raspberry-pi
---

Alright I haven't finished writting part 1 and imma gonna be honest, I kinda started originally with this part when I was messing around. Anyway who cares about order below is the guide thing on getting your own VPN thing on a Raspberry pi or whatever idk..

So now that ads are gone, let’s do something actually useful: access your home network **from anywhere** without exposing random ports or trusting sketchy cloud VPNs.

## Part 2: VPN Time (PiVPN + DuckDNS)

We’re setting up:
- **PiVPN** → easy VPN installer for WireGuard/OpenVPN  
- **DuckDNS** → free dynamic DNS so you don’t care about changing IPs  
- **WireGuard** → fast, modern VPN protocol (we’re not using OpenVPN unless you hate yourself)

Whole idea of this particular setup is to get some protection from ISPs. 

### Getting a DuckDNS domain

Ok so before we set DuckDNS we gotta explain WHY we need to do this

1. Go to https://www.duckdns.org
2. Log in (GitHub/Google works)
3. Pick a subdomain  
   Example: `pk-pipboy.duckdns.org`
4. Copy your **token** (you’ll need it)

### Installing DuckDNS updater on the Pi

This keeps your DuckDNS domain updated when your ISP changes your IP. We gonna create a new script which we will add to a cronjob using crontab and have that running every 5 minutes or so.

```sh
mkdir -p ~/duckdns
cd ~/duckdns
```

Create and edit a new file:

```sh
nvim duck.sh
```

Paste this (replace DOMAIN and TOKEN):

```sh
echo "url=https://www.duckdns.org/update?domains=YOUR_DOMAIN&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -
```

Make it executable:

```sh
chmod 700 duck.sh
```

Test it:

```sh
./duck.sh
cat duck.log
```

If it says OK, you’re good. This script needs to be ran everynow and then, so we're automating that:

```sh
crontab -e
```

If it's your first time opening crontab you'll be asked what editor to use. I personally prefer using neovim, choose whatever CLI editor suits you. Add this at the bottom of the configuration file:

```sh
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

This updates your IP every 5 minutes.

### Installing PiVPN (oh god finally)

Run the installer wizard thingy:

```sh
curl -L https://install.pivpn.io | bash
```

You'll go over a couple of settings                                                                                                                                            

- VPN Type: WireGuard  
- Network Interface: same one Pi-hole uses  
- Static IP? No, we’re rocking DHCP  
- Just smash Enter, Enter, Enter—defaults are fine unless you like pain.

Once you crawl out of the wizard, check clients (it will be empty first):

```
pikachu@pipboy:~ $ pivpn list
[2025-12-18T09:49:12-0500]: ::: There are no clients to list
```

Add client

```sh
pikachu@pipboy:~ $ pivpn add
Enter the Client IP from range 10.159.29.2 - 10.159.29.254 (optional): 
::: Chosen Client IP: 10.159.29.2
Enter a Name for the Client (default: 'pipboy'): 
[2025-12-18T09:49:21-0500]: ::: Name is blank. Defaulting to 'pipboy'.
::: Client Keys generated
::: Client config generated
::: Updated server config
::: WireGuard reloaded
======================================================================
::: Done! pipboy.conf successfully created!
::: pipboy.conf was copied to /home/pikachu/configs for easytransfer.
::: Please use this profile only on one device and create additional
::: profiles for other devices. You can also use pivpn -qr
::: to generate a QR Code you can scan with the mobile app.
======================================================================
```

Do a check again

```sh
pikachu@pipboy:~ $ pivpn list
::: Clients Summary :::
Client      Public key                                        Creation date
pipboy      6ae74yFLWhmujSYiMDoUIGMLVdvDnulpkMbGStDSDAc=      18 Dec 2025, 09:49, EST
::: Disabled clients :::
```

Then let’s check some basic info on the client we’re running

```sh
pikachu@pipboy:~ $ pivpn -c
::: Connected Clients List :::
Name        Remote IP      Virtual IP                                       Bytes Received      Bytes Sent      Last Seen
pipboy      (none)         10.159.29.2,fd11:5ee:bad:c0de::a9f:1d02/128      0B                  0B              (not yet)
::: Disabled clients :::
```

This is normal, Remote IP shows as None because no client has connected, which is why we dont have any bytes received nor sent

Some other check i dont know how to describe

```sh
pikachu@pipboy:~ $ sudo -i
root@pipboy:/etc/wireguard# sudo wg show
interface: wg0
  public key: 44-long key
  private key: (hidden)
  listening port: 51820

peer: 44-long key
  preshared key: (hidden)
  allowed ips: 10.xx.xx.2/32, fd11:xxx:bad:c0de::xxx:1d02/128

```

We need to add duckDNS to WireGuard

nvim ~/config/pipboy.conf

We need to replace 

```
Endpoint = 67.84.165.224:51820
```

to this

```
Endpoint = pk-pipboy.duckdns.org:51820
```

Then we reload wireguard

```
pikachu@pipboy:~# sudo wg show
interface: wg0
  public key: 14-len string
  private key: (hidden)
  listening port: 51820

peer: kza1pUx0GO158zdpkqs/yMafbd67FPRvp5YUWgMlTV4=
  preshared key: (hidden)
  endpoint: 67.xx.xxx.xxx:54784
  allowed ips: 10.xxx.xx.x/32, fd11:5ee:bad:c0de::a9f:1d02/128
  latest handshake: 40 seconds ago
  transfer: 78.40 MiB received, 1.99 GiB sent

```

on the pi check the lan ip using `ip a` or `hostname -I`

you should get something like 192.168.1.50 which is the IP you need to forward in your router

### Port forward + auto-start

- On your router: forward UDP 51820 to the Pi LAN IP (e.g., 192.168.1.50). If you use IPv6, allow UDP 51820 inbound to the Pi’s v6 address.
- Enable and restart WireGuard so it boots automatically:

```sh
sudo systemctl enable wg-quick@wg0
sudo systemctl restart wg-quick@wg0
```

If you see “wg-quick@wg0.service is not active, cannot reload”, stop the manual instance and retry:

```sh
sudo wg-quick down wg0 || true
sudo systemctl restart wg-quick@wg0
```

### Firewall rules

If you’re using UFW / iptables / being paranoid, WireGuard needs permission.

For IPv6

```sh
sudo ip6tables -A INPUT -p udp --dport 51820 -j ACCEPT
sudo ip6tables -A FORWARD -i wg0 -j ACCEPT
sudo ip6tables -A FORWARD -o wg0 -j ACCEPT
```

For IPv4 (if you locked things down):

```sh
sudo iptables -A INPUT -p udp --dport 51820 -j ACCEPT
sudo iptables -A FORWARD -i wg0 -j ACCEPT
sudo iptables -A FORWARD -o wg0 -j ACCEPT
```

Persist rules using:
- `ufw`
- `netfilter-persistent`
- `firewalld`
- whatever flavor of firewall pain you prefer

### Sanity checks (unordered chaos, pick your fighter)

Service + socket (Listening to port?)

```sh
sudo systemctl status wg-quick@wg0
sudo ss -lun | grep 51820   # listening on UDP 51820?
```

WireGuard state  

```sh
sudo wg show
```
Look for your peer and a “latest handshake” after connecting a client.

IP forwarding  

```sh
sudo sysctl net.ipv4.ip_forward
sudo sysctl net.ipv6.conf.all.forwarding
```
Both should be `1`.

Client path test (on phone/laptop over cellular, Wi‑Fi off):  

- Connect with the generated profile.  
- Hit `https://ifconfig.me` or `https://ipleak.net` and confirm the IP is your home/public IP.  
- Ping something on LAN (`ping 192.168.1.1`) to verify internal reachability.

Example quick pings (while connected)

```sh
ping 192.168.1.1        # router
ping 192.168.1.xxx      # Pi
```

Check DNS

```
nslookup google.com
```

DNS server should be the Pi

Logs if things explode:

```sh
journalctl -u wg-quick@wg0 -b
sudo tail -n 100 /var/log/syslog | grep wg0
```

Here's a few things that you can do if things went wrong

### IPv6 causes random hangs
Cause: Partial IPv6 routing  

Fix: Either fully allow it or disable IPv6 on client.

### ISP blocks inbound ports (CGNAT hell)
Cause: Carrier-grade NAT  

Check:

```sh
curl ifconfig.me  
```

Compare with router WAN IP. If different, ISP hates you.

### “It worked yesterday”
Diagnosis:
- It didn’t
- Or IP changed
- Or router updated itself at 4am

Debug order:
1. wg show  
2. ss -lun  
3. DuckDNS resolution  
4. Router forwarding  

Always in that order.

If it works now: congrats, you own your network.

> Next part is probably GPIO, LEDs, or turning the Pi into a NAS and regretting it.


### Sources

- https://docs.pivpn.io/
- https://www.duckdns.org/
- https://www.wireguard.com/

