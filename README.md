<<<<<<< HEAD
# Lineup Docker Setup

Run the full project with Docker:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017/lineup`

Notes:

- The frontend container serves the Vite build through Nginx.
- Nginx proxies `/api` and `/socket.io` to the backend container.
- `docker-compose.yml` overrides `MONGO_URI` to use the local `mongo` service.
- The backend still reads the rest of its environment values from `backend/.env`.
=======
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
>>>>>>> d4871f62e8c745106794251ee20978ca878277c3
