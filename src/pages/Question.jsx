import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const emptyForm = {
    assessmentId: "",
    questionText: "",
    options: "",
    correctAnswer: "",
};

function Question() {
    const [searchParams] = useSearchParams();
    const assessmentId = searchParams.get("assessmentId") || "";

    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [deletingQuestion, setDeletingQuestion] = useState(null);

    const [assessmentTitle, setAssessmentTitle] = useState("");
    const [questions, setQuestions] = useState([]);

    const [formData, setFormData] = useState({
        ...emptyForm,
        assessmentId,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [notification, setNotification] = useState(null);

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = assessmentId
                ? await api.get(`/questions/${assessmentId}`)
                : await api.get("/questions");

            const data = response.data;

            setQuestions(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.questions)
                      ? data.questions
                      : []
            );

            if (assessmentId) {
                const assessmentResponse = await api.get(
                    `/assessments/${assessmentId}`
                );

                setAssessmentTitle(
                    assessmentResponse.data.title || "Selected Assessment"
                );
            } else {
                setAssessmentTitle("");
            }
        } catch (err) {
            console.error(
                "QUESTIONS ERROR:",
                err.response?.data || err.message
            );

            setError("Unable to load questions. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [assessmentId]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => setNotification(null), 4000);
        return () => clearTimeout(timer);
    }, [notification]);

    const resetForm = () => {
        setFormData({
            ...emptyForm,
            assessmentId,
        });

        setEditingQuestion(null);
        setFormError("");
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        resetForm();
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
    };

    const handleEditQuestion = (question) => {
        const questionAssessmentId =
            question.assessmentId?._id ||
            question.assessmentId ||
            assessmentId;

        setEditingQuestion(question);

        setFormData({
            assessmentId: questionAssessmentId || "",
            questionText: question.questionText || "",
            options: Array.isArray(question.options)
                ? question.options.join(", ")
                : question.options || "",
            correctAnswer: question.correctAnswer || "",
        });

        setFormError("");
        setShowModal(true);
    };

    const handleSubmitQuestion = async (event) => {
        event.preventDefault();

        if (saving) return;

        const questionText = formData.questionText.trim();
        const options = formData.options
            .split(",")
            .map((option) => option.trim())
            .filter(Boolean);
        const correctAnswer = formData.correctAnswer.trim();

        if (!formData.assessmentId) {
            setFormError("Please select an assessment for this question.");
            return;
        }

        if (!questionText) {
            setFormError("Please enter the question.");
            return;
        }

        if (options.length < 2) {
            setFormError("Enter at least two answer options.");
            return;
        }

        if (
            new Set(options.map((option) => option.toLowerCase())).size !==
            options.length
        ) {
            setFormError("Answer options must be unique.");
            return;
        }

        if (!correctAnswer) {
            setFormError("Please enter the correct answer.");
            return;
        }

        const matchingOption = options.find(
            (option) => option.toLowerCase() === correctAnswer.toLowerCase()
        );

        if (!matchingOption) {
            setFormError(
                "The correct answer must exactly match one of your answer options."
            );
            return;
        }

        setSaving(true);
        setFormError("");

        try {
            const payload = {
                assessmentId: formData.assessmentId,
                questionText,
                options,
                correctAnswer: matchingOption,
            };

            if (editingQuestion) {
                await api.put(`/questions/${editingQuestion._id}`, payload);
            } else {
                await api.post("/questions", payload);
            }

            const wasEditing = Boolean(editingQuestion);

            setShowModal(false);
            resetForm();

            await fetchQuestions();

            setNotification({
                type: "success",
                message: wasEditing
                    ? "Question updated successfully."
                    : "Question created successfully.",
            });
        } catch (err) {
            console.error(
                "SAVE QUESTION ERROR:",
                err.response?.data || err.message
            );

            setFormError(
                err.response?.data?.message ||
                    "Unable to save the question. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteQuestion = async () => {
        if (!deletingQuestion || deleting) return;

        setDeleting(true);

        try {
            await api.delete(`/questions/${deletingQuestion._id}`);

            setDeletingQuestion(null);

            await fetchQuestions();

            setNotification({
                type: "success",
                message: "Question deleted successfully.",
            });
        } catch (err) {
            console.error(
                "DELETE QUESTION ERROR:",
                err.response?.data || err.message
            );

            setDeletingQuestion(null);

            setNotification({
                type: "error",
                message:
                    err.response?.data?.message ||
                    "Unable to delete the question. Please try again.",
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="mx-auto w-full min-w-0 max-w-7xl">
            {notification && (
                <div
                    role="status"
                    className={`mb-5 flex items-start gap-3 rounded-xl border p-4 ${
                        notification.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-red-200 bg-red-50 text-red-800"
                    }`}
                >
                    <span className="text-lg">
                        {notification.type === "success" ? "✓" : "⚠️"}
                    </span>

                    <p className="min-w-0 flex-1 text-sm font-medium">
                        {notification.message}
                    </p>

                    <button
                        type="button"
                        onClick={() => setNotification(null)}
                        aria-label="Dismiss notification"
                        className="shrink-0 rounded px-2 font-bold hover:bg-black/5"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 md:text-4xl">
                        {assessmentTitle ? "Assessment Questions" : "Questions"}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                        {assessmentTitle
                            ? `Manage questions for ${assessmentTitle}.`
                            : "Create and manage assessment questions."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
                >
                    <span className="text-lg">+</span>
                    Create Question
                </button>
            </div>

            {assessmentTitle && (
                <div className="mb-6">
                    <div className="inline-flex max-w-full items-center gap-3 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 px-4 py-3">
                        <span className="text-lg">📝</span>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-blue-500 dark:text-blue-300">
                                Assessment
                            </p>
                            <p className="break-words text-sm font-semibold text-blue-800 dark:text-blue-200">
                                {assessmentTitle}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
                    <span className="text-xl">❓</span>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total questions</p>
                        <p className="font-bold text-blue-600">
                            {questions.length}
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    <p className="mt-4 text-slate-500 dark:text-slate-400">Loading questions...</p>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
                    <h2 className="font-bold text-red-800">
                        Unable to load questions
                    </h2>
                    <p className="mt-2 text-sm text-red-700">{error}</p>
                    <button
                        type="button"
                        onClick={fetchQuestions}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            ) : questions.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm sm:p-12">
                    <div className="mb-4 text-5xl">❓</div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        No questions yet
                    </h2>
                    <p className="mb-6 mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {assessmentId
                            ? "This assessment does not have any questions yet."
                            : "Create your first question to get started."}
                    </p>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        + Create Question
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
                    {questions.map((question, index) => {
                        const options = Array.isArray(question.options)
                            ? question.options
                            : typeof question.options === "string"
                              ? question.options
                                    .split(",")
                                    .map((option) => option.trim())
                                    .filter(Boolean)
                              : [];

                        return (
                            <article
                                key={question._id}
                                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition hover:shadow-md"
                            >
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 font-bold text-blue-700 dark:text-blue-200">
                                            {index + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="break-words text-lg font-bold leading-7 text-slate-800 dark:text-slate-100">
                                                {question.questionText}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        {options.map((option, optionIndex) => {
                                            const isCorrect =
                                                option.trim().toLowerCase() ===
                                                question.correctAnswer
                                                    ?.trim()
                                                    .toLowerCase();

                                            return (
                                                <div
                                                    key={`${question._id}-${optionIndex}`}
                                                    className={`min-w-0 items-start gap-3 rounded-xl border px-3 py-3 sm:px-4 ${
                                                        isCorrect
                                                            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950"
                                                            : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                            isCorrect
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-500"
                                                        }`}
                                                    >
                                                        {String.fromCharCode(
                                                            65 + optionIndex
                                                        )}
                                                    </span>

                                                    <span
                                                        className={`min-w-0 flex-1 break-words pt-1 text-sm ${
                                                            isCorrect
                                                                ? "font-semibold text-emerald-800"
                                                                : "text-slate-700 dark:text-slate-200"
                                                        }`}
                                                    >
                                                        {option}
                                                    </span>

                                                    {isCorrect && (
                                                        <span className="shrink-0 pt-1 text-xs font-semibold text-emerald-600">
                                                            Correct
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-4 sm:px-6">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditQuestion(question)
                                            }
                                            className="rounded-lg bg-amber-100 px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-200"
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeletingQuestion(question)
                                            }
                                            className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-200"
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="question-modal-title"
                        className="my-auto max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 px-5 py-5 sm:px-6">
                            <div className="min-w-0">
                                <h2
                                    id="question-modal-title"
                                    className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl"
                                >
                                    {editingQuestion
                                        ? "Edit Question"
                                        : "Create New Question"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {editingQuestion
                                        ? "Update this question and its answers."
                                        : "Add a question to your assessment."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close modal"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitQuestion}>
                            <div className="space-y-5 p-5 sm:p-6">
                                {formError && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:text-red-300"
                                    >
                                        {formError}
                                    </div>
                                )}

                                {assessmentTitle && (
                                    <div className="rounded-xl bg-blue-50 dark:bg-blue-950 p-3">
                                        <p className="text-xs text-blue-600 dark:text-blue-300">
                                            Assessment
                                        </p>
                                        <p className="mt-1 break-words text-sm font-semibold text-blue-800 dark:text-blue-200">
                                            {assessmentTitle}
                                        </p>
                                    </div>
                                )}

                                {!assessmentId && (
                                    <div>
                                        <label
                                            htmlFor="question-assessment"
                                            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                                        >
                                            Assessment ID
                                        </label>
                                        <input
                                            id="question-assessment"
                                            name="assessmentId"
                                            value={formData.assessmentId}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter the assessment ID"
                                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                            Open Questions from an assessment card to fill this automatically.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="question-text"
                                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                                    >
                                        Question
                                    </label>
                                    <textarea
                                        id="question-text"
                                        name="questionText"
                                        value={formData.questionText}
                                        onChange={handleInputChange}
                                        placeholder="Enter your question..."
                                        rows={3}
                                        maxLength={2000}
                                        required
                                        className="w-full resize-y rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="question-options"
                                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                                    >
                                        Answer Options
                                    </label>
                                    <textarea
                                        id="question-options"
                                        name="options"
                                        value={formData.options}
                                        onChange={handleInputChange}
                                        placeholder="Option 1, Option 2, Option 3, Option 4"
                                        rows={3}
                                        required
                                        className="w-full resize-y rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-slate-500">
                                        Separate options with commas. Avoid commas inside an individual option.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="question-correct-answer"
                                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                                    >
                                        Correct Answer
                                    </label>
                                    <input
                                        id="question-correct-answer"
                                        type="text"
                                        name="correctAnswer"
                                        value={formData.correctAnswer}
                                        onChange={handleInputChange}
                                        placeholder="Enter the correct answer"
                                        required
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-3 font-medium text-slate-700 dark:text-slate-300 transition hover:bg-white dark:hover:bg-slate-600 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingQuestion
                                          ? "Update Question"
                                          : "Create Question"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingQuestion && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-question-title"
                        className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">
                            🗑️
                        </div>

                        <h2
                            id="delete-question-title"
                            className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100"
                        >
                            Delete question?
                        </h2>

                        <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Are you sure you want to delete this question? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeletingQuestion(null)}
                                disabled={deleting}
                                className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteQuestion}
                                disabled={deleting}
                                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? "Deleting..." : "Delete Question"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Question;