[English](TECHNICAL_OVERVIEW.md) | [日本語](TECHNICAL_OVERVIEW.ja.md) | [繁體中文](TECHNICAL_OVERVIEW.zh-Hant.md)

# Technical Overview: Dark Traveller 24 App

This document provides a detailed technical breakdown of the Dark Traveller 24 application, focusing on its architecture, data flow, and core components, presented in a point-form structure.

## 1. Application Architecture & Context Providers

- **Architecture Style**: Client-heavy single-page application (SPA) using React and the Ionic Framework.
- **State Management**: Global state and services are managed via a hierarchy of React Context providers.
- **Dependency Injection**: The context setup in `main.tsx` establishes the dependency injection order:
  ```
  <FirebaseProvider>
    <RepositoryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RepositoryProvider>
  </FirebaseProvider>
  ```

---

### Context Provider Details

- **`FirebaseProvider`**
  - **Role**: Top-level provider; initializes the connection to the Firebase backend.
  - **Actions**:
    - Reads Firebase configuration from environment variables.
    - Initializes the core Firebase `app` and `analytics` instances.
  - **Provides**: `app` and `analytics` objects to all child components.

- **`RepositoryProvider`**
  - **Role**: Instantiates the data access layer, abstracting all Firestore logic from the UI.
  - **Dependencies**: Consumes the Firebase `app` instance.
  - **Actions**:
    - Initializes the Firestore database instance (`getFirestore`).
    - Creates and provides singleton instances of `PointRepository` and `UserRepository`.
  - **Provides**: `pointRepository` and `userRepository` instances.

- **`AuthProvider`**
  - **Role**: Manages user authentication state, sessions, and persistence.
  - **Dependencies**: Consumes the Firebase `app` instance.
  - **Actions**:
    - Initializes Firebase Authentication and sets up an `onAuthStateChanged` listener.
    - Handles login/logout logic.
    - Uses `browserLocalPersistence` to keep users logged in.
  - **Provides**: `user` object, `isAuthed` boolean, and `isLoading` boolean.

## 2. Data Repositories & Client-Side Aggregation

- **Core Logic Location**: The application's business logic is concentrated in the **repository layer** (`src/repository/`).
- **Responsibilities**:
  - Handles all communication with Firestore.
  - Performs complex data aggregation on the client-side to derive application state from raw data.

---

### Repository Details

- **`UserRepository`**
  - **Role**: Manages all operations related to user data.
  - **Methods**:
    - **`getUser(email)`**: Fetches a single user profile from the `users` collection.
    - **`upgradeUser(user, upgradePointId)`**:
      - **Purpose**: Increases a user's level.
      - **Logic**:
        - Validates against `USER_MAXIMUM_LEVEL`.
        - Prevents duplicate upgrades.
        - Logs the `USER_UPGRADE` event.
    - **`capturePoint(user, pointId)`**:
      - **Purpose**: Atomically captures a point, potentially from another user.
      - **Execution**: Runs inside a Firestore Transaction for data integrity.
      - **Flow**:
        1.  **Fetch State**: Reads all `users` and the target `point`.
        2.  **Validate**: Checks for self-recapture (`CapturedPointAlreadyCapturedError`) and cooldown violations (`CapturedPointInCooldownError`).
        3.  **Clear Opponent**: If taking a point, sets `expiredAt` on the opponent's captured point.
        4.  **Add New Capture**: Adds a new, active point to the current user's `capturedPoints` array.
        5.  **Log Events**: Logs `CLEAR_POINT` and `CAPTURE_POINT` events after the transaction.
    - **`getRanking()`**:
      - **Purpose**: Generates the real-time leaderboard.
      - **Aggregation**:
        - Fetches all users.
        - Calculates each user's score (`attackedPower`) on the client-side.
        - Sorts the user list by the calculated score.

- **`PointRepository`**
  - **Role**: Manages static checkpoint data and their dynamic, real-time status.
  - **Methods**:
    - **`getPoints()`**: Retrieves the static list of all available points.
    - **`getPointsWithCapturedInfo()`**:
      - **Purpose**: To provide the map view with a complete, real-time status for every point.
      - **Aggregation**:
        1.  Fetches all `users` and `points` in two efficient queries.
        2.  Creates a lookup map of the *most recent* capture event for each unique point.
        3.  Enriches the static point data with a dynamic `PointStatus` (`new`, `captured`, etc.) and owner information.

## 3. Views and Routing

- **UI Organization**: The UI is organized into pages, with routing controlled by `IonReactRouter`.
- **Navigation**: A main tab bar provides the primary navigation between views.

---

### Structure Details

- **Routing (`App.tsx` & `route.tsx`)**
  - **Engine**: Routes are defined within an `<IonRouterOutlet>`.
  - **Protection**: The `AuthRoute` component wraps protected routes, checking the `isAuthed` flag and redirecting to `/login` if the user is not authenticated.

- **Tab-Based Navigation & Pages**
  - **`/home`**: Main dashboard showing user progress and objectives.
  - **`/map`**: Interactive Leaflet map that renders point markers using data from `pointRepository.getPointsWithCapturedInfo()`.
  - **`/scan`**: QR code scanning interface that triggers `capturePoint` or `upgradeUser` repository methods.
  - **`/ranking`**: Leaderboard page that displays the sorted data from `userRepository.getRanking()`.
  - **`/profile`**: User statistics page that displays data for the current user from `userRepository.getUser()`.

- **Component Structure**
  - **`pages/`**: "Smart" components that correspond to full-screen views. They are responsible for fetching data and managing view-specific state.
  - **`components/`**: "Dumb," presentational components that are highly reusable. They receive all data and functions via props.
