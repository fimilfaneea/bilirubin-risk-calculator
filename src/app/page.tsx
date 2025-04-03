"use client";

import { useState } from "react";

const AgeInput = ({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) => {
  const [isHours, setIsHours] = useState(true);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value) || 0;
    if (!isHours) {
      value *= 24; // Convert days to hours
    }
    setFormData((prev: any) => ({ ...prev, age: value }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Age ({isHours ? "in hours" : "in days"})
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          checked={!isHours}
          onChange={() => setIsHours((prev) => !prev)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <span className="text-gray-700">
          {isHours ? "Switch to Days" : "Switch to Hours"}
        </span>
      </div>
      <input
        type="number"
        name="age"
        value={isHours ? formData.age : formData.age / 24}
        onChange={handleAgeChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
        min="0"
        step="0.1"
      />
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({
    gestationalAge: "",
    age: "",
    tsbLevel: "",
    riskFactors: {
      gestationalAgeUnder38: false,
      albuminUnder3: false,
      g6pdDeficiency: false,
      hemolyticDisease: false,
      sepsis: false,
      clinicalInstability: false,
    },
  });

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: any }
  ) => {
    if ("target" in e) {
      const { name, value, type } = e.target;

      if (type === "checkbox") {
        const checkbox = e.target as HTMLInputElement;
        setFormData((prev) => ({
          ...prev,
          riskFactors: {
            ...prev.riskFactors,
            [name]: checkbox.checked,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      // Handle manual updates
      setFormData((prev) => ({
        ...prev,
        [e.name]: e.value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-black mb-6">
          Bilirubin Risk Assessment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gestational Age Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gestational Age (weeks)
            </label>
            <select
              name="gestationalAge"
              value={formData.gestationalAge}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              required
            >
              <option value="">Select gestational age</option>
              {[...Array(18)].map((_, i) => (
                <option key={i} value={23 + i}>
                  {23 + i} weeks
                </option>
              ))}
              <option value="40+">≥40 weeks</option>
            </select>
          </div>

          {/* Age Input */}
          <AgeInput formData={formData} setFormData={setFormData} />

          {/* TSB Level Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Serum Bilirubin (TSB) level (mg/dL)
            </label>
            <input
              type="number"
              name="tsbLevel"
              value={formData.tsbLevel}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.1"
            />
          </div>

          {/* Risk Factors (Hidden if gestationalAge ≤ 34 weeks) */}
         { formData.gestationalAge === "" || Number(formData.gestationalAge) > 34 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Factors
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anyRiskFactor"
                  name="anyRiskFactor"
                  checked={Object.values(formData.riskFactors).some(Boolean)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const updatedRiskFactors = Object.keys(
                      formData.riskFactors
                    ).reduce((acc, key) => ({ ...acc, [key]: checked }), {});
                    handleInputChange({
                      name: "riskFactors",
                      value: updatedRiskFactors,
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="anyRiskFactor"
                  className="ml-2 text-sm text-gray-600"
                >
                  Any Risk Factor Present:&nbsp;
                  <span className="text-gray-500">
                    (Gestational age &lt;38 weeks, Albumin &lt;3.0 g/dL, G6PD
                    deficiency, Hemolytic disease, Sepsis, Clinical instability
                    in past 24 hours etc)
                  </span>
                </label>
              </div>
            </div>
          ):null}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
  