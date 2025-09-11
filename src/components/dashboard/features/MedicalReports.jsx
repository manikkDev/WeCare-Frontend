import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import './MedicalReports.css';

const MedicalReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your reports');
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/ocr/user-reports?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
        setTotalPages(data.pagination.pages);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Fetch reports error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchReports();
  }, [currentPage, sortBy, fetchReports]);

  const viewReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/ocr/user-reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const report = await response.json();
        setSelectedReport(report);
        setShowViewModal(true);
      } else {
        alert('Failed to load report details');
      }
    } catch (error) {
      console.error('View report error:', error);
      alert('Network error. Please try again.');
    }
  };

  const downloadReport = (report) => {
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

    // Add report info
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`File: ${report.fileName}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Add content
    pdf.setFontSize(11);
    const lines = report.analysisResult.split('\n');
    
    lines.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

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
      } else if (line.startsWith('*') && !line.startsWith('**')) {
        const listItem = '• ' + line.substring(1).trim();
        const splitLines = pdf.splitTextToSize(listItem, maxWidth - 10);
        splitLines.forEach((splitLine) => {
          pdf.text(splitLine, margin + 10, yPosition);
          yPosition += lineHeight;
        });
      } else if (line.trim()) {
        const splitLines = pdf.splitTextToSize(line, maxWidth);
        splitLines.forEach((splitLine) => {
          pdf.text(splitLine, margin, yPosition);
          yPosition += lineHeight;
        });
      } else {
        yPosition += lineHeight * 0.5;
      }
    });

    pdf.save(`${report.fileName}-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'lab-report':
        return '🧪';
      case 'x-ray':
        return '🦴';
      case 'mri-scan':
        return '🧠';
      case 'blood-test':
        return '🩸';
      default:
        return '📄';
    }
  };

  const filteredReports = reports.filter(report =>
    report.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="medical-reports">
        <div className="reports-header">
          <h1>Medical Reports</h1>
          <p>Loading your saved medical reports...</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Fetching your reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medical-reports">
        <div className="reports-header">
          <h1>Medical Reports</h1>
          <p>Manage and view your saved medical reports</p>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Reports</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchReports}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-reports">
      <div className="reports-header">
        <h1>Medical Reports</h1>
        <p>Manage and view your saved medical reports</p>
      </div>

      <div className="reports-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Reports Found</h3>
          <p>
            {searchTerm 
              ? `No reports match "${searchTerm}". Try a different search term.`
              : 'You haven\'t saved any medical reports yet. Upload and analyze a report to get started.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="reports-grid">
            {filteredReports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="report-icon">
                    {getReportTypeIcon(report.reportType)}
                  </div>
                  <div className="report-info">
                    <h3 className="report-title">{report.fileName}</h3>
                    <p className="report-date">{formatDate(report.createdAt)}</p>
                  </div>
                  <div className="report-status">
                    <span className={`status-badge ${report.processingStatus}`}>
                      {report.processingStatus}
                    </span>
                  </div>
                </div>
                
                <div className="report-preview">
                  <p className="report-excerpt">
                    {report.analysisResult ? 
                      report.analysisResult.substring(0, 150) + '...' : 
                      'No analysis available'
                    }
                  </p>
                </div>
                
                <div className="report-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => viewReport(report.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    View
                  </button>
                  <button
                    className="action-btn download-btn"
                    onClick={() => downloadReport(report)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* View Report Modal */}
      {showViewModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedReport.fileName}</h2>
              <button
                className="close-btn"
                onClick={() => setShowViewModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="report-details">
                <div className="detail-item">
                  <strong>Date:</strong> {formatDate(selectedReport.createdAt)}
                </div>
                <div className="detail-item">
                  <strong>Type:</strong> {selectedReport.reportType}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> 
                  <span className={`status-badge ${selectedReport.processingStatus}`}>
                    {selectedReport.processingStatus}
                  </span>
                </div>
              </div>
              <div className="analysis-content">
                <h3>Analysis Results</h3>
                <div className="analysis-text">
                  {selectedReport.analysisResult && selectedReport.analysisResult.split('\n').map((line, index) => {
                    if (line.includes('**')) {
                      const cleanLine = line.replace(/\*\*/g, '');
                      return <h4 key={index}>{cleanLine}</h4>;
                    } else if (line.startsWith('*') && !line.startsWith('**')) {
                      return <li key={index}>{line.substring(1).trim()}</li>;
                    } else if (line.trim()) {
                      return <p key={index}>{line}</p>;
                    }
                    return <br key={index} />;
                  })}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn download-btn"
                onClick={() => downloadReport(selectedReport)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReports;