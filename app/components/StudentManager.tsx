"use client";

import { useCallback, useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  age: number;
}

const initialForm = {
  name: "",
  email: "",
  course: "",
  age: "",
};

export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/students");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load students");
      }

      setStudents(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load students"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        editingId
          ? `/api/students/${editingId}`
          : "/api/students",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            age: Number(form.age),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save student");
      }

      setMessage(
        editingId
          ? "Student updated successfully!"
          : "Student added successfully!"
      );

      resetForm();
      await loadStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save student"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete student");
      }

      setMessage("Student deleted successfully!");
      await loadStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete student"
      );
    }
  }

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">

        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Student Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Student Management System
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your student records easily.
          </p>
        </header>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            {message}
          </div>
        )}

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            {editingId ? "Edit Student" : "Add New Student"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2"
          >
            <input
              type="text"
              placeholder="Student Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              minLength={2}
              maxLength={100}
              className="field"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              className="field"
            />

            <input
              type="text"
              placeholder="Course"
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value })
              }
              required
              className="field"
            />

            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
              min={1}
              max={120}
              required
              className="field"
            />

            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Student"
                    : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Student Records
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Total students: {students.length}
              </p>
            </div>

            <input
              type="search"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field sm:max-w-xs"
            />
          </div>

          {loading ? (
            <p className="py-8 text-center text-gray-600">
              Loading students...
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="py-8 text-center text-gray-600">
              No students found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm text-gray-900">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Age</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-200 hover:bg-slate-50"
                    >
                      <td className="p-4">{student.id}</td>
                      <td className="p-4 font-medium">{student.name}</td>
                      <td className="p-4">{student.email}</td>
                      <td className="p-4">{student.course}</td>
                      <td className="p-4">{student.age}</td>

                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditingId(student.id);
                              setForm({
                                name: student.name,
                                email: student.email,
                                course: student.course,
                                age: String(student.age),
                              });
                            }}
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(student.id)}
                            className="font-semibold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}