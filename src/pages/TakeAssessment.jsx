import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function TakeAssessment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [assessment, setAssessment] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    const submittingRef = useRef(false);
    const submittedRef = useRef(false);
    const autoSubmitTriggered = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const loadAssessment = async () => {
            try {
                setLoading(true);
                setError("");

                const [assessmentResponse, questionResponse] =
                    await Promise.all([
                        api.get("/assessments"),
                        api.get(`/questions/${id}`),
                    ]);

                if (cancelled) return;

                const assessmentList = Array.isArray(
                    assessmentResponse.data.assessments
                )
                    ? assessmentResponse.data.assessments
                    : [];

                const foundAssessment = assessmentList.find(
                    (item) => item._id === id
                );

                if (!foundAssessment) {
                    throw new Error("Assessment not found.");
                }

                const questionList = Array.isArray(questionResponse.data)
                    ? questionResponse.data
                    : [];

                setAssessment(foundAssessment);
                setQuestions(questionList);

                const duration = Math.max(
                    0,
                    Number(foundAssessment.duration) || 0
                );

                setTimeLeft(duration * 60);
            } catch (err) {
                if (!cancelled) {
                    console.error(
                        "ASSESSMENT LOAD ERROR:",
                        err.response?.data || err.message
                    );

                    setError(
                        err.message === "Assessment not found."
                            ? err.message
                            : "Unable to load this assessment. Please try again."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadAssessment();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSubmitAssessment = useCallback(
        async (automatic = false) => {
            if (submittingRef.current || submittedRef.current) return;

            submittingRef.current = true;
            setIsSubmitting(true);
            setSubmitError("");

            try {
                const formattedAnswers = Object.entries(answers).map(
                    ([questionId, answer]) => ({
                        questionId,
                        answer,
                    })
                );

                const response = await api.post("/submissions", {
                    assessmentId: id,
                    answers: formattedAnswers,
                });

                const result = response.data;

                setSubmissionResult({
                    score: result.score,
                    percentage: result.percentage,
                });
                submittedRef.current = true;
                setSubmitted(true);
            } catch (err) {
                console.error(
                    "SUBMIT ERROR:",
                    err.response?.data || err.message
                );

                const message =
                    err.response?.data?.message ||
                    "Submission failed. Please try again.";

                setSubmitError(
                    automatic
                        ? `Time is up. Your answers could not be submitted automatically. ${message}`
                        : message
                );

                if (automatic) {
                    autoSubmitTriggered.current = true;
                }
            } finally {
                submittingRef.current = false;
                setIsSubmitting(false);
            }
        },
        [answers, id]
    );

    useEffect(() => {
        if (
            timeLeft === null ||
            loading ||
            submitted ||
            isSubmitting
        ) {
            return;
        }

        if (timeLeft <= 0) {
            if (!autoSubmitTriggered.current) {
                autoSubmitTriggered.current = true;
                handleSubmitAssessment(true);
            }

            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((previous) =>
                previous === null
                    ? null
                    : Math.max(0, previous - 1)
            );
        }, 1000);

        return () => clearTimeout(timer);
    }, [
        timeLeft,
        loading,
        submitted,
        isSubmitting,
        handleSubmitAssessment,
    ]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: answer,
        }));
    };

    const formatTime = (seconds) => {
        const safeSeconds = Math.max(0, seconds ?? 0);
        const minutes = Math.floor(safeSeconds / 60);
        const remainingSeconds = safeSeconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    <p className="mt-4 text-slate-600">
                        Loading your assessment...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-white p-6 sm:p-8">
                <div className="text-3xl">⚠️</div>

                <h1 className="mt-3 text-xl font-bold text-slate-800">
                    Unable to open assessment
                </h1>

                <p className="mt-2 text-sm text-red-600">{error}</p>

                <button
                    type="button"
                    onClick={() => navigate("/student/assessments")}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                    Back to Assessments
                </button>
            </div>
        );
    }

    if (submitted) {
        const hasScore =
            submissionResult?.score !== undefined &&
            submissionResult?.score !== null;

        const hasPercentage =
            submissionResult?.percentage !== undefined &&
            submissionResult?.percentage !== null;

        return (
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                    ✓
                </div>

                <p className="mt-5 text-sm font-bold uppercase tracking-wider text-emerald-600">
                    Submission successful
                </p>

                <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Assessment submitted!
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                    Your answers have been recorded. You can review your
                    performance on the Results page.
                </p>

                {(hasScore || hasPercentage) && (
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {hasScore && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Your score
                                </p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">
                                    {submissionResult.score}
                                </p>
                            </div>
                        )}

                        {hasPercentage && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                                <p className="text-sm text-emerald-700">
                                    Percentage
                                </p>
                                <p className="mt-2 text-3xl font-bold text-emerald-700">
                                    {submissionResult.percentage}%
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => navigate("/results")}
                    className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                    View My Results
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="text-4xl">📭</div>

                <h1 className="mt-4 text-xl font-bold text-slate-800">
                    No questions available
                </h1>

                <p className="mt-2 text-slate-500">
                    This assessment doesn't have any questions yet.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/student/assessments")}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                    Back to Assessments
                </button>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const isTimeLow = timeLeft !== null && timeLeft <= 60;

    return (
        <div className="mx-auto w-full min-w-0 max-w-5xl">
            <div className="mb-5 sm:mb-7">
                <p className="text-sm font-semibold text-blue-600">
                    ASSESSMENT IN PROGRESS
                </p>

                <h1 className="mt-2 break-words text-2xl font-bold leading-tight text-slate-800 sm:text-3xl lg:text-4xl">
                    {assessment.title}
                </h1>
                {assessment.description && (
                    <p className="mt-3 break-words text-sm leading-6 text-slate-500 sm:text-base">
                        {assessment.description}
                    </p>
                )}
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <p className="text-xs text-slate-500 sm:text-sm">
                        Duration
                    </p>

                    <p className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
                        {assessment.duration} minutes
                    </p>
                </div>

                <div
                    className={`rounded-xl border p-3 shadow-sm sm:p-4 ${
                        isTimeLow
                            ? "border-red-200 bg-red-50"
                            : "border-blue-100 bg-blue-50"
                    }`}
                >
                    <p className="text-xs text-slate-500 sm:text-sm">
                        Time remaining
                    </p>

                    <p
                        className={`mt-1 text-xl font-bold tabular-nums sm:text-2xl ${
                            isTimeLow ? "text-red-600" : "text-blue-700"
                        }`}
                        aria-live={isTimeLow ? "polite" : "off"}
                    >
                        ⏱️ {formatTime(timeLeft)}
                    </p>
                </div>
            </div>

            <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <p className="shrink-0 text-xs font-medium text-slate-500 sm:text-sm">
                        {answeredCount} / {questions.length} answered
                    </p>
                </div>

                <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-valuenow={currentQuestion + 1}
                    aria-valuemin={1}
                    aria-valuemax={questions.length}
                    aria-label="Question progress"
                >
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-4 sm:p-7 md:p-8">
                    <div className="mb-5 inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 sm:text-sm">
                        QUESTION {currentQuestion + 1}
                    </div>

                    <h2 className="break-words text-lg font-bold leading-7 text-slate-800 sm:text-2xl sm:leading-9">
                        {question.questionText}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Select one answer.
                    </p>

                    <div className="mt-6 space-y-3">
                        {question.options.map((option, index) => {
                            const selected =
                                answers[question._id] === option;

                            return (
                                <label
                                    key={`${question._id}-${index}`}
                                    className={`flex min-w-0 items-start gap-3 rounded-xl border p-3 transition sm:gap-4 sm:p-4 ${
                                        isSubmitting
                                            ? "cursor-not-allowed opacity-70"
                                            : "cursor-pointer"
                                    } ${
                                        selected
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={question._id}
                                        value={option}
                                        checked={selected}
                                        disabled={isSubmitting}
                                        onChange={() =>
                                            handleAnswerChange(
                                                question._id,
                                                option
                                            )
                                        }
                                        className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                                    />

                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                            selected
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </span>

                                    <span className="min-w-0 flex-1 break-words text-sm leading-6 text-slate-700 sm:text-base">
                                        {option}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {submitError && (
                        <div
                            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                            role="alert"
                        >
                            <p className="font-semibold">
                                We couldn't submit your assessment.
                            </p>

                            <p className="mt-1">{submitError}</p>

                            <button
                                type="button"
                                onClick={() =>
                                    handleSubmitAssessment(
                                        timeLeft !== null && timeLeft <= 0
                                    )
                                }
                                disabled={isSubmitting}
                                className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Try Submission Again"}
                            </button>
                        </div>
                    )}

                    <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
                        <button
                            type="button"
                            disabled={currentQuestion === 0 || isSubmitting}
                            onClick={() =>
                                setCurrentQuestion(
                                    (previous) => previous - 1
                                )
                            }
                            className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-32 sm:px-5"
                        >
                            ← Previous
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() =>
                                    setCurrentQuestion(
                                        (previous) => previous + 1
                                    )
                                }
                                className="flex min-h-12 items-center justify-center gap-1 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32 sm:px-5"
                            >
                                Next Question →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleSubmitAssessment(false)}
                                disabled={isSubmitting || answeredCount === 0}
                                className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:min-w-44 sm:px-6"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : "✓ Submit Assessment"}
                            </button>
                        )}
                    </div>

                    <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                        Your selected answers are saved as you move between
                        questions.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TakeAssessment;