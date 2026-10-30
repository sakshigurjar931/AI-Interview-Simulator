
from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def evaluate_answer(question: str, answer: str):

    prompt = f"""
You are an expert technical interviewer.

Evaluate the candidate's answer to the interview question.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer on a scale of 0 to 10.

Return the result in exactly this format:

Score: <number>/10
Strengths: <what the candidate did well>
Weaknesses: <what is missing or incorrect>
Suggestion: <how the candidate can improve>

Be fair and consider correctness, relevance, clarity, and completeness.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_completion_tokens=1024
    )

    return response.choices[0].message.content
