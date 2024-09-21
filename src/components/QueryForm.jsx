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
    <div className="h-screen bg-gray-100 p-4 rounded-xl shadow-lg flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back
        className="bg-gray-900 text-white p-3 rounded-full mb-4 hover:bg-gray-700 transition duration-300"
      >
        Back
      </button>

      {/* Chatbox Section */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-inner text-gray-900">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Placeholder for icon */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
              {msg.type === "user" ? (
                <div className="text-blue-500">🙍‍♂️</div>
              ) : (
                <div className="text-gray-500">🤖</div>
              )}
            </div>

            <div
              className={`ml-2 p-3 rounded-lg max-w-xs text-sm shadow-sm ${
                msg.type === "user"
                  ? "bg-green-600 text-white rounded-br-3xl rounded-tl-3xl"
                  : "bg-sky-400 text-gray-900 rounded-bl-3xl rounded-tr-3xl"
              }`}
            >
              {msg.text}
              <div className="text-xs mt-1 text-gray-600">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSubmit}
        className="flex border-gray-400 bg-white rounded-lg shadow-md mt-4 mb-2"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Type a message..."
          className="border-none p-3 flex-1 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-6 hover:bg-blue-600 transition duration-300 rounded-lg"
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
