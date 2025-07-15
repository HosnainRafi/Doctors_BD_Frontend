import React, { useEffect, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import AiSearchCard from '../../components/AiSearchCard';

export default function ChatWithAssistant() {
  const [input, setInput] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        const response = await fetch('/mockDoctorData.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDoctorData(data);
      } catch (error) {
        console.error('Failed to load mock doctor data:', error);
      }
    }

    fetchDoctorData();
  }, []);
  const handleSend = () => {
    if (!input.trim()) return;

    setSubmittedText(input); // Replace with API call later
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-purple-700 mb-6">
        🤖 Chat with CarePoint Assistant
      </h1>

      <div className="w-full max-w-2xl">
        <div className="flex items-center border rounded-xl bg-white shadow-md p-3">
          <textarea
            rows={3}
            placeholder="Describe your problem..."
            className="flex-1 resize-none text-sm md:text-base p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-3 bg-purple-700 text-white p-2 rounded-md hover:bg-purple-800"
          >
            <SendHorizonal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {submittedText && (
        <div className="mt-8 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
          <p className="font-medium text-gray-800">Your query:</p>
          <p className="text-gray-600 mt-2">{submittedText}</p>

          <div className="mt-4">
            <p className="font-semibold text-purple-700">Suggested Doctors:</p>
            <AiSearchCard doctor={doctorData} />
          </div>
        </div>
      )}
    </div>
  );
}
