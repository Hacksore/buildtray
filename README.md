# buildtray

An app to allow you to subscribe to Github build notifications for your projects

### Project setup
TODO:

### Export the database
`npm run export`

### Cloudflare tunnel

```
# create teh tunnel
cloudflared tunnel create buildtray

# add dns
cloudflared tunnel route dns buildtray buildtray.boult.me

# if you are using an other machine you will want to fetch the existing info
cloudflared tunnel token --cred-file $HOME/.cloudflared/aa101349-62e4-487f-af0f-943f0252b541.json buildtray
```