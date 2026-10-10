import React, { useState, useMemo } from 'react';
import { useVisitorContext } from '../context/VisitorContext';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Printer, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  FileSpreadsheet,
  Building,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';
import { VisitorRecord, VisitorStatus } from '../types/visitor';

export const RecordsPage: React.FC = () => {
  const { 
    visitors, 
    setSelectedVisitor, 
    setPassModalVisitor, 
    deleteVisitorRecord, 
    showToast 
  } = useVisitorContext();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'fullName' | 'status'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter and sort visitors
  const filteredRecords = useMemo(() => {
    return visitors.filter((v) => {
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          v.fullName.toLowerCase().includes(q) ||
          v.company.toLowerCase().includes(q) ||
          v.phone.includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.hostName.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && v.status !== statusFilter) {
        return false;
      }

      // Purpose Filter
      if (purposeFilter !== 'all' && v.purpose !== purposeFilter) {
        return false;
      }

      // Date Filter
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        if (v.expectedDate !== today && !v.createdAt.startsWith(today)) return false;
      } else if (dateFilter === 'yesterday') {
        const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (v.expectedDate !== yest && !v.createdAt.startsWith(yest)) return false;
      }

      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === 'fullName') {
        cmp = a.fullName.localeCompare(b.fullName);
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      } else {
        cmp = (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [visitors, searchQuery, statusFilter, dateFilter, purposeFilter, sortField, sortAsc]);

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      showToast('No records to export matching current filter.', 'warning');
      return;
    }

    const headers = [
      'Pass ID',
      'Visitor Name',
      'Contact Phone',
      'Email',
      'Company',
      'Host Name',
      'Department',
      'Purpose',
      'Visit Date',
      'Check-In Time',
      'Check-Out Time',
      'Stay Duration',
      'Badge Number',
      'Status'
    ];

    const rows = filteredRecords.map((v) => [
      v.id,
      `"${v.fullName.replace(/"/g, '""')}"`,
      v.phone,
      v.email || '',
      `"${v.company.replace(/"/g, '""')}"`,
      `"${v.hostName.replace(/"/g, '""')}"`,
      `"${v.hostDepartment.replace(/"/g, '""')}"`,
      `"${v.purpose.replace(/"/g, '""')}"`,
      v.expectedDate,
      v.checkInTime || '',
      v.checkOutTime || '',
      v.stayDuration || '',
      v.badgeNumber || '',
      v.status
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `passguard-visitor-records-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredRecords.length} visitor records to CSV file.`, 'success');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inside':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Inside</span>;
      case 'expected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Expected</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Completed</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Visitor Records & Historical Directory</h2>
          <p className="text-xs text-slate-500">
            Searchable log of all visitor passes, check-in timestamps, and host visit records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Text Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search visitor name, phone, company, or pass ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="inside">Currently Inside</option>
              <option value="expected">Expected / Approved</option>
              <option value="completed">Completed Visits</option>
              <option value="pending">Pending Approval</option>
              <option value="rejected">Rejected Passes</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today's Visits</option>
              <option value="yesterday">Yesterday</option>
            </select>
          </div>

          {/* Purpose Filter */}
          <div>
            <select
              value={purposeFilter}
              onChange={(e) => {
                setPurposeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Purposes</option>
              <option value="Business Meeting">Business Meeting</option>
              <option value="Job Interview">Job Interview</option>
              <option value="Vendor & Supplier">Vendor & Supplier</option>
              <option value="Client Presentation">Client Presentation</option>
              <option value="Delivery & Courier">Delivery & Courier</option>
              <option value="Maintenance & IT">Maintenance & IT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredRecords.length}</strong> visitor records
          </span>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Sort by:</span>
            <button
              onClick={() => {
                if (sortField === 'createdAt') setSortAsc(!sortAsc);
                else { setSortField('createdAt'); setSortAsc(false); }
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${sortField === 'createdAt' ? 'font-bold text-blue-700 bg-blue-50' : 'text-slate-600'}`}
            >
              Date
            </button>
            <button
              onClick={() => {
                if (sortField === 'fullName') setSortAsc(!sortAsc);
                else { setSortField('fullName'); setSortAsc(true); }
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${sortField === 'fullName' ? 'font-bold text-blue-700 bg-blue-50' : 'text-slate-600'}`}
            >
              Name
            </button>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No records found matching filters</h4>
            <p className="text-[11px] text-slate-400">Try adjusting your query or date filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Pass ID</th>
                  <th className="pb-3">Visitor Name & Contact</th>
                  <th className="pb-3">Person to Meet</th>
                  <th className="pb-3">Purpose</th>
                  <th className="pb-3">Check-In</th>
                  <th className="pb-3">Check-Out</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRecords.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Pass ID */}
                    <td className="py-3 pl-2 font-mono font-bold text-blue-700">
                      {v.id}
                      {v.badgeNumber && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {v.badgeNumber}
                        </span>
                      )}
                    </td>

                    {/* Visitor & Contact */}
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{v.fullName}</div>
                      <div className="text-[11px] text-slate-500">{v.company} · {v.phone}</div>
                    </td>

                    {/* Host */}
                    <td className="py-3">
                      <div className="font-semibold text-slate-800">{v.hostName}</div>
                      <div className="text-[11px] text-slate-500">{v.hostDepartment}</div>
                    </td>

                    {/* Purpose */}
                    <td className="py-3 text-slate-700">{v.purpose}</td>

                    {/* Check In */}
                    <td className="py-3 font-mono text-slate-700">
                      {v.checkInTime ? (
                        <div>
                          <span className="text-emerald-700 font-semibold">{v.checkInTime.split(' ')[1]}</span>
                          <span className="text-[10px] text-slate-400 block font-sans">{v.checkInTime.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Expected {v.expectedTime}</span>
                      )}
                    </td>

                    {/* Check Out */}
                    <td className="py-3 font-mono text-slate-700">
                      {v.checkOutTime ? (
                        <div>
                          <span className="text-slate-800 font-semibold">{v.checkOutTime.split(' ')[1]}</span>
                          <span className="text-[10px] text-slate-400 block font-sans">{v.stayDuration || 'Completed'}</span>
                        </div>
                      ) : v.status === 'inside' ? (
                        <span className="text-emerald-600 font-sans font-medium text-[11px]">On premises</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3">{getStatusBadge(v.status)}</td>

                    {/* Actions */}
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVisitor(v)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View visitor profile & timeline"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPassModalVisitor(v)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Print physical pass badge"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${v.fullName}?`)) {
                              deleteVisitorRecord(v.id);
                            }
                          }}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Page <strong className="text-slate-800">{currentPage}</strong> of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
