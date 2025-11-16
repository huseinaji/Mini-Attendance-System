import React, { useState, useEffect } from 'react';
import { ClockIcon, CalendarIcon, ArrowDownTrayIcon, FunnelIcon, UserIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const HOST = '192.168.1.41';

type AttendanceRecord = {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
};

interface Employee {
  employeeId: number;
  username: string;
}

async function getEmployee() {
  const response = await fetch(`http://192.168.1.41:8000/api/user`);
  const data = await response.json();
  console.log('Employee Data:', data);
  return data;
}

const AttendanceSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('checkin');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeData, setEmployeeData] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    { id: 1, name: 'John Smith', department: 'Engineering' },
    { id: 2, name: 'Sarah Johnson', department: 'Marketing' },
    { id: 3, name: 'Michael Brown', department: 'Sales' },
    { id: 4, name: 'Emily Davis', department: 'HR' },
    { id: 5, name: 'David Wilson', department: 'Engineering' }
  ];

  const workSchedule = {
    startTime: '09:00',
    endTime: '17:00',
  };

  useEffect(() => {
    getEmployee()
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []); 

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateStatus = (checkIn: Date, checkOut: Date) => {
    if (!checkIn) return 'absent';
    
    const checkInTime = new Date(`1970-01-01T${checkIn}`);
    const workStart = new Date(`1970-01-01T${workSchedule.startTime}`);
    const workEnd = new Date(`1970-01-01T${workSchedule.endTime}`);
    
    const lateMinutes = (checkInTime - workStart) / (1000 * 60);
    
    if (checkOut) {
      const checkOutTime = new Date(`1970-01-01T${checkOut}`);
      const earlyMinutes = (workEnd - checkOutTime) / (1000 * 60);
      
      if (earlyMinutes > workSchedule.earlyLeaveThreshold) {
        return 'early-leave';
      }
    }
    
    if (lateMinutes > workSchedule.lateThreshold) {
      return 'late';
    }
    
    return 'present';
  };

  const handleCheckIn = () => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    const employee = employees.find(e => e.id === parseInt(selectedEmployee));
    const today = new Date().toISOString().split('T')[0];
    
    const existingRecord = attendanceRecords.find(
      r => r.employeeId === parseInt(selectedEmployee) && r.date === today
    );

    if (existingRecord && existingRecord.checkIn) {
      alert('Already checked in today!');
      return;
    }

    const checkInTime = currentTime.toTimeString().split(' ')[0].slice(0, 5);
    
    const newRecord = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      date: today,
      checkIn: checkInTime,
      checkOut: null,
      status: calculateStatus(checkInTime, null)
    };

    setAttendanceRecords([...attendanceRecords, newRecord]);
    alert(`Check-in successful for ${employee.name} at ${checkInTime}`);
  };

  const handleCheckOut = () => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const recordIndex = attendanceRecords.findIndex(
      r => r.employeeId === parseInt(selectedEmployee) && r.date === today
    );

    if (recordIndex === -1) {
      alert('No check-in record found for today!');
      return;
    }

    if (attendanceRecords[recordIndex].checkOut) {
      alert('Already checked out today!');
      return;
    }

    const checkOutTime = currentTime.toTimeString().split(' ')[0].slice(0, 5);
    const updatedRecords = [...attendanceRecords];
    updatedRecords[recordIndex].checkOut = checkOutTime;
    updatedRecords[recordIndex].status = calculateStatus(
      updatedRecords[recordIndex].checkIn,
      checkOutTime
    );

    setAttendanceRecords(updatedRecords);
    alert(`Check-out successful at ${checkOutTime}`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-800 border-green-200',
      late: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'early-leave': 'bg-orange-100 text-orange-800 border-orange-200',
      absent: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      present: <CheckCircleIcon className="w-4 h-4" />,
      late: <ExclamationTriangleIcon className="w-4 h-4" />,
      'early-leave': <ExclamationTriangleIcon className="w-4 h-4" />,
      absent: <XCircleIcon className="w-4 h-4" />
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${styles[status]}`}>
        {icons[status]}
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const statusMatch = filterStatus === 'all' || record.status === filterStatus;
    const dateMatch = !filterDate || record.date === filterDate;
    const searchMatch = !searchTerm || 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && dateMatch && searchMatch;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Employee Name', 'Department', 'Check In', 'Check Out', 'Status'];
    const rows = filteredRecords.map(r => [
      r.date,
      r.checkIn || '-',
      r.checkOut || '-',
      r.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusCount = (status: string) => {
    return attendanceRecords.filter(r => r.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-indigo-600" />
                Employee Attendance System
              </h1>
              <p className="text-gray-600 mt-1">Track and manage employee attendance efficiently</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-600">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-600 mt-1">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'checkin'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Check In / Check Out
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'reports'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Attendance Reports
            </button>
          </div>

          {/* Check In/Out Tab */}
          {activeTab === 'checkin' && (
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                  <h2 className="text-2xl font-bold mb-2">Record Attendance</h2>
                  <p className="text-indigo-100">Select an employee and check in or check out</p>
                </div>

                <div className="space-y-6">
                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Employee
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} - {emp.department}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleCheckIn}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Check In
                    </button>
                    <button
                      onClick={handleCheckOut}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Check Out
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2">Work Schedule</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Start Time: {workSchedule.startTime}</p>
                      <p>• End Time: {workSchedule.endTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="p-8">
              {/* Statistics Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="text-green-600 text-sm font-semibold mb-1">Present</div>
                  <div className="text-3xl font-bold text-green-700">{getStatusCount('present')}</div>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <div className="text-yellow-600 text-sm font-semibold mb-1">Late</div>
                  <div className="text-3xl font-bold text-yellow-700">{getStatusCount('late')}</div>
                </div>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <div className="text-orange-600 text-sm font-semibold mb-1">Early Leave</div>
                  <div className="text-3xl font-bold text-orange-700">{getStatusCount('early-leave')}</div>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="text-red-600 text-sm font-semibold mb-1">Absent</div>
                  <div className="text-3xl font-bold text-red-700">{getStatusCount('absent')}</div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border-2 border-gray-200">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">Filters:</span>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search employee or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="early-leave">Early Leave</option>
                    <option value="absent">Absent</option>
                  </select>

                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />

                  <button
                    onClick={exportToCSV}
                    className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="font-semibold">No attendance records found</p>
                            <p className="text-sm">Try adjusting your filters or check in some employees</p>
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{record.employeeId}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{record.checkIn || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{record.checkOut || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(record.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;