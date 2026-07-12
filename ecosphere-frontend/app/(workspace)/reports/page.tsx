"use client";

import React, { useState } from 'react';
import {
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  CalendarIcon,
  SettingsIcon,
  CheckCircleIcon,
  Loader2Icon,
  SparklesIcon
} from 'lucide-react';
import { Button, Card } from '@/app/components/ui/Primitives';
import { motion, AnimatePresence } from 'framer-motion';

// Mock report data structure for previews and generation
interface ReportSection {
  title: string;
  metrics: { name: string; value: string; status: 'optimal' | 'warning' | 'normal' }[];
  tableHeaders?: string[];
  tableRows?: string[][];
}

const reportTemplates: Record<string, { title: string; subtitle: string; sections: ReportSection[] }> = {
  esg_scorecard: {
    title: "Corporate ESG Scorecard",
    subtitle: "Comprehensive ESG KPI ratings and performance summaries.",
    sections: [
      {
        title: "Overall Ratings Summary",
        metrics: [
          { name: "Environmental (E)", value: "84 / 100", status: "optimal" },
          { name: "Social (S)", value: "78 / 100", status: "normal" },
          { name: "Governance (G)", value: "91 / 100", status: "optimal" }
        ],
        tableHeaders: ["Dimension", "Score", "Performance status", "Quarterly Change"],
        tableRows: [
          ["Environmental (E)", "84%", "Highly Commendable", "+2.4%"],
          ["Social (S)", "78%", "Acceptable / Normal", "+1.1%"],
          ["Governance (G)", "91%", "Excellent Compliance", "+0.5%"],
          ["Total ESG Score", "84.3%", "Strong ESG Performance", "+1.3%"]
        ]
      },
      {
        title: "Key Insights & Trends",
        metrics: [
          { name: "Audit Readiness", value: "100% Prepared", status: "optimal" },
          { name: "CSR Mobilization", value: "3.1x Increase", status: "optimal" }
        ]
      }
    ]
  },
  carbon_footprint: {
    title: "Carbon Footprint Audit (Scope 1 & 2)",
    subtitle: "Emissions tracking, carbon intensity, and target thresholds.",
    sections: [
      {
        title: "Greenhouse Gas Emissions Summary",
        metrics: [
          { name: "Scope 1 (Direct)", value: "482 tCO2e", status: "normal" },
          { name: "Scope 2 (Indirect)", value: "638 tCO2e", status: "normal" },
          { name: "Target Cap Threshold", value: "1,200 tCO2e Limit", status: "optimal" }
        ],
        tableHeaders: ["Source", "Emissions (tCO2e)", "% of Total", "Target Comparison"],
        tableRows: [
          ["Natural Gas Combustion", "210 tCO2e", "18.7%", "Within target limits"],
          ["Company Fleet Vehicles", "272 tCO2e", "24.3%", "Moderate threshold limit"],
          ["Purchased Electricity", "638 tCO2e", "57.0%", "Within renewable transition targets"],
          ["Total Footprint", "1,120 tCO2e", "100.0%", "6.7% below target threshold"]
        ]
      }
    ]
  },
  social_csr: {
    title: "Social Performance & CSR Actions",
    subtitle: "Employee welfare, CSR participation levels, and reward programs.",
    sections: [
      {
        title: "CSR Participation Summary",
        metrics: [
          { name: "CSR Volunteering", value: "420 Hours", status: "optimal" },
          { name: "Employee Engagement", value: "73%", status: "normal" },
          { name: "Community Impact Score", value: "8.5 / 10", status: "optimal" }
        ],
        tableHeaders: ["Activity Area", "Hours Logged", "Employees Joined", "Impact Rating"],
        tableRows: [
          ["Local Reforestation Day", "180 hrs", "45 joined", "High Impact (9.2/10)"],
          ["STEM Volunteering in Schools", "110 hrs", "23 joined", "Moderate Impact (8.0/10)"],
          ["Diversity and Inclusion Forums", "80 hrs", "52 joined", "High Impact (8.5/10)"],
          ["Food Donation Drives", "50 hrs", "30 joined", "Normal Impact (7.5/10)"]
        ]
      }
    ]
  },
  governance_audit: {
    title: "Governance & Compliance Overview",
    subtitle: "Policy compliance status, audit preparation, and corporate governance.",
    sections: [
      {
        title: "Compliance Readiness Summary",
        metrics: [
          { name: "Corporate Policies Active", value: "12 Policies", status: "optimal" },
          { name: "Critical Audits Passed", value: "4 Audits", status: "optimal" },
          { name: "Compliance Deficiencies", value: "0 Open Issues", status: "optimal" }
        ],
        tableHeaders: ["Audit Category", "Last Review", "Compliance Rating", "Actions Required"],
        tableRows: [
          ["Financial Integrity & Audits", "May 2026", "100% Compliant", "No actions required"],
          ["Data Privacy & Cybersecurity", "June 2026", "98% Compliant", "Update minor backup logs"],
          ["Health and Workplace Safety", "Jan 2026", "100% Compliant", "No actions required"],
          ["Code of Conduct & Ethics", "March 2026", "100% Compliant", "No actions required"]
        ]
      }
    ]
  }
};

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('esg_scorecard');
  const [selectedPeriod, setSelectedPeriod] = useState('q2_fy26');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const report = reportTemplates[selectedTemplate];
  const formattedPeriod = selectedPeriod.toUpperCase().replace('_', ' ');

  const triggerPdfPrint = (title: string, subtitle: string, htmlBody: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>${title} - ${formattedPeriod}</title>
            <style>
              body {
                font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
                padding: 40px;
                color: #2D3A29;
                background-color: #fff;
                line-height: 1.6;
              }
              .header {
                border-bottom: 3px solid #244E18;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: 0.1em;
                color: #244E18;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 10px;
              }
              h1 {
                font-size: 28px;
                margin: 0;
                color: #1B2E16;
              }
              .subtitle {
                font-size: 14px;
                color: #5A6D54;
                margin: 5px 0 0 0;
              }
              .period-badge {
                float: right;
                background-color: #EAF5E4;
                color: #397B14;
                font-weight: bold;
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 13px;
                margin-top: -50px;
              }
              .section {
                margin-bottom: 35px;
              }
              .section-title {
                font-size: 18px;
                font-weight: 700;
                color: #244E18;
                border-bottom: 1px solid #DCE8D5;
                padding-bottom: 8px;
                margin-bottom: 20px;
              }
              .metrics-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-bottom: 25px;
              }
              .metric-card {
                border: 1px solid #DCE8D5;
                background-color: #F8FAF6;
                padding: 15px;
                border-radius: 12px;
                text-align: center;
              }
              .metric-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #6B7A67;
                margin-bottom: 5px;
              }
              .metric-value {
                font-size: 22px;
                font-weight: 700;
                color: #356F14;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
              }
              th, td {
                border: 1px solid #E6ECE2;
                padding: 10px 14px;
                text-align: left;
                font-size: 13px;
              }
              th {
                background-color: #F1F5EF;
                color: #2D3A29;
                font-weight: 700;
              }
              tr:nth-child(even) {
                background-color: #FAFBF9;
              }
              .footer {
                margin-top: 60px;
                border-top: 1px solid #E6ECE2;
                padding-top: 15px;
                font-size: 11px;
                text-align: center;
                color: #8A9887;
              }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">🌿 ECOSPHERE REPORTING SERVICE</div>
              <h1>${title}</h1>
              <p class="subtitle">${subtitle}</p>
              <div class="period-badge">${formattedPeriod}</div>
            </div>
            ${htmlBody}
            <div class="footer">
              This report was compiled and verified by EcoSphere ESG Management Services on ${new Date().toLocaleDateString()}. Confidential.
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.parent.document.body.removeChild(window.frameElement);
                }, 100);
              }
            </script>
          </body>
        </html>
      `);
      doc.close();
    }
  };

  const triggerFileDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      if (exportFormat === 'pdf') {
        let htmlBody = "";
        report.sections.forEach(sec => {
          htmlBody += `<div class="section">`;
          htmlBody += `<div class="section-title">${sec.title}</div>`;
          htmlBody += `<div class="metrics-grid">`;
          sec.metrics.forEach(m => {
            htmlBody += `
              <div class="metric-card">
                <div class="metric-label">${m.name}</div>
                <div class="metric-value">${m.value}</div>
              </div>
            `;
          });
          htmlBody += `</div>`;

          if (sec.tableHeaders && sec.tableRows) {
            htmlBody += `<table><thead><tr>`;
            sec.tableHeaders.forEach(h => {
              htmlBody += `<th>${h}</th>`;
            });
            htmlBody += `</tr></thead><tbody>`;
            sec.tableRows.forEach(row => {
              htmlBody += `<tr>`;
              row.forEach(cell => {
                htmlBody += `<td>${cell}</td>`;
              });
              htmlBody += `</tr>`;
            });
            htmlBody += `</tbody></table>`;
          }
          
          htmlBody += `</div>`;
        });

        triggerPdfPrint(report.title, report.subtitle, htmlBody);
      } else if (exportFormat === 'csv') {
        let csv = `Report Name,${report.title}\nReporting Period,${formattedPeriod}\n\n`;
        report.sections.forEach(sec => {
          csv += `--- ${sec.title} ---\n`;
          sec.metrics.forEach(m => {
            csv += `${m.name},${m.value}\n`;
          });
          csv += `\n`;

          if (sec.tableHeaders && sec.tableRows) {
            csv += sec.tableHeaders.join(',') + '\n';
            sec.tableRows.forEach(row => {
              csv += row.join(',') + '\n';
            });
            csv += `\n`;
          }
        });
        
        triggerFileDownload(csv, `${selectedTemplate}_${selectedPeriod}.csv`, 'text/csv;charset=utf-8;');
      } else if (exportFormat === 'json') {
        const jsonContent = JSON.stringify({
          reportName: report.title,
          period: formattedPeriod,
          timestamp: new Date().toISOString(),
          data: report.sections
        }, null, 2);
        
        triggerFileDownload(jsonContent, `${selectedTemplate}_${selectedPeriod}.json`, 'application/json');
      }

      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#499A13] dark:text-[#8ECA3C]">
          Analytics & Compliance
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-wide text-[#1B1B1B] dark:text-[#E8F0E4]">
          ESG COMPLIANCE REPORTS
        </h1>
        <p className="mt-2 text-sm text-[#6B7280] dark:text-[#8A9687]">
          Generate print-optimized ESG scorecards, Greenhouse Gas logs, and governance compliance records in one click.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[340px_1fr]">
        {/* Controls Card */}
        <Card className="p-5 sm:p-6 bg-white dark:bg-[#162212]/50 backdrop-blur h-fit space-y-6">
          <h3 className="text-base font-bold text-[#3E4D3A] dark:text-[#C8E6B8] flex items-center gap-2">
            <SettingsIcon size={16} /> Configure Report
          </h3>
          
          <div className="space-y-4">
            {/* Report Template Selector */}
            <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
              Report Template
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#DCE8D5] bg-white px-3 text-sm outline-none dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4]"
              >
                <option value="esg_scorecard">Overall ESG Scorecard</option>
                <option value="carbon_footprint">GHG Footprint (Scope 1 & 2)</option>
                <option value="social_csr">Social Impact & CSR Volunteering</option>
                <option value="governance_audit">Corporate Governance Audit</option>
              </select>
            </label>

            {/* Reporting Period Selector */}
            <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
              Reporting Period
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#DCE8D5] bg-white px-3 text-sm outline-none dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4]"
              >
                <option value="q1_fy26">Q1 FY26 (First Quarter)</option>
                <option value="q2_fy26">Q2 FY26 (Second Quarter)</option>
                <option value="fy26_ytd">FY26 YTD (Year-To-Date)</option>
                <option value="fy25_full">FY25 Full Annual Report</option>
              </select>
            </label>

            {/* Export Format Selector */}
            <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
              Export Format
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { id: 'pdf', label: 'PDF' },
                  { id: 'csv', label: 'CSV' },
                  { id: 'json', label: 'JSON' }
                ].map(format => (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => setExportFormat(format.id)}
                    className={`h-10 rounded-xl border text-xs font-bold transition-all ${
                      exportFormat === format.id
                        ? 'border-[#499A13] bg-[#EAF5E4] text-[#397B14] dark:border-[#8ECA3C] dark:bg-[#1E3319] dark:text-[#8ECA3C]'
                        : 'border-[#DCE8D5] hover:border-[#499A13] dark:border-[#2A4222] dark:text-[#8A9687]'
                    }`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 h-12"
          >
            {isGenerating ? (
              <>
                <Loader2Icon size={16} className="animate-spin" />
                Compiling Report...
              </>
            ) : (
              <>
                <DownloadIcon size={16} />
                Generate & Export
              </>
            )}
          </Button>
        </Card>

        {/* Live Preview Card */}
        <div className="space-y-3 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-[#7A8577] dark:text-[#6B7B67]">
            <span className="flex items-center gap-1.5"><EyeIcon size={13} /> Live Preview (Simulated)</span>
            <span className="flex items-center gap-1"><CalendarIcon size={13} /> Period: {formattedPeriod}</span>
          </div>

          <Card className="p-4 sm:p-6 bg-white dark:bg-[#162212]/30 backdrop-blur border border-[#DCE8D5]/80 dark:border-[#1E3319]/80 shadow-md">
            {/* Fake Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDF2E9] pb-4 mb-6 dark:border-[#1E3319]">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#499A13] dark:text-[#8ECA3C]">ECOSPHERE REPORT SYSTEM</span>
                <h2 className="font-display text-xl sm:text-2xl text-[#1B1B1B] dark:text-[#E8F0E4]">{report.title}</h2>
                <p className="text-xs text-[#7A8577] dark:text-[#6B7B67] mt-1">{report.subtitle}</p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block text-[10px] font-bold bg-[#EAF5E4] text-[#397B14] px-2 py-0.5 rounded-lg dark:bg-[#1E3319] dark:text-[#8ECA3C]">
                  {formattedPeriod}
                </span>
                <p className="text-[9px] text-[#9CA3AF] mt-1">Generated: Real-time</p>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="space-y-6">
              {report.sections.map((section, sidx) => (
                <div key={sidx} className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E4D3A] dark:text-[#C8E6B8] border-l-2 border-[#499A13] pl-2">
                    {section.title}
                  </h4>
                  
                  {/* Top KPIs */}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    {section.metrics.map((m, midx) => (
                      <div key={midx} className="rounded-xl border border-[#EDF2E9] bg-[#F7FAF5]/50 p-4 dark:border-[#1E3319]/50 dark:bg-[#121A0F]/20">
                        <p className="text-[10px] font-semibold text-[#83907F] dark:text-[#6B7B67]">{m.name}</p>
                        <p className="text-base sm:text-lg font-bold text-[#356F14] dark:text-[#8ECA3C] mt-1">{m.value}</p>
                        <div className="flex items-center gap-1 mt-2 text-[9px] text-[#499A13] dark:text-[#8ECA3C] font-semibold">
                          <CheckCircleIcon size={10} /> Validated signal
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table (if any) */}
                  {section.tableHeaders && section.tableRows && (
                    <div className="overflow-x-auto rounded-xl border border-[#EDF2E9] dark:border-[#1E3319]">
                      <table className="min-w-full divide-y divide-[#EDF2E9] dark:divide-[#1E3319] text-xs">
                        <thead className="bg-[#F7FAF5] dark:bg-[#162212]">
                          <tr>
                            {section.tableHeaders.map((th, thidx) => (
                              <th key={thidx} className="px-3 sm:px-4 py-3 text-left font-bold text-[#3E4D3A] dark:text-[#C8E6B8] whitespace-nowrap">{th}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EDF2E9] dark:divide-[#1E3319] bg-white/50 dark:bg-transparent">
                          {section.tableRows.map((row, rowidx) => (
                            <tr key={rowidx} className="hover:bg-[#F5F8F2]/50 dark:hover:bg-[#1A2D16]/20">
                              {row.map((cell, cidx) => (
                                <td key={cidx} className="px-3 sm:px-4 py-3 text-[#556052] dark:text-[#8A9687] whitespace-nowrap">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Simulated report footer */}
            <div className="mt-8 pt-4 border-t border-dashed border-[#EDF2E9] dark:border-[#1E3319] flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center text-[10px] text-[#9CA3AF] dark:text-[#5A6B56]">
              <span>🌿 EcoSphere ESG Platform Compliance Engine</span>
              <span className="flex items-center gap-1"><SparklesIcon size={10} /> Certified Data Signal</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
