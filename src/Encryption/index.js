export const getPrivateKey = async (uid) => {
    return new Promise((resolve, reject) => {
      const dbName = 'privateKeys';
      const storeName = 'keys';
      const openRequest = indexedDB.open(dbName, 1);
  
      openRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getRequest = store.get(uid);
  
        getRequest.onsuccess = (event) => {
          if (event.target.result) {
            resolve(event.target.result.privateKey);
          } else {
            reject(new Error('Private key not found.'));
          }
        };
  
        getRequest.onerror = (event) => {
          reject(new Error('Error retrieving private key.'));
        };
      };
  
      openRequest.onerror = (event) => {
        reject(new Error('Error opening IndexedDB.'));
      };
    });
  };