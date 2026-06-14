import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { isMockFirebase } from './auth';
import { MOCK_PRODUCTS, CATEGORIES } from '../utils/constants';

// Initialize mock collections in localStorage if they don't exist
if (isMockFirebase) {
  if (!localStorage.getItem('mock_users')) {
    localStorage.setItem('mock_users', JSON.stringify([
      { uid: 'mock_admin', email: 'admin@wfoods.com', fullName: 'System Admin', phone: '9876543210', role: 'admin' },
      { uid: 'mock_rider', email: 'rider@wfoods.com', fullName: 'Super Rider', phone: '9876543211', role: 'rider' },
      { uid: 'mock_customer', email: 'customer@wfoods.com', fullName: 'Happy Customer', phone: '9876543212', role: 'customer' }
    ]));
  }
  // Always update mock products and categories in development to capture additions
  localStorage.setItem('mock_products', JSON.stringify(MOCK_PRODUCTS));
  localStorage.setItem('mock_categories', JSON.stringify(CATEGORIES));
  if (!localStorage.getItem('mock_orders')) {
    localStorage.setItem('mock_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_addresses')) {
    localStorage.setItem('mock_addresses', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_riders')) {
    localStorage.setItem('mock_riders', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_tracking')) {
    localStorage.setItem('mock_tracking', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_notifications')) {
    localStorage.setItem('mock_notifications', JSON.stringify([]));
  }
}

// ---------------- USERS CRUD ----------------
export const getUserProfileDb = async (uid) => {
  if (isMockFirebase) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    return users.find(u => u.uid === uid) || null;
  } else {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? docSnap.data() : null;
  }
};

export const createUserProfileDb = async (uid, profileData) => {
  if (isMockFirebase) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const newProfile = { uid, ...profileData, createdAt: new Date().toISOString() };
    users.push(newProfile);
    localStorage.setItem('mock_users', JSON.stringify(users));
    return newProfile;
  } else {
    await setDoc(doc(db, 'users', uid), {
      ...profileData,
      createdAt: new Date().toISOString()
    });
  }
};

// ---------------- PRODUCTS CRUD ----------------
export const getProductsDb = async () => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('mock_products') || '[]');
  } else {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  }
};

export const getProductByIdDb = async (id) => {
  if (isMockFirebase) {
    const products = JSON.parse(localStorage.getItem('mock_products') || '[]');
    return products.find(p => p.id === id) || null;
  } else {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }
};

export const createProductDb = async (productData) => {
  if (isMockFirebase) {
    const products = JSON.parse(localStorage.getItem('mock_products') || '[]');
    const newProduct = {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      ...productData,
      rating: 5.0
    };
    products.push(newProduct);
    localStorage.setItem('mock_products', JSON.stringify(products));
    return newProduct;
  } else {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return { id: docRef.id, ...productData };
  }
};

export const updateProductDb = async (id, updatedData) => {
  if (isMockFirebase) {
    const products = JSON.parse(localStorage.getItem('mock_products') || '[]');
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData };
      localStorage.setItem('mock_products', JSON.stringify(products));
      return products[index];
    }
    throw new Error('Product not found.');
  } else {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
  }
};

export const deleteProductDb = async (id) => {
  if (isMockFirebase) {
    const products = JSON.parse(localStorage.getItem('mock_products') || '[]');
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('mock_products', JSON.stringify(filtered));
    return true;
  } else {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return true;
  }
};

// ---------------- CATEGORIES CRUD ----------------
export const getCategoriesDb = async () => {
  if (isMockFirebase) {
    return JSON.parse(localStorage.getItem('mock_categories') || '[]');
  } else {
    const snap = await getDocs(collection(db, 'categories'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// ---------------- ORDERS CRUD ----------------
export const getOrdersDb = async () => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('mock_orders') || '[]');
  } else {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  }
};

export const createOrderDb = async (orderData) => {
  if (isMockFirebase) {
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const newOrder = {
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('mock_orders', JSON.stringify(orders));
    return newOrder;
  } else {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...orderData, status: 'pending' };
  }
};

export const updateOrderStatusDb = async (id, status, riderId = null) => {
  if (isMockFirebase) {
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      if (riderId) orders[index].riderId = riderId;
      localStorage.setItem('mock_orders', JSON.stringify(orders));
      return orders[index];
    }
    throw new Error('Order not found.');
  } else {
    const docRef = doc(db, 'orders', id);
    const updates = { status };
    if (riderId) updates.riderId = riderId;
    await updateDoc(docRef, updates);
    return { id, ...updates };
  }
};

export const updateOrderFieldsDb = async (id, fields) => {
  if (isMockFirebase) {
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...fields };
      localStorage.setItem('mock_orders', JSON.stringify(orders));
      return orders[index];
    }
    throw new Error('Order not found.');
  } else {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, fields);
    return { id, ...fields };
  }
};

// ---------------- ADDRESSES CRUD ----------------
export const getAddressesDb = async (userId) => {
  if (isMockFirebase) {
    const userKey = `addresses_${userId}`;
    return JSON.parse(localStorage.getItem(userKey) || '[]');
  } else {
    const q = query(collection(db, 'addresses'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

export const createAddressDb = async (userId, addressData) => {
  if (isMockFirebase) {
    const userKey = `addresses_${userId}`;
    const addresses = JSON.parse(localStorage.getItem(userKey) || '[]');
    const newAddr = {
      id: 'addr_' + Math.random().toString(36).substr(2, 9),
      ...addressData,
      userId
    };
    addresses.push(newAddr);
    localStorage.setItem(userKey, JSON.stringify(addresses));
    return newAddr;
  } else {
    const docRef = await addDoc(collection(db, 'addresses'), { ...addressData, userId });
    return { id: docRef.id, ...addressData };
  }
};

// ---------------- RIDERS CRUD ----------------
export const getRidersDb = async () => {
  if (isMockFirebase) {
    return JSON.parse(localStorage.getItem('mock_riders') || '[]');
  } else {
    const snap = await getDocs(collection(db, 'riders'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

export const updateRiderLocationDb = async (riderId, lat, lng, status = 'idle') => {
  if (isMockFirebase) {
    const riders = JSON.parse(localStorage.getItem('mock_riders') || '[]');
    const index = riders.findIndex(r => r.id === riderId);
    const updatedRider = {
      id: riderId,
      status,
      currentLatitude: lat,
      currentLongitude: lng,
      updatedAt: new Date().toISOString()
    };
    if (index !== -1) {
      riders[index] = { ...riders[index], ...updatedRider };
    } else {
      riders.push(updatedRider);
    }
    localStorage.setItem('mock_riders', JSON.stringify(riders));
    return updatedRider;
  } else {
    await setDoc(doc(db, 'riders', riderId), {
      status,
      currentLatitude: lat,
      currentLongitude: lng,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
};

// ---------------- TRACKING CRUD ----------------
export const updateOrderTrackingDb = async (orderId, lat, lng, status) => {
  if (isMockFirebase) {
    const trackingList = JSON.parse(localStorage.getItem('mock_tracking') || '[]');
    const index = trackingList.findIndex(t => t.orderId === orderId);
    const update = {
      orderId,
      status,
      coordinates: { latitude: lat, longitude: lng },
      updatedAt: new Date().toISOString()
    };
    if (index !== -1) {
      trackingList[index] = update;
    } else {
      trackingList.push(update);
    }
    localStorage.setItem('mock_tracking', JSON.stringify(trackingList));
    // Dispatch local custom event for active tab listening
    window.dispatchEvent(new CustomEvent('mock_tracking_update', { detail: update }));
    // Dispatch general storage event for cross-tab listening
    window.dispatchEvent(new Event('storage'));
    return update;
  } else {
    await setDoc(doc(db, 'tracking', orderId), {
      status,
      coordinates: { latitude: lat, longitude: lng },
      updatedAt: new Date().toISOString()
    });
  }
};

export const subscribeToOrderTrackingDb = (orderId, callback) => {
  if (isMockFirebase) {
    const handleStorageChange = (e) => {
      if (e.key === 'mock_tracking' || !e.key) {
        const trackingList = JSON.parse(localStorage.getItem('mock_tracking') || '[]');
        const trackDoc = trackingList.find(t => t.orderId === orderId);
        if (trackDoc) {
          callback(trackDoc);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleLocalUpdate = (e) => {
      if (e.detail?.orderId === orderId) {
        callback(e.detail);
      }
    };
    window.addEventListener('mock_tracking_update', handleLocalUpdate);

    // Initial load
    const trackingList = JSON.parse(localStorage.getItem('mock_tracking') || '[]');
    const trackDoc = trackingList.find(t => t.orderId === orderId);
    if (trackDoc) {
      callback(trackDoc);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mock_tracking_update', handleLocalUpdate);
    };
  } else {
    const { onSnapshot } = import('firebase/firestore');
    const docRef = doc(db, 'tracking', orderId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ orderId: docSnap.id, ...docSnap.data() });
      }
    });
  }
};

// ---------------- NOTIFICATIONS CRUD ----------------
export const getNotificationsDb = async (userId) => {
  if (isMockFirebase) {
    const notifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    return notifs.filter(n => n.userId === userId);
  } else {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

export const createNotificationDb = async (userId, title, message) => {
  if (isMockFirebase) {
    const notifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    const newNotif = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifs.push(newNotif);
    localStorage.setItem('mock_notifications', JSON.stringify(notifs));
    return newNotif;
  } else {
    const docRef = await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, userId, title, message, read: false };
  }
};

export const markNotificationReadDb = async (notifId) => {
  if (isMockFirebase) {
    const notifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    const index = notifs.findIndex(n => n.id === notifId);
    if (index !== -1) {
      notifs[index].read = true;
      localStorage.setItem('mock_notifications', JSON.stringify(notifs));
    }
  } else {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  }
};
