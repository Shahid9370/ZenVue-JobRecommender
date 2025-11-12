import React, { useState } from "react";

/**
 * Contact page with a friendly form and contact details card.
 * Added contact owner details (fake) and location: Pune, Maharashtra, India.
 */

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.message.trim()) return "Please enter a message.";
    return null;
  }

  function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ type: "error", message: err });
      return;
    }
    // Demo: replace with real API call
    setStatus({ type: "loading", message: "Sending..." });
    setTimeout(() => {
      setStatus({ type: "success", message: "Thanks! We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  }

  // Fake contact owner details (as requested)
  const owner = {
    name: "Shahid Shaikh",
    role: "Founder & CTO",
    phone: "+91 98200 12345",
    email: "shahid@example.com",
    location: "Pune, Maharashtra, India",
    hours: "Mon - Fri, 10:00 AM - 6:00 PM IST",
    linkedin: "https://www.linkedin.com/in/shahid-example",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact form */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-semibold mb-2">Contact us</h1>
          <p className="text-gray-600 mb-6">
            Have questions or need support? Send us a message and we'll respond shortly.
          </p>

          <form onSubmit={onSubmit} className="space-y-4 bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            {status && status.type === "error" && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{status.message}</div>
            )}
            {status && status.type === "success" && (
              <div className="text-green-700 text-sm bg-green-50 p-2 rounded">{status.message}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 block w-full border px-3 py-2 rounded-md"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 block w-full border px-3 py-2 rounded-md"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-2 block w-full border px-3 py-2 rounded-md"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                className="mt-2 block w-full border px-3 py-2 rounded-md"
                placeholder="Write your message..."
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Send message"
              >
                Send message
              </button>

              <div className="text-sm text-gray-500">
                Or email us at{" "}
                <a href={`mailto:${owner.email}`} className="text-blue-600 underline">
                  {owner.email}
                </a>
              </div>
            </div>
          </form>
        </div>

        {/* Contact details card */}
        <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>

          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-500">Owner</div>
              <div className="font-medium">{owner.name}</div>
              <div className="text-xs text-gray-500">{owner.role}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Phone</div>
              <a href={`tel:${owner.phone.replace(/\s+/g, "")}`} className="text-sm text-blue-600">
                {owner.phone}
              </a>
            </div>

            <div>
              <div className="text-xs text-gray-500">Email</div>
              <a href={`mailto:${owner.email}`} className="text-sm text-blue-600">
                {owner.email}
              </a>
            </div>

            <div>
              <div className="text-xs text-gray-500">Location</div>
              <div className="text-sm">{owner.location}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Office hours</div>
              <div className="text-sm">{owner.hours}</div>
            </div>

            <div className="pt-2">
              <a
                href={owner.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zM8.98 8h4.37v2.16h.06c.61-1.15 2.1-2.36 4.33-2.36 4.63 0 5.48 3.04 5.48 6.98V24H19.6v-7.56c0-1.8-.03-4.12-2.51-4.12-2.51 0-2.89 1.96-2.89 3.99V24H8.98V8z" />
                </svg>
                View LinkedIn
              </a>
            </div>
          </div>

          <hr className="my-4 border-gray-100" />

          <div className="text-xs text-gray-500">
            Privacy: We won't share your contact information. This contact card contains example/fake personal details for demo purposes.
          </div>
        </aside>
      </div>
    </div>
  );
}