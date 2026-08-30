import { useEffect, useState } from "react";
import api from "../services/api";

function Results() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await api.get("/submissions/my-results");

            console.log("My results:", response.data);

            setResults(response.data);
      } catch (error) {
          console.error(
              "RESULTS ERROR:",
               error.response?.data || error.message
        );
    }
};

return (
    <div className="p-8">

        <h1 className="text-4xl font-bold text-blue-600 mb-8">
            My Results
        </h1>

        {results.length === 0 ? (
            <div className="bg-white shadow rounded-xl p-6">
                <p className="text-gray-600">
                    You haven't completed any assessments yet.
                </p>
            </div>
        ) : (
            <div className="grid gap-6">
                {results.map((result) => {
                    const totalQuestions = Array.isArray(result.answers)
                        ? result.answers.length
                        : 0;

                    const percentage =
                        totalQuestions > 0
                            ? Math.round((result.score / totalQuestions) * 100)
                            : 0;

                    const passed = percentage >= 50;

                    return (
                        <div
                            key={result._id}
                            className="bg-white shadow-lg rounded-xl p-6 mb-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {result.assessmentId?.title}
                            </h2>

                            {result.assessmentId?.description && (
                                <p className="text-gray-600 mb-6">
                                    {result.assessmentId.description}
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-gray-500">Score</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {result.score} / {totalQuestions}
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-gray-500">Percentage</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {percentage}%
                                    </p>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-gray-500">Status</p>
                                    <p className="text-2xl font-bold text-purple-600 capitalize">
                                        {result.status}
                                    </p>
                                </div>

                                <div
                                    className={`p-4 rounded-lg ${
                                        passed ? "bg-green-50" : "bg-red-50"
                                    }`}
                                >
                                    <p className="text-gray-500">Result</p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            passed
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {passed ? "Passed" : "Failed"}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-500 mt-5">
                                Submitted on:{" "}
                                <span className="font-medium text-gray-700">
                                    {result.createdAt
                                        ? new Date(result.createdAt).toLocaleString()
                                        : "N/A"}
                                </span>
                            </p>
                        </div>
                    );
                })}
            </div>
        )}

    </div>
);
}
export default Results;