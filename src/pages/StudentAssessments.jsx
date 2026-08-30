import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function StudentAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
const navigate = useNavigate();

const fetchAssessments = async () => {
    try {
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
            throw new Error("Failed to load assessments");
        }

        const data = await response.json();

        setAssessments(data.assessments || []);

    } catch (error) {
        console.error(error);
        setError("Unable to load assessments.");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchAssessments();
}, []);

if (loading) {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-blue-600">
                Available Assessments
            </h1>

            <p className="mt-6 text-gray-600">
                Loading assessments...
            </p>
        </div>
    );
}

if (error) {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-blue-600">
                Available Assessments
            </h1>

            <p className="mt-6 text-red-600">
                {error}
            </p>
        </div>
    );
}

return (
    <div className="p-8">

        <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-600">
                Available Assessments
            </h1>

            <p className="text-gray-600 mt-2">
                Choose an assessment to begin.
            </p>
        </div>

        {assessments.length === 0 ? (
            <div className="bg-white shadow-lg rounded-xl p-8">
                <p className="text-gray-600">
                    No assessments are currently available.
                </p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {assessments.map((assessment) => (

                    <div
                        key={assessment._id}
                        className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
                    >

                        <h2 className="text-2xl font-bold text-gray-800">
                            {assessment.title}
                        </h2>

                        <p className="text-gray-600 mt-3">
                            {assessment.description ||
                                "No description provided."}
                        </p>

                        <div className="mt-5">
                            <p className="text-gray-700">
                                <strong>Duration:\</strong>{" "}
                                {assessment.duration} minutes
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    `/assessments/${assessment._id}/take`
                                )
                            }
                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                        >
                            Start Assessment
                        </button>

                    </div>

                ))}

            </div>
        )}

    </div>
);
}
export default StudentAssessments;
