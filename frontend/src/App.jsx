import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./Login";
import Editor from "./features/Editor";
import NotesDashboard from "./features/NotesDashboard";
import PdfUploader from "./pages/PdfUploader";
function App() {
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(true);
      else setShowSidebar(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login setUser={setUser} />} />
      </Routes>
    );
  }
  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen flex flex-col">
      <header className="p-4 bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 text-white flex items-center justify-between w-full shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">NoteMug AI</h1>
          <p className="text-sm">Welcome, {user.name}</p>
        </div>
        <button
          onClick={toggleSidebar}
          className="block md:hidden bg-white text-blue-700 px-4 py-2 rounded shadow hover:bg-blue-100"
        >
          {showSidebar ? "Hide Notes" : "Show Notes"}
        </button>
      </header>

      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col md:flex-row h-full">
                {showSidebar && (
                  <div className="w-full md:w-1/3 max-h-screen overflow-auto p-4 border-b md:border-b-0 md:border-r border-gray-300">
                    <NotesDashboard user={user} />
                  </div>
                )}
                <div className="w-full md:w-2/3 p-4">
                  <Editor user={user} />
                </div>
              </div>
            }
          />
          <Route path="/editor" element={<Editor user={user} />} />
          <Route path="/notes" element={<NotesDashboard user={user} />} />
          <Route path="/upload-pdf" element={<PdfUploader />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;




