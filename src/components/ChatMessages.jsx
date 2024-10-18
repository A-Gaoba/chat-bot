import PropTypes from "prop-types";

const ChatMessages = ({
  messages,
  showSuggestions,
  suggestions,
  handleSuggestionClick,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-900 space-y-4">
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
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["user", "bot"]).isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired, // `messages` must be an array of objects with text, type, and time

  showSuggestions: PropTypes.bool.isRequired, // `showSuggestions` is a required boolean

  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired, // `suggestions` is an array of strings

  handleSuggestionClick: PropTypes.func.isRequired, // `handleSuggestionClick` is a required function
};

export default ChatMessages;
