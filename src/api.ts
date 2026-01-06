import { ref, set, get, child } from "firebase/database";
import { db } from "./firebase";
import type { SavedState } from "./logic/orchestra";

// Firebase Realtime Database root path
const DB_ROOT = "stages";

export const api = {
  saveStage: async (stageName: string, data: SavedState) => {
    'Saves stage data to Firebase'
    // Create a reference path
    const stageRef = ref(db, `${DB_ROOT}/${stageName}`);
    
    // Write the data (overwrites if exists)
    await set(stageRef, data);
    console.log(`Saved stage to cloud: ${stageName}`);
  },

  loadStage: async (stageName: string): Promise<SavedState | null> => {
    'Loads stage data from Firebase'
    // Create a reference to the database
    const dbRef = ref(db);
    try {
      // Read the data at the specified path
      const snapshot = await get(child(dbRef, `${DB_ROOT}/${stageName}`));
      
      if (snapshot.exists()) {
        // if exists, return the data as SavedState
        return snapshot.val() as SavedState;
      } else {
        console.warn("No data found for this stage name");
        return null;
      }
      } catch (error) {
        console.error("Error loading stage:", error);
        return null;
      }
    },
  };