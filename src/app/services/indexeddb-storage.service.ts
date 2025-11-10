import { Injectable } from "@angular/core";
import { openDB, IDBPDatabase } from "idb";

@Injectable({
  providedIn: "root",
})
export class IndexedDBStorageService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB("ugpa-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("ugpa-store")) {
          db.createObjectStore("ugpa-store");
        }
      },
    });
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.put("ugpa-store", { value }, key);
    } catch (err) {
      console.error("Errore setItem:", err);
      throw err;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const db = await this.dbPromise;
      const entry = await db.get("ugpa-store", key);
      return entry ? entry.value : null;
    } catch (err) {
      console.error("Errore getItem:", err);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.delete("ugpa-store", key);
    } catch (err) {
      console.error("Errore removeItem:", err);
      throw err;
    }
  }
}
