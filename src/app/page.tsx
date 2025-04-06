"use client";

import { useState } from "react";
import {
  getBilirubinLevelPreBorn,
  getBilirubinLevelRiskFactor,
  getBilirubinLevelNoRiskFactor,
} from "./bilirubin";

type RiskFactors = {
  gestationalAgeUnder38: boolean;
  albuminUnder3: boolean;
  g6pdDeficiency: boolean;
  hemolyticDisease: boolean;
  sepsis: boolean;
  clinicalInstability: boolean;
};

type FormData = {
  gestationalAge: string;
  age: string;
  tsbLevel: number | null;
  riskFactors: RiskFactors;
};

type AgeInputProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

const AgeInput = ({ formData, setFormData }: AgeInputProps) => {
  const [isHours, setIsHours] = useState(true);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value) || 0;
    if (!isHours) {
      value *= 24; // Convert days to hours
    }
    setFormData((prev) => ({ ...prev, age: value.toString() }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Age ({isHours ? "in hours" : "in days"})
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={() => setIsHours((prev) => !prev)}
          className={`px-4 py-2 rounded-full ${
            isHours ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } focus:outline-none focus:ring focus:border-blue-300`}
        >
          {isHours ? "Hours" : "Days"}
        </button>
      </div>
      <div className="relative">
        <input
          type="number"
          name="age"
          value={
            isHours ? formData.age : (parseFloat(formData.age) / 24).toString()
          }
          onChange={handleAgeChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black pr-16"
          required
          min="0"
          step="0.1"
          placeholder={isHours ? "Enter age in hours" : "Enter age in days"}
        />
        {formData.age && (
          <span className="absolute inset-y-0 right-2 flex items-center text-gray-500">
            {isHours ? "hours" : "days"}
          </span>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    gestationalAge: "Select ",
    age: "",
    tsbLevel: null,
    riskFactors: {
      gestationalAgeUnder38: false,
      albuminUnder3: false,
      g6pdDeficiency: false,
      hemolyticDisease: false,
      sepsis: false,
      clinicalInstability: false,
    },
  });

  const [showTSB, setShowTSB] = useState(false);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: keyof FormData; value: string | number | RiskFactors }
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
      setFormData((prev) => ({
        ...prev,
        [e.name]: e.value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const riskFactorCount = Object.values(formData.riskFactors).filter(
      Boolean
    ).length;
    const gestationalAge = parseInt(formData.gestationalAge, 10);
    const postnatalAge = parseFloat(formData.age);

    let calculatedTSB: number;
    if (gestationalAge <= 34) {
      calculatedTSB = getBilirubinLevelPreBorn(gestationalAge, postnatalAge);
    } else if (riskFactorCount > 0) {
      calculatedTSB = getBilirubinLevelRiskFactor(gestationalAge, postnatalAge);
    } else {
      calculatedTSB = getBilirubinLevelNoRiskFactor(
        gestationalAge,
        postnatalAge
      );
    }

    setFormData((prev) => ({ ...prev, tsbLevel: calculatedTSB }));
    setShowTSB(true);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="text-right border-t border-gray-200 pt-3 mb-6">
        <p className="text-sm text-gray-600">
          Created by{" "}
          <a
            href="https://www.linkedin.com/in/fimilfaneea/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-bold hover:underline"
          >
            Fimil
          </a>
        </p>
      </div>
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
            <input
              type="range"
              name="gestationalAge"
              min="23"
              max="40"
              value={
                formData.gestationalAge === "40+"
                  ? "40"
                  : formData.gestationalAge
              }
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setFormData({
                  ...formData,
                  gestationalAge:
                    value === 40 && formData.gestationalAge === "40+"
                      ? "40+"
                      : String(value),
                });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <p className="mt-2 text-lg text-gray-500 text-center">
              {formData.gestationalAge} weeks
            </p>
          </div>

          {/* Age Input */}
          <AgeInput formData={formData} setFormData={setFormData} />

          {/* Risk Factors */}
          {formData.gestationalAge === "" ||
          Number(formData.gestationalAge) > 34 ? (
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
                    ).reduce(
                      (acc, key) => ({ ...acc, [key]: checked }),
                      {} as RiskFactors
                    );
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
                  Any Risk Factor Present (Gestational age &lt;38 weeks, Albumin
                  &lt;3.0 g/dL, etc.)
                </label>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Calculate Risk
          </button>
        </form>

        {showTSB && formData.tsbLevel !== null && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Total Serum Bilirubin Level
            </h2>
            <p className="text-2xl font-bold text-blue-900">
              {formData.tsbLevel.toFixed(1)} mg/dL
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
