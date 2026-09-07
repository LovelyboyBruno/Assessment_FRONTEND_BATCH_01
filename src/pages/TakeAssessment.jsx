import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
function TakeAssessment() {
    const { id } = useParams();
const [assessment, setAssessment] = useState(null);
const [questions, setQuestions] = useState([]);
const [answers, setAnswers] = useState({});
const [currentQuestion, setCurrentQuestion] = useState(0);
const [timeLeft, setTimeLeft] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
    fetchAssessment();
    fetchQuestions();
}, [id]);
useEffect(() => {
    if (assessment) {
        setTimeLeft(assessment.duration * 60);
    }
}, [assessment]);

useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
        handleSubmitAssessment();
        return;
    }

    const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
}, [timeLeft]);

const fetchAssessment = async () => {
    try {
        const response = await api.get("/assessments");

        const foundAssessment = response.data.assessments.find(
            (assessment) => assessment._id === id
        );

        setAssessment(foundAssessment);
    } catch (error) {
        console.error(
            error.response?.data || error.message
        );
    }
};

const fetchQuestions = async () => {
    try {
        const response = await api.get(`/questions/${id}`);

        setQuestions(response.data);
    } catch (error) {
        console.error(
            error.response?.data || error.message
        );
    }
};

const handleAnswerChange = (questionId, answer) => {
    setAnswers({
        ...answers,
        [questionId]: answer,
    });
};

if (!assessment) {
    return <h2 className="p-8">Loading Assessment...</h2>;
}

const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
        const formattedAnswers = Object.entries(answers).map(
            ([questionId, answer]) => ({
                questionId,
                answer,
            })
        );

        const response = await api.post("/submissions", {
            assessmentId: id,
            answers: formattedAnswers,
        });

        console.log("Assessment submitted:", response.data);

        alert(
            `Assessment submitted successfully! Score: ${response.data.score}`
        );

    } catch (error) {
        console.error(
            "SUBMIT ERROR:",
            error.response?.data || error.message
        );
    
        setIsSubmitting(false);
    }
    
};

return (
    <div className="p-8">

        <h1 className="text-4xl font-bold text-blue-600 mb-3">
            {assessment.title}
        </h1>

        <p className="text-gray-600 mb-2">
            {assessment.description}
        </p>

        <div className="flex items-center justify-between mb-8">
            <p className="font-semibold">Duration: {assessment.duration} minutes</p>

            <div
                className={`font-bold px-4 py-2 rounded-lg ${timeLeft !== null && timeLeft <= 60
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"}`}
            >
                Time Remaining: {" "}
                {String(Math.floor((timeLeft ?? 0) / 60)).padStart(2, "0")}:
                {String((timeLeft ?? 0) % 60).padStart(2, "0")}
            </div>
        </div>

        <div className="space-y-6">

            {questions.length > 0 && (
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <div className="flex justify-between items-center mb-6">

                        <p className="text-gray-500 font-semibold">
                            Question {currentQuestion + 1} of {questions.length}
                        </p>

                        <p className="text-gray-500">
                            {Object.keys(answers).length} answered
                        </p>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">

                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                            }} />

                    </div>

                    <h2 className="text-2xl font-bold mb-6">
                        {currentQuestion + 1}.{" "}
                        {questions[currentQuestion].questionText}
                    </h2>

                    <div className="space-y-3">

                        {questions[currentQuestion].options.map((option) => (

                            <label
                                key={option}
                                className={`flex items-center gap-3 border p-4 rounded-lg cursor-pointer transition ${answers[questions[currentQuestion]._id] === option
                                        ? "border-blue-600 bg-blue-50"
                                        : "hover:bg-gray-50"}`}
                            >

                                <input
                                    type="radio"
                                    name={questions[currentQuestion]._id}
                                    value={option}
                                    checked={answers[questions[currentQuestion]._id] === option}
                                    onChange={() => handleAnswerChange(
                                        questions[currentQuestion]._id,
                                        option
                                    )} />

                                <span className="text-gray-800">
                                    {option}
                                </span>

                            </label>

                        ))}

                    </div>

                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            className="px-5 py-3 bg-gray-300 rounded-lg disabled:opacity-50"
                        >
                            ← Previous
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmitAssessment}
                                disabled={isSubmitting}
                                className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Assessment"}
                            </button>
                        )}

                    </div>

                </div>

            )}
        </div>

    </div>
);
}
export default TakeAssessment;