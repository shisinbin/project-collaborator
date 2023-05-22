import { useEffect, useState } from 'react';
import { db } from '../firebase/config';

// firebase imports
import { collection, doc, onSnapshot } from 'firebase/firestore';

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = doc(collection(db, collectionName), id);

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        // Check if the document exists
        if (snapshot.exists()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError('No such document exists');
        }
      },
      (err) => {
        console.log('Error fetching document', err);
        setError('Failed to get document');
      }
    );

    return () => unsub();
  }, [collectionName, id]);

  return { document, error };
};
