import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://assessment-api-batch-01-1.onrender.com/api/assessments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load assessments"
                );
            }

            const data = await response.json();

            setAssessments(
                Array.isArray(data.assessments)
                    ? data.assessments
                    : []
            );
        } catch (error) {
            console.error(error);

            setError(
                "Unable to load assessments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Available Assessments
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Choose an assessment to test your knowledge.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">

                    <div className="w-10 h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

                    <p className="text-slate-500 mt-4">
                        Loading assessments...
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
                        Available Assessments
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Choose an assessment to test your knowledge.
                    </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                    <div className="flex items-start gap-4">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-red-100 flex items-center justify-center">
                            ⚠️
                        </div>

                        <div>

                            <h2 className="font-bold text-red-800">
                                Unable to load assessments
                            </h2>

                            <p className="text-sm text-red-600 mt-1">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchAssessments}
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

            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Available Assessments
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Choose an assessment to test your knowledge.
                    </p>

                </div>


                {/* Assessment Count */}
                <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

                    <span className="text-lg">
                        📝
                    </span>

                    <div>

                        <p className="text-xs text-slate-500">
                            Available
                        </p>

                        <p className="font-bold text-blue-600">
                            {assessments.length}
                        </p>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {assessments.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">

                    <div className="text-5xl mb-4">
                        📭
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                        No assessments available
                    </h2>

                    <p className="text-slate-500 mt-2">
                        There are currently no assessments available to take.
                    </p>

                </div>

            ) : (

                /* ================================================= */
                /* ASSESSMENT CARDS */
                /* ================================================= */

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">

                    {assessments.map((assessment) => (

                        <div
                            key={assessment._id}
                            className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                        >

                            {/* Card Top */}
                            <div className="p-5 md:p-6">

                                {/* Icon + Duration */}
                                <div className="flex items-center justify-between gap-3">

                                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
                                        📝
                                    </div>

                                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                                        ⏱️ {assessment.duration} min
                                    </span>

                                </div>


                                {/* Title */}
                                <h2 className="text-xl font-bold text-slate-800 mt-5 leading-7">
                                    {assessment.title}
                                </h2>


                                {/* Description */}
                                <p className="text-sm text-slate-500 mt-3 leading-6 min-h-[72px]">
                                    {assessment.description ||
                                        "No description provided."}
                                </p>


                                {/* Divider */}
                                <div className="border-t border-slate-100 mt-5 pt-5">

                                    <div className="flex items-center justify-between">
                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Assessment duration
                                            </p>

                                            <p className="text-sm font-semibold text-slate-700 mt-1">
                                                {assessment.duration} minutes
                                            </p>

                                        </div>

                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            ⏱️
                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Card Footer */}
                            <div className="px-5 md:px-6 py-4 bg-slate-50 border-t border-slate-100">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/assessments/${assessment._id}/take`
                                        )
                                    }
                                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                                >
                                    Start Assessment

                                    <span className="text-lg group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>

                                </button>

                            </div>

                        </div>

                    ))}

                </div>
                

            )}

        </div>
        
    );
}

export default StudentAssessments;
                                