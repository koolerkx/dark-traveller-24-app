[English](TECHNICAL_OVERVIEW.md) | [日本語](TECHNICAL_OVERVIEW.ja.md) | [繁體中文](TECHNICAL_OVERVIEW.zh-Hant.md)

# 技術概覽：Dark Traveller 24 應用程式

本文件以點列形式，詳細介紹 Dark Traveller 24 應用程式的技術細節，重點介紹其架構、資料流和核心元件。

## 1. 應用程式架構與內容提供者

- **架構風格**：使用 React 和 Ionic 框架的客戶端繁重單頁應用程式 (SPA)。
- **狀態管理**：全域狀態和服務透過 React Context 提供者的層級結構進行管理。
- **依賴注入**：`main.tsx` 中的內容設定建立了依賴注入的順序：
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

### 內容提供者詳細資料

- **`FirebaseProvider`**

  - **角色**：頂層提供者；初始化與 Firebase 後端的連線。
  - **動作**：
    - 從環境變數讀取 Firebase 設定。
    - 初始化核心 Firebase `app` 和 `analytics` 實例。
  - **提供**：`app` 和 `analytics` 物件給所有子元件。

- **`RepositoryProvider`**

  - **角色**：實例化資料存取層，將所有 Firestore 邏輯從 UI 中抽象出來。
  - **依賴**：取用 Firebase `app` 實例。
  - **動作**：
    - 初始化 Firestore 資料庫實例 (`getFirestore`)。
    - 建立並提供 `PointRepository` 和 `UserRepository` 的單例實例。
  - **提供**：`pointRepository` 和 `userRepository` 實例。

- **`AuthProvider`**
  - **角色**：管理使用者驗證狀態、會話和持續性。
  - **依賴**：取用 Firebase `app` 實例。
  - **動作**：
    - 初始化 Firebase Authentication 並設定 `onAuthStateChanged` 偵聽器。
    - 處理登入/登出邏輯。
    - 使用 `browserLocalPersistence` 來保持使用者登入狀態。
  - **提供**：`user` 物件、`isAuthed` 布林值和 `isLoading` 布林值。

## 2. 資料儲存庫與客戶端匯總

- **核心邏輯位置**：應用程式的業務邏輯集中在**儲存庫層** (`src/repository/`)。
- **職責**：
  - 處理與 Firestore 的所有通訊。
  - 在客戶端執行複雜的資料匯總，以從原始資料衍生應用程式狀態。

---

### 儲存庫詳細資料

- **`UserRepository`**

  - **角色**：管理與使用者資料相關的所有操作。
  - **方法**：
    - **`getUser(email)`**：從 `users` 集合中擷取單一使用者設定檔。
    - **`upgradeUser(user, upgradePointId)`**：
      - **目的**：提升使用者等級。
      - **邏輯**：
        - 根據 `USER_MAXIMUM_LEVEL` 進行驗證。
        - 防止重複升級。
        - 記錄 `USER_UPGRADE` 事件。
    - **`capturePoint(user, pointId)`**：
      - **目的**：以原子方式佔領一個點，可能從另一個使用者那裡奪取。
      - **執行**：在 Firestore 交易中執行以確保資料完整性。
      - **流程**：
        1.  **擷取狀態**：讀取所有 `users` 和目標 `point`。
        2.  **驗證**：檢查是否重複佔領 (`CapturedPointAlreadyCapturedError`) 和冷卻違規 (`CapturedPointInCooldownError`)。
        3.  **清除對手**：如果佔領一個點，則在對手的佔領點上設定 `expiredAt`。
        4.  **新增佔領**：將一個新的、有效的點新增至目前使用者的 `capturedPoints` 陣列。
        5.  **記錄事件**：交易後記錄 `CLEAR_POINT` 和 `CAPTURE_POINT` 事件。
    - **`getRanking()`**：
      - **目的**：產生即時排行榜。
      - **匯總**：
        - 擷取所有使用者。
        - 在客戶端計算每個使用者的分數 (`attackedPower`)。
        - 根據計算出的分數對使用者清單進行排序。

- **`PointRepository`**
  - **角色**：管理靜態檢查點資料及其動態即時狀態。
  - **方法**：
    - **`getPoints()`**：擷取所有可用點的靜態清單。
    - **`getPointsWithCapturedInfo()`**：
      - **目的**：為地圖視圖提供每個點的完整即時狀態。
      - **匯總**：
        1.  在兩個有效率的查詢中擷取所有 `users` 和 `points`。
        2.  為每個唯一點的*最新*佔領事件建立一個查詢對應。
        3.  使用動態 `PointStatus` (`new`、`captured` 等) 和擁有者資訊來豐富靜態點資料。

## 3. 視圖與路由

- **UI 組織**：UI 被組織成頁面，路由由 `IonReactRouter` 控制。
- **導覽**：主標籤列提供視圖之間的主要導覽。

---

### 結構詳細資料

- **路由 (`App.tsx` & `route.tsx`)**

  - **引擎**：路由在 `<IonRouterOutlet>` 中定義。
  - **保護**：`AuthRoute` 元件包裝受保護的路由，檢查 `isAuthed` 旗標，如果使用者未經驗證，則重新導向至 `/login`。

- **標籤式導覽與頁面**

  - **`/home`**：顯示使用者進度和目標的主儀表板。
  - **`/map`**：使用 `pointRepository.getPointsWithCapturedInfo()` 的資料呈現點標記的互動式 Leaflet 地圖。
  - **`/scan`**：觸發 `capturePoint` 或 `upgradeUser` 儲存庫方法的 QR code 掃描介面。
  - **`/ranking`**：顯示來自 `userRepository.getRanking()` 的排序資料的排行榜頁面。
  - **`/profile`**：顯示來自 `userRepository.getUser()` 的目前使用者資料的使用者統計資料頁面。

- **元件結構**
  - **`pages/`**：「智慧型」元件，對應於全螢幕視圖。它們負責擷取資料和管理特定於視圖的狀態。
  - **`components/`**：「笨拙型」、展示性元件，可高度重複使用。它們透過 props 接收所有資料和函式。
