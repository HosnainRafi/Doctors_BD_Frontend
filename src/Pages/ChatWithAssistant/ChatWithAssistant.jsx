import React, { useEffect, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { getNearestDistrict } from './UserDistrict';
import DoctorCard from '../../components/DoctorCard';
import { ColorRing } from 'react-loader-spinner';

export default function ChatWithAssistant() {
  const SUPPORTED_DISTRICTS = [
    'Rangpur',
    'Bogura',
    'Khulna',
    'Kushtia',
    'Pabna',
    'Sylhet',
    'Rajshahi',
    'Chittagong',
    'Barisal',
    'Dhaka',
    'Mymensingh',
    'Narayanganj',
  ];

  const districtTranslations = {
    rangpur: 'রংপুর',
    bogura: 'বগুড়া',
    khulna: 'খুলনা',
    kushtia: 'কুষ্টিয়া',
    pabna: 'পাবনা',
    sylhet: 'সিলেট',
    rajshahi: 'রাজশাহী',
    chittagong: 'চট্টগ্রাম',
    barisal: 'বরিশাল',
    dhaka: 'ঢাকা',
    mymensingh: 'ময়মনসিংহ',
    narayanganj: 'নারায়ণগঞ্জ',
  };

  function inputMentionsSupportedDistrict(input) {
    const lowerInput = input.toLowerCase();
    if (SUPPORTED_DISTRICTS.some(d => lowerInput.includes(d.toLowerCase()))) {
      return true;
    }
    return Object.values(districtTranslations).some(bnDistrict => {
      const patterns = [
        bnDistrict,
        bnDistrict + 'য়',
        bnDistrict + 'তে',
        bnDistrict.replace(/া$/, 'ে'),
      ];
      return patterns.some(pattern => input.includes(pattern));
    });
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const [input, setInput] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [doctorList, setDoctorList] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('bn-BD');
  const [userDistrict, setUserDistrict] = useState(null);
  const [realLocation, setRealLocation] = useState('');
  const [loading, setLoading] = useState('');
  const [note, setNote] = useState('');
  const [usedDistrict, setUsedDistrict] = useState('');
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLat(lat);
          setUserLon(lon);

          const nearestDistrict = getNearestDistrict(lat, lon);
          setUserDistrict(nearestDistrict);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            const address = data.address;
            const locationName = `
              ${address.village || address.town || address.suburb || ''},
              ${address.county || address.district || ''}`
              .replace(/\s*,\s*/, ', ')
              .trim();
            setRealLocation(locationName);
          } catch (err) {
            console.error('Reverse geocoding failed:', err);
          }
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  function detectLanguage(text) {
    const hasBangla = /[\u0980-\u09FF]/.test(text);
    return hasBangla ? 'bn-BD' : 'en-US';
  }

  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => `${prev} ${transcript}`);
    };
    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  const cleanQueryText = input => {
    const isBengali = /[\u0980-\u09FF]/.test(input);
    if (isBengali) {
      return input.replace(/\bin\b\s?/gi, '');
    }
    return input;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    let prompt = cleanQueryText(input);

    const mentionsDistrict = inputMentionsSupportedDistrict(input);

    if (!mentionsDistrict && userDistrict) {
      let locationPhrase;
      if (language === 'bn-BD') {
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
      setLoading(true);

      const res = await fetch(
        'https://doctors-bd-backend-five.vercel.app/api/v1/doctors/ai-search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            fallbackLocation: userDistrict,
            language: language.startsWith('bn-BD') ? 'bn-BD' : 'en-US',
            lat: userLat,
            lon: userLon,
          }),
        }
      );

      const data = await res.json();
      setDoctorList(data.data);
      setNote(data.note || '');
      setUsedDistrict(data.usedDistrict || '');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-purple-700 mb-6">
        🤖 Chat with CarePoint Assistant
      </h1>

      {realLocation &&
        usedDistrict &&
        !realLocation.toLowerCase().includes(usedDistrict.toLowerCase()) && (
          <div className="mb-4 text-sm text-gray-700 bg-yellow-100 border border-yellow-300 rounded-md p-2">
            <strong>Your current location is {realLocation}</strong>, but we
            don’t have doctor data for this area.
            <br />
            So we are showing doctors from the nearest available district:{' '}
            <strong>{usedDistrict}</strong>.
          </div>
        )}

      <div className="w-full max-w-2xl">
        <div className="flex items-center border rounded-xl bg-white shadow-md p-3">
          <textarea
            rows={3}
            placeholder="Describe your problem..."
            className="flex-1 resize-none text-sm md:text-base p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={input}
            onChange={e => {
              const value = e.target.value;
              setInput(value);
              setLanguage(detectLanguage(value));
            }}
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
            {loading ? (
              <ColorRing
                visible={true}
                height="20"
                width="20"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
              />
            ) : (
              <SendHorizonal className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Detected Language: {language === 'bn-BD' ? 'বাংলা' : 'English'}
        </p>

        <div className="flex items-center gap-4 mt-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="text-sm border rounded-md p-1 bg-white text-gray-700"
          >
            <option value="bn-BD">বাংলা (Bangla)</option>
            <option value="en-US">English</option>
          </select>

          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-md ${
              isRecording ? 'bg-red-500' : 'bg-green-600'
            } text-white`}
          >
            🎤 {isRecording ? 'Listening...' : 'Start Talking'}
          </button>
        </div>
      </div>

      {submittedText && (
        <div className="mt-8 w-full  md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6  rounded-lg ">
          <p className="font-medium text-gray-800">Your query:</p>
          <p className="text-gray-600 mt-2">{submittedText}</p>
          {note && (
            <div className="mb-4 text-sm text-gray-700 bg-yellow-100 border border-yellow-300 rounded-md p-2">
              {note}
            </div>
          )}
          <div>
            <p className="font-semibold text-purple-700">Suggested Doctors:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6">
              {doctorList &&
                doctorList.map(doctor => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
