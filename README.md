# CommandGrid: Intelligent Alert Management & Visualization

CommandGrid is a high-performance, real-time fleet surveillance and alert management dashboard. Built for operations admins, it provides deep visibility into alert lifecycles, driver performance, and automated escalation protocols.

## 🚀 Key Features

### 1. Command Center & Dashboard
- **Real-time Summaries**: Vital stats (Total Open, Escalated, Auto-Closed) update dynamically to simulate live telemetry.
- **Top Offenders Leaderboard**: Instant identification of high-risk drivers with quick-drill-down capabilities.
- **Severity Distribution**: Visual breakdown of critical vs. warning events using high-impact donut and bar charts.

### 2. Intelligent Alert Feed
- **Global Search & Filter**: Search by Driver, Asset, or ID with real-time feedback.
- **Multi-Status Tracking**: Full lifecycle support from `OPEN` to `RESOLVED`.
- **Drill-down Modals**: Detailed metadata view including a **Visual State Transition Timeline** for auditability.

### 3. Analytics & Intelligence
- **Trend Analysis**: Interactive Area Charts showing Daily vs. Weekly alert oscillations.
- **Source Module Distribution**: Visualization of alerts by origin (Speed, Temp, Geofence, etc.).
- **Memoized Performance**: All heavy data filtering is wrapped in `useMemo` to ensure 60FPS UI responsiveness.

### 4. Admin Rule Configuration
- **Visual Protocol Designer**: Create, edit, and toggle escalation rules without code.
- **Conflict Prevention**: Built-in validation (Threshold ≥ 1) and **Diff/Preview** view before saving changes.
- **Real-time Propagation**: Rules reflect in system logic immediately upon confirmation.

## 🛠️ Tech Stack & Plus Points

| Criteria | Implementation Strategy |
| :--- | :--- |
| **Component Architecture** | Modular, Atomic design with separation of concerns. |
| **Responsiveness** | Mobile-first Tailwind CSS with fluid layouts (Grid/Flex). |
| **Performance** | React `useMemo` for filtering + state-driven virtualization. |
| **Accessibility** | WCAG 2.1 compliant: ARIA labels, semantic HTML, high contrast. |
| **State Management** | Local Component State with "Lifting State" for shared views. |
| **Visual Excellence** | Modern "Glassmorphism" UI, consistent token-based design system. |

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📐 Architecture Note
The application follows a **Domain-Driven Component** structure. UI logic is isolated in `src/components`, while global utility tokens and standardizations (like the `cn` utility) ensure design consistency. Data flows are primarily top-down, ensuring predictable state and easy debugging.

---
*Created for the MoveInSync Evaluation.*
