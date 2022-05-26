# buildtray

An app to allow you to subscribe to Github build notifications for your projects


### how to setup the cloudflare tunnel

```
# create teh tunnel
cloudflared tunnel create buildtray

# add dns
cloudflared tunnel route dns buildtray buildtray.boult.me
```