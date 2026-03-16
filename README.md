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
