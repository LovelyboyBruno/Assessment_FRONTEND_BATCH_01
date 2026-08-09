import { useEffect, useState } from "react";

import api from "../services/api";

function Question() {

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        assessmentId: "",
        questionText: "",
        options: "",
        correctAnswer: "",
    });

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
       try {
           const response = await api.get("/questions");

           console.log(response.data);

           setQuestions(response.data);

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateQuestion = async () => {
    try {

        const payload = {
            assessmentId: formData.assessmentId,
            questionText: formData.questionText,
            options: formData.options
                .split(",")
                .map((option) => option.trim()),
            correctAnswer: formData.correctAnswer,
        };

        const response = await api.post(
            "/questions",
            payload
        );

        console.log("Question created:", response.data);

        fetchQuestions();

        setShowModal(false);
        
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
};

return (
    <div className="p-8">

        <div className="flex justify-between items-center mb-8">

            <h1 className="text-4xl font-bold text-blue-600">
                Questions
            </h1>

            <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                + Create Question
            </button>

        </div>

        <div className="grid gap-6">

            {questions.map((question) => (

                <div
                    key={question._id}
                    className="bg-white shadow-lg rounded-xl p-6"
                >

                    <h2 className="text-xl font-bold">
                        {question.questionText}
                    </h2>

                    <p className="mt-3">
                        Correct Answer:{" "}
                        <strong> {question.correctAnswer}</strong>
                    </p>

                    <div className="mt-5 flex gap-4">

                        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                            Edit
                        </button>

                        <button className="bg-red-600 text-white px-4 py-2 rounded">
                            Delete
                        </button>

                    </div>

                </div>

            ))}

        </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-xl w-[500px]">

                        <h2 className="text-2xl font-bold mb-6">
                            Create New Question
                        </h2>

                        <input
                            type="text"
                            name="assessmentId"
                            placeholder="Assessment ID"
                            value={formData.assessmentId}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded mb-4"
                        />

                        <textarea
                            name="questionText"
                            placeholder="Question"
                            value={formData.questionText}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded mb-4"
                        />

                        <input
                            type="text"
                            name="options"
                            placeholder="Option1, Option2, Option3, Option4"
                            value={formData.options}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded mb-4"
                        />

                        <input
                            type="text"
                            name="correctAnswer"
                            placeholder="Correct Answer"
                            value={formData.correctAnswer}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded mb-6"
                        />

                        <div className="flex justify-end gap-3">

                            <button 
                                onClick={() => setShowModal (false)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreateQuestion}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Create Question
                            </button>

                        </div>
                    </div>

                </div>
                    
            )}

        </div>
    );
}
export default Question;