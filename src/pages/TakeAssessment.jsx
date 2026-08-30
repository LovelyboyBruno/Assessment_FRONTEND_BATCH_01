import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
function TakeAssessment() {
    const { id } = useParams();
const [assessment, setAssessment] = useState(null);
const [questions, setQuestions] = useState([]);
const [answers, setAnswers] = useState({});

useEffect(() => {
    fetchAssessment();
    fetchQuestions();
}, [id]);

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

        <p className="font-semibold mb-8">
            Duration: {assessment.duration} minutes
        </p>

        <div className="space-y-6">

            {questions.map((question, index) => (

                <div
                    key={question._id}
                    className="bg-white shadow-lg rounded-xl p-6"
                >

                    <h2 className="text-xl font-bold mb-5">
                        {index + 1}. {question.questionText}
                    </h2>

                    <div className="space-y-3">

                        {question.options.map((option) => (

                            <label
                                key={option}
                                className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                            >

                                <input
                                    type="radio"
                                    name={question._id}
                                    value={option}
                                    checked={
                                        answers[question._id] === option
                                    }
                                    onChange={() =>
                                        handleAnswerChange(
                                            question._id,
                                            option
                                        )
                                    }
                                />

                                <span>{option}</span>

                            </label>

                        ))}

                    </div>

                </div>

            ))}

        </div>

        <button
            type="button"
            onClick={handleSubmitAssessment}
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
            Submit Assessment
        </button>

    </div>
);
}
export default TakeAssessment;