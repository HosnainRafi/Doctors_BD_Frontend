import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useUserDistrict } from "./UserDistrict";
import DoctorCard from "../../components/DoctorCard";

// Free location hook using Nominatim reverse geocoding

export default function ChatWithAssistant() {
  const districtTranslations = {
    rangpur: "রংপুর",
    bogura: "বগুড়া",
    khulna: "খুলনা",
    kushtia: "কুষ্টিয়া",
    pabna: "পাবনা",
    sylhet: "সিলেট",
    rajshahi: "রাজশাহী",
    chittagong: "চট্টগ্রাম",
    barisal: "বরিশাল",
    dhaka: "ঢাকা",
    mymensingh: "ময়মনসিংহ",
    narayanganj: "নারায়ণগঞ্জ",
  };

  function containsBengaliDistrict(input, districtTranslations) {
    // Check for any Bengali district name with or without locative suffixes
    return Object.values(districtTranslations).some((bnDistrict) => {
      // Check for: exact, "য়", "তে", "ে" suffixes
      const patterns = [
        bnDistrict, // "ঢাকা"
        bnDistrict + "য়", // "ঢাকায়"
        bnDistrict + "তে", // "কুষ্টিয়াতে"
        bnDistrict.replace(/া$/, "ে"), // "ঢাকায়" (sometimes "া" becomes "ে")
      ];
      return patterns.some((pattern) => input.includes(pattern));
    });
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  function cleanQueryText() {
    const isBengali = /[\u0980-\u09FF]/.test(input); // Bengali character detection
    if (isBengali) {
      return input.replace(/\bin\b\s?/gi, ""); // Remove "in ", "in"
    }
    return input;
  }

  const [input, setInput] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("bn-BD"); // Default: Bangla

  const userDistrict = useUserDistrict();

  function detectLanguage(text) {
    // If it contains Bengali Unicode range (0980–09FF)
    const hasBangla = /[\u0980-\u09FF]/.test(text);
    return hasBangla ? "bn-BD" : "en-US";
  }

  const handleVoiceInput = () => {
    // const detectedLang = detectLanguage(input);
    // setLanguage(detectedLang);
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language; // Use "en-US" for English or "bn-BD" for Bangla
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => `${prev} ${transcript}`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    let prompt = cleanQueryText(input);

    let hasDistrict = false;
    if (language === "bn-BD") {
      hasDistrict = containsBengaliDistrict(input, districtTranslations);
    } else {
      const lowerInput = input.toLowerCase();
      hasDistrict =
        lowerInput.includes("district") || lowerInput.includes("in ");
    }

    if (!hasDistrict && userDistrict) {
      let locationPhrase;
      if (language === "bn-BD") {
        const bengaliDistrict =
          districtTranslations[userDistrict?.toLowerCase()] || userDistrict;
        locationPhrase = `${bengaliDistrict}`;
      } else {
        locationPhrase = `in ${userDistrict}`;
      }
      prompt = `${input} ${locationPhrase}`;
    }

    setSubmittedText(prompt);

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/doctors/ai-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            fallbackLocation: userDistrict,
            language: language.startsWith("bn-BD") ? "bn-BD" : "en-US",
          }),
        }
      );

      const data = await res.json();
      setDoctorList(data.data);
    } catch (error) {
      console.error("Search failed:", error);
    }

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-purple-700 mb-6">
        🤖 Chat with CarePoint Assistant
      </h1>

      {userDistrict && (
        <div className="mb-4 text-sm text-gray-700 bg-purple-100 border border-purple-300 rounded-md p-2">
          📍 Using your current location:{" "}
          <strong className="capitalize">{userDistrict}</strong>
        </div>
      )}

      <div className="w-full max-w-2xl">
        {/* Textarea + Send Button */}
        <div className="flex items-center border rounded-xl bg-white shadow-md p-3">
          <textarea
            rows={3}
            placeholder="Describe your problem..."
            className="flex-1 resize-none text-sm md:text-base p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={input}
            onChange={(e) => {
              const value = e.target.value;
              setInput(value);
              setLanguage(detectLanguage(value)); // <-- auto-detect language
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="ml-3 bg-purple-700 text-white p-2 rounded-md hover:bg-purple-800"
          >
            <SendHorizonal className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Detected Language: {language === "bn-BD" ? "বাংলা" : "English"}
        </p>
        {/* ⬇️ Add this RIGHT HERE: below the input box, inside same container */}
        <div className="flex items-center gap-4 mt-2">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border rounded-md p-1 bg-white text-gray-700"
          >
            <option value="bn-BD">বাংলা (Bangla)</option>
            <option value="en-US">English</option>
          </select>

          {/* Microphone button */}
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-md ${
              isRecording ? "bg-red-500" : "bg-green-600"
            } text-white`}
          >
            🎤 {isRecording ? "Listening..." : "Start Talking"}
          </button>
        </div>
      </div>

      {submittedText && (
        <div className="mt-8 w-full  md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6  rounded-lg ">
          <p className="font-medium text-gray-800">Your query:</p>
          <p className="text-gray-600 mt-2">{submittedText}</p>

          <div>
            <p className="font-semibold text-purple-700">Suggested Doctors:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6">
              {doctorList &&
                doctorList.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
