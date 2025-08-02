import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, User, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// In a real app, these would come from your routing and context setup.
// For this example, we'll provide mock implementations.
const useNavigate = () => (path) => console.log(`Navigating to ${path}`);
const useAuth = () => ({ API: "https://api.example.com" });

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { API } = useAuth();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        setStatus("error-fields");
        return;
    }
    setIsLoading(true);
    setStatus("Sending...");

    try {
      // Mocking the API call for demonstration
      console.log("Submitting to:", `${API}/api/auth/sendmail`);
      console.log("Form Data:", formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Mock response
      const response = { ok: true }; 
      // const response = { ok: false }; // Uncomment to test error state

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error-api");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error-api");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "success":
        return (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
          </div>
        );
      case "error-api":
        return (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Something went wrong. Please try again later.</span>
          </div>
        );
      case "error-fields":
        return (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Please fill out all the fields.</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Adjusted padding for better mobile view (px-4, py-12) and larger screens (sm:px-6, md:py-20) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 text-yellow-300" />
              {/* Adjusted text size for responsiveness from mobile to desktop */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Get In Touch
              </h1>
            </div>
            {/* Adjusted text size for better readability on mobile */}
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
              Have questions about your next adventure? We're here to help make your travel dreams come true!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {/* Adjusted padding for different screen sizes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Grid layout now explicitly uses 1 column on mobile and 2 on large screens. */}
        {/* Increased vertical gap (gap-y-16) for better separation when stacked on mobile. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-start">
          
          {/* Contact Form */}
          {/* Adjusted padding to be more consistent across screen sizes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Send us a message</h2>
              <p className="text-gray-600">We'd love to hear from you. Fill out the form below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                  placeholder="Tell us about your travel plans or any questions..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {status && (
              <div className="mt-6">
                {getStatusMessage()}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Other ways to reach us</h3>
              
              <div className="space-y-6">
                {/* Contact Card Item */}
                <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email Us</h4>
                    <p className="text-gray-600 text-sm mb-2">For general inquiries and support</p>
                    <a href="mailto:vaibhavsharma5104@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium break-all">
                      vaibhavsharma5104@gmail.com
                    </a>
                  </div>
                </div>

                {/* Contact Card Item */}
                <div className="flex items-start gap-4 p-4 bg-purple-50/50 rounded-xl hover:bg-purple-100 transition-colors duration-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Call Us</h4>
                    <p className="text-gray-600 text-sm mb-2">Mon-Fri, 9AM-6PM (IST)</p>
                    <a href="tel:+917837591800" className="text-purple-600 hover:text-purple-700 font-medium">
                      +91 7837591800
                    </a>
                  </div>
                </div>

                {/* Contact Card Item */}
                <div className="flex items-start gap-4 p-4 bg-indigo-50/50 rounded-xl hover:bg-indigo-100 transition-colors duration-200">
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Visit Us</h4>
                    <p className="text-gray-600 text-sm mb-2">Our office location</p>
                    <address className="text-indigo-600 not-italic">
                      Jalandhar, Punjab
                    </address>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center sm:text-left">
              <h3 className="text-xl font-bold mb-3">Frequently Asked Questions</h3>
              <p className="text-blue-100 mb-6">
                Find quick answers about travel planning, bookings, and more.
              </p>
              <button 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 w-full sm:w-auto" 
                onClick={() => navigate('/about')}
              >
                View FAQs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
