# Hourly Timesheet UI - Hackathon Guide

A 4-hour hackathon project utilizing Amazon Q to create a simple timesheet UI for hourly employees.

## Project Overview

This project aims to create a simple timesheet UI with role-based access:

- **Employees** can enter time on a biweekly basis
- **Managers** can approve or reject employee time entries
- System integrates company holidays (no time entry allowed on holidays)

## 4-Hour Hackathon Approach (Using Vue.js)

### Hour 1: Setup & Planning (0:00-1:00)

1. **Project Setup (20 min)**
   - Create basic HTML structure with Vue.js CDN
   - Set up CSS file with minimal styling
   - Create mock data files

2. **Data Modeling (20 min)**
   - Define user roles and sample users
   - Create timesheet data structure
   - Define company holidays list

3. **UI Wireframing (20 min)**
   - Sketch login screen
   - Plan employee and manager dashboards

### Hour 2: Authentication & Navigation (1:00-2:00)

1. **Authentication System (30 min)**
   - Create login form
   - Implement role-based view switching
   - Store user session in localStorage

2. **Navigation Structure (30 min)**
   - Create navigation menu
   - Implement conditional rendering based on role
   - Build basic dashboard layouts

### Hour 3: Employee Features (2:00-3:00)

1. **Calendar Component (30 min)**
   - Create biweekly calendar view
   - Implement holiday highlighting
   - Add date selection functionality

2. **Time Entry Form (30 min)**
   - Build hours input form
   - Add validation for time entries
   - Implement save functionality

### Hour 4: Manager Features & Finalization (3:00-4:00)

1. **Manager Approval Interface (30 min)**
   - Create timesheet review list
   - Add approve/reject buttons
   - Implement feedback mechanism

2. **Final Integration & Testing (30 min)**
   - Connect all components
   - Test user flows
   - Fix critical bugs

## Project Structure

```
/timesheet-app
  index.html
  /css
    styles.css
  /js
    app.js
    mock-data.js
    components.js
```

## Implementation Tips

### Keep It Simple

1. **Use Vue.js via CDN**
   - No build tools needed
   - Quick to implement

2. **Mock Data**
   - Use JavaScript objects for data
   - Store in localStorage for persistence

3. **Minimal Styling**
   - Use simple CSS or a CSS framework via CDN
   - Focus on functionality over appearance

## Presentation Strategy

Demonstrate:
1. Login as employee and enter time
2. Show holiday restrictions
3. Login as manager and approve/reject time
4. Highlight the role-based access control