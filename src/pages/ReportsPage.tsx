import React, { useState } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Users, 
  Building,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { visitors, showToast } = useVisitorContext();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Compute breakdown stats based on current records
  const totalVisitors = visitors.length;
  const completedVisits = visitors.filter((v) => v.status === 'completed').length;
  const insideVisits = visitors.filter((v) => v.status === 'inside').length;
  const approvedVisits = visitors.filter((v) => v.status !== 'rejected').length;
  const preRegVisits = visitors.filter((v) => v.preRegistered).length;
  const walkInVisits = totalVisitors - preRegVisits;

  // Purpose Breakdown
  const purposeCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    purposeCounts[v.purpose] = (purposeCounts[v.purpose] || 0) + 1;
  });
  const purposeList = Object.entries(purposeCounts).sort((a, b) => b[1] - a[1]);

  // Department Breakdown
  const deptCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    deptCounts[v.hostDepartment] = (deptCounts[v.hostDepartment] || 0) + 1;
  });
  const deptList = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

  // Weekly Trend Data simulation
  const weeklyTrendData = [
    { day: 'Mon', count: 18, checkIns: 18, checkOuts: 18 },
    { day: 'Tue', count: 24, checkIns: 24, checkOuts: 23 },
    { day: 'Wed', count: 31, checkIns: 31, checkOuts: 30 },
    { day: 'Thu', count: 28, checkIns: 28, checkOuts: 27 },
    { day: 'Fri', count: 35, checkIns: 35, checkOuts: 33 },
    { day: 'Sat', count: 9, checkIns: 9, checkOuts: 9 },
    { day: 'Sun', count: 4, checkIns: 4, checkOuts: 4 },
  ];

  const handleExportCSV = () => {
    const headers = [
      'Pass ID',
      'Visitor Name',
      'Phone',
      'Company',
      'Host',
      'Department',
      'Purpose',
      'Expected Date',
      'Check-In',
      'Check-Out',
      'Status'
    ];

    const rows = visitors.map((v) => [
      v.id,
      `"${v.fullName.replace(/"/g, '""')}"`,
      v.phone,
      `"${v.company.replace(/"/g, '""')}"`,
      `"${v.hostName.replace(/"/g, '""')}"`,
      `"${v.hostDepartment.replace(/"/g, '""')}"`,
      `"${v.purpose.replace(/"/g, '""')}"`,
      v.expectedDate,
      v.checkInTime || 'N/A',
      v.checkOutTime || 'N/A',
      v.status
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `visitor-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Generated & exported ${timeRange} visitor report CSV!`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Visitor Analytics & Security Reports</h2>
          <p className="text-xs text-slate-500">
            Generate executive compliance summaries, footfall trends, and export records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl text-xs">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 'daily'
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 'weekly'
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                timeRange === 'monthly'
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* High Level Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Visits (Period)</span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {timeRange === 'daily' ? totalVisitors : timeRange === 'weekly' ? 149 : 582}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2% vs previous period
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Average Stay Duration</span>
          <div className="mt-2 text-2xl font-bold font-mono text-blue-700 tabular-nums">
            1 hr 48 min
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Median dwell time</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Peak Campus Hours</span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            10:00 – 11:30 AM
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Highest gate arrival density</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Pre-Approval Compliance</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            94.6%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">High security standard</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Footfall Trend Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {timeRange === 'daily' ? 'Hourly Activity Distribution' : timeRange === 'weekly' ? 'Weekly Footfall Trends' : 'Monthly Daily Average'}
              </h3>
              <p className="text-xs text-slate-500">Aggregated visitor check-ins & completed visits</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Total: 149 Visitors</span>
          </div>

          {/* Weekly SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-60 w-full flex items-end gap-3 sm:gap-6 px-4 pb-6 border-b border-slate-200 relative">
              {weeklyTrendData.map((d) => {
                const heightPercent = Math.min(100, (d.count / 40) * 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 px-2 py-1 bg-slate-900 text-white rounded text-[11px] font-mono whitespace-nowrap z-20 pointer-events-none">
                      {d.count} visitors ({d.day})
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-blue-600 group-hover:bg-blue-500 rounded-t-lg transition-all duration-300"
                    />
                    <span className="absolute -bottom-5 text-xs font-semibold text-slate-500">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                  <span>Check-Ins Volume</span>
                </span>
                <span className="text-slate-300">·</span>
                <span>Busiest day: <strong className="text-slate-800">Friday (35 visits)</strong></span>
              </div>
              <span className="text-slate-400 text-[11px]">Nexus Security Audit Engine</span>
            </div>
          </div>
        </div>

        {/* Pre-Registered vs Walk-In Ratio (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Registration Mode Ratio</h3>
            <p className="text-xs text-slate-500">Pre-scheduled portal passes vs walk-ins</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Pre-Registered Passes</span>
                <span className="font-mono text-blue-700">
                  {Math.round((preRegVisits / Math.max(1, totalVisitors)) * 100)}% ({preRegVisits})
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(preRegVisits / Math.max(1, totalVisitors)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Walk-In Front Desk</span>
                <span className="font-mono text-emerald-700">
                  {Math.round((walkInVisits / Math.max(1, totalVisitors)) * 100)}% ({walkInVisits})
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${(walkInVisits / Math.max(1, totalVisitors)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">Security Policy Insight:</span>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Pre-registration reduces reception desk wait times by an average of 4.2 minutes per visitor.
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Grids: Purpose of Visit & Visits by Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purpose Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Visits by Purpose</h3>
          <div className="space-y-3">
            {purposeList.map(([purpose, count]) => {
              const percent = Math.round((count / Math.max(1, totalVisitors)) * 100);
              return (
                <div key={purpose} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{purpose}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Visits by Host Department</h3>
          <div className="space-y-3">
            {deptList.map(([dept, count]) => {
              const percent = Math.round((count / Math.max(1, totalVisitors)) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{dept}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
