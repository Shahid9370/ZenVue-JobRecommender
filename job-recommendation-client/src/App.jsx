import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import ResumeBuilder from "./pages/ResumeBuilder";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

/**
 * App with routing for all pages.
 * Navbar/Footer remain visible on all routes.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* optional pages (create if needed) */}
            <Route path="/post-job" element={<div className="p-12 text-center">Post a Job (coming soon)</div>} />
            <Route path="/companies" element={<div className="p-12 text-center">Companies (coming soon)</div>} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}