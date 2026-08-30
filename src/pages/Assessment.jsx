import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Assessment() {
    const [assessments, setAssessments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
    });

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get("/assessments");

            console.log(response.data.assessments);

            setAssessments(response.data.assessments);

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateAssessment = async () => {
       try {

        if (editingAssessment) {


            await api.put(
                `/assessments/${editingAssessment._id}`,
                formData
            );

        }else {

            await api.post(
                "/assessments",
                formData
            );
        }

        fetchAssessments();

        setShowModal(false);

        setEditingAssessment(null);

        setFormData({
            title: "",
            description: "",
            duration: "",
        });

       } catch (error) {

        console.error(error.response?.data || error.message);

       }
    };

    const handleEdit = (assessment) => {

        setEditingAssessment(assessment);

        setFormData({
            title: assessment.title,
            description: assessment.description,
            duration: assessment.duration,
        });

        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this assessment?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/assessments/${id}`);

            fetchAssessments();

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };
       

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600">Assessments</h1>
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Create Assessment
                </button>
            </div>

            <div className="grid gap-6">
                {assessments.map((assessment) => (
                    <div
                        key={assessment._id}
                        className="bg-white shadow-lg rounded-xl p-6"
                    >
                        <h2 className="text-2xl font-semibold">{assessment.title}</h2>
                        <p className="text-gray-600 mt-2">{assessment.description}</p>
                        <p className="text-gray-500">
                            Duration: {assessment.duration} minutes
                            </p>
                        <div className="mt-6 flex gap-4">
                            <button 
                                onClick={() => handleEdit(assessment)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                 onClick={() => handleDelete(assessment._id)} 
                                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                                Delete
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/questions?assessmentId=${assessment._id}`)
                                }
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                            >
                                View Questions
                            </button>
                            
                            <button
                                 type="button"
                                 onClick={() => navigate(`/assessments/${assessment._id}/take`)}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Take Assessment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-xl w-[450px]">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingAssessment 
                            ? "Edit Assessment" 
                            : "Create New Assessment"}
                        </h2>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Title"
                            className="w-full border p-3 rounded mb-4"
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="w-full border p-3 rounded mb-4"
                        />
                        <input
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            type="number"
                            placeholder="Duration (in minutes)"
                            className="w-full border p-3 rounded mb-6"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingAssessment(null);

                                    setFormData({
                                        title: "",
                                        description: "",
                                        duration: "",
                                    });
                                }}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                            onClick={handleCreateAssessment}
                            className="px-4 py-2 bg-blue-600 text-white rounded">
                                {editingAssessment 
                                ? "Update Assessment" 
                                : "Create Assessment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Assessment;
