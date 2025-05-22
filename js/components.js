// Vue components for the timesheet application

// App Title Component
Vue.component('app-title', {
  template: `
    <div class="text-center my-4 app-title">
      <h1 class="display-4"><i class="bi bi-clock-history"></i> Timesheet Portal</h1>
      <p class="lead">Track and manage your working hours efficiently</p>
      <div class="title-underline"></div>
    </div>
  `
});

// Login Component
Vue.component('login-form', {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  template: `
    <div class="card">
      <div class="card-header">
        <h3>Timesheet Login</h3>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" v-model="username" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required>
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-100">Login</button>
        </form>
      </div>
    </div>
  `,
  methods: {
    login() {
      const user = users.find(u => u.username === this.username && u.password === this.password);
      if (user) {
        this.$emit('login-success', user);
      } else {
        this.error = 'Invalid username or password';
      }
    }
  }
});

// Calendar Component
Vue.component('calendar-view', {
  props: ['selectedDate'],
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      days: []
    };
  },
  created() {
    this.generateCalendarDays();
  },
  template: `
    <div class="calendar mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-sm btn-outline-secondary" @click="previousMonth">
          <i class="bi bi-chevron-left"></i> Previous
        </button>
        <div class="text-center">
          <h4 class="month-year mb-2">{{ monthName }} {{ currentYear }}</h4>
          <button class="btn btn-sm btn-outline-primary" @click="goToToday">
            <i class="bi bi-calendar-check"></i> Today
          </button>
        </div>
        <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
          Next <i class="bi bi-chevron-right"></i>
        </button>
      </div>
      
      <div class="d-flex flex-wrap">
        <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
             class="calendar-day text-center fw-bold">
          {{ day }}
        </div>
        
        <div v-for="day in days" 
             :key="day.date" 
             :class="['calendar-day', { 
               'holiday': day.isHoliday,
               'selected-date': day.date === selectedDate,
               'today-marker': day.isToday,
               'disabled': day.isHoliday
             }]"
             @click="selectDate(day)">
          <div class="day-number">{{ day.dayOfMonth }}</div>
          <div v-if="day.isHoliday" class="holiday-name">{{ day.holidayName }}</div>
        </div>
      </div>
    </div>
  `,
  computed: {
    monthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
    }
  },
  methods: {
    generateCalendarDays() {
      this.days = [];
      
      // First day of the month
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      // Get today's date for comparison
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      // Add empty days for the start of the month
      for (let i = 0; i < firstDay.getDay(); i++) {
        this.days.push({ 
          dayOfMonth: '', 
          date: null, 
          isHoliday: false,
          isToday: false
        });
      }
      
      // Add days of the month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        const dateString = date.toISOString().split('T')[0];
        const isHolidayDate = isHoliday(dateString);
        const isToday = dateString === todayString;
        
        this.days.push({
          dayOfMonth: i,
          date: dateString,
          isHoliday: isHolidayDate,
          isToday: isToday,
          holidayName: isHolidayDate ? getHolidayName(dateString) : null
        });
      }
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.generateCalendarDays();
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.generateCalendarDays();
    },
    goToToday() {
      const today = new Date();
      this.currentMonth = today.getMonth();
      this.currentYear = today.getFullYear();
      this.generateCalendarDays();
      
      // Select today's date and emit the event
      const todayString = today.toISOString().split('T')[0];
      if (!isHoliday(todayString)) {
        this.$emit('date-selected', todayString);
      }
    },
    selectDate(day) {
      if (day.date && !day.isHoliday) {
        this.$emit('date-selected', day.date);
      }
    }
  }
});

// Employee Dashboard Component
Vue.component('employee-dashboard', {
  props: ['user'],
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      hours: '',
      message: '',
      messageType: '',
      currentTimesheets: []
    };
  },
  created() {
    this.loadTimesheets();
  },
  template: `
    <div>
      <div class="dashboard-header d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-2">Employee Dashboard</h2>
          <p class="welcome-message">Welcome, {{ user.username }}!</p>
        </div>
        <div class="current-date text-end">
          <h4>{{ new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) }}</h4>
        </div>
      </div>
      
      <div v-if="message" :class="'alert alert-' + messageType">{{ message }}</div>
      
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h4><i class="bi bi-calendar3"></i> Select Date</h4>
            </div>
            <div class="card-body">
              <calendar-view 
                @date-selected="onDateSelected" 
                :selected-date="selectedDate">
              </calendar-view>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col-lg-6">
              <div class="card">
                <div class="card-header">
                  <h4><i class="bi bi-graph-up"></i> Hours Summary</h4>
                </div>
                <div class="card-body">
                  <h5 class="card-title mb-3">Biweekly Target: 80 Hours</h5>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>Current Period:</div>
                    <strong>{{ getCurrentPeriodHours() }} hours</strong>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>Previous Period:</div>
                    <strong>{{ getPreviousPeriodHours() }} hours</strong>
                  </div>
                  <div class="progress">
                    <div class="progress-bar" role="progressbar" 
                         :style="{ width: getProgressPercentage() + '%' }" 
                         :aria-valuenow="getCurrentPeriodHours()" 
                         aria-valuemin="0" aria-valuemax="80">
                      {{ getProgressPercentage() }}%
                    </div>
                  </div>
                  <small class="text-muted mt-2 d-block">Progress toward biweekly target</small>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card">
                <div class="card-header">
                  <h4><i class="bi bi-calendar-check"></i> Upcoming Holidays</h4>
                </div>
                <div class="card-body">
                  <h5 class="card-title mb-3">Upcoming Holidays</h5>
                  <ul class="list-group">
                    <li v-for="holiday in getUpcomingHolidays()" :key="holiday.date" class="list-group-item">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>{{ formatDate(holiday.date) }}</div>
                        <strong>{{ holiday.name }}</strong>
                      </div>
                    </li>
                    <li v-if="getUpcomingHolidays().length === 0" class="list-group-item">
                      No upcoming holidays in the next 30 days
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-header">
              <h4><i class="bi bi-pencil-square"></i> Time Entry Form</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitHours">
                <div class="mb-3">
                  <label :for="'hours-' + selectedDate" class="form-label">
                    Hours for {{ formatDate(selectedDate) }}:
                  </label>
                  <input 
                    type="number" 
                    class="form-control form-control-lg" 
                    :id="'hours-' + selectedDate" 
                    v-model="hours" 
                    step="0.5" 
                    min="0" 
                    max="24" 
                    :disabled="isHoliday(selectedDate)"
                    required>
                  <small class="form-text text-muted">Enter hours worked (overtime allowed)</small>
                  <div v-if="isHoliday(selectedDate)" class="text-danger mt-2">
                    {{ getHolidayName(selectedDate) }} - No time entry allowed
                  </div>
                </div>
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg w-100"
                  :disabled="isHoliday(selectedDate)">
                  <i class="bi bi-check-circle"></i> Submit Hours
                </button>
              </form>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h4><i class="bi bi-list-check"></i> Recent Submissions</h4>
            </div>
            <div class="card-body">
              <div v-if="currentTimesheets.length === 0" class="text-center py-3">
                No timesheet submissions yet.
              </div>
              <ul v-else class="list-group">
                <li v-for="timesheet in currentTimesheets" :key="timesheet.id" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <strong>{{ timesheet.startDate }} to {{ timesheet.endDate }}</strong>
                    <span :class="'badge ' + getStatusClass(timesheet.status)">
                      {{ timesheet.status }}
                    </span>
                  </div>
                  <div class="mt-2">
                    <i class="bi bi-clock"></i> Total Hours: <strong>{{ getTotalHours(timesheet) }}</strong>
                  </div>
                  <div v-if="timesheet.status === 'rejected' && timesheet.rejectionReason" class="mt-2">
                    <div class="alert alert-danger py-2">
                      <strong>Rejection Reason:</strong> {{ timesheet.rejectionReason }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    onDateSelected(date) {
      this.selectedDate = date;
      this.hours = this.getHoursForDate(date) || '';
    },
    isHoliday(date) {
      return isHoliday(date);
    },
    getHolidayName(date) {
      return getHolidayName(date);
    },
    formatDate(date) {
      return formatDate(date);
    },
    getHoursForDate(date) {
      for (const timesheet of this.currentTimesheets) {
        const entry = timesheet.entries.find(e => e.date === date);
        if (entry) return entry.hours;
      }
      return null;
    },
    getCurrentPeriodHours() {
      const today = new Date();
      const day = today.getDate();
      const isPeriod1 = day <= 15;
      
      const periodStart = new Date(today.getFullYear(), today.getMonth(), isPeriod1 ? 1 : 16);
      const periodEnd = new Date(today.getFullYear(), today.getMonth() + (isPeriod1 ? 0 : 1), isPeriod1 ? 15 : 0);
      
      const startDate = periodStart.toISOString().split('T')[0];
      const endDate = periodEnd.toISOString().split('T')[0];
      
      const currentPeriodTimesheet = this.currentTimesheets.find(
        t => t.startDate === startDate && t.endDate === endDate
      );
      
      return currentPeriodTimesheet ? this.getTotalHours(currentPeriodTimesheet) : 0;
    },
    getPreviousPeriodHours() {
      const today = new Date();
      const day = today.getDate();
      const isPeriod1 = day <= 15;
      
      let periodStart, periodEnd;
      
      if (isPeriod1) {
        // Previous period is the second half of last month
        periodStart = new Date(today.getFullYear(), today.getMonth() - 1, 16);
        periodEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      } else {
        // Previous period is the first half of this month
        periodStart = new Date(today.getFullYear(), today.getMonth(), 1);
        periodEnd = new Date(today.getFullYear(), today.getMonth(), 15);
      }
      
      const startDate = periodStart.toISOString().split('T')[0];
      const endDate = periodEnd.toISOString().split('T')[0];
      
      const previousPeriodTimesheet = this.currentTimesheets.find(
        t => t.startDate === startDate && t.endDate === endDate
      );
      
      return previousPeriodTimesheet ? this.getTotalHours(previousPeriodTimesheet) : 0;
    },
    getProgressPercentage() {
      const currentHours = this.getCurrentPeriodHours();
      return Math.min(Math.round((currentHours / 80) * 100), 100);
    },
    getUpcomingHolidays() {
      const today = new Date();
      const thirtyDaysLater = new Date(today);
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      const todayString = today.toISOString().split('T')[0];
      const thirtyDaysString = thirtyDaysLater.toISOString().split('T')[0];
      
      return holidays.filter(h => h.date >= todayString && h.date <= thirtyDaysString)
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .slice(0, 3);
    },
    submitHours() {
      if (this.isHoliday(this.selectedDate)) {
        this.message = 'Cannot submit time for holidays';
        this.messageType = 'danger';
        return;
      }
      
      const hoursValue = parseFloat(this.hours);
      if (isNaN(hoursValue) || hoursValue <= 0 || hoursValue > 24) {
        this.message = 'Please enter valid hours (between 0 and 24)';
        this.messageType = 'danger';
        return;
      }
      
      // Find or create timesheet for the period
      const date = new Date(this.selectedDate);
      const day = date.getDate();
      
      // Determine period (1st-15th or 16th-end of month)
      const isPeriod1 = day <= 15;
      
      const periodStart = new Date(date.getFullYear(), date.getMonth(), isPeriod1 ? 1 : 16);
      const periodEnd = new Date(date.getFullYear(), date.getMonth() + (isPeriod1 ? 0 : 1), isPeriod1 ? 15 : 0);
      
      const startDate = periodStart.toISOString().split('T')[0];
      const endDate = periodEnd.toISOString().split('T')[0];
      
      let timesheet = timesheets.find(
        t => t.employeeId === this.user.id && 
        t.startDate === startDate && 
        t.endDate === endDate
      );
      
      if (!timesheet) {
        timesheet = {
          id: timesheets.length + 1,
          employeeId: this.user.id,
          startDate,
          endDate,
          entries: [],
          status: 'pending'
        };
        timesheets.push(timesheet);
      }
      
      // Add or update entry
      const existingEntryIndex = timesheet.entries.findIndex(e => e.date === this.selectedDate);
      if (existingEntryIndex >= 0) {
        timesheet.entries[existingEntryIndex].hours = hoursValue;
      } else {
        timesheet.entries.push({ date: this.selectedDate, hours: hoursValue });
      }
      
      saveTimesheets();
      this.loadTimesheets();
      
      this.message = 'Time entry submitted successfully!';
      this.messageType = 'success';
    },
    loadTimesheets() {
      this.currentTimesheets = timesheets.filter(t => t.employeeId === this.user.id);
    },
    getTotalHours(timesheet) {
      return timesheet.entries.reduce((sum, entry) => sum + entry.hours, 0);
    },
    getStatusClass(status) {
      return status === 'approved' ? 'bg-success' : 
             status === 'rejected' ? 'bg-danger' : 'bg-warning';
    }
  }
});

// Manager Dashboard Component
Vue.component('manager-dashboard', {
  props: ['user'],
  data() {
    return {
      pendingTimesheets: [],
      allTimesheets: [],
      selectedTimesheet: null,
      rejectionReason: '',
      message: '',
      messageType: '',
      activeTab: 'pending'
    };
  },
  created() {
    this.loadTimesheets();
  },
  template: `
    <div>
      <div class="dashboard-header d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-2">Manager Dashboard</h2>
          <p class="welcome-message">Welcome, {{ user.username }}!</p>
        </div>
        <div class="current-date text-end">
          <h4>{{ new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) }}</h4>
        </div>
      </div>
      
      <div v-if="message" :class="'alert alert-' + messageType">{{ message }}</div>
      
      <div class="row mb-4">
        <div class="col-lg-3">
          <div class="stats-card card" @click="activeTab = 'pending'">
            <div class="card-body text-center">
              <i class="bi bi-hourglass-split stats-icon"></i>
              <h3 class="mb-0">{{ pendingTimesheets.length }}</h3>
              <p class="text-muted mb-0">Pending Approvals</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="stats-card card" @click="activeTab = 'all'; statusFilter = 'approved'">
            <div class="card-body text-center">
              <i class="bi bi-check-circle stats-icon"></i>
              <h3 class="mb-0">{{ getApprovedCount() }}</h3>
              <p class="text-muted mb-0">Approved Timesheets</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="stats-card card" @click="activeTab = 'all'; statusFilter = 'rejected'">
            <div class="card-body text-center">
              <i class="bi bi-x-circle stats-icon"></i>
              <h3 class="mb-0">{{ getRejectedCount() }}</h3>
              <p class="text-muted mb-0">Rejected Timesheets</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="stats-card card" @click="activeTab = 'employees'">
            <div class="card-body text-center">
              <i class="bi bi-people stats-icon"></i>
              <h3 class="mb-0">{{ getTotalEmployees() }}</h3>
              <p class="text-muted mb-0">Total Employees</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'pending' }" 
                 href="#" @click.prevent="activeTab = 'pending'">
                <i class="bi bi-hourglass"></i> Pending Approvals
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'all' }" 
                 href="#" @click.prevent="activeTab = 'all'">
                <i class="bi bi-list-ul"></i> All Timesheets
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'employees' }" 
                 href="#" @click.prevent="activeTab = 'employees'">
                <i class="bi bi-people"></i> Employees
              </a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <div v-if="activeTab === 'pending'">
            <div v-if="pendingTimesheets.length === 0" class="alert alert-info">
              No pending timesheets to review.
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Period</th>
                    <th>Total Hours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="timesheet in pendingTimesheets" :key="timesheet.id">
                    <td>{{ timesheet.employeeId }}</td>
                    <td>{{ timesheet.startDate }} to {{ timesheet.endDate }}</td>
                    <td>{{ getTotalHours(timesheet) }}</td>
                    <td>
                      <button 
                        class="btn btn-sm btn-success me-2"
                        @click="approveTimesheet(timesheet.id)">
                        <i class="bi bi-check-circle"></i> Approve
                      </button>
                      <button 
                        class="btn btn-sm btn-danger"
                        @click="openRejectModal(timesheet)"
                        data-bs-toggle="modal"
                        data-bs-target="#rejectModal">
                        <i class="bi bi-x-circle"></i> Reject
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-if="activeTab === 'all'">
            <div class="row mb-3">
              <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Search by employee ID or date..." v-model="searchQuery">
              </div>
              <div class="col-md-6 text-end">
                <div class="btn-group">
                  <button class="btn" :class="statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'" @click="statusFilter = 'all'">All</button>
                  <button class="btn" :class="statusFilter === 'approved' ? 'btn-primary' : 'btn-outline-primary'" @click="statusFilter = 'approved'">Approved</button>
                  <button class="btn" :class="statusFilter === 'rejected' ? 'btn-primary' : 'btn-outline-primary'" @click="statusFilter = 'rejected'">Rejected</button>
                  <button class="btn" :class="statusFilter === 'pending' ? 'btn-primary' : 'btn-outline-primary'" @click="statusFilter = 'pending'">Pending</button>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Period</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="timesheet in filteredTimesheets" :key="timesheet.id">
                    <td>{{ timesheet.employeeId }}</td>
                    <td>{{ getEmployeeName(timesheet.employeeId) }}</td>
                    <td>{{ timesheet.startDate }} to {{ timesheet.endDate }}</td>
                    <td>{{ getTotalHours(timesheet) }}</td>
                    <td>
                      <span :class="'badge ' + getStatusClass(timesheet.status)">
                        {{ timesheet.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" 
                              @click="viewTimesheetDetails(timesheet)"
                              data-bs-toggle="modal"
                              data-bs-target="#detailsModal">
                        <i class="bi bi-eye"></i> View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-if="activeTab === 'employees'">
            <div class="row mb-3">
              <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Search employees..." v-model="searchQuery">
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Hire Date</th>
                        <th>Total Timesheets</th>
                        <th>Pending</th>
                        <th>Approved</th>
                        <th>Rejected</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="employee in filteredEmployees" :key="employee.id">
                        <td>{{ employee.id }}</td>
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.department }}</td>
                        <td>{{ employee.position }}</td>
                        <td>{{ employee.email }}</td>
                        <td>{{ formatDate(employee.hireDate) }}</td>
                        <td>{{ employee.timesheets.length }}</td>
                        <td>{{ employee.timesheets.filter(t => t.status === 'pending').length }}</td>
                        <td>{{ employee.timesheets.filter(t => t.status === 'approved').length }}</td>
                        <td>{{ employee.timesheets.filter(t => t.status === 'rejected').length }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary" 
                                  @click="viewEmployeeDetails(employee)"
                                  data-bs-toggle="modal"
                                  data-bs-target="#employeeModal">
                            <i class="bi bi-person-lines-fill"></i> View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Reject Modal -->
      <div class="modal fade" id="rejectModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reject Timesheet</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="rejectionReason" class="form-label">Reason for Rejection:</label>
                <textarea
                  class="form-control"
                  id="rejectionReason"
                  v-model="rejectionReason"
                  rows="3"
                  required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button 
                type="button" 
                class="btn btn-danger"
                @click="rejectTimesheet"
                data-bs-dismiss="modal">
                <i class="bi bi-x-circle"></i> Reject Timesheet
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Details Modal -->
      <div class="modal fade" id="detailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Timesheet Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="selectedTimesheet">
              <div class="row mb-3">
                <div class="col-md-6">
                  <p><strong>Employee:</strong> {{ getEmployeeName(selectedTimesheet.employeeId) }} (ID: {{ selectedTimesheet.employeeId }})</p>
                  <p><strong>Period:</strong> {{ selectedTimesheet.startDate }} to {{ selectedTimesheet.endDate }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Status:</strong> 
                    <span :class="'badge ' + getStatusClass(selectedTimesheet.status)">
                      {{ selectedTimesheet.status }}
                    </span>
                  </p>
                  <p><strong>Total Hours:</strong> {{ getTotalHours(selectedTimesheet) }}</p>
                </div>
              </div>
              
              <h6>Daily Entries</h6>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in selectedTimesheet.entries" :key="entry.date">
                    <td>{{ formatDate(entry.date) }}</td>
                    <td>{{ new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' }) }}</td>
                    <td>{{ entry.hours }}</td>
                  </tr>
                </tbody>
              </table>
              
              <div v-if="selectedTimesheet.status === 'rejected' && selectedTimesheet.rejectionReason" class="mt-3">
                <div class="alert alert-danger">
                  <strong>Rejection Reason:</strong> {{ selectedTimesheet.rejectionReason }}
                </div>
              </div>
              
              <div v-if="selectedTimesheet.status === 'approved'" class="mt-3">
                <div class="alert alert-success">
                  <strong>Approved</strong> - This timesheet has been approved and is ready for processing.
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <div v-if="selectedTimesheet && selectedTimesheet.status === 'pending'">
                <button 
                  class="btn btn-success me-2"
                  @click="approveTimesheet(selectedTimesheet.id)"
                  data-bs-dismiss="modal">
                  <i class="bi bi-check-circle"></i> Approve
                </button>
                <button 
                  class="btn btn-danger"
                  @click="openRejectModal(selectedTimesheet)"
                  data-bs-toggle="modal"
                  data-bs-target="#rejectModal"
                  data-bs-dismiss="modal">
                  <i class="bi bi-x-circle"></i> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Employee Details Modal -->
      <div class="modal fade" id="employeeModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Employee Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="selectedEmployee">
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header">
                      <h5>Personal Information</h5>
                    </div>
                    <div class="card-body">
                      <p><strong>Name:</strong> {{ selectedEmployee.name }}</p>
                      <p><strong>Employee ID:</strong> {{ selectedEmployee.id }}</p>
                      <p><strong>Email:</strong> {{ selectedEmployee.email }}</p>
                      <p><strong>Department:</strong> {{ selectedEmployee.department }}</p>
                      <p><strong>Position:</strong> {{ selectedEmployee.position }}</p>
                      <p><strong>Hire Date:</strong> {{ formatDate(selectedEmployee.hireDate) }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header">
                      <h5>Timesheet Summary</h5>
                    </div>
                    <div class="card-body">
                      <div class="d-flex justify-content-between mb-2">
                        <span>Total Timesheets:</span>
                        <strong>{{ selectedEmployee.timesheets.length }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Pending:</span>
                        <strong>{{ selectedEmployee.timesheets.filter(t => t.status === 'pending').length }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Approved:</span>
                        <strong>{{ selectedEmployee.timesheets.filter(t => t.status === 'approved').length }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Rejected:</span>
                        <strong>{{ selectedEmployee.timesheets.filter(t => t.status === 'rejected').length }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Total Hours (All Time):</span>
                        <strong>{{ getTotalEmployeeHours(selectedEmployee) }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h6>Recent Timesheets</h6>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="timesheet in selectedEmployee.timesheets.slice(0, 5)" :key="timesheet.id">
                    <td>{{ timesheet.startDate }} to {{ timesheet.endDate }}</td>
                    <td>{{ getTotalHours(timesheet) }}</td>
                    <td>
                      <span :class="'badge ' + getStatusClass(timesheet.status)">
                        {{ timesheet.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" 
                              @click="viewTimesheetDetails(timesheet)"
                              data-bs-toggle="modal"
                              data-bs-target="#detailsModal"
                              data-bs-dismiss="modal">
                        <i class="bi bi-eye"></i> View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      pendingTimesheets: [],
      allTimesheets: [],
      selectedTimesheet: null,
      rejectionReason: '',
      message: '',
      messageType: '',
      activeTab: 'pending',
      searchQuery: '',
      statusFilter: 'all',
      selectedEmployee: null,
      employeeStats: {}
    };
  },
  computed: {
    filteredTimesheets() {
      let filtered = [...this.allTimesheets];
      
      // Apply status filter
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === this.statusFilter);
      }
      
      // Apply search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
          t.employeeId.toString().includes(query) || 
          this.getEmployeeName(t.employeeId).toLowerCase().includes(query) ||
          t.startDate.includes(query) || 
          t.endDate.includes(query)
        );
      }
      
      return filtered;
    },
    uniqueEmployees() {
      const uniqueIds = [...new Set(this.allTimesheets.map(t => t.employeeId))];
      return uniqueIds.map(id => {
        const user = users.find(u => u.id === id);
        return {
          id,
          name: user ? user.username : `Employee ${id}`,
          department: user ? user.department : 'Unknown',
          position: user ? user.position : 'Unknown',
          email: user ? user.email : `employee${id}@company.com`,
          hireDate: user ? user.hireDate : '2024-01-01',
          timesheets: this.allTimesheets.filter(t => t.employeeId === id)
        };
      });
    },
    filteredEmployees() {
      let filtered = [...this.uniqueEmployees];
      
      // Apply search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(e => 
          e.name.toLowerCase().includes(query) || 
          e.id.toString().includes(query) ||
          e.department.toLowerCase().includes(query) ||
          e.position.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    }
  },
  methods: {
    getEmployeeName(employeeId) {
      const employee = users.find(u => u.id === employeeId);
      return employee ? employee.username : `Employee ${employeeId}`;
    },
    loadTimesheets() {
      this.pendingTimesheets = timesheets.filter(t => t.status === 'pending');
      this.allTimesheets = [...timesheets];
    },
    getTotalHours(timesheet) {
      return timesheet.entries.reduce((sum, entry) => sum + entry.hours, 0);
    },
    approveTimesheet(timesheetId) {
      const index = timesheets.findIndex(t => t.id === timesheetId);
      if (index >= 0) {
        timesheets[index].status = 'approved';
        saveTimesheets();
        this.loadTimesheets();
        this.message = 'Timesheet approved successfully!';
        this.messageType = 'success';
      }
    },
    openRejectModal(timesheet) {
      this.selectedTimesheet = timesheet;
      this.rejectionReason = '';
    },
    rejectTimesheet() {
      if (!this.rejectionReason.trim()) {
        this.message = 'Please provide a reason for rejection.';
        this.messageType = 'danger';
        return;
      }
      
      const index = timesheets.findIndex(t => t.id === this.selectedTimesheet.id);
      if (index >= 0) {
        timesheets[index].status = 'rejected';
        timesheets[index].rejectionReason = this.rejectionReason;
        saveTimesheets();
        this.loadTimesheets();
        this.message = 'Timesheet rejected.';
        this.messageType = 'success';
      }
    },
    viewTimesheetDetails(timesheet) {
      this.selectedTimesheet = timesheet;
    },
    viewEmployeeDetails(employee) {
      this.selectedEmployee = employee;
    },
    getTotalEmployeeHours(employee) {
      return employee.timesheets.reduce((total, timesheet) => {
        return total + this.getTotalHours(timesheet);
      }, 0);
    },
    formatDate(date) {
      return formatDate(date);
    },
    getStatusClass(status) {
      return status === 'approved' ? 'bg-success' : 
             status === 'rejected' ? 'bg-danger' : 'bg-warning';
    },
    getApprovedCount() {
      return this.allTimesheets.filter(t => t.status === 'approved').length;
    },
    getRejectedCount() {
      return this.allTimesheets.filter(t => t.status === 'rejected').length;
    },
    getTotalEmployees() {
      const uniqueEmployeeIds = new Set(this.allTimesheets.map(t => t.employeeId));
      return uniqueEmployeeIds.size;
    }
  }
});