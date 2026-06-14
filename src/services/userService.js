import { isMockFirebase } from '../firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const getUsers = async () => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('mock_users') || '[]');
  } else {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  }
};
