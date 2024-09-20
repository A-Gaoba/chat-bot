import PropTypes from "prop-types"; // Import PropTypes

const MessageDisplay = ({ message, error }) => {
  return (
    <div className="p-4">
      {message && <p className="text-green-500">Response: {message}</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

// Define prop types for validation
MessageDisplay.propTypes = {
  message: PropTypes.string,
  error: PropTypes.string,
};

export default MessageDisplay;
