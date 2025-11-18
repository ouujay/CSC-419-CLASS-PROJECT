'use client'
import {  useState } from "react";

function usePostRequest<T>(
  url: string,
  options:  RequestInit = {}
) {
  const [response, setResponse] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const postRequest = async () => {
    setIsLoading(true);
    try {
       

      const response = await fetch(url, options);
      
      const responseData: T = await response.json();
      
      setIsLoading(false);
      setResponse(responseData);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.name); // the type of error
        console.log(error.message); // the description of the error
        console.log(error.stack); // the stack trace of the error
        setError(error);
      } else {
        // handle other errors
        setError(new Error('An unknown error occurred'));
      }
      setIsLoading(false);
      setResponse(null);
    }
  };

  return [response, isLoading, error, postRequest] as [T | null, boolean, Error | null, () => Promise<void>];
}

export default usePostRequest;
