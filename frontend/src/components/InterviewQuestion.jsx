import { Mic, Square } from 'lucide-react';

export default function InterviewQuestion({
  question,
  questionNumber,
  totalQuestions,
  answer,
  setAnswer,
  isRecording,
  onStartRecording,
  onStopRecording,
  speechSupported,
  onSubmit,
  onSkip,
}) {
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold leading-snug text-white sm:text-2xl">
        {question}
      </h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={6}
        placeholder="Type your answer here, or use the microphone to speak..."
        className="input-field mt-5 resize-none"
        aria-label="Your answer"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {speechSupported && !isRecording && (
          <button onClick={onStartRecording} className="btn-ghost py-2.5 text-sm">
            <Mic className="h-4 w-4" />
            Start Recording
          </button>
        )}
        {speechSupported && isRecording && (
          <button
            onClick={onStopRecording}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
          >
            <Square className="h-4 w-4" />
            Stop Recording
          </button>
        )}
        <button onClick={onSubmit} className="btn-primary py-2.5 text-sm">
          Submit Answer
        </button>
        <button onClick={onSkip} className="btn-ghost py-2.5 text-sm">
          Skip
        </button>
      </div>

      {!speechSupported && (
        <p className="mt-4 text-xs text-slate-500">
          Speech recognition isn't available in this browser, so you can type your answer instead.
        </p>
      )}
      {isRecording && (
        <p className="mt-4 inline-flex items-center gap-2 text-xs text-rose-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
          Listening... speak clearly.
        </p>
      )}
    </div>
  );
}
