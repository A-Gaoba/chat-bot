import { useState } from "react";
import QueryForm from "../components/QueryForm";
// import MessageDisplay from "../components/MessageDisplay";

const QueryPage = () => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="max-h-screen bg-gray-100 pb-4">
        <div className="max-w-2xl mx-auto bg-white p-3 rounded-lg shadow-lg">
          <QueryForm setResponse={setResponse} setError={setError} />
          {/* <MessageDisplay message={response} error={error} /> */}
      </div>
    </div>
  );
};

export default QueryPage;
