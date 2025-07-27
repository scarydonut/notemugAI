import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Calendar, RefreshCw } from "lucide-react";
import { getRevisionPlan } from "../api/reviseNote";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
const NotesDashboard = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?._id) fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    const res = await axios.get(`https://back-x6zy.onrender.com/api/notes/user/${user._id}`);
    setNotes(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://back-x6zy.onrender.com/api/notes/${id}`);
    fetchNotes();
  };

  const saveNoteEdits = async () => {
    await axios.put(`https://back-x6zy.onrender.com/api/notes/${editingNote._id}`, editingNote);
    setEditingNote(null);
    fetchNotes();
  };

  const handleRevisionPlan = async (note) => {
    if (!note || !note.title || !note.summary || !note.quiz) {
      alert("Note is missing title, summary or quiz!");
      return;
    }

    try {
      const plan = await getRevisionPlan(note);
      alert(`📅 Revision Plan:\n\n${plan}`);
    } catch (error) {
      console.error("Error generating revision plan:", error.response?.data || error.message);
      alert("⚠️ Failed to generate revision plan. Please try again.");
    }
  };

  return (
    <div className="px-6 py-10 bg-gradient-to-r from-[#e0f7fa] to-[#f1f8e9] min-h-screen rounded-lg">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-blue-800 text-center">
        📚 Your Smart Notes
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          className="w-full md:w-1/2 border border-blue-300 rounded px-4 py-2 text-gray-800"
          placeholder="🔍 Search notes by title, summary, or quiz..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="default"
          onClick={() => setSearchQuery(searchQuery.trim())}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Search
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {notes
          .filter((note) =>
            note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.quiz?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((note) => (

            <Card
              key={note._id}
              className="relative bg-white border border-blue-200 shadow-md hover:shadow-xl transition-all rounded-lg overflow-hidden"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-700">{note.title || "Untitled Note"}</CardTitle>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar size={14} /> {new Date(note.createdAt).toLocaleString()}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="max-h-32 overflow-y-auto pr-1">
                  <Badge variant="secondary" className="mb-1">📝 Summary</Badge>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.summary}</p>
                </div>

                <div className="max-h-32 overflow-y-auto pr-1">
                  <Badge className="mb-1">🎯 Quiz</Badge>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.quiz}</p>
                </div>
                {note.keywords?.length > 0 && (
                  <div className="max-h-24 overflow-y-auto pr-1 border-t pt-2 mt-2">
                    <Badge className="mb-1 bg-yellow-300 text-black">🔑 Keywords</Badge>
                    <div className="flex flex-wrap gap-2">
                      {note.keywords.map((k, i) => (
                        <span
                          key={i}
                          className="bg-yellow-100 px-2 py-1 text-xs font-medium rounded-full shadow-sm"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {note.suggestions?.length > 0 && (
                  <div className="max-h-24 overflow-y-auto pr-1 border-t pt-2 mt-2">
                    <Badge className="mb-1 bg-green-200 text-green-800">🌐 Suggestions</Badge>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                      {note.suggestions.map((url, i) => (
                        <li key={i}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-900"
                          >
                            {url.includes("youtube") ? "📺 YouTube" : "📘 Wikipedia"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between items-center flex-wrap mt-4 gap-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingNote(note)}>
                    <Pencil size={14} className="mr-1" /> Edit
                  </Button>

                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleRevisionPlan(note)}
                  >
                    <RefreshCw size={14} className="mr-1" /> Plan Revision
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(note._id)}
                >
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-full h-full md:w-11/12 md:h-5/6 rounded-lg shadow-xl overflow-y-auto flex flex-col">
            <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">✏️ Edit Note</h2>

            <input
              className="w-full border p-3 mb-4 rounded text-lg"
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="w-full border p-4 mb-4 rounded text-base h-64 resize-none"
              value={editingNote.summary}
              onChange={(e) => setEditingNote({ ...editingNote, summary: e.target.value })}
              placeholder="Summary"
            />

            <textarea
              className="w-full border p-4 mb-6 rounded text-base h-64 resize-none"
              value={editingNote.quiz}
              onChange={(e) => setEditingNote({ ...editingNote, quiz: e.target.value })}
              placeholder="Quiz Questions"
            />


            <div className="flex justify-end gap-4 mt-auto">
              <Button variant="outline" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
              <Button onClick={saveNoteEdits}>💾 Save Changes</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NotesDashboard;


