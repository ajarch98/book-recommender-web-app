# Makefile

.PHONY: backend frontend

# Run the FASTAPI app using uvicorn
backend:
	book-recommender-backend/.venv/bin/fastapi dev book-recommender-backend/main.py --port=8000

# Run the React front-end
frontend:
	cd book-recommender-frontend && npm run dev -- --port 8001