# Timesheet Portal

A modern web application for tracking and managing employee work hours, replacing manual Google Sheets tracking for hourly paid employees.

## Project Background

This application was developed during a company-wide hackathon focused on leveraging Amazon Q for AI-assisted development. The 4-hour challenge encouraged participants to explore how AI tools could accelerate development workflows and enhance productivity.

## Key Features

### For Employees
- **Time Entry**: Log working hours on a biweekly basis through an intuitive calendar interface
- **Holiday Integration**: Automatic display of company holidays with time entry restrictions
- **Progress Tracking**: Visual progress bars showing completion toward biweekly hour targets
- **Submission History**: View past timesheet submissions and their approval status

### For Managers
- **Approval Dashboard**: Review pending timesheet submissions from all employees
- **Feedback System**: Provide rejection reasons when timesheet entries need correction
- **Employee Overview**: View employee statistics and submission history
- **Status Tracking**: Monitor approved, rejected, and pending timesheets

## Technology Stack

- **Frontend Framework**: Vue.js (via CDN)
- **UI Components**: Bootstrap 5
- **Styling**: Custom CSS with variables for theming
- **Icons**: Bootstrap Icons
- **Data Storage**: Client-side localStorage (for prototype)
- **Development Tools**: Amazon Q for AI-assisted development

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Login with sample credentials:
   - Employee: username `Sophia`, password `pass`
   - Employee: username `employee2`, password `pass`
   - Manager: username `manager`, password `pass`

## Future Enhancements

- Data export functionality (CSV, PDF)
- Notification system for pending approvals
- Reporting features for managers
- Integration with payroll systems