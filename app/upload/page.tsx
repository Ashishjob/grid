"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
}

const FileUploadPage = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
  });
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
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
        Given the following energy consumption, solar generation, and utility data, analyze how the household could participate in a decentralized, community-driven net metering system. 
        Focus on:
        1. How they can reduce energy consumption and contribute excess energy back to the community grid.
        2. Calculate the **Return on Investment (ROI)** for solar installation, factoring in implementation costs, maintenance costs, utility bill reductions, and any tax incentives or credits.
        3. Potential financial benefits, including:
          - Utility cost reductions from net metering (including estimated savings based on average utility rates).
          - Tax incentives and credits for solar installation and maintenance.
          - Increased property value due to solar energy adoption.
        4. How their solar energy could support low-income households and improve grid stability.
        5. Possible revenue streams from peer-to-peer (P2P) energy trading.
        6. The sustainability impact of their participation in such a system.
        
        Data:
        ${fileContents.join("\n\n")}
        
        Provide a structured HTML response highlighting key benefits and opportunities for participation, and ensure the calculations (ROI, costs, savings) are included.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const response = await model.generateContent(prompt);
      const result = await response.response.text();

      // Update AI response state
      setAiResponse(result);
    } catch (error) {
      console.error("Error analyzing with Gemini:", error);
      throw error;
    }
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

  const renderAiResponse = () => {
    if (!aiResponse) return null;

    // Convert Markdown to HTML using marked
    const htmlContent = marked(aiResponse);

    return (
      <div
        className="mt-6 p-4 bg-white shadow-lg rounded-lg"
        dangerouslySetInnerHTML={{ __html: htmlContent }} // Inject the HTML content
      />
    );
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

          {/* Show upload form only if no AI response */}
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

          {/* Display AI Response */}
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
