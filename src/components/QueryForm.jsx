import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { postQuery } from "../api"; // Adjust the path as necessary

const QueryForm = ({ setResponse, setError }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    <div className="h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-4 rounded-xl shadow-2xl flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back
        className="bg-gray-900 text-white p-3 rounded-full mb-4 hover:bg-gray-700 transition duration-300 shadow-lg"
      >
        Back
      </button>

      {/* Chatbox Section */}
      <div className="flex-1 overflow-y-auto p-6 bg-white rounded-xl shadow-inner text-gray-900">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-lg max-w-xs text-sm shadow-lg ${
                msg.type === "user"
                  ? "bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-bl-3xl rounded-tr-3xl"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-3xl rounded-tl-3xl"
              }`}
            >
              {msg.text}
              <div className="text-xs mt-1 text-gray-300">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSubmit}
        className="flex border-gray-400 bg-white rounded-lg shadow-xl mt-4 mb-2"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Type a message..."
          className="border-none p-4 flex-1 rounded-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-700 to-pink-600 text-white font-semibold py-2 px-6 hover:from-pink-700 hover:to-purple-600 transition duration-300 ease-in-out rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

QueryForm.propTypes = {
  setResponse: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default QueryForm;
