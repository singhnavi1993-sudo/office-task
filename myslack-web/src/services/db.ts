// IndexedDB Offline Cache Service for MySlack
const DB_NAME = 'MySlackOfflineDB';
const DB_VERSION = 1;

export class IndexedDBService {
  private db: IDBDatabase | null = null;

  public async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains('messageDrafts')) {
          db.createObjectStore('messageDrafts', { keyPath: 'channelId' });
        }
        if (!db.objectStoreNames.contains('cachedChannels')) {
          db.createObjectStore('cachedChannels', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result as IDBDatabase;
        resolve(this.db);
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

  public async saveDraft(channelId: string, content: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('messageDrafts', 'readwrite');
      const store = transaction.objectStore('messageDrafts');
      const request = store.put({ channelId, content, updatedAt: new Date().toISOString() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getDraft(channelId: string): Promise<string | null> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('messageDrafts', 'readonly');
      const store = transaction.objectStore('messageDrafts');
      const request = store.get(channelId);

      request.onsuccess = () => {
        resolve(request.result ? request.result.content : null);
      };
      request.onerror = () => resolve(null);
    });
  }
}

export const offlineDbService = new IndexedDBService();
