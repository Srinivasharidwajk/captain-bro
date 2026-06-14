import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Determine if we should run in Mock mode
export const isMockFirebase = auth.app.options.apiKey === 'mock-api-key';

// In Mock Mode, we store mock users in localStorage
const getMockUsers = () => JSON.parse(localStorage.getItem('mock_users') || '[]');
const saveMockUsers = (users) => localStorage.setItem('mock_users', JSON.stringify(users));

export const registerUser = async (email, password, fullName, phone, role = 'customer') => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getMockUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists.');
    }
    const newUser = {
      uid: 'u_' + Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      phone,
      role,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveMockUsers(users);
    
    // Log them in by setting active mock user
    localStorage.setItem('active_mock_user', JSON.stringify(newUser));
    // Dispatch storage event to notify other contexts
    window.dispatchEvent(new Event('storage'));
    return newUser;
  } else {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userProfile = {
      uid: user.uid,
      email,
      fullName,
      phone,
      role,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  }
};

export const loginUser = async (email, password) => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getMockUsers();
    
    // Seed default roles for testing if mock_users is empty
    let user = users.find(u => u.email === email);
    if (!user) {
      if (email === 'admin@wfoods.com' && password === 'admin123') {
        user = { uid: 'mock_admin', email, fullName: 'System Admin', phone: '9876543210', role: 'admin' };
      } else if (email === 'rider@wfoods.com' && password === 'rider123') {
        user = { uid: 'mock_rider', email, fullName: 'Super Rider', phone: '9876543211', role: 'rider' };
      } else if (email === 'customer@wfoods.com' && password === 'customer123') {
        user = { uid: 'mock_customer', email, fullName: 'Happy Customer', phone: '9876543212', role: 'customer' };
      }
    }
    
    if (user) {
      localStorage.setItem('active_mock_user', JSON.stringify(user));
      window.dispatchEvent(new Event('storage'));
      return user;
    }
    throw new Error('Invalid email or password. Use demo account admin@wfoods.com / admin123, rider@wfoods.com / rider123, or customer@wfoods.com / customer123');
  } else {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return { uid: user.uid, email: user.email, role: 'customer' };
  }
};

export const loginWithPhone = async (phone) => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getMockUsers();
    let user = users.find(u => u.phone === phone);
    if (!user) {
      user = {
        uid: 'u_' + Math.random().toString(36).substr(2, 9),
        email: `${phone}@captainbro.com`,
        fullName: 'Customer ' + phone.slice(-4),
        phone,
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveMockUsers(users);
    }
    localStorage.setItem('active_mock_user', JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
    return user;
  } else {
    // In production, fallback to retrieve profile by phone or create a new one
    const newUser = {
      uid: 'u_' + Math.random().toString(36).substr(2, 9),
      email: `${phone}@captainbro.com`,
      fullName: 'Customer ' + phone.slice(-4),
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', newUser.uid), newUser);
    return newUser;
  }
};

export const logoutUser = async () => {
  if (isMockFirebase) {
    localStorage.removeItem('active_mock_user');
    window.dispatchEvent(new Event('storage'));
  } else {
    await signOut(auth);
  }
};

export const resetPassword = async (email) => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } else {
    await sendPasswordResetEmail(auth, email);
  }
};

export const subscribeToAuth = (callback) => {
  if (isMockFirebase) {
    const checkUser = () => {
      const u = localStorage.getItem('active_mock_user');
      callback(u ? JSON.parse(u) : null);
    };
    checkUser();
    
    const handleStorageChange = () => {
      checkUser();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  } else {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          callback(userDoc.data());
        } else {
          callback({ uid: user.uid, email: user.email, role: 'customer' });
        }
      } else {
        callback(null);
      }
    });
  }
};
