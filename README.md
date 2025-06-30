[English](README.md) | [日本語](README.ja.md) | [繁體中文](README.zh-Hant.md)

# Dark Traveller 24 App

## Overview

- PWA-ready React/Ionic application for supporting a one-day offline city orienteering event.
- Participants ride bicycles to find QR-coded checkpoints in the city.
- Scanning a checkpoint “captures” it and earns marks (HP) over time.
- Teams compete: first to accumulate a target amount of marks wins.
- Participants can spend marks at “upgrade points” to increase mark-earning speed.

Technical Overview: [doc/TECHNICAL_OVERVIEW.md](doc/TECHNICAL_OVERVIEW.md)
UI Overciew: [doc/UI_OVERVIEW.md](doc/UI_DESCRIPTION.md)

## Getting Started (for Self-Hosting)

This project is designed to be deployed on Firebase and is not intended for general public installation. To run a personal instance for development or private use:

1.  **Install Dependencies:**
    ```bash
    yarn install
    ```
2.  **Run Development Server:**
    ```bash
    yarn dev
    ```
    You will also need to configure your own Firebase project and connect it to the application.

## Features

- **Authentication**: Firebase Authentication with participant-only access.
- **Real-time Map & Tracking**: Leaflet.js map view showing checkpoint locations, cycling track, and capture status.
- **QR Code Scanning**: Utilizes the web browser's native camera API for a seamless PWA experience to scan checkpoints and upgrade codes.
- **Progress & Ranking**: Home screen displays current objective progress and next target checkpoint. Ranking screen shows team standings and captured points.
- **Profile & Stats**: Team profile page with HP, upgrade level, and activity log.
- **Checkpoint Protection**: Captured checkpoints enter a 5-minute “cool-down” period before they can be recaptured.

## Technical Stack

The application is a client-heavy PWA that interfaces directly with Firebase services.

```
+------------------------------------------------+
|                                                |
|      User's Device (Browser / PWA)             |
|                                                |
|  +------------------------------------------+  |
|  |      React + Ionic Frontend App          |  |
|  |                                          |  |
|  |  - Game Logic & UI                       |  |
|  |  - Leaflet.js Map                        |  |
|  |  - QR Scanner (Native Camera API)        |  |
|  +------------------------------------------+  |
|                  |                             |
|                  | (Firebase SDK)              |
|                  v                             |
|  +------------------------------------------+  |
|  |      Firebase Services (Google Cloud)    |  |
|  |                                          |  |
|  |  - Firestore (Real-time Database)        |  |
|  |  - Authentication                        |  |
|  |  - Hosting & Storage                     |  |
|  |  - Google Analytics                      |  |
|  +------------------------------------------+  |
|                                                |
+------------------------------------------------+
```

| Category           | Technology / Library       | Purpose                                      |
| ------------------ | -------------------------- | -------------------------------------------- |
| **Core Frontend**  | React                      | UI library for building components           |
| **Framework**      | Ionic                      | UI toolkit for building cross-platform PWAs  |
| **Bundler**        | Vite                       | Fast development server and build tool       |
| **Mapping**        | Leaflet.js                 | Interactive maps                             |
| **QR Scanning**    | `@yudiel/react-qr-scanner` | React component for camera-based QR scanning |
| **Backend**        | Firebase                   | Platform for data, auth, and hosting         |
| **Database**       | Firestore                  | Real-time NoSQL database for game state      |
| **Authentication** | Firebase Auth              | User login and session management            |
| **Hosting**        | Firebase Hosting           | Static file hosting for the PWA              |
| **Analytics**      | Google Analytics           | Event tracking and user engagement analysis  |

## Architecture & Data Flow

1.  **Client-side Logic**: All game rules, mark calculations, and data aggregation run in the browser. Firestore reads/writes are batched and optimized to minimize network calls.
2.  **Firestore Collections**:
    - **checkpoints**: Static data for each QR-code location and metadata.
    - **users**: Participant profiles, team assignments, current HP and upgrade level.
    - **activity_logs**: Timestamped records of every scan event (capture/upgrade).
3.  **Data Aggregation**: The client pulls from all three collections and computes the current state in real time.

## UI / Views

1.  **Login**: Login restricted to registered participants.
2.  **Home**: Overview of team HP and next checkpoint target.
3.  **Map View**: Interactive map with checkpoints, track overlays, and status markers.
4.  **QR Code Scan**: Camera view for scanning checkpoint or upgrade QR codes.
5.  **Ranking**: Leaderboard of all teams and their captured checkpoints.
6.  **Profile**: Team statistics: total HP, upgrade level, history of scans.

## Deployment

- Hosted on **Firebase Hosting**.
- Continuous deployment via the Firebase CLI.
- Build artifacts are served as a PWA, installable on modern iOS and Android devices.

## Related Projects

- **Event Analysis & Reporting**:
  https://github.com/koolerkx/dark-traveller-24-analysis
- **Staff Patrol Dashboard (web)**:
  https://github.com/koolerkx/dark-traveller-24-patrol
- **Traditional Chinese PDF Report**:
  Detailed event parameter design and web analytics (internal)

## License

MIT License
