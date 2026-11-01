import { useEffect, useState } from "react";

function Submission() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://assessment-api-batch-01-1.onrender.com/api/submissions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load submissions");
            }

            const data = await response.json();
            setSubmissions(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load submissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Submissions
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Review student assessment submissions and results.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                    <div className="w-10 h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-slate-400 mt-4">Loading submissions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Submissions
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Review student assessment submissions and results.
                    </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            ⚠️
                        </div>

                        <div>
                            <h2 className="font-bold text-red-800">
                                Unable to load submissions
                            </h2>

                            <p className="text-red-600 text-sm mt-1">{error}</p>

                            <button
                                type="button"
                                onClick={() => {
                                    setLoading(true);
                                    setError("");
                                    fetchSubmissions();
                                }}
                                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
                        Submissions
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Review student assessment submissions and results.
                    </p>
                </div>

                <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-lg">📤</span>

                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total submissions</p>
                        <p className="font-bold text-blue-600">{submissions.length}</p>
                    </div>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-12 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">No submissions yet</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Student assessment submissions will appear here.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900  border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 md:px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Student Submissions
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Latest assessment activity
                                </p>
                            </div>

                            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                                {submissions.length}{" "}
                                {submissions.length === 1 ? "submission" : "submissions"}
                            </span>
                        </div>
                    </div>

                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Student
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Assessment
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Score
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Result
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Submitted
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {submissions.map((submission) => {
                                    const percentage = submission.percentage ?? submission.score ?? 0;
                                    const result =
                                        submission.result || (percentage >= 50 ? "passed" : "failed");

                                    return (
                                        <tr
                                            key={submission._id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800  transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                        {(submission.studentId?.name || "U")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                                                            {submission.studentId?.name || "Unknown Student"}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                            {submission.studentId?.email || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-medium text-slate-700 dark:text-slate-200">
                                                    {submission.assessmentId?.title || "N/A"}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                <p className="font-bold text-blue-600">{percentage}%</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    {submission.score ?? 0} correct
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                        result === "passed"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    <span>{result === "passed" ? "✓" : "✕"}</span>
                                                    {result === "passed" ? "Passed" : "Failed"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                                                        submission.status === "scored"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {submission.status || "Unknown"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {submission.createdAt
                                                    ? new Date(submission.createdAt).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {submissions.map((submission) => {
                            const percentage = submission.percentage ?? submission.score ?? 0;
                            const result =
                                submission.result || (percentage >= 50 ? "passed" : "failed");

                            return (
                                <div key={submission._id} className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                            {(submission.studentId?.name || "U")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                {submission.studentId?.name || "Unknown Student"}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {submission.studentId?.email || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                            Assessment
                                        </p>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">
                                            {submission.assessmentId?.title || "N/A"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-5">
                                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl p-3">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
                                            <p className="text-xl font-bold text-blue-600 mt-1">
                                                {percentage}%
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {submission.score ?? 0} correct
                                            </p>
                                        </div>

                                        <div
                                            className={`rounded-xl border p-3 ${
                                                result === "passed"
                                                    ? "bg-emerald-50 border-emerald-100"
                                                    : "bg-red-50 border-red-100"
                                            }`}
                                        >
                                            <p className="text-xs text-slate-500">Result</p>
                                            <p
                                                className={`text-xl font-bold mt-1 ${
                                                    result === "passed"
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {result === "passed" ? "Passed" : "Failed"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                                        <span
                                            className={`text-sm font-semibold capitalize ${
                                                submission.status === "scored"
                                                    ? "text-blue-600"
                                                    : "text-amber-600"
                                            }`}
                                        >
                                            {submission.status || "Unknown"}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-4">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Submitted</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right">
                                            {submission.createdAt
                                                ? new Date(submission.createdAt).toLocaleString()
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Submission;