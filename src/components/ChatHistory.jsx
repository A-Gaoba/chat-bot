import PropTypes from "prop-types";

const ChatHistory = ({
  chatSessions,
  handleNewChat,
  handleChatHistoryClick,
  handleDeleteChat,
  isSidebarOpen,
  // setIsSidebarOpen,
  currentChatId,
}) => {
  return (
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
              onClick={() => handleChatHistoryClick(chat.id)}
              className={`flex-grow cursor-pointer bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md ${
                chat.id === currentChatId ? "bg-gray-600" : ""
              }`}
            >
              {chat.title.length > 20
                ? `${chat.title.substring(0, 20)}...`
                : chat.title}
            </span>
            <button
              onClick={() => handleDeleteChat(chat.id)}
              className="ml-2 text-red-500 hover:text-red-400"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChatHistory.propTypes = {
  chatSessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      messages: PropTypes.array.isRequired,
    })
  ).isRequired,
  handleNewChat: PropTypes.func.isRequired,
  handleChatHistoryClick: PropTypes.func.isRequired,
  handleDeleteChat: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired, // If unused, remove it
  currentChatId: PropTypes.number,
};

export default ChatHistory;
