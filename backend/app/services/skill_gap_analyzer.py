
from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


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

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_completion_tokens=1536
    )

    return response.choices[0].message.content
