import { useState, useEffect } from 'react';
import { auth, storage, db } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

// Firebase imports
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// ref is used to create a storage reference,
// uploadString is used to upload the user thumbnail,
// getDownloadURL is used to get the download URL of the uploaded thumbnail
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
// setDoc is used to create a user document
import { setDoc, doc } from 'firebase/firestore';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  // Notes to self about this sign up function:
  // 5 separate calls to firebase, error handling could be better,
  // should use onSnapshot on the uploadBytes task that is returned, e.g.
  // const uploadTask = uploadBytes(...)
  // uploadTask.on((snapshot) => { ... }, {error} => { ... }, () => { uploadTask.snapshot.ref.getDownloadURL().then((url) => setDownloadURL(url)) })
  // could do some stuff to show progress of file being uploaded
  // could use Promise.all() to do things concurrently (signing up user while uploading an image) though maybe you want to sign up a user first before trying to upload an image...
  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not complete signup');
      }

      // Uploading user thumbnail process
      // 1. set the upload path
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      // 2. use the path to create a reference for storage
      const storageRef = ref(storage, uploadPath);
      // 3. upload the thumbnail
      await uploadBytes(storageRef, thumbnail);
      // 4. get the image URL so we can put it as one of the user's fields
      const imgUrl = await getDownloadURL(storageRef);

      // Update the profile to include a display name and the url to thumbnail
      await updateProfile(res.user, {
        displayName,
        photoURL: imgUrl,
      });

      // create a user document
      const userDocRef = doc(db, 'users', res.user.uid);
      await setDoc(userDocRef, {
        online: true,
        displayName,
        photoURL: imgUrl,
      });

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

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
    setIsCancelled(false); // for strict mode reasons
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
