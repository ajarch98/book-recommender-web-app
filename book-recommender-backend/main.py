from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import logging

from src.chatgpt_util import get_book_recommendation

logger = logging.getLogger(__name__)

class BookList(BaseModel):
    books: list

origins = [
    "http://localhost:5173",
    "https://book-recommender-web-app-foze.onrender.com",
    "https://book-recs.advaitjoshi.com",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/book-recommendation")
async def recommend(booklist: BookList):
    try:
        recommendation = get_book_recommendation(booklist.books)
        logger.info(recommendation)
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))