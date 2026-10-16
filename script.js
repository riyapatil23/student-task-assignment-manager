/**
 * ============================================================================
 * STUDENT TASK & ASSIGNMENT MANAGER
 * Client-Side Application Logic & State Management
 * 
 * NOTE FOR JAVA BACKEND INTEGRATION (Phase 2 Roadmap):
 * ----------------------------------------------------------------------------
 * Currently, data is stored in the browser's `localStorage` via `StorageService`.
 * In Phase 2, this service will be adapted to execute asynchronous HTTP fetch
 * requests targeting a Java Spring Boot REST API controller:
 * 
 *   Frontend Action        -> Future Spring Boot REST Endpoint
 *   -------------------------------------------------------------------------
 *   StorageService.getAll()   -> GET    /api/assignments
 *   StorageService.getById()  -> GET    /api/assignments/{id}
 *   StorageService.create()   -> POST   /api/assignments
 *   StorageService.update()   -> PUT    /api/assignments/{id}
 *   StorageService.delete()   -> DELETE /api/assignments/{id}
 *   StorageService.toggle()   -> PATCH  /api/assignments/{id}/status
 * ============================================================================
 */

// Strict mode for cleaner code and prevention of accidental global variables
'use strict';

/* ============================================================================
   1. STORAGE & REPOSITORY LAYER (LocalStorage abstraction)
   ============================================================================ */



const StorageService = {
  STORAGE_KEY: 'campus_task_assignments_v1',

  /**
   * Default sample data for 3rd Year B.Tech IT students
   * Generates dynamic dates relative to today so overdue/upcoming states are always fresh!
   */
  getDefaultData() {
    const today = new Date();

    // Helper to format Date as YYYY-MM-DD
    const formatDate = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Helper to add/subtract days
    const shiftDays = (days) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return formatDate(d);
    };

    return [
      {
        id: 'task-1',
        title: 'SQL Normalization & B+ Tree Indexing Mini-Project',
        subject: 'Database Management Systems',
        description: 'Design 3NF relational schema for college placement portal. Submit ER diagram, schema normalization steps, and explain execution plans with B+ tree indexes.',
        dueDate: shiftDays(3), // Due in 3 days
        priority: 'High',
        status: 'Pending',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'task-2',
        title: 'Binary Search Tree & Graph BFS/DFS Implementation',
        subject: 'Data Structures & Algorithms',
        description: 'Implement BFS and DFS graph traversals in Java. Include unit test cases checking disconnected components and cycle detection with time complexities.',
        dueDate: shiftDays(5), // Due in 5 days
        priority: 'Medium',
        status: 'Pending',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'task-3',
        title: 'Process Synchronization & Mutex Semaphore Lab',
        subject: 'Operating Systems',
        description: 'Solve the classical Dining Philosophers problem avoiding deadlocks using counting semaphores and mutex locks in Java / C.',
        dueDate: shiftDays(-2), // 2 days ago -> Overdue!
        priority: 'High',
        status: 'Pending',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'task-4',
        title: 'TCP/IP Multi-Threaded Socket Client-Server App',
        subject: 'Computer Networks',
        description: 'Create a multi-client chat daemon using Java ServerSocket, thread pools, and input/output stream buffers.',
        dueDate: shiftDays(-1), // Completed yesterday
        priority: 'Medium',
        status: 'Completed',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'task-5',
        title: 'Software Requirement Specification (SRS) & UML Diagram',
        subject: 'Software Engineering',
        description: 'Write IEEE 830 compliant SRS document. Construct UML Use Case, Class, and Sequence diagrams for the automated grading module.',
        dueDate: shiftDays(8), // Due in 8 days
        priority: 'Low',
        status: 'Pending',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'task-6',
        title: 'Java Exception Handling & Collections Framework Assignment',
        subject: 'Java Programming',
        description: 'Build a custom banking transaction system demonstrating custom checked exceptions, HashMap, ArrayList, and Comparable/Comparator sorting.',
        dueDate: shiftDays(-4), // 4 days ago -> Completed
        priority: 'High',
        status: 'Completed',
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  },

  /**
   * Retrieve all assignments from localStorage
   * (In Phase 2: Will be `await fetch('/api/assignments').then(r => r.json())`)
   */
  getAll() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        const defaults = this.getDefaultData();
        this.saveAll(defaults);
        return defaults;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return [];
    }
  },

  /**
   * Persist full array of assignments to localStorage
   */
  saveAll(assignments) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assignments));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  },

  /**
   * Get single assignment by ID
   * (In Phase 2: Will be `await fetch('/api/assignments/' + id)`)
   */
  getById(id) {
    const list = this.getAll();
    return list.find(item => item.id === id) || null;
  },

  /**
   * Create new assignment
   * (In Phase 2: Will be `await fetch('/api/assignments', { method: 'POST', body: ... })`)
   */
  create(assignmentData) {
    const list = this.getAll();
    const newAssignment = {
      ...assignmentData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newAssignment);
    this.saveAll(list);
    return newAssignment;
  },

  /**
   * Update existing assignment
   * (In Phase 2: Will be `await fetch('/api/assignments/' + id, { method: 'PUT', body: ... })`)
   */
  update(id, updatedFields) {
    const list = this.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    this.saveAll(list);
    return list[index];
  },

  /**
   * Delete assignment by ID
   * (In Phase 2: Will be `await fetch('/api/assignments/' + id, { method: 'DELETE' })`)
   */
  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(item => item.id !== id);
    this.saveAll(filtered);
    return true;
  },

  /**
   * Toggle completed/pending status
   */
  toggleStatus(id) {
    const assignment = this.getById(id);
    if (!assignment) return null;
    const newStatus = assignment.status === 'Completed' ? 'Pending' : 'Completed';
    return this.update(id, { status: newStatus });
  }
};

/* ============================================================================
   2. DATE & STATUS UTILITIES
   ============================================================================ */
const DateUtils = {
  /**
   * Checks if an assignment is overdue.
   * An assignment is overdue if status is NOT 'Completed' and its due date has passed.
   */
  isOverdue(dueDateStr, status) {
    if (status === 'Completed') return false;
    if (!dueDateStr) return false;

    // Due date considered active until 23:59:59 of that day local time
    const dueTime = new Date(`${dueDateStr}T23:59:59`).getTime();
    const now = Date.now();
    return dueTime < now;
  },

  /**
   * Formats date string into human-friendly format (e.g., "Oct 18, 2026")
   */
  formatFriendly(dateStr) {
    if (!dateStr) return 'No due date';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, parseInt(month, 10) - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  },

  /**
   * Calculates difference in days from today and returns human readable badge
   */
  getRelativeDueInfo(dueDateStr, status) {
    if (status === 'Completed') {
      return { text: 'Completed', className: 'status-completed' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dueDateStr.split('-');
    const dueDate = new Date(year, parseInt(month, 10) - 1, day);
    dueDate.setHours(0, 0, 0, 0);

    const diffMs = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        text: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
        className: 'due-countdown-urgent',
        isOverdue: true
      };
    } else if (diffDays === 0) {
      return { text: 'Due Today', className: 'due-countdown-urgent', isUrgent: true };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', className: 'due-countdown-warning', isWarning: true };
    } else if (diffDays <= 4) {
      return { text: `Due in ${diffDays} days`, className: 'due-countdown-warning' };
    } else {
      return { text: `Due in ${diffDays} days`, className: 'due-countdown-normal' };
    }
  }
};

/* ============================================================================
   3. TOAST NOTIFICATION SERVICE
   ============================================================================ */
const Toast = {
  container: document.getElementById('toast-container'),

  show(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Icon based on type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span class="toast-msg">${message}</span>
    `;

    this.container.appendChild(toast);

    // Auto dismiss after 3.2 seconds
    setTimeout(() => {
      toast.classList.add('toast-closing');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3200);
  }
};

/* ============================================================================
   4. APPLICATION STATE & DOM CONTROLLERS
   ============================================================================ */
const AppState = {
  currentView: 'dashboard', // 'dashboard' or 'assignments'
  filterStatus: 'ALL',      // 'ALL', 'Pending', 'Completed', 'Overdue'
  filterSubject: 'ALL',     // 'ALL' or specific subject string
  searchQuery: '',
  sortBy: 'due-asc',        // 'due-asc', 'due-desc', 'title-asc', 'title-desc'
  pendingDeleteId: null     // ID of assignment to delete upon confirmation
};

// DOM Element References Cache
const DOM = {
  // Navigation & Shell
  sidebar: document.getElementById('sidebar'),
  sidebarBackdrop: document.getElementById('sidebar-backdrop'),
  mobileHamburger: document.getElementById('mobile-hamburger'),
  mobileCloseBtn: document.getElementById('mobile-sidebar-close'),
  topbarTitle: document.getElementById('topbar-view-title'),
  currentDateDisplay: document.getElementById('current-date-display'),

  // Views
  viewDashboard: document.getElementById('view-dashboard'),
  viewAssignments: document.getElementById('view-assignments'),
  navDashboard: document.getElementById('nav-dashboard'),
  navAssignments: document.getElementById('nav-assignments'),
  filterNavButtons: document.querySelectorAll('.filter-nav-btn'),

  // Nav Counters
  navTotalCount: document.getElementById('nav-total-count'),
  navPendingCount: document.getElementById('nav-pending-count'),
  navCompletedCount: document.getElementById('nav-completed-count'),
  navOverdueCount: document.getElementById('nav-overdue-count'),

  // Dashboard Stats
  statTotal: document.getElementById('stat-total'),
  statPending: document.getElementById('stat-pending'),
  statCompleted: document.getElementById('stat-completed'),
  statOverdue: document.getElementById('stat-overdue'),
  statCompletionRate: document.getElementById('stat-completion-rate'),
  progressPercentLabel: document.getElementById('progress-percent-label'),
  progressFillBar: document.getElementById('progress-fill-bar'),
  progressTrack: document.getElementById('progress-track'),
  dashboardUpcomingList: document.getElementById('dashboard-upcoming-list'),
  dashboardRecentList: document.getElementById('dashboard-recent-list'),
  dashboardViewAllBtn: document.getElementById('dashboard-view-all-btn'),

  // Assignment List Controls
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  filterStatus: document.getElementById('filter-status'),
  filterSubject: document.getElementById('filter-subject'),
  sortSelect: document.getElementById('sort-select'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  resultsCount: document.getElementById('results-count'),
  assignmentsGrid: document.getElementById('assignments-grid'),
  emptyState: document.getElementById('empty-state'),
  emptyClearBtn: document.getElementById('empty-clear-btn'),
  emptyCreateBtn: document.getElementById('empty-create-btn'),

  // Buttons to trigger Add modal
  sidebarAddBtn: document.getElementById('sidebar-add-btn'),
  topbarAddBtn: document.getElementById('topbar-add-btn'),
  assignmentsAddBtn: document.getElementById('assignments-add-btn'),

  // Assignment Modal & Form
  assignmentModal: document.getElementById('assignment-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalCancelBtn: document.getElementById('modal-cancel-btn'),
  assignmentForm: document.getElementById('assignment-form'),
  formAssignmentId: document.getElementById('form-assignment-id'),
  formTitle: document.getElementById('form-title'),
  formSubject: document.getElementById('form-subject'),
  customSubjectWrap: document.getElementById('custom-subject-wrap'),
  formCustomSubject: document.getElementById('form-custom-subject'),
  formDescription: document.getElementById('form-description'),
  descCharCount: document.getElementById('desc-char-count'),
  formDueDate: document.getElementById('form-due-date'),
  formStatus: document.getElementById('form-status'),
  submitBtnLabel: document.getElementById('submit-btn-label'),

  // Form Validation Errors
  errorTitle: document.getElementById('error-title'),
  errorSubject: document.getElementById('error-subject'),
  errorDueDate: document.getElementById('error-due-date'),
  errorStatus: document.getElementById('error-status'),

  // Delete Confirm Modal
  confirmModal: document.getElementById('confirm-modal'),
  confirmItemName: document.getElementById('confirm-item-name'),
  confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
  confirmDeleteBtn: document.getElementById('confirm-delete-btn')
};

/* ============================================================================
   5. VIEW SWITCHING & NAVIGATION
   ============================================================================ */
function switchView(viewName) {
  AppState.currentView = viewName;

  if (viewName === 'dashboard') {
    DOM.viewDashboard.classList.add('active');
    DOM.viewAssignments.classList.remove('active');

    DOM.navDashboard.classList.add('active');
    DOM.navAssignments.classList.remove('active');
    DOM.topbarTitle.textContent = 'Dashboard';
  } else {
    DOM.viewDashboard.classList.remove('active');
    DOM.viewAssignments.classList.add('active');

    DOM.navDashboard.classList.remove('active');
    DOM.navAssignments.classList.add('active');
    DOM.topbarTitle.textContent = 'All Assignments';
  }

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Refresh data view
  renderApp();
}

function openMobileSidebar() {
  DOM.sidebar.classList.add('mobile-open');
  DOM.sidebarBackdrop.classList.add('mobile-open');
}

function closeMobileSidebar() {
  DOM.sidebar.classList.remove('mobile-open');
  DOM.sidebarBackdrop.classList.remove('mobile-open');
}

/* ============================================================================
   6. METRICS & COUNTERS CALCULATION
   ============================================================================ */
function calculateMetrics(assignments) {
  const total = assignments.length;
  let completed = 0;
  let pending = 0;
  let overdue = 0;

  assignments.forEach(item => {
    if (item.status === 'Completed') {
      completed++;
    } else {
      pending++;
      if (DateUtils.isOverdue(item.dueDate, item.status)) {
        overdue++;
      }
    }
  });

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, pending, completed, overdue, completionRate };
}

function updateCountersAndStats(assignments) {
  const metrics = calculateMetrics(assignments);

  // Sidebar counters
  DOM.navTotalCount.textContent = metrics.total;
  DOM.navPendingCount.textContent = metrics.pending;
  DOM.navCompletedCount.textContent = metrics.completed;
  DOM.navOverdueCount.textContent = metrics.overdue;

  // Dashboard Stat Cards
  DOM.statTotal.textContent = metrics.total;
  DOM.statPending.textContent = metrics.pending;
  DOM.statCompleted.textContent = metrics.completed;
  DOM.statOverdue.textContent = metrics.overdue;

  DOM.statCompletionRate.textContent = `${metrics.completionRate}% completed`;
  DOM.progressPercentLabel.textContent = `${metrics.completionRate}%`;
  DOM.progressFillBar.style.width = `${metrics.completionRate}%`;
  DOM.progressTrack.setAttribute('aria-valuenow', metrics.completionRate);
}

/* ============================================================================
   7. DASHBOARD WIDGET RENDERING
   ============================================================================ */
function renderDashboardWidgets(assignments) {
  // 1. Upcoming Deadlines Widget:
  // Filter pending items, sort by due date ascending, take first 4
  const pendingTasks = assignments
    .filter(a => a.status === 'Pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  DOM.dashboardUpcomingList.innerHTML = '';
  if (pendingTasks.length === 0) {
    DOM.dashboardUpcomingList.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--navy-500); font-size: 0.85rem;">
        🎉 Awesome! You have no pending deadlines right now.
      </div>
    `;
  } else {
    pendingTasks.forEach(task => {
      const countdown = DateUtils.getRelativeDueInfo(task.dueDate, task.status);
      const isOverdue = DateUtils.isOverdue(task.dueDate, task.status);

      const itemEl = document.createElement('div');
      itemEl.className = 'widget-item';
      itemEl.innerHTML = `
        <div class="widget-item-info">
          <span class="widget-item-title" title="${escapeHtml(task.title)}">${escapeHtml(task.title)}</span>
          <span class="widget-item-subject">${escapeHtml(task.subject)}</span>
        </div>
        <div class="widget-item-meta">
          <span class="due-countdown-tag ${countdown.className}">
            ${countdown.text}
          </span>
          <button class="icon-btn btn-view" title="Jump to assignment" data-action="view-task" data-id="${task.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"></path>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      `;
      DOM.dashboardUpcomingList.appendChild(itemEl);
    });
  }

  // 2. Recent Assignments Widget:
  // Sort by updatedAt/createdAt descending, take first 4
  const recentTasks = [...assignments]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 4);

  DOM.dashboardRecentList.innerHTML = '';
  if (recentTasks.length === 0) {
    DOM.dashboardRecentList.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--navy-500); font-size: 0.85rem;">
        No assignments yet. Click "+ New Assignment" to add one!
      </div>
    `;
  } else {
    recentTasks.forEach(task => {
      const isDone = task.status === 'Completed';
      const itemEl = document.createElement('div');
      itemEl.className = 'widget-item';
      itemEl.innerHTML = `
        <div class="widget-item-info">
          <span class="widget-item-title ${isDone ? 'style-completed-text' : ''}" title="${escapeHtml(task.title)}">
            ${escapeHtml(task.title)}
          </span>
          <span class="widget-item-subject">${escapeHtml(task.subject)} • Due ${DateUtils.formatFriendly(task.dueDate)}</span>
        </div>
        <div class="widget-item-meta">
          <button class="toggle-status-btn" data-action="toggle-status" data-id="${task.id}" title="Toggle status">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${isDone
          ? '<polyline points="20 6 9 17 4 12"></polyline>'
          : '<circle cx="12" cy="12" r="10"></circle>'}
            </svg>
            <span>${isDone ? 'Done' : 'Mark Done'}</span>
          </button>
        </div>
      `;
      DOM.dashboardRecentList.appendChild(itemEl);
    });
  }
}

/* ============================================================================
   8. ASSIGNMENT MANAGEMENT LIST RENDERING
   ============================================================================ */
function populateSubjectDropdown(assignments) {
  const currentVal = DOM.filterSubject.value;

  // Collect distinct subjects
  const standardSubjects = [
    'Database Management Systems',
    'Data Structures & Algorithms',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Java Programming',
    'Web Technologies'
  ];

  const subjectSet = new Set(standardSubjects);
  assignments.forEach(a => {
    if (a.subject) subjectSet.add(a.subject);
  });

  // Rebuild select options
  DOM.filterSubject.innerHTML = '<option value="ALL">All Subjects</option>';
  Array.from(subjectSet).sort().forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    DOM.filterSubject.appendChild(opt);
  });

  // Preserve user selection if valid
  if (Array.from(subjectSet).includes(currentVal)) {
    DOM.filterSubject.value = currentVal;
  } else {
    DOM.filterSubject.value = 'ALL';
  }
}

function getFilteredAndSortedAssignments(assignments) {
  return assignments.filter(item => {
    // 1. Search Query filter (Title or Description)
    if (AppState.searchQuery.trim() !== '') {
      const q = AppState.searchQuery.toLowerCase();
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q);
      const subjectMatch = (item.subject || '').toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !subjectMatch) {
        return false;
      }
    }

    // 2. Status filter ('ALL', 'Pending', 'Completed', 'Overdue')
    if (AppState.filterStatus === 'Pending') {
      if (item.status !== 'Pending') return false;
    } else if (AppState.filterStatus === 'Completed') {
      if (item.status !== 'Completed') return false;
    } else if (AppState.filterStatus === 'Overdue') {
      if (!DateUtils.isOverdue(item.dueDate, item.status)) return false;
    }

    // 3. Subject filter
    if (AppState.filterSubject !== 'ALL') {
      if (item.subject !== AppState.filterSubject) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sorting logic
    if (AppState.sortBy === 'due-asc') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (AppState.sortBy === 'due-desc') {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    } else if (AppState.sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (AppState.sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });
}

function renderAssignmentsGrid(filteredList, totalListCount) {
  DOM.assignmentsGrid.innerHTML = '';

  // Update results count indicator
  if (filteredList.length === totalListCount) {
    DOM.resultsCount.textContent = `Showing all ${totalListCount} assignments`;
  } else {
    DOM.resultsCount.textContent = `Showing ${filteredList.length} of ${totalListCount} assignments`;
  }

  // Handle empty state
  if (filteredList.length === 0) {
    DOM.emptyState.classList.remove('hidden');
    if (totalListCount === 0) {
      document.getElementById('empty-title').textContent = 'No assignments created yet';
      document.getElementById('empty-desc').textContent = 'Get started by creating your first academic assignment or homework task.';
      DOM.emptyClearBtn.classList.add('hidden');
    } else {
      document.getElementById('empty-title').textContent = 'No matching assignments found';
      document.getElementById('empty-desc').textContent = 'No tasks matched your current search and filter combination. Try adjusting your filters.';
      DOM.emptyClearBtn.classList.remove('hidden');
    }
    return;
  }

  DOM.emptyState.classList.add('hidden');

  // Render cards
  filteredList.forEach(assignment => {
    const isCompleted = assignment.status === 'Completed';
    const isOverdue = DateUtils.isOverdue(assignment.dueDate, assignment.status);
    const relativeInfo = DateUtils.getRelativeDueInfo(assignment.dueDate, assignment.status);

    // Determine status badge display
    let statusBadgeHtml = '';
    if (isCompleted) {
      statusBadgeHtml = `<span class="status-badge status-completed">Completed</span>`;
    } else if (isOverdue) {
      statusBadgeHtml = `<span class="status-badge status-overdue">⚠️ Overdue</span>`;
    } else {
      statusBadgeHtml = `<span class="status-badge status-pending">Pending</span>`;
    }

    // Determine priority badge class
    const priorityClass = `priority-${(assignment.priority || 'medium').toLowerCase()}`;

    const card = document.createElement('article');
    card.className = `assignment-card ${isOverdue ? 'is-overdue' : ''} ${isCompleted ? 'is-completed' : ''}`;
    card.setAttribute('data-id', assignment.id);

    card.innerHTML = `
      <div class="card-top">
        <span class="subject-badge" title="${escapeHtml(assignment.subject)}">${escapeHtml(assignment.subject)}</span>
        <span class="priority-badge ${priorityClass}">${escapeHtml(assignment.priority || 'Medium')}</span>
      </div>

      <h2 class="card-title">${escapeHtml(assignment.title)}</h2>

      <p class="card-desc">${assignment.description ? escapeHtml(assignment.description) : '<em style="color: var(--navy-400);">No description provided.</em>'}</p>

      <div class="card-meta-row">
        <div class="due-info ${isOverdue ? 'due-overdue' : ''}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${DateUtils.formatFriendly(assignment.dueDate)}</span>
          <span style="font-weight: 500; font-size: 0.725rem; color: var(--navy-500);">(${relativeInfo.text})</span>
        </div>
        ${statusBadgeHtml}
      </div>

      <div class="card-actions-row">
        <button class="toggle-status-btn" data-action="toggle-status" data-id="${assignment.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${isCompleted
        ? '<polyline points="20 6 9 17 4 12"></polyline>'
        : '<circle cx="12" cy="12" r="10"></circle>'}
          </svg>
          <span>${isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
        </button>

        <div class="card-action-icons">
          <button class="icon-btn btn-edit" title="Edit assignment" data-action="edit" data-id="${assignment.id}" aria-label="Edit ${escapeHtml(assignment.title)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="icon-btn btn-delete" title="Delete assignment" data-action="delete" data-id="${assignment.id}" aria-label="Delete ${escapeHtml(assignment.title)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    DOM.assignmentsGrid.appendChild(card);
  });
}

/* ============================================================================
   9. OVERALL APP RENDER CYCLE
   ============================================================================ */
function renderApp() {
  const allAssignments = StorageService.getAll();

  // 1. Update stats & counters
  updateCountersAndStats(allAssignments);

  // 2. If in Dashboard view, render dashboard widgets
  if (AppState.currentView === 'dashboard') {
    renderDashboardWidgets(allAssignments);
  }

  // 3. Populate subject filter dropdown options
  populateSubjectDropdown(allAssignments);

  // 4. Filter, sort, and render assignments grid
  const filtered = getFilteredAndSortedAssignments(allAssignments);
  renderAssignmentsGrid(filtered, allAssignments.length);
}

/* ============================================================================
   10. MODAL HANDLING: ADD / EDIT ASSIGNMENT
   ============================================================================ */
function openAddModal() {
  resetFormErrors();
  DOM.assignmentForm.reset();
  DOM.formAssignmentId.value = '';
  DOM.modalTitle.textContent = 'Add New Assignment';
  DOM.submitBtnLabel.textContent = 'Save Assignment';
  DOM.descCharCount.textContent = '0/300';
  DOM.customSubjectWrap.classList.add('hidden');
  DOM.formCustomSubject.required = false;

  // Default due date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  DOM.formDueDate.value = `${year}-${month}-${day}`;

  DOM.formStatus.value = 'Pending';
  const defaultPriorityRadio = DOM.assignmentForm.querySelector('input[name="priority"][value="Medium"]');
  if (defaultPriorityRadio) defaultPriorityRadio.checked = true;

  DOM.assignmentModal.showModal();
}

function openEditModal(id) {
  const assignment = StorageService.getById(id);
  if (!assignment) {
    Toast.show('Assignment not found.', 'danger');
    return;
  }

  resetFormErrors();
  DOM.formAssignmentId.value = assignment.id;
  DOM.modalTitle.textContent = 'Edit Assignment';
  DOM.submitBtnLabel.textContent = 'Update Assignment';

  DOM.formTitle.value = assignment.title || '';
  DOM.formDescription.value = assignment.description || '';
  DOM.descCharCount.textContent = `${(assignment.description || '').length}/300`;
  DOM.formDueDate.value = assignment.dueDate || '';
  DOM.formStatus.value = assignment.status || 'Pending';

  // Handle subject dropdown vs custom
  const options = Array.from(DOM.formSubject.options).map(o => o.value);
  if (options.includes(assignment.subject)) {
    DOM.formSubject.value = assignment.subject;
    DOM.customSubjectWrap.classList.add('hidden');
    DOM.formCustomSubject.value = '';
    DOM.formCustomSubject.required = false;
  } else {
    DOM.formSubject.value = 'CUSTOM';
    DOM.customSubjectWrap.classList.remove('hidden');
    DOM.formCustomSubject.value = assignment.subject;
    DOM.formCustomSubject.required = true;
  }

  // Handle priority radio
  const priorityVal = assignment.priority || 'Medium';
  const targetRadio = DOM.assignmentForm.querySelector(`input[name="priority"][value="${priorityVal}"]`);
  if (targetRadio) targetRadio.checked = true;

  DOM.assignmentModal.showModal();
}

function closeAssignmentModal() {
  DOM.assignmentModal.close();
}

/* ============================================================================
   11. FORM VALIDATION & SUBMISSION
   ============================================================================ */
function resetFormErrors() {
  DOM.errorTitle.textContent = '';
  DOM.errorSubject.textContent = '';
  DOM.errorDueDate.textContent = '';
  DOM.errorStatus.textContent = '';

  DOM.formTitle.classList.remove('is-invalid');
  DOM.formSubject.classList.remove('is-invalid');
  DOM.formCustomSubject.classList.remove('is-invalid');
  DOM.formDueDate.classList.remove('is-invalid');
  DOM.formStatus.classList.remove('is-invalid');
}

function validateAssignmentForm() {
  resetFormErrors();
  let isValid = true;

  // Title validation
  const title = DOM.formTitle.value.trim();
  if (!title) {
    DOM.errorTitle.textContent = 'Please enter an assignment title.';
    DOM.formTitle.classList.add('is-invalid');
    isValid = false;
  } else if (title.length < 3) {
    DOM.errorTitle.textContent = 'Title must be at least 3 characters long.';
    DOM.formTitle.classList.add('is-invalid');
    isValid = false;
  }

  // Subject validation
  const subjectVal = DOM.formSubject.value;
  if (!subjectVal) {
    DOM.errorSubject.textContent = 'Please select a subject or course.';
    DOM.formSubject.classList.add('is-invalid');
    isValid = false;
  } else if (subjectVal === 'CUSTOM') {
    const customSubject = DOM.formCustomSubject.value.trim();
    if (!customSubject) {
      DOM.errorSubject.textContent = 'Please enter the custom subject name.';
      DOM.formCustomSubject.classList.add('is-invalid');
      isValid = false;
    }
  }

  // Due Date validation
  const dueDate = DOM.formDueDate.value;
  if (!dueDate) {
    DOM.errorDueDate.textContent = 'Please select a due date for submission.';
    DOM.formDueDate.classList.add('is-invalid');
    isValid = false;
  }

  // Status validation
  const status = DOM.formStatus.value;
  if (!status) {
    DOM.errorStatus.textContent = 'Please choose a status (Pending or Completed).';
    DOM.formStatus.classList.add('is-invalid');
    isValid = false;
  }

  return isValid;
}

function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateAssignmentForm()) {
    Toast.show('Please fix the errors in the form.', 'warning');
    return;
  }

  const id = DOM.formAssignmentId.value;
  const isEditing = Boolean(id);

  // Determine final subject
  let subject = DOM.formSubject.value;
  if (subject === 'CUSTOM') {
    subject = DOM.formCustomSubject.value.trim();
  }

  const selectedPriorityRadio = DOM.assignmentForm.querySelector('input[name="priority"]:checked');
  const priority = selectedPriorityRadio ? selectedPriorityRadio.value : 'Medium';

  const assignmentPayload = {
    title: DOM.formTitle.value.trim(),
    subject: subject,
    description: DOM.formDescription.value.trim(),
    dueDate: DOM.formDueDate.value,
    priority: priority,
    status: DOM.formStatus.value
  };

  if (isEditing) {
    StorageService.update(id, assignmentPayload);
    Toast.show('Assignment updated successfully!', 'success');
  } else {
    StorageService.create(assignmentPayload);
    Toast.show('New assignment added to schedule!', 'success');
  }

  closeAssignmentModal();
  renderApp();
}

/* ============================================================================
   12. DELETE CONFIRMATION MODAL
   ============================================================================ */
function promptDelete(id) {
  const assignment = StorageService.getById(id);
  if (!assignment) return;

  AppState.pendingDeleteId = id;
  DOM.confirmItemName.textContent = `"${assignment.title}"`;
  DOM.confirmModal.showModal();
}

function executeDelete() {
  if (!AppState.pendingDeleteId) return;

  StorageService.delete(AppState.pendingDeleteId);
  Toast.show('Assignment deleted successfully.', 'danger');
  AppState.pendingDeleteId = null;
  DOM.confirmModal.close();
  renderApp();
}

/* ============================================================================
   13. EVENT LISTENERS SETUP
   ============================================================================ */
function initEventListeners() {
  // Navigation View Switching
  DOM.navDashboard.addEventListener('click', () => switchView('dashboard'));
  DOM.navAssignments.addEventListener('click', () => switchView('assignments'));
  DOM.dashboardViewAllBtn.addEventListener('click', () => switchView('assignments'));

  // Quick filter buttons in sidebar
  DOM.filterNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-filter-status');
      AppState.filterStatus = status;
      DOM.filterStatus.value = status;
      switchView('assignments');
    });
  });

  // Mobile drawer controls
  DOM.mobileHamburger.addEventListener('click', openMobileSidebar);
  DOM.mobileCloseBtn.addEventListener('click', closeMobileSidebar);
  DOM.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Add Assignment Modal Triggers
  DOM.sidebarAddBtn.addEventListener('click', openAddModal);
  DOM.topbarAddBtn.addEventListener('click', openAddModal);
  DOM.assignmentsAddBtn.addEventListener('click', openAddModal);
  DOM.emptyCreateBtn.addEventListener('click', openAddModal);

  // Modal Close buttons
  DOM.modalCloseBtn.addEventListener('click', closeAssignmentModal);
  DOM.modalCancelBtn.addEventListener('click', closeAssignmentModal);

  // Delete Confirmation Buttons
  DOM.confirmCancelBtn.addEventListener('click', () => DOM.confirmModal.close());
  DOM.confirmDeleteBtn.addEventListener('click', executeDelete);

  // Custom subject visibility toggle
  DOM.formSubject.addEventListener('change', (e) => {
    if (e.target.value === 'CUSTOM') {
      DOM.customSubjectWrap.classList.remove('hidden');
      DOM.formCustomSubject.focus();
    } else {
      DOM.customSubjectWrap.classList.add('hidden');
      DOM.formCustomSubject.value = '';
    }
  });

  // Description character counter
  DOM.formDescription.addEventListener('input', (e) => {
    DOM.descCharCount.textContent = `${e.target.value.length}/300`;
  });

  // Form submit
  DOM.assignmentForm.addEventListener('submit', handleFormSubmit);

  // Live input validation clear
  DOM.formTitle.addEventListener('input', () => {
    if (DOM.formTitle.value.trim().length >= 3) {
      DOM.formTitle.classList.remove('is-invalid');
      DOM.errorTitle.textContent = '';
    }
  });

  DOM.formDueDate.addEventListener('change', () => {
    if (DOM.formDueDate.value) {
      DOM.formDueDate.classList.remove('is-invalid');
      DOM.errorDueDate.textContent = '';
    }
  });

  // Search Input Handler (with debounced or immediate input)
  DOM.searchInput.addEventListener('input', (e) => {
    AppState.searchQuery = e.target.value;
    if (e.target.value.trim() !== '') {
      DOM.clearSearchBtn.classList.remove('hidden');
    } else {
      DOM.clearSearchBtn.classList.add('hidden');
    }
    renderApp();
  });

  // Clear search button
  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    AppState.searchQuery = '';
    DOM.clearSearchBtn.classList.add('hidden');
    renderApp();
  });

  // Filter Status Dropdown
  DOM.filterStatus.addEventListener('change', (e) => {
    AppState.filterStatus = e.target.value;
    renderApp();
  });

  // Filter Subject Dropdown
  DOM.filterSubject.addEventListener('change', (e) => {
    AppState.filterSubject = e.target.value;
    renderApp();
  });

  // Sort By Dropdown
  DOM.sortSelect.addEventListener('change', (e) => {
    AppState.sortBy = e.target.value;
    renderApp();
  });

  // Reset Filters Button
  DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
  DOM.emptyClearBtn.addEventListener('click', resetAllFilters);

  // Delegated event listener for Grid & Widget Actions
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');

    if (action === 'toggle-status') {
      const updated = StorageService.toggleStatus(id);
      if (updated) {
        const msg = updated.status === 'Completed'
          ? `Marked "${updated.title}" as completed! 🎯`
          : `Marked "${updated.title}" as pending.`;
        Toast.show(msg, updated.status === 'Completed' ? 'success' : 'info');
        renderApp();
      }
    } else if (action === 'edit') {
      openEditModal(id);
    } else if (action === 'delete') {
      promptDelete(id);
    } else if (action === 'view-task') {
      // Jump from dashboard widget to assignments view and highlight card
      switchView('assignments');
      setTimeout(() => {
        const card = document.querySelector(`.assignment-card[data-id="${id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.outline = '2px solid var(--purple-500)';
          setTimeout(() => { card.style.outline = 'none'; }, 2000);
        }
      }, 100);
    }
  });

  // Set Topbar Current Date
  const now = new Date();
  DOM.currentDateDisplay.textContent = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function resetAllFilters() {
  AppState.searchQuery = '';
  AppState.filterStatus = 'ALL';
  AppState.filterSubject = 'ALL';
  AppState.sortBy = 'due-asc';

  DOM.searchInput.value = '';
  DOM.clearSearchBtn.classList.add('hidden');
  DOM.filterStatus.value = 'ALL';
  DOM.filterSubject.value = 'ALL';
  DOM.sortSelect.value = 'due-asc';

  Toast.show('Filters reset.', 'info');
  renderApp();
}

/**
 * Escapes HTML characters to prevent XSS in dynamic rendering
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================================
   14. APPLICATION INITIALIZATION
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderApp();
});
