# Player Turn

**Live Demo:** [https://enigmaticmind.github.io/player-turn/](https://enigmaticmind.github.io/player-turn/)

A fun, interactive touch-based game where multiple players place their fingers on the screen and one is randomly chosen. Perfect for deciding turns, picking teams, or any random selection game!

## Features

- **Multi-Touch Support**: Each player can place their finger on the screen simultaneously
- **Visual Feedback**: Each touch point gets a unique colored glow with ripple effects
- **Random Selection**: After a brief moment, one finger is randomly chosen
- **Audio Effects**: Sound effects enhance the gameplay experience
- **Progressive Web App (PWA)**: Installable on mobile devices and desktops
- **Touch-Optimized**: Designed specifically for touchscreen devices

## How It Works

1. Tap "Start Game" to begin
2. Have each player place their finger on the screen
3. Each touch point appears with a colored glow
4. After 2 seconds, one finger is randomly selected
5. The selected touch point is highlighted for 4 seconds
6. The game resets automatically for the next round

## Tech Stack

- **React Router v7** - Framework and routing
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Deployment

The app is deployed to GitHub Pages using `gh-pages`:

```bash
npm run deploy
```

## Project Structure

```
app/
  ├── components/        # Reusable components
  │   ├── TouchGlow.tsx  # Main game component with touch detection
  │   ├── ProgressBar.tsx # Progress indicator during selection
  │   └── *.mp3          # Audio effects
  ├── routes/            # Route components
  │   └── home.tsx       # Home page route
  ├── welcome/           # Welcome screen
  │   └── welcome.tsx    # Landing page with install prompt
  ├── root.tsx           # Root component
  ├── routes.ts          # Route configuration
  └── app.css            # Global styles

public/                  # Static assets
  ├── icon-*.png         # PWA icons
  ├── icon.svg           # App icon
  └── manifest.json      # PWA manifest

Configuration files:
  ├── package.json       # Dependencies and scripts
  ├── tsconfig.json      # TypeScript configuration
  ├── vite.config.ts     # Vite build configuration
  └── react-router.config.ts # React Router configuration
```

## License

Private project - All rights reserved
