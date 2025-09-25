import React from "react";
import { useNavigate } from "react-router-dom";
import Header from './Comp/Header.jsx';
import Footer from './Comp/Footer.jsx';

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80";

const testimonials = [
  {
    name: "Jane Doe",
    feedback: "ZenVue made job hunting effortless. The AI recommendations were spot on!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Alex Smith",
    feedback: "Uploading my resume and getting instant job matches saved me hours.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    name: "Priya Patel",
    feedback: "I found my dream job thanks to the ATS compatible suggestions.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const features = [
  {
    title: "Check Available Jobs",
    description: "Browse the latest openings tailored to your skills and interests.",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Resume Upload",
    description: "Upload your resume and let our AI analyze your experience for better matches.",
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 16v-4m0 0V8m0 4l-4 4m4-4l4 4" />
      </svg>
    ),
  },
  {
    title: "AI Recommendations",
    description: "Get personalized job suggestions powered by advanced algorithms.",
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    title: "ATS Compatible",
    description: "All job matches are optimized for Applicant Tracking Systems.",
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Upload Resume",
    description: "Drag and drop your resume or upload it directly.",
  },
  {
    title: "Get Job Matches",
    description: "Our AI analyzes your profile and finds best-fit jobs.",
  },
  {
    title: "Apply",
    description: "Apply seamlessly to recommended positions.",
  },
];

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-poppins">
      <Header
        navigation={[
          { label: "Home", onClick: () => scrollToSection("hero") },
          { label: "Features", onClick: () => scrollToSection("features") },
          { label: "How It Works", onClick: () => scrollToSection("howitworks") },
          { label: "Testimonials", onClick: () => scrollToSection("testimonials") },
          { label: "Get Started", onClick: () => scrollToSection("cta") },
        ]}
      />

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between px-6 sm:px-8 md:px-16 py-16 bg-gradient-hero animate-fade-in"
      >
        <div className="flex-1 flex flex-col items-start space-y-6">
          <h1 className="gradient-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight animate-fade-in-up">
            Find Your Perfect Job Match
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg animate-fade-in-up">
            AI-powered job recommendations tailored for you. Upload your resume, browse jobs, and apply with ease.
          </p>
          <button
            onClick={() => scrollToSection("cta")}
            className="btn-main"
          >
            Get Started
          </button>
        </div>
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={HERO_IMAGE}
            alt="Job search illustration"
            className="hero-img w-full max-w-sm sm:max-w-md shadow-xl object-cover animate-fade-in"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 sm:px-8 md:px-16 bg-light animate-fade-in">
        <h2 className="gradient-headline text-3xl sm:text-4xl font-semibold text-center mb-12 animate-fade-in-up">
          Core Features
        </h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6 sm:p-8 flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="mt-4 text-lg sm:text-xl font-bold text-gray-700">{feature.title}</h3>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="howitworks" className="py-16 px-6 sm:px-8 md:px-16 bg-white-section animate-fade-in">
        <h2 className="gradient-headline text-3xl sm:text-4xl font-semibold text-center mb-12 animate-fade-in-up">
          How It Works
        </h2>
        <ol className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-8 md:space-y-0">
          {steps.map((step, idx) => (
            <li key={step.title} className="flex flex-col items-center text-center max-w-xs">
              <div className="step-circle">{idx + 1}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-700">{step.title}</h3>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">{step.description}</p>
              {idx < steps.length - 1 && (
                <span className="hidden md:inline-block w-10 h-1 bg-blue-200 mx-6 my-6"></span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-6 sm:px-8 md:px-16 bg-light animate-fade-in">
        <h2 className="gradient-headline text-3xl sm:text-4xl font-semibold text-center mb-12 animate-fade-in-up">
          What Users Say
        </h2>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6 sm:p-8 flex flex-col items-center text-center">
              <img src={t.avatar} alt={t.name} className="avatar" />
              <p className="italic text-gray-500 mb-4 text-sm sm:text-base">&quot;{t.feedback}&quot;</p>
              <span className="font-bold text-gray-700 text-sm sm:text-base">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="cta" className="py-16 px-6 sm:px-8 md:px-16 bg-blue-section animate-fade-in">
        <div className="flex flex-col items-center">
          <h2 className="gradient-headline text-3xl sm:text-4xl font-semibold text-white text-center mb-6 animate-fade-in-up">
            Ready to Find Your Next Job?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 text-center max-w-xl animate-fade-in-up">
            Join thousands of users landing their dream jobs with ZenVue’s smart recommendations.
          </p>
          <button
            className="btn-cta"
            onClick={() => navigate("/app")}
          >
            Start Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
