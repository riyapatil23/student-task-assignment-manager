# 🎓 Student Task & Assignment Manager

A modern, responsive, academic productivity web dashboard built specifically for college students to track assignments, coursework deadlines, subjects, and completion statuses.

Designed with clean architecture to provide an intuitive prototype in **Phase 1 (HTML5, CSS3, Vanilla JavaScript)** that seamlessly integrates into a **Java Spring Boot, Spring Data JPA, and MySQL** backend in **Phase 2**.

---

## 📁 Project Structure

```text
Student Task & Assignment Manager/
├── index.html        # Semantic HTML5 dashboard, navigation sidebar, metrics, widgets, and dialog modals
├── style.css         # Modern academic CSS3 design (Navy Blue & Purple accents, responsive layout, badges)
├── script.js         # Modular Vanilla JavaScript (StorageService, DOM rendering, validation, event bus)
└── README.md         # Project documentation, execution steps, and Java backend roadmap
```

---

## 🚀 How to Run the Project Locally

Because this phase is built entirely with pure **HTML5, CSS3, and Vanilla JavaScript**, no heavy runtime installation or build steps are required.

### Option 1: Direct Browser Launch (Simplest)
1. Navigate to the project folder:
   ```text
   c:\Users\riyavinodpatil\OneDrive\Desktop\Projects\Student Task & Assignment Manager
   ```
2. Double-click **`index.html`** or right-click `index.html` → **Open with** → Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option 2: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Click **"Go Live"** in the bottom status bar or right-click `index.html` → **"Open with Live Server"**.
4. The application will open automatically at `http://127.0.0.1:5500`.

### Option 3: Using Python Built-in HTTP Server (Terminal)
If you have Python installed, open PowerShell or Command Prompt in the project folder and run:
```powershell
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 🌟 Key Features Implemented (Phase 1)

### 1. Academic Dashboard & Metrics Overview
- **Metric Stat Cards**:
  - **Total Assignments**: Total active coursework across all subjects.
  - **Pending Assignments**: Deliverables awaiting completion.
  - **Completed Assignments**: Successfully submitted assignments.
  - **Overdue Assignments**: Automatically detected past-due assignments.
- **Coursework Progress Bar**: Real-time percentage indicator of completed assignments vs. total workload.
- **Upcoming Deadlines Widget**: Chronologically sorted pending assignments due soonest, with contextual urgency badges (`Due Today`, `Due Tomorrow`, `Due in X days`).
- **Recent Assignments Widget**: Quick preview of recently updated or newly created tasks with one-click status toggle.

### 2. Assignment Management & List
- **View All Assignments**: Responsive grid of cards displaying course subject tags, priority levels (High, Medium, Low), title, description snippet, due date, and status badges.
- **Overdue Highlighting**: Clear red alert left-border, warning badge (`⚠️ Overdue`), and urgency styling whenever an assignment's due date has passed and is not marked as completed.
- **Live Search**: Instant case-insensitive filtering by assignment title, subject, or description text.
- **Multi-Criteria Filtering**:
  - By **Status** (`All`, `Pending`, `Completed`, `Overdue`).
  - By **Subject** (`Database Management Systems`, `Data Structures & Algorithms`, `Operating Systems`, `Computer Networks`, `Software Engineering`, `Java Programming`, etc.).
- **Sorting Options**:
  - Due Date (Earliest First)
  - Due Date (Latest First)
  - Title (A - Z)
  - Title (Z - A)
- **One-Click Quick Actions**: Mark complete/pending toggle right from the card.
- **Interactive Modals**:
  - **Add/Edit Modal**: Native `<dialog>` modal with validation for title, subject, custom subject option, description (with character counter), due date, and priority.
  - **Delete Confirmation Dialog**: Custom modal preventing accidental deletions.
- **Toast Notifications**: Smooth, auto-dismissing notifications for create, update, delete, and status toggle actions.
- **Helpful Empty States**: User-friendly feedback when no assignments match search filters or when the list is empty.

### 3. Architecture & Data Persistence
- **Client Storage Abstraction**: Utilizes browser `localStorage` with pre-seeded, realistic 3rd Year B.Tech IT coursework assignments (DBMS, DSA, OS, CN, SE, Java).
- **Clean Separation for Backend Transition**: The `StorageService` in `script.js` is structured to mirror REST API calls, making future Java Spring Boot integration straightforward.

---

## 🔮 Phase 2 Roadmap: Java Spring Boot & MySQL Backend

In Phase 2, the `StorageService` in `script.js` will be connected to a Java Spring Boot REST API backed by a MySQL database.

### Planned Backend Architecture (Spring Boot 3.x + Java 17/21):

```text
src/main/java/com/campustask/
├── CampusTaskApplication.java        # Spring Boot Entrypoint
├── model/
│   └── Assignment.java               # JPA Entity (@Entity, @Table(name="assignments"))
├── repository/
│   └── AssignmentRepository.java     # Spring Data JPA Repository (JpaRepository<Assignment, Long>)
├── service/
│   └── AssignmentService.java        # Business Logic & Service Implementation
├── controller/
│   └── AssignmentController.java     # REST Controller (@RestController, @RequestMapping("/api/assignments"))
└── dto/
    ├── AssignmentRequestDto.java     # Request Validation DTO (@NotBlank, @NotNull)
    └── AssignmentResponseDto.java    # Clean JSON API Response DTO
```

### Planned REST Endpoints:

| HTTP Method | Endpoint | Description | Spring Boot Annotation |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/assignments` | Retrieve all assignments | `@GetMapping` |
| **GET** | `/api/assignments/{id}` | Get assignment by ID | `@GetMapping("/{id}")` |
| **POST** | `/api/assignments` | Create a new assignment | `@PostMapping` |
| **PUT** | `/api/assignments/{id}` | Update existing assignment | `@PutMapping("/{id}")` |
| **DELETE** | `/api/assignments/{id}` | Delete assignment by ID | `@DeleteMapping("/{id}")` |
| **PATCH** | `/api/assignments/{id}/status` | Toggle assignment status | `@PatchMapping("/{id}/status")` |

### Planned MySQL Schema (`assignments` table):
```sql
CREATE TABLE assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 📋 Status Summary

### ✅ Implemented in Current Phase
- [x] Responsive layout with sidebar and academic theme (Navy Blue + Purple)
- [x] Dashboard view with 4 metrics cards (Total, Pending, Completed, Overdue)
- [x] Coursework completion rate and animated progress bar
- [x] Upcoming Deadlines and Recent Assignments widgets
- [x] Assignment Management view with card grid
- [x] Add Assignment form with field validation
- [x] Edit Assignment with pre-populated values
- [x] Delete Assignment with custom `<dialog>` confirmation modal
- [x] One-click status toggle (Pending ↔ Completed)
- [x] Dynamic overdue detection and alert styling
- [x] Real-time title/subject search
- [x] Filter by status and subject
- [x] Sort by due date and title
- [x] LocalStorage persistence with realistic sample data
- [x] Toast notification system

### ⏳ Pending for Phase 2 (Java Spring Boot + MySQL)
- [ ] Spring Boot 3.x project setup (Maven/Gradle)
- [ ] MySQL database setup and schema migration (Flyway or JPA `ddl-auto`)
- [ ] JPA Entity mapping (`@Entity`, `@Id`, `@Enumerated`)
- [ ] Spring Data JPA Repository methods (e.g., `findByStatus`, `findByDueDateBefore`)
- [ ] Service layer with transaction management (`@Transactional`)
- [ ] REST API Controllers with input validation (`@Valid`)
- [ ] CORS configuration to allow frontend `fetch()` requests
- [ ] Unit & Integration testing (JUnit 5, Mockito, MockMvc)
