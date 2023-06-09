import { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

// firebase imports
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { user, dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      // update online status in firestore user collection
      const { uid } = user;
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, { online: false });

      // sign the user out
      await signOut(auth);

      // dispatch logout action
      dispatch({ type: 'LOGOUT' });

      // update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false); // for react strict mode reasons
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
