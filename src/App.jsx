// App.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle2, XCircle, ChevronDown, ArrowRight } from 'lucide-react';

// Declare gtag function for Google Analytics
const gtag = typeof window !== 'undefined' && window.gtag ? window.gtag : function() {};

// Coefficients from the logistic regression model
const COEFFICIENTS = {
  age: 0.043105212902502056,
  vas_ratesmell: 0.027966104711863282,
  vas_4gasleak: 0.019908032571725683,
  diabetes: 1.3004639643330465,
  constant: -5.117446511633389
};

function calculate4CAST(age, hasDiabetes, smellRating, safetyImpact) {
  const diabetesBinary = hasDiabetes ? 1 : 0;

  const summation =
    age * COEFFICIENTS.age +
    smellRating * COEFFICIENTS.vas_ratesmell +
    safetyImpact * COEFFICIENTS.vas_4gasleak +
    diabetesBinary * COEFFICIENTS.diabetes +
    COEFFICIENTS.constant;

  const odds = Math.exp(summation);
  const probability = odds / (1 + odds);
  const passFail = probability > 0.5 ? 'FAIL' : 'PASS';

  return {
    probability,
    percentProbability: (probability * 100).toFixed(1),
    passFail,
    hasSmellLoss: probability > 0.5
  };
}

// Modern slider component — no numeric value, prominent endpoint labels
function Slider({ value, onChange, min = 0, max = 100, label, sublabel, leftLabel, rightLabel }) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <label className="block text-xl font-semibold text-slate-800 mb-1">{label}</label>
        {sublabel && <p className="text-lg text-slate-500">{sublabel}</p>}
      </div>

      {/* Endpoint labels — large and bold, above the slider */}
      <div className="flex justify-between items-baseline px-1">
        <span className="text-xl font-bold text-teal-700">{leftLabel}</span>
        <ArrowRight className="w-5 h-5 text-slate-300" />
        <span className="text-xl font-bold text-red-600">{rightLabel}</span>
      </div>

      <div className="relative pt-2 pb-8">
        <div className="slider-track-bg" />
        <div
          className="slider-track-fill"
          style={{
            width: `${percent}%`,
            backgroundSize: percent > 0 ? `${100 / percent * 100}% 100%` : '100% 100%',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider-input"
        />
        {/* Floating value label pinned under the thumb */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `calc(${percent}% + ${14 - (percent / 100) * 28}px)`,
            top: '100%',
            transform: 'translateX(-50%)',
            marginTop: '-25px',
          }}
        >
          <span className="text-lg text-slate-500">{value}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [age, setAge] = useState(50);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [smellRating, setSmellRating] = useState(50);   // 0 = Excellent, 100 = Poor
  const [safetyImpact, setSafetyImpact] = useState(50); // 0 = No impact, 100 = Biggest impact
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    const newResult = calculate4CAST(age, hasDiabetes, smellRating, safetyImpact);
    setResult(newResult);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    gtag('event', 'test_completed', {
      age,
      has_diabetes: hasDiabetes,
      smell_rating: smellRating,
      safety_impact: safetyImpact,
      result: newResult.passFail,
      probability_percent: newResult.percentProbability
    });
  };

  const handleReset = () => {
    setShowResult(false);
    setTimeout(() => {
      setAge(50);
      setHasDiabetes(false);
      setSmellRating(50);
      setSafetyImpact(50);
      setResult(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600" />

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header */}
        <motion.header
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-5">
            <img
              src="/header-image.png"
              alt="4CAST Medical Tool"
              className="w-24 h-24 object-cover rounded-full shadow-md"
            />
          </div>

          <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-2">
            4CAST
          </h1>
          <p className="text-lg font-medium text-slate-500 uppercase tracking-widest mb-4">
            4-Item Concise Aging Adults Smell Test
          </p>
          <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            A quick, free, and anonymous screening tool to evaluate your risk of smell loss in adults 50+.
          </p>
        </motion.header>

        {/* About card */}
        <motion.div
          className="bg-white border border-slate-200 rounded-xl p-6 mb-8 text-lg text-slate-600 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>
            Researchers at the{' '}
            <a href="https://muschealth.org/medical-services/ent/sinus-center/smell-and-taste"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-800 underline underline-offset-2"
            >
              Medical University of South Carolina (MUSC)
            </a>{' '}
            developed the{' '}
            <a href="https://pubmed.ncbi.nlm.nih.gov/39462307/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-800 underline underline-offset-2"
            >
              4CAST
            </a>{' '}
            to help predict smell loss in adults 50 years or older.
          </p>
          <p className="mt-3">
            If the test reports failure, likely some decline in smell function, please see a medical
            provider, usually an Ear Nose and Throat doctor, for detailed smell testing and treatment.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-7 sm:p-10"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-slate-800 mb-8 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-teal-600" />
                  Screening Questions
                </h2>

                <div className="space-y-10">
                  {/* Age Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <label className="block text-xl font-semibold text-slate-800 mb-2">Age (years)</label>
                    <div className="relative">
                      <select
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full px-4 py-3.5 text-xl border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white appearance-none cursor-pointer"
                      >
                        {Array.from({ length: 51 }, (_, i) => {
                          const ageValue = i + 50;
                          return (
                            <option key={ageValue} value={ageValue}>
                              {ageValue === 100 ? '100+' : ageValue}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
                    </div>
                  </motion.div>

                  {/* Diabetes Radio Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <label className="block text-xl font-semibold text-slate-800 mb-3">
                      Have you been diagnosed with Type 2 Diabetes?
                    </label>
                    <div className="flex gap-3">
                      {[false, true].map((val) => (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => setHasDiabetes(val)}
                          className={`flex-1 py-3.5 rounded-lg text-lg font-semibold border-2 transition-all duration-200 cursor-pointer ${
                            hasDiabetes === val
                              ? 'border-teal-600 bg-teal-50 text-teal-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {val ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Smell Rating Slider */}
                  <Slider
                    value={smellRating}
                    onChange={setSmellRating}
                    label="How would you rate your ability to smell?"
                    sublabel="For example, sniffing flowers, soap, or smelling garbage?"
                    leftLabel="Excellent"
                    rightLabel="Poor"
                  />

                  {/* Safety Impact Slider */}
                  <Slider
                    value={safetyImpact}
                    onChange={setSafetyImpact}
                    label="How much has lost sense of smell impacted your safety?"
                    sublabel="To gas leak, smoke, spoiled food, etc.?"
                    leftLabel="No impact"
                    rightLabel="Biggest impact possible"
                  />

                  {/* Calculate Button */}
                  <motion.button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-700 hover:via-teal-600 hover:to-cyan-700 text-white text-xl font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Activity className="w-6 h-6" />
                    <span>Calculate Risk</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Results Card */}
              <div
                className={`bg-white rounded-xl shadow-sm border-2 p-8 mb-6 ${
                  result.hasSmellLoss ? 'border-red-300' : 'border-emerald-300'
                }`}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center mb-5"
                  >
                    {result.hasSmellLoss ? (
                      <div className="p-5 bg-red-50 rounded-full">
                        <XCircle className="w-16 h-16 text-red-500" />
                      </div>
                    ) : (
                      <div className="p-5 bg-emerald-50 rounded-full">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className={`inline-block text-sm font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 ${
                      result.hasSmellLoss
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {result.passFail}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <p className="text-4xl font-bold text-slate-800 mb-2">
                      {result.percentProbability}%
                    </p>
                    <p className="text-base text-slate-500">
                      probability of smell loss
                    </p>
                    {result.hasSmellLoss && (
                      <p className="text-base text-red-600 font-medium mt-3">
                        Consider consulting a healthcare professional
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={handleReset}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Calculate Again
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Info section */}
              <motion.div
                className="bg-white border border-slate-200 rounded-xl p-6 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-4">About smell loss</h3>
                <ul className="space-y-3 text-base text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      Olfactory dysfunction is common in older adults — some estimates
                      report over half of adults 65+ have olfactory loss.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>Smell usually declines slowly over time and patients are often unaware they have smell loss.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>
                      Smell loss can be associated with cognitive decline, dementia, depression, altered diet,
                      anxiety, and social isolation.{' '}
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/40305767/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-800 underline underline-offset-2"
                      >
                        Learn more
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5 shrink-0">&#8226;</span>
                    <span>Fortunately, treatments exist for age-related olfactory loss and new research is ongoing.</span>
                  </li>
                </ul>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-base text-amber-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p>
                    <strong>Disclaimer:</strong> This tool is for informational purposes only and does not
                    constitute medical advice. Please consult with a qualified healthcare professional for any
                    health concerns.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
