import { useEffect, useState } from "react";
import api from "../services/api";

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchResults = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/submissions/my-results");

            console.log("My results:", response.data);

            setResults(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(
                "RESULTS ERROR:",
                error.response?.data || error.message
            );

            setError("Unable to load your results.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        My Results
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Review your assessment performance and results.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center">
                    <div className="w-10 h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

                    <p className="text-slate-500 mt-4">
                        Loading your results...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        My Results
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Review your assessment performance and results.
                    </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-red-100 flex items-center justify-center">
                            ⚠️
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-bold text-red-800">
                                Unable to load results
                            </h2>

                            <p className="text-red-600 text-sm mt-1">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchResults}
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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
                        My Results
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Review your assessment performance and results.
                    </p>
                </div>
                {/* Results Count */}
                <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm self-start sm:self-auto">
                    <span className="text-lg">📊</span>

                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Completed assessments
                        </p>

                        <p className="font-bold text-blue-600">
                            {results.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {results.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 sm:p-12 text-center">
                    <div className="text-5xl mb-4">📭</div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        No results yet
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        You haven't completed any assessments yet.
                    </p>
                </div>
            ) : (
                /* Results */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
                    {results.map((result) => {
                        const percentage =
                            result.percentage ?? result.score ?? 0;

                        const resultStatus =
                            result.result ||
                            (percentage >= 50 ? "passed" : "failed");

                        const isPassed = resultStatus === "passed";

                        return (
                            <div
                                key={result._id}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden min-w-0"
                            >
                                {/* Card Header */}
                                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 break-words">
                                                {result.assessmentId?.title ||
                                                    "Assessment"}
                                            </h2>

                                            {result.assessmentId?.description && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-5 line-clamp-2">
                                                    {
                                                        result.assessmentId
                                                            .description
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Result Badge */}
                                        <span
                                            className={`shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                isPassed
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            <span>
                                                {isPassed ? "✓" : "✕"}
                                            </span>
                                            {isPassed ? "Passed" : "Failed"}
                                        </span>
                                    </div>
                                </div>

                                {/* Performance Stats */}
                                <div className="p-5 sm:p-6">
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        {/* Score */}
                                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl p-3 sm:p-4 min-w-0">
                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                                Score
                                            </p>

                                            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                                                {result.score ?? 0}
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                correct answers
                                            </p>
                                        </div>

                                        {/* Percentage */}
                                        <div
                                            className={`rounded-xl p-3 sm:p-4 border min-w-0 ${
                                                isPassed
                                                    ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900"
                                                    : "bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900"
                                            }`}
                                        >
                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                                Percentage
                                            </p>

                                            <p
                                                className={`text-xl sm:text-2xl font-bold mt-1 ${
                                                    isPassed
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {percentage}%
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                final score
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📋</span>

                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                Submission status
                                            </span>
                                        </div>

                                        <span
                                            className={`text-sm font-semibold capitalize ${
                                                result.status === "scored"
                                                    ? "text-blue-600"
                                                    : "text-amber-600"
                                            }`}
                                        >
                                            {result.status || "Unknown"}
                                        </span>
                                    </div>

                                    {/* Submitted Date */}
                                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Submitted
                                        </span>

                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 sm:text-right break-words">
                                            {result.createdAt
                                                ? new Date(
                                                      result.createdAt
                                                  ).toLocaleString()
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Results;