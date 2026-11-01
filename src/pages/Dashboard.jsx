import { useEffect, useState } from "react";
import api from "../services/api";

const statCards = [
  {
    label: "Total Users",
    key: "totalUsers",
    description: "All registered users",
    icon: "👥",
    iconStyle: "bg-blue-100 dark:bg-blue-950",
  },
  {
    label: "Students",
    key: "totalStudents",
    description: "Registered students",
    icon: "🎓",
    iconStyle: "bg-emerald-100 dark:bg-emerald-950",
  },
  {
    label: "Administrators",
    key: "totalAdmins",
    description: "System administrators",
    icon: "🛡️",
    iconStyle: "bg-violet-100 dark:bg-violet-950",
  },
  {
    label: "Assessments",
    key: "totalAssessments",
    description: "Available assessments",
    icon: "📝",
    iconStyle: "bg-amber-100 dark:bg-amber-950",
  },
  {
    label: "Questions",
    key: "totalQuestions",
    description: "Questions in system",
    icon: "❓",
    iconStyle: "bg-cyan-100 dark:bg-cyan-950",
  },
  {
    label: "Submissions",
    key: "totalSubmissions",
    description: "Completed assessments",
    icon: "📤",
    iconStyle: "bg-rose-100 dark:bg-rose-950",
  },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setError("");

        const [statsResponse, submissionsResponse] = await Promise.all([
          api.get("/dashboard"),
          api.get("/submissions"),
        ]);

        if (!isMounted) return;

        setStats(statsResponse.data);

        const submissions = Array.isArray(submissionsResponse.data)
          ? submissionsResponse.data
          : [];

        setRecentSubmissions(
          [...submissions]
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
            .slice(0, 5)
        );
      } catch (err) {
        console.error(
          "Dashboard loading failed:",
          err.response?.data?.message || err.message
        );

        if (isMounted) {
          setError("Unable to load dashboard. Please try again.");
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const pageTitle = (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl md:text-4xl">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        Overview of your assessment system.
      </p>
    </div>
  );

  if (!stats && !error) {
    return (
      <div>
        {pageTitle}

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div>
        {pageTitle}

        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900">
              ⚠️
            </div>

            <div>
              <h2 className="font-bold text-red-800 dark:text-red-300">
                Unable to load dashboard
              </h2>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const performanceCards = [
    {
      label: "Average Score",
      value: stats.averageScore ?? 0,
      description: "Across recorded submissions",
      color: "bg-blue-500",
      progress: true,
    },
    {
      label: "Highest Score",
      value: stats.highestScore ?? 0,
      description: "Best recorded performance",
      color: "bg-emerald-500",
    },
    {
      label: "Lowest Score",
      value: stats.lowestScore ?? 0,
      description: "Lowest recorded performance",
      color: "bg-amber-500",
    },
    {
      label: "Pass Rate",
      value: stats.passRate ?? 0,
      description: "Percentage of passing results",
      color: "bg-emerald-500",
      progress: true,
    },
  ];

  const getStudentName = (submission) =>
    submission.studentId?.name || "Unknown";

  const getStudentInitial = (submission) =>
    getStudentName(submission).charAt(0).toUpperCase() || "U";

  const getAssessmentTitle = (submission) =>
    submission.assessmentId?.title || "Unknown assessment";

  const getScore = (submission) =>
    submission.percentage ?? submission.score ?? 0;

  const getStatus = (submission) => submission.status || "Unknown";

  const getDate = (submission) =>
    submission.createdAt
      ? new Date(submission.createdAt).toLocaleString()
      : "N/A";

  const isScored = (submission) => submission.status === "scored";

  const studentBadge =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300";

  const panel =
    "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";

  return (
    <div className="min-w-0">
      {pageTitle}

      {/* Main statistics */}
      <section
        aria-label="System statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
      >
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20 md:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {stats[card.key] ?? 0}
                </p>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {card.description}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${card.iconStyle}`}
                aria-hidden="true"
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Performance overview */}
      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Performance Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overall assessment performance
          </p>
        </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {performanceCards.map((card) => {
            const value = Number(card.value) || 0;
            const progress = Math.min(Math.max(value, 0), 100);

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {value}
                  </p>
                  <span className="mb-1 text-sm text-slate-400 dark:text-slate-500">
                    %
                  </span>
                </div>

                {card.progress ? (
                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                    role="progressbar"
                    aria-label={card.label}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${card.color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    {card.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent submissions */}
      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Recent Submissions
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Latest assessment activity
            </p>
          </div>

          <span className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            Latest 5
          </span>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className={`${panel} p-10 text-center`}>
            <div className="mb-3 text-4xl" aria-hidden="true">
              📋
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No submissions yet
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Student submissions will appear here.
            </p>
          </div>
        ) : (
          <div className={panel}>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
                  <tr>
                    {[
                      "Student",
                      "Assessment",
                      "Score",
                      "Status",
                      "Submitted",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentSubmissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={studentBadge}>
                            {getStudentInitial(submission)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">
                              {getStudentName(submission)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {submission.studentId?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                        {getAssessmentTitle(submission)}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                        {getScore(submission)}%
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            isScored(submission)
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                          {getStatus(submission)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {getDate(submission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and tablet cards */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 lg:hidden">
              {recentSubmissions.map((submission) => (
                <div key={submission._id} className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className={studentBadge}>
                      {getStudentInitial(submission)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                        {getStudentName(submission)}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {submission.studentId?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Assessment
                    </p>
                    <p className="mt-1 break-words font-semibold text-slate-700 dark:text-slate-200">
                      {getAssessmentTitle(submission)}
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Score
                      </p>
                      <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
                        {getScore(submission)}%
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Status
                      </p>
                      <p
                        className={`mt-1 text-sm font-bold capitalize ${
                          isScored(submission)
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {getStatus(submission)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Submitted
                    </span>
                    <span className="text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                      {getDate(submission)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;