// App.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

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
        (age * COEFFICIENTS.age) +
        (smellRating * COEFFICIENTS.vas_ratesmell) +
        (safetyImpact * COEFFICIENTS.vas_4gasleak) +
        (diabetesBinary * COEFFICIENTS.diabetes) +
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

// Custom slider component
function Slider({ value, onChange, min = 0, max = 100, label, sublabel }) {
    return (
        <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                    {label}
                </label>
                {sublabel && (
                    <p className="text-xs text-gray-500 mb-3">{sublabel}</p>
                )}
            </div>
            <div className="relative">
                <div className="flex items-center space-x-4">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
                        }}
                    />
                    <motion.div 
                        className="w-16 text-center"
                        key={value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span className="text-lg font-bold text-blue-600">{value}</span>
                    </motion.div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{min === 0 ? (max === 100 ? 'None' : min) : min}</span>
                    <span>{max === 100 ? 'Maximum' : max}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function App() {
    const [age, setAge] = useState(50);
    const [hasDiabetes, setHasDiabetes] = useState(false);
    const [smellRating, setSmellRating] = useState(50);
    const [safetyImpact, setSafetyImpact] = useState(50);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleCalculate = () => {
        const newResult = calculate4CAST(age, hasDiabetes, smellRating, safetyImpact);
        setResult(newResult);
        setShowResult(true);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <motion.div 
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <svg className="w-10 h-10 text-blue-600" viewBox="0 0 80 80" fill="currentColor">
                            <path d="M69.761 37.241L59.591 27.072C55.701 23.182 49.959 16.301 46.827 11.779L39.6613 1.43527C39.0386 0.536342 38.0145 0 36.921 0C34.2314 0 32.649 3.02118 34.1807 5.23208L41.346 15.575C44.735 20.466 50.679 27.587 54.878 31.786L65.054 41.96C66.31 43.216 67 44.886 67 46.667C67 48.447 66.307 50.12 65.054 51.374C64.425 52.002 63.69 52.493 62.886 52.829L47.273 59.29C40.759 61.989 37.087 69.235 38.911 75.784L39.4018 77.5557C39.802 79.0001 41.1166 80 42.6154 80C44.8198 80 46.4174 77.8991 45.8273 75.7751C45.671 75.2126 45.505 74.6153 45.333 73.997C44.415 70.7 46.44 66.852 49.825 65.449L65.434 58.987C67.065 58.307 68.53 57.321 69.76 56.093C72.172 53.684 73.666 50.351 73.666 46.666C73.667 42.981 72.176 39.648 69.761 37.241Z"/>
                            <path d="M43.667 51.044C43.667 52.3082 42.6422 53.333 41.378 53.333C37.97 53.33 34.559 54.632 31.951 57.236L23.094 66.093C20.685 68.509 17.352 70 13.666 70C6.30301 70 0.333008 64.03 0.333008 56.667C0.333008 52.3394 1.70382 48.335 4.03791 45.0659C5.10787 43.5674 7.24614 43.583 8.54635 44.8868C9.84591 46.19 9.79678 48.2852 8.85555 49.8667C7.64568 51.8996 7.00001 54.2308 7.00001 56.667C7.00001 60.342 9.98901 63.333 13.666 63.333C15.448 63.333 17.12 62.644 18.373 61.387L27.237 52.523C31.016 48.748 36.033 46.668 41.365 46.668C41.372 46.668 41.378 46.668 41.385 46.668C42.6453 46.668 43.667 47.6897 43.667 48.95V51.044Z"/>
                        </svg>
                    </div>
                </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        4CAST Calculator
                    </h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        A quick assessment tool to evaluate your risk of smell loss
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
                            {/* Form Card */}
                            <motion.div 
                                className="bg-white rounded-2xl shadow-xl p-8 mb-6"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="space-y-8">
                                    {/* Age Input */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                                            Age (years)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={age}
                                            onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </motion.div>

                                    {/* Diabetes Checkbox */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={hasDiabetes}
                                                    onChange={(e) => setHasDiabetes(e.target.checked)}
                                                    className="w-6 h-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">
                                                Have you been diagnosed with Type 2 Diabetes?
                                            </span>
                                        </label>
                                    </motion.div>

                                    {/* Smell Rating Slider */}
                                    <Slider
                                        value={smellRating}
                                        onChange={setSmellRating}
                                        label="How would you rate your ability to smell?"
                                        sublabel="For example: flowers, soap, or garbage"
                                    />

                                    {/* Safety Impact Slider */}
                                    <Slider
                                        value={safetyImpact}
                                        onChange={setSafetyImpact}
                                        label="How much has reduced smell affected your safety?"
                                        sublabel="Such as detecting gas leaks, smoke, or spoiled food"
                                    />

                                    {/* Calculate Button */}
                                    <motion.button
                                        onClick={handleCalculate}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Calculator className="w-5 h-5" />
                                        <span>Calculate Risk</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            {/* Results Card */}
                            <div className={`bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 ${
                                result.hasSmellLoss ? 'border-red-200' : 'border-green-200'
                            }`}>
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="flex justify-center mb-6"
                                    >
                                        {result.hasSmellLoss ? (
                                            <div className="p-6 bg-red-100 rounded-full">
                                                <XCircle className="w-16 h-16 text-red-600" />
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-green-100 rounded-full">
                                                <CheckCircle2 className="w-16 h-16 text-green-600" />
                                            </div>
                                        )}
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className={`text-4xl font-bold mb-4 ${
                                            result.hasSmellLoss ? 'text-red-600' : 'text-green-600'
                                        }`}
                                    >
                                        {result.passFail}
                                    </motion.h2>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mb-8"
                                    >
                                        <p className="text-2xl font-semibold text-gray-700 mb-2">
                                            {result.percentProbability}% probability of smell loss
                                        </p>
                                        {result.hasSmellLoss && (
                                            <p className="text-gray-600">
                                                Consider consulting a healthcare professional
                                            </p>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-3"
                                    >
                                        <button
                                            onClick={handleReset}
                                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                                        >
                                            Calculate Again
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Disclaimer */}
                <motion.div 
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p>
                            <strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute medical advice. 
                            Please consult with a qualified healthcare professional for any health concerns.
                        </p>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #3b82f6;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #3b82f6;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
}
