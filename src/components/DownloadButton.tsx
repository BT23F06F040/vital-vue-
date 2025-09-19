import React from 'react';

interface DownloadButtonProps {
  filename: string;
  content: string;
  mimeType?: string;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  filename, 
  content, 
  mimeType = 'text/plain',
  className = 'btn-primary'
}) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className={`${className} flex items-center space-x-2`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Download {filename}</span>
    </button>
  );
};

export default DownloadButton;
