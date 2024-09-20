import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { postQuery } from "../api"; // Adjust the path as necessary

const QueryForm = ({ setResponse, setError }) => {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState(() => {
    // Initialize messages from local storage
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    // Save messages to local storage whenever messages change
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    // Add user's message to chat
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
      const data = await postQuery(topic); // Send the topic to the API
      const botMessage = {
        text: data["AI Answer"],
        type: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }; // Add timestamp
      setResponse(data["AI Answer"]); // Set the response state
      setMessages((prevMessages) => [...prevMessages, botMessage]); // Add bot message to chat
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
      }; // Add timestamp
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]); // Add error message to chat
    }

    setTopic(""); // Clear input field
  };

  return (
    <div className="p-2 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-200 rounded-md shadow-lg max-w-lg mx-auto flex flex-col h-full text-white">
      {/* Chatbox Section */}
      <div className="flex-1 overflow-y-auto mb-4 p-2 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-200 rounded-lg  text-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.type === "user"
                  ? "bg-green-500 text-black rounded-ss-2xl rounded-none rounded-br-3xl"
                  : "bg-sky-200 text-black rounded-ss-2xl rounded-none rounded-br-3xl"
              }`}
            >
              {msg.text}
              <div className="text-xs mt-1 text-gray-600">{msg.time}</div>{" "}
              {/* Display timestamp */}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSubmit}
        className="flex border-gray-300 bg-white rounded-lg"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)} // Update topic state on change
          placeholder="Type a message..."
          className="border-none p-3 flex-1 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-green-600 to-sky-500 text-white py-2 px-4 rounded-r-lg hover:from-sky-500 hover:to-green-600 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

// Define prop types for validation
QueryForm.propTypes = {
  setResponse: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default QueryForm;
