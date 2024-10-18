import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHistory from "./ChatHistory";
import ChatMessages from "./ChatMessages";
import InputForm from "./InputForm";
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
  const [isSending, setIsSending] = useState(false);

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
      title: `New Chat`,
      messages: [],
    };
    setChatSessions((prevChats) => [...prevChats, newChat]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setError("");
    setShowSuggestions(false);
    setIsSending(true);

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
            ? {
                ...chat,
                title:
                  chat.messages.length > 0
                    ? chat.title
                    : userMessage.text.substring(0, 20),
                messages: finalMessages,
              }
            : chat
        )
      );
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    }

    setIsSending(false);
    setTopic("");
  };

  const handleChatHistoryClick = (chatId) => {
    setCurrentChatId(chatId);
    setIsSidebarOpen(false);
    setShowSuggestions(false);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chatSessions.filter((chat) => chat.id !== chatId);
    setChatSessions(updatedChats);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-900">
      <ChatHistory
        chatSessions={chatSessions}
        handleNewChat={handleNewChat}
        handleChatHistoryClick={handleChatHistoryClick}
        handleDeleteChat={handleDeleteChat}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentChatId={currentChatId}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
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
        <ChatMessages
          messages={messages}
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          handleSuggestionClick={setTopic}
        />
        <InputForm
          topic={topic}
          setTopic={setTopic}
          handleSubmit={handleSubmit}
          isSending={isSending}
        />
      </div>
    </div>
  );
};

QueryForm.propTypes = {
  setResponse: PropTypes.func.isRequired, // It expects a function
  setError: PropTypes.func.isRequired, // It expects a function
};

export default QueryForm;
