import React from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "../src/firebase";
import axios from "axios";

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const res = await axios.post("https://back-x6zy.onrender.com/api/auth/google", { token });
      setUser(res.data.user);
      localStorage.setItem("notegenius-user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-green-300 to-blue-500 px-4 overflow-hidden">
      <img
        src="/editor.JPG"
        alt="Editor"
        className="absolute top-4 left-10 w-28 sm:w-36 md:w-48 lg:w-64 xl:w-70 rounded-2xl shadow-lg z-0 animate-float transition-transform transform hover:scale-110"
      />
      <img
        src="/mcq.JPG"
        alt="MCQ"
        className="absolute top-6 right-26 w-20 sm:w-36 md:w-48 lg:w-64 xl:w-105 rounded-2xl shadow-lg z-0 animate-float-rev transition-transform transform hover:scale-110"
      />
      <img
        src="/pdf.JPG"
        alt="PDF"
        className="absolute bottom-6 right-40 w-20 sm:w-36 md:w-48 lg:w-64 xl:w-110 rounded-2xl shadow-lg z-0 animate-float transition-transform transform hover:scale-110"
      />
      <img
        src="/smart.JPG"
        alt="Smart Notes"
        className="absolute bottom-6 left-66 w-20 sm:w-36 md:w-48 lg:w-64 xl:w-80 rounded-2xl shadow-lg z-0 animate-float-slow transition-transform transform hover:scale-110"
      />
      <img
        src="/youtube.JPG"
        alt="YouTube"
        className="absolute top-1/2 left-1/2 transform -translate-x-105 -translate-y-95 w-24 sm:w-36 md:w-48 lg:w-64 xl:w-105 rounded-2xl shadow-lg z-0 animate-float transition-transform hover:scale-110"
      />
      <div className="bg-white/90 p-8 md:p-12 rounded-2xl shadow-2xl backdrop-blur-md max-w-lg w-full text-center border border-blue-300 z-10">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">Welcome to</h1>
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">NoteMug AI 🧠</h1>
        <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
          Smart note summarization, flashcards & daily insights — powered by AI.
        </p>

        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg w-full hover:bg-gray-800 transition-all duration-300"
        >
          <FcGoogle size={24} />
          <span className="text-base font-medium">Sign in with Google</span>
        </button>

        <p className="text-sm text-gray-600 mt-6">
          Your learning companion — built to help you learn faster & smarter 📚⚡
        </p>
      </div>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
          .animate-float-rev {
            animation: float 6s ease-in-out infinite reverse;
          }
          .animate-float-slow {
            animation: float 7s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Login;






