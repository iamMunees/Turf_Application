# React + Vite
ArenaX is a modern sports community platform that allows players to discover nearby sports venues, book turf slots, join or host games, and connect with other players. 

The platform is designed to simplify sports coordination by providing real-time slot availability, player matchmaking, and event management in a single application.

Key Features:
• Venue discovery with filters for city, sport, price, and distance
• Slot booking system with dynamic player capacity
• Join games and track player lineup progress
• Player profiles with skill levels and positions
• Sports community feed for sharing highlights
• Messaging system to communicate with players
• Event and tournament management
• Secure authentication and user profiles

Tech Stack:
Frontend: React.js + Tailwind CSS  
Backend: Node.js + Express.js  
Database: MongoDB  
Authentication: JWT  
DevOps: Docker, Jenkins (CI/CD)

ArenaX aims to build a digital sports ecosystem where players can easily organize matches, discover venues, and build a sports community.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
