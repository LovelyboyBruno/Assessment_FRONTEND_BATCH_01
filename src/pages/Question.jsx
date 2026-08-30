import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

function Question() {

    const [showModal, setShowModal] = useState(false);
    const [searchParams] = useSearchParams();
    const assessmentId = searchParams.get("assessmentId");
    const [assessmentTitle, setAssessmentTitle] = useState("");

    const [editingQuestion, setEditingQuestion] = useState(null);

    const [formData, setFormData] = useState({
        assessmentId: assessmentId || "",
        questionText: "",
        options: "",
        correctAnswer: "",
    });

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (assessmentId) {
            setFormData((prev) => ({
                ...prev,
                assessmentId,
            }));
        }
    }, [assessmentId]);

    const fetchQuestions = async () => {
       try {
           const response = assessmentId
               ? await api.get(`/questions/${assessmentId}`)
                : await api.get("/questions");

           console.log(response.data);

           setQuestions(response.data.questions || response.data);

           if (assessmentId) {
            const assessmentResponse = await api.get(
                `/assessments/${assessmentId}`
            );
            setAssessmentTitle(assessmentResponse.data.title);
           }

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

    const handleEditQuestion = (question) => {
        console.log("EDIT QUESTION:", question);

        setEditingQuestion(question);
    
        setFormData({
            assessmentId: question.assessmentId?._id || question.assessmentId,
            questionText: question.questionText,
            options: Array.isArray(question.options)
                ? question.options.join(",")
                : question.options,
            correctAnswer: question.correctAnswer,
        });

        setShowModal(true);
    };

    const handleUpdateQuestion = async () => {
        try {
            const payload = {
                assessmentId: formData.assessmentId,
                questionText: formData.questionText,
                options: Array.isArray(formData.options)
                    ? formData.options
                    : formData.options
                        .split(",")
                        .map((option) => option.trim()),
                correctAnswer: formData.correctAnswer,
            };

            const response = await api.put(
                `/questions/${editingQuestion._id}`,
                payload
            );

            console.log("Question updated:", response.data);

            await fetchQuestions();

            setShowModal(false);
            setEditingQuestion(null);

        }catch (error) {
            console.error(
                "UPDATE ERROR",
                error.response?.data || error.message
            );
        }
    }

    const handleCreateQuestion = async () => {
    try {

        const payload = {
            assessmentId: formData.assessmentId,
            questionText: formData.questionText,
            options: Array.isArray(formData.options)
                ? formData.options
                : formData.options.split(",").map(option => option.trim()),
            correctAnswer: formData.correctAnswer,
        };

        if (editingQuestion) {
            // UPDATE exisiting question
            const response = await api.put(
                `/questions/${editingQuestion._id}`,
                payload
            );

            console.log("Question updated:", response.data);
        } else {
            //CREATE new question
            const response = await api.post(
                "/questions",
                payload
            );

            console.log("Question created:", response.data);
        }

        await fetchQuestions();

        setShowModal(false);
        setEditingQuestion(null);

        setFormData({
            assessmentId: "",
            questionText: "",
            options: [],
            correctAnswer: "",
        });

      } catch (error){
        console.error(
            error.response?.data || error.message 
        );
      }

    };

    const handleDeleteQuestion = async (questionId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmed) {
            return;
        }
        
    try {
        console.log("DELETE QUESTION:", questionId);

        await api.delete(`/questions/${questionId}`);

    // Refresh the questions after deletion
    fetchQuestions();

    } catch (error) {
        console.error(
            "DELETE ERROR:",
            error.response?.data || error.message
        );
    }
};

       

return (
    <div className="p-8">

        <div className="flex justify-between items-center mb-8">

            <h1 className="text-4xl font-bold text-blue-600">
                {assessmentTitle
                    ? `Questions for Assessment: ${assessmentTitle}`
                    : "Questions"}
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

                        <button
                            type="button"
                            onClick={() => {
                                console.log("EDIT BUTTON CLICKED:", question);
                                handleEditQuestion(question);

                                {questions.length === 0 && assessmentId && (
                    <div className="bg-white shadow-lg rounded-xl p-8">
                        <p className="text-gray-600">
                            No questions have been addedd to this assessment yet.
                        </p>
                    </div>
                )}
                            }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-yellow-600"
                        > 
                            Edit
                        </button>

                        <button
                            onClick={() => handleDeleteQuestion(question._id)}
                             className="bg-red-600 text-white px-4 py-2 rounded"
                        >
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
                            {editingQuestion ? "Edit Question" : "Create New Question"}
                        </h2>

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
                                onClick={
                                    editingQuestion
                                        ? handleUpdateQuestion
                                        : handleCreateQuestion
                                }
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {editingQuestion ? "Update Question" : "Create Question"}
                            </button>

                        </div>
                    </div>

                </div>
                    
            )}

        </div>
    );
}
export default Question;