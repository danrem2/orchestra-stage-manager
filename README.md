# Orchestra Seating App

A web application for managing orchestra seating arrangements with real-time cloud sync.

## Features

-  **Visual Stage Layout** - Interactive visualization of orchestra seating with   desks and chairs
-  **Player Rotation** - Swap positions of selected players
-  **Guest Management** - Add temporary guest musicians to specific seats
-  **Remove & Restore** - Remove players from stage and restore them later
-  **Auto Fill-In** - Automatically fill empty seats by shifting players
-  **Cloud Sync** - Save and load stage configurations via Firebase


##  How to Use

1. **Select Players:** Click on any player circle to select them (gold outline).
2. **Rotate:** Select 2+ players and click **Rotate** to shift them in order.
3. **Remove:** Select players and click **Remove** to move them to the sidebar.
4. **Restore:** Click the **+** button next to a removed player to bring them back.
5. **Cloud Save/Load:**
   - Type a name (e.g., `Rehearsal-A`) in the top-right input.
   - Click **Save** to store it in the cloud.
   - If you'd like to reuse the seating arrangement, type the same name and click **Load** to sync.


## Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** CSS, Styled Components
- **Build Tool:** Vite
- **Backend:** Firebase Realtime Database


## Getting Started

1. Install dependencies
2. Configure Firebase
  - Create a project at [.](https://console.firebase.google.com/u/0/)
  - Create a Realtime Database and start in Test Mode.
  - Copy your config keys from Project Settings > General > Your Apps.
  - Create a .env.local file in the root directory.
3. Start the Development Server


### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/danrem2/orchestra-app.git
   cd orchestra-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Firebase credentials:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Run the app locally:
   ```bash
   npm run dev
   ```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Run locally for development          |
| `npm run build`   | Build static files for deployment    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## License

MIT
