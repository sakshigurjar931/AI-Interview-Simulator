
from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


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

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_completion_tokens=1536
    )

    return response.choices[0].message.content
