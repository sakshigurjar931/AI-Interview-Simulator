
from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def generate_questions(
    job_role: str,
    difficulty: str = "Medium",
    count: int = 5
):
    prompt = f"""
You are an expert technical interviewer.

Generate exactly {count} interview questions
for the job role: {job_role}.

Difficulty level: {difficulty}

Include a mixture of:
- Technical questions
- Conceptual questions
- Practical/project-based questions

Return only the questions as a numbered list.
Do not include answers or explanations.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_completion_tokens=2048
    )

    return response.choices[0].message.content
