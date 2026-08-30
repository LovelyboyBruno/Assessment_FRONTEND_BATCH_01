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
      <div className="p-8">
        <h1 className="text-4xl font-bold text-blue-600">Submissions</h1>
        <p className="mt-6 text-gray-600">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-blue-600">Submissions</h1>
        <p className="mt-6 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Submissions</h1>
        <p className="text-gray-600 mt-2">
          Review student assessment submissions.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-8">
          <p className="text-gray-600">No submissions yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Assessment</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {submission.studentId?.name || "Unknown Student"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {submission.studentId?.email || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {submission.assessmentId?.title || "N/A"}
                    </td>

                    <td className="px-6 py-4 font-bold text-blue-600">
                      {submission.score}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          submission.status === "scored"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(submission.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Submission;