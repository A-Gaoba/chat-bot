import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { postQuery } from "../api"; // Adjust the path as necessary

const QueryForm = ({ setResponse, setError }) => {
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
    <div className="h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg flex flex-col text-white">
      {/* Chatbox Section */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow-inner text-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs text-sm shadow-md ${
                msg.type === "user"
                  ? "bg-gradient-to-r from-green-400 to-green-500 text-white rounded-bl-3xl rounded-tr-3xl"
                  : "bg-gradient-to-r from-blue-400 to-sky-500 text-white rounded-br-3xl rounded-tl-3xl"
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
        className="flex border-gray-300 bg-white rounded-lg shadow-lg"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Type a message..."
          className="border-none p-3 flex-1 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-6 hover:from-pink-600 hover:to-purple-600 transition duration-300 ease-in-out"
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
