import json

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


def get_book_recommendation(books):
    client = OpenAI()

    recommendation_function = {
        "name": "recommend_book", 
        "description": "Recommend a book based on the user's reading preferences.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The title of the recommended book."
                },
                "reason": {
                    "type": "string",
                    "description": "Why this book is a great match for the user'"
                },
            },
            "required": ["title", "reason"]
        }
    }

    summarizer_function = {
        "name": "summarize_user_taste",
        "description": (
            "Summarize the user's literary taste based on all their favorite books "
            "using a warm, personality-insighful tone (Barnum effect-style)"
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "taste_summary": {
                    "type": "string",
                    "description": "A poetic, insightful summary of what the user's taste says about them"
                }
            },
            "required": ["taste_summary"]
        },
    }

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": (
                "You are a friendly and insightful book guide with a deep knowledge of literature across all genres. "
                "Your role is to help readers discover their next great read. "
                "The user will share three books they’ve enjoyed. Based on that, you'll analyze their reading preferences—"
                "themes, tone, genre, emotional depth, and narrative style—and offer a thoughtful recommendation. "
                "Your response should include: a well-matched book recommendation, a summary of the user's likely tastes,  "
                "and a compelling explanation for why this book is a great fit. Be enthusiastic, clear, and welcoming in tone."
            )},
            {"role": "user", "content": (
                f"These are the books I really liked: {books}. "
                "What would you recommend I read next? "
                "I’d love to find something new that builds on it or surprises me"
                "and maybe hear what you think this says about my taste."
            )}
        ],
        tools=[
            {"type": "function", "function": recommendation_function},
        ],
        tool_choice="auto"
    )

    tool_calls = response.choices[0].message.tool_calls

    for tool_call in tool_calls:
        tool_name = tool_call.function.name
        if tool_name == "recommend_book":
            recommendation = json.loads(tool_call.function.arguments)

    return recommendation
