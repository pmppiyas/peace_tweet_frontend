# 🕊️ PeaceTweet Frontend

> **Next-generation Islamic Social Media & Spiritual Wellness Platform**  
> Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack React Query v5**, **Zustand**, **Socket.IO**, **Apache Kafka**, and **Web Audio API**.

---

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.4-black?style=for-the-badge&logo=socket.io&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-Event--Driven-black?style=for-the-badge&logo=apache-kafka&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache--Layer-red?style=for-the-badge&logo=redis&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Tech Stack](#-tech-stack)
- [Event-Driven Architecture (Kafka & Redis)](#-event-driven-architecture-kafka--redis)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [Audio & Sound Effects Engine](#-audio--sound-effects-engine)
- [Real-time WebSocket Integration](#-real-time-websocket-integration)
- [Design System & Responsive Layout](#-design-system--responsive-layout)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**PeaceTweet** combines modern, Facebook-grade social networking with dedicated Islamic spiritual utilities. Users can share reflections, daily authentic Duas, participate in community discussions, request emergency blood donations, organize prayers across daily time slots, and utilize an interactive digital Tasbih counter with tactile haptics and synthesized sound effects.

The frontend is architected as a feature-driven Next.js App Router application optimized for lightning-fast server-rendered performance, optimistic UI updates, zero-latency Web Audio sound effects, and bilingual accessibility (Bengali and English), backed by an **event-driven distributed pipeline** powered by **Apache Kafka** and **Redis**.

---

## ✨ Key Features

### 1. 📱 Dynamic Social Feed & Rich Post Composer
- **Multi-type Posting**: Share Text reflections, authentic Quranic/Masnoon Duas, and urgent Blood Requests.
- **Media Uploads**: Multi-image attachments with client-side preview, validation, and optimistic posting.
- **Reactions & Interactions**: Tactile like reactions with bubble pop sounds, nested comment threads, and share count tracking.
- **Story Bar**: Interactive daily Dua stories carousel (Sabah-Masa, Sleep, Prayer, Sustenance) with auto-advancing cards.

### 2. 💬 Real-Time Messenger
- **Instant Messaging**: Powered by Socket.IO for real-time one-to-one messaging with zero page refreshes.
- **Dual Interface**:
  - Quick-access Messenger popover dropdown on the navbar with live unread count badges.
  - Full-screen dedicated chat suite at `/messages` with conversations list, active typing, and message history.

### 3. 🔔 Notification System
- **Real-Time Push Alerts**: Live notifications for friend requests, post interactions, comments, and blood donation calls.
- **Instant Filtering**: Switch between All and Unread notifications with instant client-side memoization.

### 4. 👥 Social Network & Friends System
- **Friend Requests**: Send, accept, and cancel requests with affirmative synthesized chime audio feedback.
- **Relationships Tab**: Dedicated tabs for Friend Requests, Suggestions, Following, and Followers.

### 5. 🩸 Emergency Blood Donation Network
- **Live Donation Requests**: Dedicated feed items and sidebar filter for urgent patient blood requirements.
- **Detailed Vitals**: Blood group (A+, B+, O+, AB+, etc.), urgency levels, hospital location, and direct call contact.

### 6. 📿 Saved Routines Hub & Digital Tasbih (`/saved`)
- **Daily Time-Slot Organization**: Categorize saved Duas and posts by routine prayer times:
  - 🌅 **Morning / Fajr** (সকাল)
  - ☀️ **Noon / Dhuhr** (দুপুর)
  - ⛅ **Afternoon / Asr** (বিকাল)
  - 🌇 **Evening / Maghrib** (সন্ধ্যা)
  - 🌙 **Night / Isha** (রাত)
- **TimeSlot Picker**: Reassign any saved item to another routine slot with instant state synchronization.
- **Integrated Digital Tasbih Counter**:
  - Customizable target presets: **3, 7, 11, 15, 33, 100**.
  - Circular SVG progress ring with animated completion celebrations.
  - Native Web Audio click synthesis & device haptic vibration feedback.
  - LocalStorage persistence for Lap and Total daily dhikr counts.

### 7. 🔊 Synthesized Web Audio API Engine
- Zero external MP3/WAV download overhead; audio is synthesized natively on the user's browser using oscillators and gain envelopes.
- Synthesized audio profiles:
  - `playFriendRequest`: Ascending dual tone.
  - `playFriendAccept`: 3-note celebration chime.
  - `playPost`: Publication chime.
  - `playReaction`: Bubble pop on likes.
  - `playSave`: Bookmark tone.
  - `playDelete`: Crisp trash discard downward frequency sweep.
  - `playCancel`: Soft descending tick.

### 8. 🌐 Bilingual & Dark Mode Support
- **Full i18n Translation**: Seamless toggle between Bengali (`bn`) and English (`en`) without layout shift.
- **Modern Theme System**: Crisp Light mode and high-contrast Dark mode (`#18191a` / `#242526`).

---

## 📁 Architecture & Directory Structure

```text
peacetweet_frontend/
├── public/                           # Static assets, SVG logos, brand marks
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── (auth)/                   # Authentication route group
│   │   │   ├── login/page.tsx        # Login with email/username & OAuth
│   │   │   └── register/page.tsx     # New user registration
│   │   ├── (protected)/              # Authenticated user route group
│   │   │   ├── saved/                # Saved routines feed & Tasbih suite
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slot]/page.tsx
│   │   │   ├── profile/              # User profile & account overview
│   │   │   │   ├── page.tsx
│   │   │   │   └── [username]/page.tsx
│   │   │   ├── settings/page.tsx     # User preferences & account settings
│   │   │   ├── friends/page.tsx      # Friends, requests, and connections
│   │   │   ├── messages/             # Fullscreen real-time chat
│   │   │   │   ├── page.tsx
│   │   │   │   └── [chatId]/page.tsx
│   │   │   └── blood/page.tsx        # Blood donation directory
│   │   ├── (public)/                 # Public exploration route group
│   │   │   ├── page.tsx              # Main 3-column Home feed
│   │   │   ├── duas/page.tsx         # Duas collection directory
│   │   │   ├── categories/page.tsx   # Topic categories
│   │   │   └── search/page.tsx       # Global search results
│   │   ├── layout.tsx                # Root layout (Providers, Navbar, MobileNav)
│   │   ├── loading.tsx               # Shimmer skeleton fallback
│   │   ├── error.tsx                 # Client error boundary
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── features/                     # Feature-driven modular architecture
│   │   ├── auth/                     # LoginForm, RegisterForm, OAuth buttons, hooks
│   │   ├── feed/                     # Feed, FeedItem, PostComposer, StoryBar, hooks
│   │   ├── bookmark/                 # BookmarkList, SavedLayout, SavedSidebar, TasbihWidget
│   │   ├── chat/                     # ChatBox, ChatList, MessengerDropdown, socket hooks
│   │   ├── notifications/            # NotificationDropdown, notification cards, hooks
│   │   ├── friends/                  # FriendsTabs, FriendCard, friend action hooks
│   │   ├── blood/                    # BloodRequestCard, BloodSidebar, donation hooks
│   │   ├── search/                   # SearchDrawer, search input, recent history
│   │   └── profile/                  # ProfileView, ProfileHeader, edit forms
│   │
│   ├── components/                   # Reusable shared UI & Layout components
│   │   ├── ui/                       # Button, Input, Card, Modal, Badge, Dropdown, Skeleton
│   │   ├── layout/                   # Container, Sidebar (Left), RightSidebar, SectionLayout
│   │   ├── navigation/               # Navbar (Desktop 3-column), MobileNav, SectionSidebar
│   │   └── common/                       # ArabicText, BookmarkButton, ShareButton, Avatar
│   │
│   ├── lib/                          # Core utilities & singleton services
│   │   ├── api/client.ts             # Axios client with JWT attachment & 401 refresh
│   │   ├── sound/soundEffects.ts     # Synthesized Web Audio API sound service
│   │   ├── query/query-client.ts     # TanStack Query client configuration
│   │   └── utils/                    # cn, date helpers, string formatting
│   │
│   ├── hooks/                        # Global hooks (useAuth, useDebounce, useLocalStorage)
│   ├── providers/                    # QueryProvider, AuthProvider, LanguageProvider, ThemeProvider
│   ├── stores/                       # Zustand stores (useAuthStore, useChatStore, useUiStore)
│   ├── types/                        # Global TypeScript interface definitions
│   └── constants/                    # API endpoints, routes, time slots, feeling presets
│
├── .env.example                      # Environment variables reference template
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.ts                # Tailwind design system configuration
├── tsconfig.json                     # TypeScript compiler options
└── package.json                      # Dependencies & package scripts
```

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | React framework with hybrid SSR/CSR & server components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strongly typed JavaScript with strict typing |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework with dark mode support |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/v5) | Async state manager, optimistic updates & cache invalidation |
| **Client State** | [Zustand](https://github.com/pmndrs/zustand) | Lightweight, hook-based state management |
| **HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP client with request/response interceptors |
| **Real-time WebSockets** | [Socket.IO Client](https://socket.io/) | Low-latency bi-directional messaging & live push notifications |
| **Event Streaming** | [Apache Kafka](https://kafka.apache.org/) | Distributed event backbone for async post processing & media jobs |
| **In-Memory Caching** | [Redis](https://redis.io/) | Sub-millisecond feed & session caching layer |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **Sound Synthesis** | [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Native browser audio synthesis without asset downloads |

---

## ⚡ Event-Driven Architecture (Kafka & Redis)

PeaceTweet uses an **event-driven distributed architecture** where the Next.js frontend interacts seamlessly with backend microservices orchestrated via **Apache Kafka** and cached through **Redis**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 14 Frontend                             │
│   (Optimistic UI, TanStack Query v5 Caching, Socket.IO WebSockets)     │
└───────────────────▲────────────────────────────────┬───────────────────┘
                    │                                │
      Real-Time     │                                │ HTTP / REST &
      Socket Events │                                │ Multi-part Uploads
                    │                                │
┌───────────────────┴────────────────────────────────▼───────────────────┐
│                      PeaceTweet Backend Gateway                        │
│                   (Express / NestJS Microservices)                     │
└───────────────────▲────────────────────────────────┬───────────────────┘
                    │                                │
       Cache Reads  │                                │ Produces Events
       & Fast Hits  │                                │
                    ▼                                ▼
       ┌────────────────────────┐       ┌────────────────────────┐
       │   Redis Cache Layer    │       │  Apache Kafka Broker   │
       │ (Valkey High-Speed KV) │       │ (Distributed Pipeline) │
       └────────────────────────┘       └───────────┬────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
      ┌───────────────────────┐                                             ┌───────────────────────┐
      │      Post Worker      │                                             │     Audio Worker      │
      │   (kafkajs Consumer)  │                                             │   (kafkajs Consumer)  │
      ├───────────────────────┤                                             ├───────────────────────┤
      │ • post.created        │                                             │ • dua.audio.requested │
      │ • post.shared         │                                             │ • dua.audio.processed│
      │ • Feed distribution   │                                             │ • Async FFmpeg extract│
      │ • Search re-indexing  │                                             │ • Waveform generation │
      └───────────────────────┘                                             └───────────────────────┘
```

### Kafka Topics in the Ecosystem:

1. **`post.created`**:
   - When a user submits a reflection, Masnoon Dua, or Blood Request in the Post Composer, the backend immediately responds to the frontend (`201 Created`) while dispatching the post event to Kafka.
   - The **Post Worker** asynchronously indexes the post, updates search tags, fans out the item to followers' timelines, and updates cached counters in Redis.

2. **`post.shared`**:
   - Tracks share engagement asynchronously, updating viral post metrics without blocking client navigation.

3. **`dua.audio.requested`**:
   - Heavy multimedia uploads (e.g., video recitation recordings) are enqueued to Kafka.
   - The dedicated **Audio Worker** consumes the job, extracts high-quality audio using FFmpeg, generates audio waveforms, and saves optimized audio files.

4. **`dua.audio.processed`**:
   - Emitted once extraction completes. The backend receives this event, updates the database, and pushes the ready audio link to the frontend via Socket.IO in real-time.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- **Node.js**: v18.17.0 or higher
- **pnpm**: v8.0.0 or higher (or `npm` / `yarn`)

### Installation

1. **Clone repository & enter frontend directory:**
   ```bash
   cd peacetweet_frontend
   ```

2. **Install project dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *(See [Environment Configuration](#-environment-configuration) below for details)*

4. **Run the local development server:**
   ```bash
   pnpm dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root of `peacetweet_frontend/`:

```env
# Backend REST API endpoint (Express / NestJS backend)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Real-time WebSocket Gateway URL (Socket.IO)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Site Metadata
NEXT_PUBLIC_APP_NAME="PeaceTweet"
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Meta (Facebook) OAuth credentials (Optional)
NEXT_PUBLIC_META_APP_ID=
NEXT_PUBLIC_META_REDIRECT_URI=http://localhost:3000/api/auth/facebook/callback
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=http://localhost:3000/api/auth/facebook/callback
```

---

## 📜 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `pnpm dev` | Starts local Next.js development server on port `3000` |
| `build` | `pnpm build` | Compiles production-optimized client and server bundles |
| `start` | `pnpm start` | Runs the compiled production build on port `3000` |
| `lint` | `pnpm lint` | Runs ESLint analysis across TypeScript & JSX files |
| `type-check` | `pnpm tsc --noEmit` | Runs strict TypeScript compiler verification |

---

## 🔊 Audio & Sound Effects Engine

PeaceTweet implements a zero-overhead Web Audio synthesis engine located in [`src/lib/sound/soundEffects.ts`](src/lib/sound/soundEffects.ts). Rather than downloading large audio assets over the network, sounds are generated on-the-fly using trigonometric oscillator nodes, exponential gain ramps, and harmonic overtones:

```typescript
import { soundEffects } from '@/lib/sound/soundEffects';

// Trigger celebratory chime when accepting a friend
soundEffects.playFriendAccept();

// Trigger crisp trash discard tone when deleting content
soundEffects.playDelete();

// Trigger subtle bubble pop when liking a post
soundEffects.playReaction();
```

Users can toggle sound effects globally at any time, with preferences automatically persisted in `localStorage`.

---

## 🔌 Real-time WebSocket Integration

Real-time capabilities are orchestrated via `Socket.IO` connected to the backend server:

- **Private Chat Events**: `send_message`, `receive_message`, `typing_indicator`, `message_read`.
- **Notification Events**: `notification_received`, `unread_notifications_count`.
- **Auto Reconnection**: Reconnects with JWT token renewal on session restore.

---

## 🎨 Design System & Responsive Layout

PeaceTweet employs a Facebook-grade 3-column responsive layout:

- **Left Column** (`w-60 xl:w-64`): Navigation sidebar, profile shortcuts, routine time slots.
- **Center Column** (`w-full max-w-2xl`): Feed stream, Story bar, post composers, Dua details.
- **Right Column** (`w-72 xl:w-80`): Interactive Digital Tasbih widget, Trending topics, blood requests.
- **Mobile (< 1024px)**: Bottom safe-area navigation bar (`MobileNav`), slide-over drawer menus, and floating Tasbih drawer modal.

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](../LICENSE).
