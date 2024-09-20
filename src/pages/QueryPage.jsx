import { useState } from "react";
import QueryForm from "../components/QueryForm";
// import MessageDisplay from "../components/MessageDisplay";

const QueryPage = () => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="max-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          <QueryForm setResponse={setResponse} setError={setError} />
          {/* <MessageDisplay message={response} error={error} /> */}
        </div>
      </div>
    </div>
  );
};

export default QueryPage;
