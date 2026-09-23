from google import genai

from app.core.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def generate_feedback(job_role: str, evaluations: str):
    prompt = f"""
You are an expert interview coach.

Generate a final interview feedback report for the candidate.

Job Role:
{job_role}

Individual Answer Evaluations:
{evaluations}

Provide:

Overall Score: <score out of 10>

Strengths:
- <strength 1>
- <strength 2>

Weaknesses:
- <weakness 1>
- <weakness 2>

Suggestions:
- <suggestion 1>
- <suggestion 2>

Keep the feedback constructive, specific, and useful for improving interview performance.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text