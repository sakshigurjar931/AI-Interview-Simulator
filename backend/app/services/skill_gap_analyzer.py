from google import genai

from app.core.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_skill_gap(job_role: str, feedback: str):
    prompt = f"""
You are an expert career and interview coach.

Analyze the candidate's interview performance and identify their skill gaps.

Job Role:
{job_role}

Interview Feedback:
{feedback}

Return the result in exactly this format:

Missing Skills:
- <skill 1>
- <skill 2>

Recommended Skills:
- <skill 1>
- <skill 2>

Learning Resources:
- <resource 1>
- <resource 2>

Focus on skills that are genuinely relevant to the specified job role.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text