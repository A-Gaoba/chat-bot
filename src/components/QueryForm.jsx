import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { postQuery } from "../api";

const suggestions = [
  "What is AI?",
  "Tell me a joke",
  "Explain quantum computing",
  "What is the weather today?",
];

const QueryForm = ({ setResponse, setError }) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSuggestionClick = (suggestion) => {
    setTopic(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuggestions(false);

    const userMessage = {
      text: topic,
      type: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const data = await postQuery(topic);
      const botMessage = {
        text: data["AI Answer"],
        type: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setResponse(data["AI Answer"]);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = error.message || "An unexpected error occurred.";
      setError(errorMessage);
      const errorBotMessage = {
        text: errorMessage,
        type: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    }

    setTopic("");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 p-4 md:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-800 text-white py-2 px-4 rounded-full mb-4 hover:bg-gray-700 transition duration-300"
      >
        Back
      </button>

      {/* Chat Container */}
      <div className="flex flex-col flex-1 w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {showSuggestions && (
          <div className="bg-gray-700 p-4 mb-4 rounded-lg">
            <h3 className="text-white text-lg mb-2">Suggestions:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-4 rounded-lg shadow-md ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-700 text-white rounded-tl-none"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-4 border-t border-gray-700"
        >
          <div className="flex items-center">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
              required
            />
            <button
              type="submit"
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

QueryForm.propTypes = {
  setResponse: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default QueryForm;
