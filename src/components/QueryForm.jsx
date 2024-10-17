import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { postQuery } from "../api";

const QueryForm = ({ setResponse, setError }) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatSessions, setChatSessions] = useState(() => {
    const savedChats = localStorage.getItem("chatSessions");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isSending, setIsSending] = useState(false); // Track request state

  const suggestions = [
    "What is AI?",
    "Tell me a joke.",
    "How can I improve my coding skills?",
    "What's the weather like today?",
  ];

  useEffect(() => {
    if (currentChatId) {
      const currentChat = chatSessions.find(
        (chat) => chat.id === currentChatId
      );
      if (currentChat) {
        setMessages(currentChat.messages);
      }
    }
  }, [currentChatId, chatSessions]);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: [],
    };
    setChatSessions((prevChats) => [...prevChats, newChat]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return; // Prevent multiple submissions

    setError("");
    setShowSuggestions(false);
    setIsSending(true); // Start sending the request

    const userMessage = {
      text: topic,
      type: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

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
      const finalMessages = [...updatedMessages, botMessage];

      setMessages(finalMessages);

      setChatSessions((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: finalMessages }
            : chat
        )
      );
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
      const finalMessages = [...updatedMessages, errorBotMessage];
      setMessages(finalMessages);

      setChatSessions((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: finalMessages }
            : chat
        )
      );
    }

    setIsSending(false); // Request completed
    setTopic("");
  };

  const handleChatHistoryClick = (chatId) => {
    setCurrentChatId(chatId);
    setIsSidebarOpen(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setTopic(suggestion);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chatSessions.filter((chat) => chat.id !== chatId);
    setChatSessions(updatedChats);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      setShowSuggestions(true); // Show suggestions when no chat is selected
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-900">
      {/* Sidebar Section */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block bg-gray-800 w-full lg:w-64 p-4 border-r border-gray-700 lg:flex-shrink-0 h-screen overflow-y-auto`}
      >
        <h2 className="text-white mb-4">Chat History</h2>
        <button
          onClick={handleNewChat}
          className="bg-green-500 text-white py-2 px-4 rounded-lg mb-4 w-full hover:bg-green-600"
        >
          + New Chat
        </button>
        <ul className="space-y-2">
          {chatSessions.map((chat) => (
            <li key={chat.id} className="flex items-center justify-between">
              <span
                className={`flex-grow cursor-pointer bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md ${
                  chat.id === currentChatId ? "bg-gray-600" : ""
                }`}
                onClick={() => handleChatHistoryClick(chat.id)}
              >
                {chat.title.length > 12
                  ? `${chat.title.substring(0, 12)}...`
                  : chat.title}
              </span>
              <button
                onClick={() => handleDeleteChat(chat.id)}
                className="ml-2 text-red-500 hover:text-red-400"
                aria-label="Delete chat"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 text-white py-2 px-4 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden bg-gray-700 text-white py-2 px-4 rounded-lg"
          >
            {isSidebarOpen ? "Close History" : "Open History"}
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900 space-y-4">
          {/* Show suggestions at the start of new chats */}
          {showSuggestions && messages.length === 0 && (
            <div className="mb-4">
              <h3 className="text-white mb-2">Suggestions:</h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Display */}
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
              disabled={isSending} // Disable input while sending
            />
            <button
              type="submit"
              className="ml-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
              disabled={isSending} // Disable button while sending
            >
              {isSending ? (
                "Sending..." 
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} className="h-6 w-6" />
              )}
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
