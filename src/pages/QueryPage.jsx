import { useState } from "react";
import QueryForm from "../components/QueryForm";

const QueryPage = () => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full">
          <QueryForm setResponse={setResponse} setError={setError} />
        </div>
      </div>
    </div>
  );
};

export default QueryPage;
