const API_URL = "https://notesai-ten.vercel.app";

// Utility function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData?.detail?.[0]?.msg || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }
  return response.json();
};

// GET request to fetch the root message
export const fetchMessage = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching message:", error.message);
    throw error; // Propagate error to caller
  }
};

// POST request to query the API
export const postQuery = async (topic) => {
  try {
    const response = await fetch(`${API_URL}/query/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }), // Serialize the topic object to JSON
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error posting query:", error.message);
    throw error; // Propagate error to caller
  }
};
