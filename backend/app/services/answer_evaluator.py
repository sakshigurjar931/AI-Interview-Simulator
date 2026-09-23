from google import genai

from app.core.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


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

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text