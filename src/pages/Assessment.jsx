import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  duration: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

const panelClass =
  "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";

function Assessment() {
  const [assessments, setAssessments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [deletingAssessment, setDeletingAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const navigate = useNavigate();

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assessments");
      const data = response.data.assessments;

      setAssessments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "ASSESSMENTS ERROR:",
        err.response?.data?.message || err.message
      );
      setError("Unable to load assessments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAssessment(null);
    setFormError("");
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title || "",
      description: assessment.description || "",
      duration: String(assessment.duration ?? ""),
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSaveAssessment = async (event) => {
    event.preventDefault();

    if (saving) return;

    const title = formData.title.trim();
    const duration = Number(formData.duration);

    if (!title) {
      setFormError("Please enter an assessment title.");
      return;
    }

    if (!Number.isInteger(duration) || duration < 1) {
      setFormError(
        "Duration must be a whole number of at least 1 minute."
      );
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        title,
        description: formData.description.trim(),
        duration,
      };

      if (editingAssessment) {
        await api.put(
          `/assessments/${editingAssessment._id}`,
          payload
        );
      } else {
        await api.post("/assessments", payload);
      }

      const wasEditing = Boolean(editingAssessment);

      await fetchAssessments();

      setShowModal(false);
      resetForm();
      setNotification({
        type: "success",
        message: wasEditing
          ? "Assessment updated successfully."
          : "Assessment created successfully.",
      });
    } catch (err) {
      console.error(
        "SAVE ASSESSMENT ERROR:",
        err.response?.data?.message || err.message
      );

      setFormError(
        err.response?.data?.message ||
          "Unable to save the assessment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAssessment || deleting) return;

    setDeleting(true);

    try {
      await api.delete(`/assessments/${deletingAssessment._id}`);

      const deletedTitle = deletingAssessment.title;
      setDeletingAssessment(null);

      await fetchAssessments();

      setNotification({
        type: "success",
        message: `${deletedTitle} was deleted successfully.`,
      });
    } catch (err) {
      console.error(
        "DELETE ASSESSMENT ERROR:",
        err.response?.data?.message || err.message
      );

      setDeletingAssessment(null);
      setNotification({
        type: "error",
        message:
          err.response?.data?.message ||
          "Unable to delete the assessment. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const heading = (
    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl md:text-4xl">
        Assessments
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
        Create, manage and organize your assessments.
      </p>
    </div>
  );

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl">
      {/* Notifications */}
      {notification && (
        <div
          role="status"
          className={`mb-5 flex items-start gap-3 rounded-xl border p-4 ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          <span className="text-lg" aria-hidden="true">
            {notification.type === "success" ? "✓" : "⚠️"}
          </span>

          <p className="min-w-0 flex-1 text-sm font-medium">
            {notification.message}
          </p>

          <button
            type="button"
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
            className="shrink-0 rounded px-2 font-bold hover:bg-black/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page heading */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {heading}

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 sm:w-auto"
        >
          <span className="text-lg" aria-hidden="true">
            +
          </span>
          Create Assessment
        </button>
      </div>

      {/* Assessment count */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xl" aria-hidden="true">
            📝
          </span>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total assessments
            </p>
            <p className="font-bold text-blue-600 dark:text-blue-400">
              {assessments.length}
            </p>
          </div>
        </div>
      </div>
{/* Loading state */}
      {loading ? (
        <div className={`${panelClass} p-10 text-center`}>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Loading assessments...
          </p>
        </div>
      ) : error ? (
        /* Error state */
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40 sm:p-6"
        >
          <h2 className="font-bold text-red-800 dark:text-red-300">
            Unable to load assessments
          </h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchAssessments}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : assessments.length === 0 ? (
        /* Empty state */
        <div className={`${panelClass} p-8 text-center sm:p-12`}>
          <div className="mb-4 text-5xl" aria-hidden="true">
            📝
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            No assessments yet
          </h2>
          <p className="mb-6 mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Create your first assessment to get started.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Create Assessment
          </button>
        </div>
      ) : (
        /* Assessment cards */
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
          {assessments.map((assessment) => (
            <article
              key={assessment._id}
              className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                      {assessment.title}
                    </h2>
                    <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Assessment
                    </span>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl dark:bg-blue-950 sm:h-11 sm:w-11">
                    📝
                  </div>
                </div>

                <p className="mt-5 min-h-12 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {assessment.description ||
                    "No description provided for this assessment."}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="text-lg" aria-hidden="true">
                    ⏱️
                  </span>
                  <span>Duration:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {assessment.duration} minutes
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      {/* Create / edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assessment-modal-title"
            className="my-auto max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="assessment-modal-title"
                  className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl"
                >
                  {editingAssessment
                    ? "Edit Assessment"
                    : "Create New Assessment"}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {editingAssessment
                    ? "Update assessment information."
                    : "Add a new assessment to the system."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAssessment}>
              <div className="space-y-5 p-5 sm:p-6">
                {formError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                  >
                    {formError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="assessment-title"
                    className={labelClass}
                  >
                    Assessment Title
                  </label>
                  <input
                    id="assessment-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={150}
                    required
                    placeholder="e.g. JavaScript Fundamentals"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="assessment-description"
                    className={labelClass}
                  >
                    Description
                  </label>
                  <textarea
                    id="assessment-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what this assessment covers..."
                    rows={4}
                    maxLength={2000}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="assessment-duration"
                    className={labelClass}
                  >
                    Duration
                  </label>
                  <div className="relative">
                    <input
                      id="assessment-duration"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      step="1"
                      required
                      placeholder="60"
                      className={`${inputClass} pr-24`}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500">
                      minutes
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingAssessment
                      ? "Update Assessment"
                      : "Create Assessment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
         {/* Delete confirmation */}
      {deletingAssessment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-assessment-title"
            aria-describedby="delete-assessment-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl dark:bg-red-950">
              🗑️
            </div>

            <h2
              id="delete-assessment-title"
              className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100"
            >
              Delete assessment?
            </h2>

            <p
              id="delete-assessment-description"
              className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400"
            >
              Are you sure you want to delete{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {deletingAssessment.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingAssessment(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Assessment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assessment;