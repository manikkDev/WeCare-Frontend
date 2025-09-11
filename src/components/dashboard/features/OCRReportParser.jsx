import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import './OCRReportParser.css';

const OCRReportParser = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [EXTRACTED_TEXT, setExtractedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // API calls should go through backend for security
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   const GEMINI_API_URL = `${API_BASE_URL}/api/analyze-report`;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP) or PDF.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    setUploadedFile(file);
    setExtractedText('');
    setAnalysisResult(null);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      // Extract text using Gemini Vision API
      const extractedText = await extractTextWithGemini(base64, file.type);
      setExtractedText(extractedText);
      
      // Analyze the extracted text
      const analysis = await analyzeWithGemini(extractedText);
      setAnalysisResult(analysis);
      
      setUploadProgress(100);
      
      // Clear progress after completion
      setTimeout(() => {
        setUploadProgress(0);
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const extractTextWithGemini = async (base64, mimeType) => {
    const prompt = `Extract all text from this medical report image. Please provide the complete text content exactly as it appears in the document, maintaining the original formatting and structure as much as possible.`;
    
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64
            }
          }
        ]
      }]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No text extracted';
  };

  const analyzeWithGemini = async (text) => {
    const prompt = `Analyze this medical report text and provide a detailed medical analysis. Please structure your response as follows:

1. **Patient Information**: Extract any patient details mentioned
2. **Medical Findings**: Summarize key medical findings and observations
3. **Diagnoses**: List any diagnoses or medical conditions mentioned
4. **Medications**: Extract any medications, dosages, or prescriptions
5. **Recommendations**: Summarize any medical recommendations or follow-up instructions
6. **Critical Values**: Highlight any abnormal or critical values that need attention
7. **Summary**: Provide a concise overall summary of the report

Medical Report Text:
${text}`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No analysis available';
  };

  const resetUpload = () => {
    const confirmed = window.confirm('Are you sure you want to close this report? All analysis data will be lost.');
    if (confirmed) {
      // Stop any ongoing speech
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      
      setUploadedFile(null);
      setExtractedText('');
      setAnalysisResult(null);
      setIsProcessing(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Action button functions
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const showDownloadConfirmation = () => {
    setShowDownloadModal(true);
  };

  const confirmDownload = (text) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 7;
    let yPosition = margin;

    // Add title
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Medical Report Analysis', margin, yPosition);
    yPosition += lineHeight * 2;

    // Add date
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Process and add content
    pdf.setFontSize(11);
    const lines = text.split('\n');
    
    lines.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Handle bold headings (lines with **)
      if (line.includes('**')) {
        const cleanLine = line.replace(/\*\*/g, '');
        if (cleanLine.trim()) {
          pdf.setFont(undefined, 'bold');
          const splitLines = pdf.splitTextToSize(cleanLine, maxWidth);
          splitLines.forEach((splitLine) => {
            pdf.text(splitLine, margin, yPosition);
            yPosition += lineHeight;
          });
          pdf.setFont(undefined, 'normal');
        }
      }
      // Handle list items
      else if (line.startsWith('*') && !line.startsWith('**')) {
        const listItem = '• ' + line.substring(1).trim();
        const splitLines = pdf.splitTextToSize(listItem, maxWidth - 10);
        splitLines.forEach((splitLine) => {
          pdf.text(splitLine, margin + 10, yPosition);
          yPosition += lineHeight;
        });
      }
      // Handle regular text
      else if (line.trim()) {
        const splitLines = pdf.splitTextToSize(line, maxWidth);
        splitLines.forEach((splitLine) => {
          pdf.text(splitLine, margin, yPosition);
          yPosition += lineHeight;
        });
      }
      // Handle empty lines
      else {
        yPosition += lineHeight * 0.5;
      }
    });

    // Save the PDF
    pdf.save(`medical-report-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowDownloadModal(false);
  };

  const showCloseConfirmation = () => {
    setShowCloseModal(true);
  };

  const confirmClose = () => {
    setShowCloseModal(false);
    resetUpload();
  };

  const showSaveConfirmation = () => {
    setShowSaveModal(true);
  };

  const saveReport = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to save reports');
        return;
      }

      const response = await fetch('http://localhost:5000/api/ocr/save-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: uploadedFile?.name || 'Medical Report',
          analysisResult: analysisResult,
          originalText: EXTRACTED_TEXT,
          reportType: 'other'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSaveSuccess(true);
        setShowSaveModal(false);
        // Show success notification
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        // Handle authentication errors
        if (response.status === 401) {
          alert('Your session has expired. Please log in again.');
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Reload page to redirect to login
          window.location.reload();
        } else {
          alert(data.message || 'Failed to save report');
        }
      }
    } catch (error) {
      console.error('Save report error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        // Cancel current speech
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      // Force state update before speaking
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  // Improved text formatting function
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, index) => {
      // Handle bold text with **text**
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index}>
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      // Handle headings that start and end with **
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={index}>{line.replace(/\*\*/g, '')}</h4>;
      }
      
      // Handle list items
      if (line.startsWith('*') && !line.startsWith('**')) {
        return <li key={index}>{line.substring(1).trim()}</li>;
      }
      
      // Handle regular paragraphs
      if (line.trim()) {
        return <p key={index}>{line}</p>;
      }
      
      // Handle empty lines
      return <br key={index} />;
    });
  };

  return (
    <div className="ocr-parser">
      <div className="ocr-header">
        <h1>Upload + OCR Report Parsing</h1>
        <p>Upload your medical reports and get AI-powered analysis with text extraction</p>
      </div>

      {!uploadedFile ? (
        <div 
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 8V32M24 8L16 16M24 8L32 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 32V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Drop your medical report here</h3>
            <p>or <span className="upload-link">browse files</span></p>
            <div className="upload-info">
              <p>Supports: JPEG, PNG, WebP, PDF</p>
              <p>Max size: 10MB</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="processing-container">
          <div className="file-info">
            <div className="file-preview">
              <div className="file-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 6C6 4.89543 6.89543 4 8 4H16L22 10V26C22 27.1046 21.1046 28 20 28H8C6.89543 28 6 27.1046 6 26V6Z" fill="currentColor"/>
                  <path d="M16 4V10H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="file-details">
                <h4>{uploadedFile.name}</h4>
                <p>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            {isProcessing && (
              <div className="analysis-loading-container">
                <div className="loading-animation">
                  <div className="loading-circles">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                    <div className="circle circle-4"></div>
                  </div>
                  <div className="loading-pulse">
                    <div className="pulse-ring pulse-ring-1"></div>
                    <div className="pulse-ring pulse-ring-2"></div>
                    <div className="pulse-ring pulse-ring-3"></div>
                  </div>
                  <div className="loading-scanner">
                    <div className="scanner-line"></div>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {uploadProgress < 50 ? 'Uploading Document...' : 
                     uploadProgress < 90 ? 'Extracting Medical Data...' : 
                     'Analyzing Report with AI...'}
                  </p>
                </div>
                <div className="loading-status">
                  <div className="status-indicators">
                    <div className={`status-dot ${uploadProgress >= 25 ? 'completed' : 'active'}`}></div>
                    <div className={`status-dot ${uploadProgress >= 50 ? 'completed' : uploadProgress >= 25 ? 'active' : ''}`}></div>
                    <div className={`status-dot ${uploadProgress >= 75 ? 'completed' : uploadProgress >= 50 ? 'active' : ''}`}></div>
                    <div className={`status-dot ${uploadProgress >= 100 ? 'completed' : uploadProgress >= 75 ? 'active' : ''}`}></div>
                  </div>
                  <p className="status-text">Processing your medical report...</p>
                </div>
              </div>
            )}
            
            <button 
              className="reset-button"
              onClick={resetUpload}
              disabled={isProcessing}
            >
              Upload New File
            </button>
          </div>

          {analysisResult && (
            <div className="results-container">
              <div className="analysis-result">
                <div className="medical-report-header">
                <h2 className="medical-report-title">MEDICAL REPORT</h2>
                <div className="action-buttons">
                  <h3>AI Analysis Results</h3>
                    <button 
                      className="action-btn copy-btn" 
                      onClick={() => copyToClipboard(analysisResult)}
                      title="Copy to clipboard"
                    >
                      <div className="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="btn-label">Copy</span>
                    </button>
                    <button 
                      className="action-btn download-btn" 
                      onClick={showDownloadConfirmation}
                      title="Download PDF report"
                    >
                      <div className="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="btn-label">PDF</span>
                    </button>
                    <button 
                      className={`action-btn voice-btn ${isSpeaking ? 'speaking' : ''}`}
                      onClick={() => speakText(analysisResult)}
                      title={isSpeaking ? "Pause speech" : "Read aloud"}
                    >
                      <div className="icon">
                        {isSpeaking ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z" fill="currentColor"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="btn-label">{isSpeaking ? 'Pause' : 'Speak'}</span>
                    </button>
                    <button 
                      className="action-btn save-btn" 
                      onClick={showSaveConfirmation}
                      title="Save report to database"
                    >
                      <div className="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="btn-label">Save</span>
                    </button>
                    <button 
                      className="action-btn close-btn" 
                      onClick={showCloseConfirmation}
                      title="Close report"
                    >
                      <div className="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="btn-label">Close</span>
                    </button>
                  </div>
                </div>
                <div className="analysis-content">
                  <div className="analysis-text">
                    {renderFormattedText(analysisResult)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Download Confirmation Modal */}
      {showDownloadModal && (
        <div className="modal-overlay" onClick={() => setShowDownloadModal(false)}>
          <div className="confirmation-modal download-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-animation-container">
              <div className="modal-icon-container">
                <div className="modal-icon download-icon">
                  <div className="icon-animation">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="download-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14m-7-7l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="modal-content">
                <h3>Download PDF Report</h3>
                <p>Do you wish to download the medical report analysis as a PDF file?</p>
                <div className="modal-actions">
                  <button 
                    className="modal-btn cancel-btn" 
                    onClick={() => setShowDownloadModal(false)}
                  >
                    <span>Cancel</span>
                  </button>
                  <button 
                    className="modal-btn confirm-btn download-confirm" 
                    onClick={() => confirmDownload(analysisResult)}
                  >
                    <div className="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14m-7-7l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Confirmation Modal */}
      {showCloseModal && (
        <div className="modal-overlay" onClick={() => setShowCloseModal(false)}>
          <div className="confirmation-modal close-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-animation-container">
              <div className="modal-icon-container">
                <div className="modal-icon close-icon">
                  <div className="icon-animation">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M15 9l-6 6m0-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="warning-pulse"></div>
                </div>
              </div>
              <div className="modal-content">
                <h3>Close Report</h3>
                <p>Are you sure you want to close this report? All analysis data will be lost.</p>
                <div className="modal-actions">
                  <button 
                    className="modal-btn cancel-btn" 
                    onClick={() => setShowCloseModal(false)}
                  >
                    <span>Keep Report</span>
                  </button>
                  <button 
                    className="modal-btn confirm-btn close-confirm" 
                    onClick={confirmClose}
                  >
                    <div className="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Close Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Report Confirmation Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="confirmation-modal save-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-animation-container">
              <div className="modal-icon-container">
                <div className="modal-icon save-icon">
                  <div className="icon-animation">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="save-pulse"></div>
                </div>
              </div>
              <div className="modal-content">
                <h3>Save Medical Report</h3>
                <p>Do you want to save this medical report analysis to your account? You'll be able to view and download it later from the Medical Reports tab.</p>
                <div className="modal-actions">
                  <button 
                    className="modal-btn cancel-btn" 
                    onClick={() => setShowSaveModal(false)}
                    disabled={isSaving}
                  >
                    <span>Cancel</span>
                  </button>
                  <button 
                    className="modal-btn confirm-btn save-confirm" 
                    onClick={saveReport}
                    disabled={isSaving}
                  >
                    <div className="btn-icon">
                      {isSaving ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span>{isSaving ? 'Saving...' : 'Save Report'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="success-notification">
          <div className="success-content">
            <div className="success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="success-text">
              <h4>Report Saved Successfully!</h4>
              <p>Your medical report has been saved to your account. You can view it in the Medical Reports tab.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRReportParser;