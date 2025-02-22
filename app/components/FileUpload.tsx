import React, { useRef } from 'react';
import { EnergyData } from '../types';

const FileUpload = ({ onUpload }: { onUpload: (data: EnergyData[]) => void }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onUpload(data);
        } catch {
          alert('Error parsing file. Please ensure it\'s valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="file-upload" className="hidden">Upload File</label>
      <input
        id="file-upload"
        type="file"
        ref={fileRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
      />

    </div>
  );
};

export default FileUpload;