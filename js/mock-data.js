// Mock data for the timesheet application

// Users data
const users = [
  { id: 1, username: 'Sophia', password: 'pass', role: 'employee', email: 'sophia@company.com', department: 'Engineering', hireDate: '2025-04-01', position: 'Software Engineer' },
  { id: 2, username: 'employee2', password: 'pass', role: 'employee', email: 'employee2@company.com', department: 'Marketing', hireDate: '2024-01-10', position: 'Marketing Specialist' },
  { id: 3, username: 'manager', password: 'pass', role: 'manager', email: 'manager@company.com', department: 'Operations', hireDate: '2022-03-22', position: 'Team Lead' }
];

// Company holidays (aligned with NYSE 2025 holidays)
const holidays = [
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-01-20', name: 'Martin Luther King Jr. Day' },
  { date: '2025-02-17', name: 'Presidents\' Day' },
  { date: '2025-04-18', name: 'Good Friday' },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-06-19', name: 'Juneteenth' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-11-27', name: 'Thanksgiving Day' },
  { date: '2025-12-25', name: 'Christmas Day' }
];

// Timesheet data
let timesheets = [
  {
    id: 1,
    employeeId: 1,
    startDate: '2025-04-04',
    endDate: '2025-04-18',
    entries: [
      { date: '2025-04-04', hours: 8 },
      { date: '2025-04-05', hours: 7.5 }
    ],
    status: 'pending'
  }
];

// Helper functions
function isHoliday(date) {
  return holidays.some(h => h.date === date);
}

function getHolidayName(date) {
  const holiday = holidays.find(h => h.date === date);
  return holiday ? holiday.name : null;
}

function formatDate(date) {
  // Fix timezone issue by parsing the date parts manually
  const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
  // Create date with local timezone (months are 0-indexed in JS Date)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Local storage functions
function saveTimesheets() {
  localStorage.setItem('timesheets', JSON.stringify(timesheets));
}

function loadTimesheets() {
  const saved = localStorage.getItem('timesheets');
  if (saved) {
    timesheets = JSON.parse(saved);
  }
}

// Load data on init
loadTimesheets();