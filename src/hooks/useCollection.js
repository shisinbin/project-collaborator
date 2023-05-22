import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/config';

// firebase imports
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// this allows us to get real-time updates about a collection
export const useCollection = (collectionName, _q, _sortOrder) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _q is an array and is "different" on every function call
  const q = useRef(_q).current;
  const sortOrder = useRef(_sortOrder).current;

  useEffect(() => {
    let ref = collection(db, collectionName);

    if (q) {
      ref = query(ref, where(...q));
    }
    if (sortOrder) {
      ref = query(ref, orderBy(...sortOrder));
    }

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log('Error fetching data', error);
        setError('Error fetching data');
      }
    );

    // unsubscribe on unmount
    return () => unsub();
  }, [collectionName, q, sortOrder]);

  return { documents, error };
};
