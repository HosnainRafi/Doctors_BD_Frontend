import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import AiSearchCard from '../../components/AiSearchCard';
import DoctorsCard from '../../components/DoctorsCard';

export default function ChatWithAssistant() {
  const [input, setInput] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [doctorList, setDoctorList] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setSubmittedText(input);

    const res = await fetch(
      'https://doctors-bd-backend-five.vercel.app/api/v1/doctors/ai-search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      }
    );

    const data = await res.json();
    setDoctorList(data.data);
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
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
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
      </div>

      {submittedText && (
        <div className="mt-8 w-full  md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6  rounded-lg ">
          <p className="font-medium text-gray-800">Your query:</p>
          <p className="text-gray-600 mt-2">{submittedText}</p>

          <div>
            <p className="font-semibold text-purple-700">Suggested Doctors:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6">
              {doctorList &&
                doctorList?.map(doctor => (
                  <DoctorsCard key={doctor._id} doctor={doctor} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
