import React, { useState, useEffect } from "react";

const SPECIALTIES = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Psychiatry",
  "Urology",
  "Gastroenterology",
  "Oncology",
  "Other",
];
const DEGREES = [
  "MBBS",
  "FCPS",
  "MD",
  "MS",
  "MRCP",
  "FRCS",
  "BCS (Health)",
  "DGO",
  "DLO",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  bmdc_number: "",
  specialty: "",
  specialties: [],
  degree_names: [],
  additional_qualifications: [],
  photo: "",
  bio: "",
  experiences: [
    {
      organization_name: "",
      designation: "",
      department: "",
      from: "",
      to: "",
      is_current: false,
      duration_month: "",
    },
  ],
  consultation: {
    standard_fee: "",
    standard_fee_with_vat: "",
    follow_up_fee: "",
    follow_up_fee_with_vat: "",
    average_consultation_minutes: "",
  },
};

const MultiStepDoctorProfileForm = ({
  doctorId,
  initialDoctor,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const doctorToken = localStorage.getItem("doctorToken");

  // Pre-fill form with backend data
  useEffect(() => {
    if (!doctorId) return;
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setForm((prev) => ({
            ...prev,
            ...data.data,
            specialties: data.data.specialties || [],
            degree_names: data.data.degree_names || [],
            experiences: data.data.experiences?.length
              ? data.data.experiences
              : initialForm.experiences,
            consultation: data.data.consultation || initialForm.consultation,
          }));
        }
      });
  }, [doctorId, doctorToken]);

  // Input handlers
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSpecialtiesChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm({ ...form, specialties: options });
  };
  const handleDegreesChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm({ ...form, degree_names: options });
  };

  // Experience handlers
  const handleExperienceChange = (i, e) => {
    const newExp = [...form.experiences];
    newExp[i][e.target.name] = e.target.value;
    setForm({ ...form, experiences: newExp });
  };
  const addExperience = () => {
    setForm({
      ...form,
      experiences: [
        ...form.experiences,
        {
          organization_name: "",
          designation: "",
          department: "",
          from: "",
          to: "",
          is_current: false,
          duration_month: "",
        },
      ],
    });
  };
  const removeExperience = (i) => {
    setForm({
      ...form,
      experiences: form.experiences.filter((_, idx) => idx !== i),
    });
  };

  // Photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, photo: URL.createObjectURL(file) });
    // In production, upload to S3/Cloudinary/backend and set the returned URL.
  };

  // Step navigation
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // Convert number fields before submit
  const convertNumbers = (obj) => {
    const consultation = { ...obj.consultation };
    if (consultation.standard_fee !== "")
      consultation.standard_fee = Number(consultation.standard_fee);
    else delete consultation.standard_fee;
    if (consultation.standard_fee_with_vat !== "")
      consultation.standard_fee_with_vat = Number(
        consultation.standard_fee_with_vat
      );
    else delete consultation.standard_fee_with_vat;
    if (
      consultation.follow_up_fee !== "" &&
      consultation.follow_up_fee !== null &&
      consultation.follow_up_fee !== undefined
    )
      consultation.follow_up_fee = Number(consultation.follow_up_fee);
    else delete consultation.follow_up_fee;

    if (
      consultation.follow_up_fee_with_vat !== "" &&
      consultation.follow_up_fee_with_vat !== null &&
      consultation.follow_up_fee_with_vat !== undefined
    )
      consultation.follow_up_fee_with_vat = Number(
        consultation.follow_up_fee_with_vat
      );
    else delete consultation.follow_up_fee_with_vat;
    if (consultation.average_consultation_minutes !== "")
      consultation.average_consultation_minutes = Number(
        consultation.average_consultation_minutes
      );
    else delete consultation.average_consultation_minutes;

    const experiences = obj.experiences.map((exp) => ({
      ...exp,
      duration_month:
        exp.duration_month !== "" ? Number(exp.duration_month) : undefined,
    }));

    return { ...obj, consultation, experiences };
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = { ...convertNumbers(form), profileCompleted: true };
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (data.success) {
      setMessage("Profile completed!");
      onComplete && onComplete();
    } else setMessage(data.message || "Failed to complete profile.");
  };

  // Step 1: Basic Info
  const Step1 = (
    <>
      <h3 className="text-xl font-bold mb-4">Basic Information</h3>
      <input
        name="name"
        value={form.name}
        disabled
        className="w-full mb-2 px-3 py-2 border rounded bg-gray-100"
        placeholder="Full Name"
        required
      />
      <input
        name="email"
        value={form.email}
        disabled
        className="w-full mb-2 px-3 py-2 border rounded bg-gray-100"
        placeholder="Email"
        required
      />
      <input
        name="phone"
        value={form.phone}
        disabled
        className="w-full mb-2 px-3 py-2 border rounded bg-gray-100"
        placeholder="Phone"
        required
      />
      <input
        name="bmdc_number"
        value={form.bmdc_number}
        disabled
        className="w-full mb-2 px-3 py-2 border rounded bg-gray-100"
        placeholder="BMDC Number"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="block mb-2"
      />
      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        className="w-full mb-2 px-3 py-2 border rounded"
        placeholder="Short Bio"
      />
    </>
  );

  // Step 2: Specialties & Degrees
  const Step2 = (
    <>
      <h3 className="text-xl font-bold mb-4">Specialties & Degrees</h3>
      <select
        name="specialty"
        value={form.specialty || ""}
        onChange={handleChange}
        className="w-full mb-2 px-3 py-2 border rounded"
        required
      >
        <option value="">Select Main Specialty</option>
        {SPECIALTIES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <label className="block text-gray-700 font-medium mb-1">
        Other Specialties (hold Ctrl/Cmd to select multiple)
      </label>
      <select
        multiple
        name="specialties"
        value={form.specialties || []}
        onChange={handleSpecialtiesChange}
        className="w-full mb-2 px-3 py-2 border rounded"
      >
        {SPECIALTIES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <label className="block text-gray-700 font-medium mb-1">
        Degrees (hold Ctrl/Cmd to select multiple)
      </label>
      <select
        multiple
        name="degree_names"
        value={form.degree_names || []}
        onChange={handleDegreesChange}
        className="w-full mb-2 px-3 py-2 border rounded"
      >
        {DEGREES.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <input
        name="additional_qualifications"
        value={form.additional_qualifications?.join(", ") || ""}
        onChange={(e) =>
          setForm({
            ...form,
            additional_qualifications: e.target.value
              .split(",")
              .map((q) => q.trim())
              .filter(Boolean),
          })
        }
        className="w-full mb-2 px-3 py-2 border rounded"
        placeholder="Additional Qualifications (comma separated)"
      />
    </>
  );

  // Step 3: Experience
  const Step3 = (
    <>
      <h3 className="text-xl font-bold mb-4">Experience</h3>
      {form.experiences.map((exp, i) => (
        <div key={i} className="mb-4 border-b pb-2">
          <input
            name="organization_name"
            value={exp.organization_name}
            onChange={(e) => handleExperienceChange(i, e)}
            className="w-full mb-2 px-3 py-2 border rounded"
            placeholder="Organization Name"
            required
          />
          <input
            name="designation"
            value={exp.designation}
            onChange={(e) => handleExperienceChange(i, e)}
            className="w-full mb-2 px-3 py-2 border rounded"
            placeholder="Designation"
            required
          />
          <input
            name="department"
            value={exp.department}
            onChange={(e) => handleExperienceChange(i, e)}
            className="w-full mb-2 px-3 py-2 border rounded"
            placeholder="Department"
          />
          <input
            name="from"
            type="date"
            value={exp.from}
            onChange={(e) => handleExperienceChange(i, e)}
            className="w-full mb-2 px-3 py-2 border rounded"
            placeholder="From"
            required
          />
          <input
            name="to"
            type="date"
            value={exp.to || ""}
            onChange={(e) => handleExperienceChange(i, e)}
            className="w-full mb-2 px-3 py-2 border rounded"
            placeholder="To"
          />
          <label className="block text-xs">
            <input
              type="checkbox"
              name="is_current"
              checked={exp.is_current || false}
              onChange={(e) =>
                handleExperienceChange(i, {
                  target: { name: "is_current", value: e.target.checked },
                })
              }
              className="mr-1"
            />
            Currently working here
          </label>
          <input
            name="duration_month"
            value={exp.duration_month}
            onChange={(e) => handleExperienceChange(i, e)}
            className="w-full mb-2 px-3 py-2 border rounded"
            placeholder="Duration (months)"
            type="number"
            min="0"
          />
          <button
            type="button"
            onClick={() => removeExperience(i)}
            className="text-red-500 text-xs mt-1"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addExperience}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
      >
        + Add Experience
      </button>
    </>
  );

  // Step 4: Consultation Fees & Schedules
  const Step4 = (
    <>
      <h3 className="text-xl font-bold mb-4">Consultation & Schedules</h3>
      <div className="mb-2">
        <label className="block text-gray-700 font-medium mb-1">
          Standard Fee (BDT)
        </label>
        <input
          name="standard_fee"
          value={form.consultation?.standard_fee || ""}
          onChange={(e) =>
            setForm({
              ...form,
              consultation: {
                ...form.consultation,
                standard_fee: e.target.value,
              },
            })
          }
          className="w-full mb-2 px-3 py-2 border rounded"
          placeholder="Standard Fee"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 font-medium mb-1">
          Standard Fee With VAT (BDT)
        </label>
        <input
          name="standard_fee_with_vat"
          value={form.consultation?.standard_fee_with_vat || ""}
          onChange={(e) =>
            setForm({
              ...form,
              consultation: {
                ...form.consultation,
                standard_fee_with_vat: e.target.value,
              },
            })
          }
          className="w-full mb-2 px-3 py-2 border rounded"
          placeholder="Standard Fee With VAT"
          required
        />
      </div>
      {/* Add more fee fields as needed */}
      <div className="mb-2">
        <label className="block text-gray-700 font-medium mb-1">
          Average Consultation Minutes
        </label>
        <input
          name="average_consultation_minutes"
          value={form.consultation?.average_consultation_minutes || ""}
          onChange={(e) =>
            setForm({
              ...form,
              consultation: {
                ...form.consultation,
                average_consultation_minutes: e.target.value,
              },
            })
          }
          className="w-full mb-2 px-3 py-2 border rounded"
          placeholder="Average Consultation Minutes"
        />
      </div>
      {/* Schedules */}
      <label className="block text-gray-700 font-medium mb-1 mt-4">
        Weekly Schedules (add at least one)
      </label>
      {/* You can add a dynamic schedule form here */}
    </>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <form onSubmit={handleSubmit}>
        {step === 1 && Step1}
        {step === 2 && Step2}
        {step === 3 && Step3}
        {step === 4 && Step4}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              type="button"
              onClick={nextStep}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Next
            </button>
          )}
          {step === 4 && (
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Complete Profile
            </button>
          )}
        </div>
        {message && (
          <div className="mt-4 text-center text-green-700 font-semibold">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default MultiStepDoctorProfileForm;
