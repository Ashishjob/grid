"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
}

const LoadingAnimation = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <Zap className="w-12 h-12 text-green-500 animate-pulse" />
    </div>
    <span className="ml-4 text-lg font-medium text-gray-600">Analyzing Energy Data...</span>
  </div>
);

const FileUploadPage = () => {
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });
  const [expandedResponse, setExpandedResponse] = useState(false);
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const [aiResponse, setAiResponse] = useState<{
    brief: string;
    full: string;
    data?: {
      monthlySavings: number[];
      energyBalance: { consumption: number; generation: number; month: string }[];
      carbonReduction: number[];
    };
  } | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    energyUsage: null,
    solarData: null,
    utilityBills: null,
  });

  const fileTypes = {
    energyUsage: {
      label: "Energy Usage Data",
      description: "CSV or Excel file with historical energy consumption",
      accept: ".csv,.xlsx",
    },
    solarData: {
      label: "Solar Installation Details",
      description: "Technical specifications and layout information",
      accept: ".pdf,.docx",
    },
    utilityBills: {
      label: "Utility Bills",
      description: "Past 12 months of utility bills for comparison",
      accept: ".pdf,.jpg,.png",
    },
  };

  const handleFileChange = (type: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const analyzeWithGemini = async (files: File[]) => {
    try {
      const fileContents = await Promise.all(files.map((file) => file.text()));

      const prompt = `
        Analyze the following energy data and provide TWO responses:
        1. A BRIEF summary (max 3 sentences) of the key findings and recommendations
        2. A DETAILED analysis covering ROI, financial benefits, and sustainability impact

        Data: ${fileContents.join("\n\n")}
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const response = await model.generateContent(prompt);
      const result = await response.response.text();

      // Parse the response to separate brief and full versions
      // This is a simplified example - you'd need to properly parse the AI response
      const [brief, full, data] = result.split('---');
      
      // Sample data for visualization (replace with actual parsed data)
      const sampleData = {
        monthlySavings: Array(12).fill(0).map(() => Math.random() * 500),
        energyBalance: Array(12).fill(0).map((_, i) => ({
          month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
          consumption: Math.random() * 1000,
          generation: Math.random() * 1200,
        })),
        carbonReduction: Array(12).fill(0).map(() => Math.random() * 30),
      };

      setAiResponse({
        brief: brief || "Brief summary not available",
        full: full || "Detailed analysis not available",
        data: sampleData,
      });
    } catch (error) {
      console.error("Error analyzing with Gemini:", error);
      throw error;
    }
  };

  const renderCharts = () => {
    if (!aiResponse?.data) return null;

    return (
      <div className="space-y-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Energy Balance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiResponse.data.energyBalance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="consumption" stroke="#ff7300" name="Consumption" />
                <Line type="monotone" dataKey="generation" stroke="#82ca9d" name="Generation" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Monthly Savings</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiResponse.data.monthlySavings.map((value, index) => ({
                  month: new Date(2024, index).toLocaleString('default', { month: 'short' }),
                  savings: value
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="savings" fill="#4ade80" name="Savings ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Carbon Reduction Impact</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiResponse.data.carbonReduction.map((value, index) => ({
                  month: new Date(2024, index).toLocaleString('default', { month: 'short' }),
                  reduction: value
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="reduction" stroke="#3b82f6" name="Reduction (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAiResponse = () => {
    if (!aiResponse) return null;

    return (
      <div className="mt-6 space-y-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
          {renderCharts()}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(aiResponse.brief) }} />
            
            <button
              onClick={() => setExpandedResponse(!expandedResponse)}
              className="mt-4 flex items-center text-green-600 hover:text-green-700"
            >
              {expandedResponse ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show Detailed Analysis
                </>
              )}
            </button>

            {expandedResponse && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(aiResponse.full) }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadState({ status: "uploading" });

    try {
      // Convert object values to an array and filter out null values
      const fileArray: File[] = Object.values(files).filter(
        (file): file is File => file !== null
      );

      if (fileArray.length === 0) {
        setUploadState({
          status: "error",
          message: "No files uploaded. Please upload at least one file.",
        });
        return;
      }

      // Trigger analysis with Gemini
      await analyzeWithGemini(fileArray);

      setUploadState({
        status: "success",
        message: "Analysis complete! Check the console for results.",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setUploadState({
        status: "error",
        message: "Analysis failed. Please try again later.",
      });
    }
  };

  const handleUploadMore = () => {
    setFiles({
      energyUsage: null,
      solarData: null,
      utilityBills: null,
    });
    setAiResponse(null);
    setUploadState({ status: "idle" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Upload Your Energy Data for Analysis
          </h1>
          {uploadState.status === "idle" && !aiResponse && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {Object.entries(fileTypes).map(
                ([type, { label, description, accept }]) => (
                  <div
                    key={type}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <p className="text-sm text-gray-500 mb-2">
                          {description}
                        </p>
                        <input
                          title="file"
                          type="file"
                          accept={accept}
                          onChange={(e) =>
                            handleFileChange(type, e.target.files?.[0] || null)
                          }
                          className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-green-50 file:text-green-700
                          hover:file:bg-green-100"
                        />
                      </div>
                      {files[type] && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </div>
                )
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
      disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploadState.status === "uploading" ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Analyze Files</span>
                    </>
                  )}
                </button>
              </div>
              </form>
          )}

          {uploadState.status === "uploading" && <LoadingAnimation />}

          {uploadState.status === "success" && !aiResponse && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{uploadState.message}</span>
            </div>
          )}

          {uploadState.status === "error" && !aiResponse && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{uploadState.message}</span>
            </div>
          )}

          {aiResponse && (
            <>
              {renderAiResponse()}
              <div className="mt-6">
                <button
                  onClick={handleUploadMore}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload More Files
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;