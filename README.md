# MaskMind

MaskMind is a modern anonymous-feedback app inspired by NGL. It lets people share a public link, collect anonymous messages, and moderate their inbox with spam controls and blocked words.

## Live Demo

- https://mask-mind.vercel.app/

## Highlights

- Anonymous message inbox with moderation controls
- Public profile link (`/u/:username`)
- Accept / pause messages at any time
- Spam filters + blocked words
- Delete messages
- Email verification (OTP)
- Password reset (OTP)
- Google OAuth sign-in
- Professional, light-mode UI

## Tech Stack

- Next.js (App Router)
- TypeScript
- MongoDB + Mongoose
- NextAuth (Credentials + Google)
- Zod for validation
- Resend for email
- Tailwind CSS (v4)

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Create a `.env` file in the project root:

```bash
MONGODB_URI="..."
RESEND_API_KEY="..."
RESEND_FROM="MaskMind <no-reply@yourdomain.com>"
SECRET="your_long_secret"
NEXTAUTH_SECRET="your_long_secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Notes:
- `RESEND_FROM` must use a verified domain.
- `SECRET` and `NEXTAUTH_SECRET` should be long and random in production.
- Set `NEXTAUTH_URL` to your production domain when deploying.

### 3) Run the dev server

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

## Core Pages

- `/` - Landing page
- `/sign-up` - Email + password signup
- `/verify` - OTP verification + resend
- `/sign-in` - Login (Credentials + Google)
- `/forgot-password` - Reset password via OTP
- `/dashboard` - Inbox, controls, blocked words
- `/u/:username` - Public anonymous message page

## Core APIs

- `POST /api/signUp`
- `POST /api/verify`
- `POST /api/resend-verify`
- `POST /api/forgot-password`
- `POST /api/reset-password`
- `POST /api/send-message`
- `GET /api/messages`
- `POST /api/delete-message`
- `GET/POST /api/accept-messages`
- `GET/POST /api/block-words`

## Project Structure

```
src/
  app/
  api/
  context/
  helper/
  lib/
  model/
  schemas/
  types/
email/
public/
```

## Auth and Accounts

- Email/password accounts use OTP verification.
- Google OAuth accounts are created on first sign-in.
- Password reset uses OTP sent via email.

## Moderation and Safety

- Incoming messages are rate-limited (in-memory for dev).
- Blocked words filter out unwanted content.
- Users can delete messages anytime.

## Development Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deployment

This app can be deployed to any Node-compatible host. For Vercel:

1. Add all env vars from `.env` to Vercel.
2. Set `NEXTAUTH_URL` to your production domain.
3. Deploy.

## License

MIT
