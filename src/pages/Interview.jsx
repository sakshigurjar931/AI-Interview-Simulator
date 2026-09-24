import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import InterviewQuestion from '../components/InterviewQuestion';
import { getRoleById } from '../data/roles';
import { getQuestionsForRole } from '../data/questions';
import { generateScores, generateFeedback, generateSkillGaps, getRecommendations } from '../services/api';
import { addInterviewRecord, setLastResult } from '../utils/storage';

export default function Interview() {
  const navigate = useNavigate();
  const roleId = localStorage.getItem('ais_selected_role') || 'software-engineer';
  const role = getRoleById(roleId);
  const questions = useMemo(() => getQuestionsForRole(roleId), [roleId]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const speechSupported =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const startRecording = () => {
    if (!speechSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setAnswer(text);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const storeAnswer = (text) => {
    const updated = [...answers];
    updated[current] = { question: questions[current], answer: text };
    setAnswers(updated);
  };

  const handleSubmit = () => {
    storeAnswer(answer);
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setAnswer('');
    } else {
      finish([...answers, { question: questions[current], answer }]);
    }
  };

  const handleSkip = () => {
    storeAnswer('');
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setAnswer('');
    } else {
      finish([...answers, { question: questions[current], answer: '' }]);
    }
  };

  const finish = (allAnswers) => {
    stopRecording();
    const valid = allAnswers.filter((a) => a.answer && a.answer.trim());
    const scores = generateScores(valid.length ? valid : [{ answer: ' ' }]);
    const feedback = generateFeedback(scores);
    const skillGaps = generateSkillGaps(roleId, scores);
    const recommendations = getRecommendations(skillGaps);
    const record = {
      id: `int-${Date.now()}`,
      role: role.name,
      roleId,
      date: new Date().toISOString().slice(0, 10),
      score: scores.overall,
      performance: scores.overall >= 80 ? 'Great' : scores.overall >= 65 ? 'Good' : 'Average',
      scores,
      feedback,
      skillGaps,
      recommendations,
      answers: allAnswers,
    };
    addInterviewRecord(record);
    setLastResult(record);
    navigate('/results');
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              {role.name}
            </span>
            <h1 className="mt-1 text-2xl font-bold text-white">Mock Interview</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-blue-500/25 bg-[#061432] px-4 py-2.5 text-sm font-medium text-white">
            <Clock className="h-4 w-4 text-cyan-400" />
            {formatTime(seconds)}
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-400">Question {current + 1} of {questions.length}</p>
        </div>

        <div className="mt-8 max-w-3xl">
          <InterviewQuestion
            question={questions[current]}
            questionNumber={current + 1}
            totalQuestions={questions.length}
            answer={answer}
            setAnswer={setAnswer}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            speechSupported={!!speechSupported}
            onSubmit={handleSubmit}
            onSkip={handleSkip}
          />
        </div>

        <button
          onClick={finish}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white"
        >
          Finish & See Results
          <ArrowRight className="h-4 w-4" />
        </button>
      </main>
    </div>
  );
}
