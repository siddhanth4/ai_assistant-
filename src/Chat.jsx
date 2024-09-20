import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Function to handle voice input using Web Speech API
  const handleVoiceInput = () => {
    if (!recognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = 'en-US';

      newRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        // Automatically generate answer after receiving voice input
        generateAnswer(transcript);
      };

      newRecognition.onerror = (event) => {
        console.log("Speech Recognition Error: ", event.error);
      };

      setRecognition(newRecognition);
      newRecognition.start();
      setIsRecording(true);
      newRecognition.onend = () => setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Function to generate the answer from the Gemini API
  async function generateAnswer(input) {
    setGeneratingAnswer(true);
    setAnswer("Loading your answer... \n It might take up to 5 seconds");

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: input || question }] }],
        },
      });

      const generatedText = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setAnswer(generatedText);

      // Use speech synthesis to read the generated answer aloud
      const utterance = new SpeechSynthesisUtterance(generatedText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  // Function to handle form submit (text input)
  const handleSubmit = (e) => {
    e.preventDefault();
    generateAnswer(question);
  };

  return (
    <>
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 h-screen p-3 flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105"
      >
          <h1 className="text-4xl font-bold text-blue-500 mb-4 animate-bounce">DoJ Assistant</h1>
        
        <textarea
          required
          className="border border-gray-300 rounded w-full my-2 min-h-fit p-3 transition-all duration-300 focus:border-blue-400 focus:shadow-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything"
        ></textarea>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-all duration-300 ${
              isRecording ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRecording}
          >
            {isRecording ? "Recording..." : "Start Voice Input"}
          </button>
        </div>
        <br></br>
        <button
          type="submit"
          className={`bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all duration-300 ${
            generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={generatingAnswer}
        >
          Generate Answer
        </button>
      </form>

      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg bg-white my-4 shadow-lg transition-all duration-500 transform hover:scale-105">
        <ReactMarkdown className="p-4">{answer}</ReactMarkdown>
      </div>
    </div>
    </>
  );
}

export default Chat;
