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
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Header */}
                <motion.div 
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header Image */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src="/header-image.jpg" 
                            alt="4CAST Medical Tool"
                            className="w-32 h-32 object-cover rounded-full shadow-lg"
                        />
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        4-Item Concise Aging adults Smell Test (4CAST)
                    </h1>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                        A quick screening tool to evaluate your risk of smell loss
                    </p>
                    
                    {/* Information Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-2xl mx-auto mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            Researchers at the Medical University of South Carolina developed the 4-item Concise 
                            Aging adults Smell Test (4CAST) to help predict smell loss in adults 50 years or older. 
                            Please take the 4CAST below in an anonymous, free fashion.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            If the test reports failure (likely some decline in smell function), please see a medical 
                            provider (usually an Ear Nose and Throat doctor) for detailed smell testing and 
                            treatment.
                        </p>
                    </div>
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