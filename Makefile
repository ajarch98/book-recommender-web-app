# Makefile

.PHONY: backend frontend

# Run the FASTAPI app using uvicorn
backend:
	cd book-recommender-backend && uv run uvicorn main:app --port=8000

# Run the React front-end
frontend:
	cd book-recommender-frontend && npm run dev -- --port 8001