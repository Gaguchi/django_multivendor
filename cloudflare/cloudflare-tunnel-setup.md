# Setting Up Cloudflare Tunnel for Django Multivendor

This guide explains how to set up a Cloudflare Tunnel to expose your local Django development server and React frontend to the internet through your `bazro.ge` domain.

## 1. Install Cloudflared CLI

### Windows

1. Download the installer from [Cloudflare's website](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)
2. Run the installer and follow the prompts
3. Verify installation:
   ```
   cloudflared --version
   ```

### macOS (with Homebrew)

```
brew install cloudflared
```

### Linux

```
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

## 2. Authenticate Cloudflared

Run the following command to authenticate with your Cloudflare account:

```
cloudflared tunnel login
```

This will open a browser window where you can select the domain (`bazro.ge`) that you want to use with this tunnel.

## 3. Create a Tunnel

Create a named tunnel:

```
cloudflared tunnel create django-multivendor
```

This command will create a tunnel and generate a credentials file at `~/.cloudflared/<TUNNEL_ID>.json`.

## 4. Configure the Tunnel

Create a configuration file named `cloudflared-config.yml` in the `cloudflare` directory of your project:

```yaml
# Config for Cloudflare Tunnel
tunnel: <TUNNEL_ID>
credentials-file: /path/to/credentials/file.json

ingress:
  # Route traffic to Django backend
  - hostname: api.bazro.ge
    service: http://localhost:8000

  # Route traffic to React frontend
  - hostname: shop.bazro.ge
    service: http://localhost:5173

  # Return 404 for all other hostnames
  - service: http_status:404
```

Replace `<TUNNEL_ID>` with the ID of the tunnel you created.

## 5. Configure DNS Records

Create CNAME records in your Cloudflare DNS dashboard for the hostnames you want to use:

- Create a CNAME record for `api.bazro.ge` pointing to `<TUNNEL_ID>.cfargotunnel.com`
- Create a CNAME record for `shop.bazro.ge` pointing to `<TUNNEL_ID>.cfargotunnel.com`

## 6. Start the Tunnel

Run the tunnel from the cloudflare directory:

```
cd cloudflare
cloudflared tunnel run django-multivendor
```

Or run it with the config file:

```
cd cloudflare
cloudflared tunnel --config cloudflared-config.yml run django-multivendor
```

## 7. Update Project Settings

Update your Django settings to accept requests from the new Cloudflare domains and to properly handle the proxied requests.

## 8. Start Your Django and React Applications

In separate terminals:

- Start Django: `python manage.py runserver`
- Start React: `npm run dev`

## 9. Testing

Visit your application at `https://shop.bazro.ge` for the frontend and `https://api.bazro.ge` for the API and `https://seller.bazro.ge` fot the sellers admin panel.
