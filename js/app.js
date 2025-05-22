// Main Vue application

new Vue({
  el: '#app',
  data: {
    currentUser: null
  },
  created() {
    // Check for saved session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  },
  template: `
    <div class="container-fluid mt-4">
      <div v-if="!currentUser" class="login-container">
        <app-title></app-title>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <login-form @login-success="onLoginSuccess"></login-form>
          </div>
        </div>
      </div>
      
      <div v-else>
        <nav class="navbar navbar-expand-lg mb-4 custom-navbar">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              <i class="bi bi-clock-history"></i> Timesheet Portal
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto">
                <!-- Dashboard link removed -->
              </ul>
              <span class="navbar-text me-3">
                <i class="bi bi-person-circle"></i> 
                Logged in as: <strong>{{ currentUser.username }}</strong> 
                <span class="badge role-badge">{{ currentUser.role }}</span>
              </span>
              <button class="btn btn-primary" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          </div>
        </nav>
        
        <div class="content-wrapper px-3">
          <employee-dashboard v-if="currentUser.role === 'employee'" :user="currentUser"></employee-dashboard>
          <manager-dashboard v-else-if="currentUser.role === 'manager'" :user="currentUser"></manager-dashboard>
        </div>
      </div>
    </div>
  `,
  methods: {
    onLoginSuccess(user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
    },
    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    }
  }
});