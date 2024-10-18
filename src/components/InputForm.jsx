import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const InputForm = ({ topic, setTopic, handleSubmit, isSending }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-4 border-t border-gray-700"
    >
      <div className="flex items-center">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-grow bg-gray-900 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          disabled={isSending}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!topic || isSending}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </form>
  );
};
InputForm.propTypes = {
  topic: PropTypes.string.isRequired, // `topic` is required and must be a string
  setTopic: PropTypes.func.isRequired, // `setTopic` must be a function
  handleSubmit: PropTypes.func.isRequired, // `handleSubmit` must be a function
  isSending: PropTypes.bool.isRequired, // `isSending` must be a boolean
};

export default InputForm;
