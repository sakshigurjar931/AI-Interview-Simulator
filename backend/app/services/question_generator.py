import time

from google import genai
from google.genai import errors

from app.core.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def generate_questions(
    job_role: str,
    difficulty: str = "Medium",
    count: int = 5
):
    prompt = f"""
You are an expert technical interviewer.

Generate {count} interview questions for the job role: {job_role}.

Difficulty level: {difficulty}

Include a mixture of:
- Technical questions
- Conceptual questions
- Practical/project-based questions

Return only the questions as a numbered list.
"""

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt
            )

            return response.text

        except errors.ServerError as e:
            if attempt == 2:
                raise e

            time.sleep(3 * (attempt + 1))