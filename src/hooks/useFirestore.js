import { useReducer, useEffect, useState } from 'react';
import { db } from '../firebase/config';

// firebase imports
import {
  Timestamp,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return {
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    case 'ADDED_DOCUMENT':
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case 'DELETED_DOCUMENT':
      return {
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    case 'UPDATED_DOCUMENT':
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case 'ERROR':
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // function that only dispatches if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // collection ref - this is a synchronous action
  // and does not communicate with firebase,
  // hence it being outside the try-catch
  const collectionRef = collection(db, collectionName);

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });

    const createdAt = Timestamp.fromDate(new Date());

    try {
      const addedDocument = await addDoc(collectionRef, { ...doc, createdAt });
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });

    const docRef = doc(db, collectionName, id);

    try {
      await deleteDoc(docRef);
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' });
    }
  };

  // update document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });

    const docRef = doc(db, collectionName, id);

    try {
      const updatedDocument = await updateDoc(docRef, updates);
      dispatchIfNotCancelled({
        type: 'UPDATED_DOCUMENT',
        payload: updatedDocument,
      });
      return updatedDocument;
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not update' });
      return null;
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
