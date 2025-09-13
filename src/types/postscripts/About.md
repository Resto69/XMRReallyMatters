# XMRMatters

## Project Overview
XMRMatters is a privacy-focused, peer-to-peer trading platform for Monero (XMR). The application enables users to buy, sell, and manage XMR transactions securely and anonymously, emphasizing user privacy, security, and global accessibility.

## Vision & Goals
- Empower users to trade Monero without KYC or personal data exposure
- Provide a seamless, secure, and responsive user experience
- Integrate advanced privacy features (Tor, encryption, stealth addresses)
- Support global trading with diverse payment methods

## Features & Functionality
- User registration/login with privacy options
- Browse, filter, and search offers
- Create and manage buy/sell offers
- Secure multi-signature escrow system
- Trade management and dispute resolution
- Wallet creation, restoration, and transaction management
- Notifications, profile management, achievements
- Help/FAQ and onboarding guidance

## Architecture & Tech Stack
- **Frontend:** React (functional components, hooks), TypeScript
- **Routing:** React Router
- **State Management:** Context API
- **UI:** Tailwind CSS, framer-motion, custom UI components
- **API Layer:** Mocked service, ready for backend integration
- **Build Tools:** Vite, ESLint, PostCSS

## Key Folders & Files
- `src/components/UI/` – Reusable UI elements (Button, Card, Input, Modal)
- `src/components/Layout/` – Layout components (Header)
- `src/pages/` – Main app pages (Home, Browse, OfferDetails, Wallet, Trades, Profile, Notifications, Help, CreateOffer, Login, Register)
- `src/context/` – App-wide state management
- `src/hooks/` – Custom hooks (useWallet, useTransactions)
- `src/services/` – API service abstraction
- `src/types/` – TypeScript interfaces for all data models
- `index.html`, `index.css` – Entry point and global styles
- `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js` – Build and lint configs

## Data Flow & Integrations
- Context API manages user, wallet, trades, notifications, and app state
- API service simulates backend calls, ready for real integration
- UI components consume context and API data
- Routing controls navigation between pages

## Security & Privacy
- No KYC required; user privacy is paramount
- Tor integration and end-to-end encryption (planned)
- Secure wallet operations and escrow
- Input validation and error handling throughout

## Performance & Responsiveness
- Vite for fast builds and HMR
- Tailwind for responsive design
- Framer-motion for smooth UI transitions

## Testing & Quality
- ESLint for code quality
- TypeScript for type safety
- Modular, reusable components
- (Add unit/integration tests as roadmap item)

## Roadmap
- Integrate real backend API and database
- Implement Tor and encryption features
- Add unit/integration tests
- Expand payment method support
- Enhance dispute and notification systems
- Improve accessibility and mobile UX

## Known Issues
- API is currently mocked; no real backend
- No test coverage yet
- Some advanced privacy features are planned but not implemented

## Contribution Guidelines
- Use TypeScript and React best practices
- Keep code modular, documented, and secure
- Follow established coding style and linting rules
- Submit PRs with clear descriptions and test coverage
- Respect privacy and security principles
