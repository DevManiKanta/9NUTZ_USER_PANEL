# 9Nutz User Panel

Production-ready configuration without changing existing design, APIs, or functionality.

## Environment Setup

1. Copy `env.example` to `.env.local` and adjust values as needed:

```
NEXT_PUBLIC_API_BASE=YOUR_BASE_URL
NEXT_PUBLIC_API_BASE_URL=YOUR_LOGIN_API_BASE_URL
PROD_API_URL=https://9nutsapi.nearbydoctors.in/public/api/
```

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- Do not store secrets in public variables.

## Development

```
npm install
npm run dev
```

## Production

```
npm run build
npm run start
```

This project adds secure HTTP headers via `next.config.js` and standardizes API base URLs using environment variables.
