import { supabase, isMockSupabase } from './supabaseClient';
import { MOCK_PRODUCTS, CATEGORIES } from '../utils/constants';

// Helper to convert camelCase to snake_case (with special total -> total_amount mapping)
const camelToSnake = (str) => {
  if (str === 'total') return 'total_amount';
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Helper to convert snake_case to camelCase (with special total_amount -> total mapping)
const snakeToCamel = (str) => {
  if (str === 'total_amount') return 'total';
  return str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
};

const convertKeys = (obj, converter) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => convertKeys(item, converter));
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      // Don't recursively convert keys inside JSON columns like 'items'
      if (key === 'items' && converter === snakeToCamel) {
        acc[key] = obj[key];
        return acc;
      }
      const newKey = converter(key);
      acc[newKey] = typeof obj[key] === 'object' && key !== 'items' ? convertKeys(obj[key], converter) : obj[key];
      return acc;
    }, {});
  }
  return obj;
};

export const toSnake = (obj) => convertKeys(obj, camelToSnake);
export const toCamel = (obj) => convertKeys(obj, snakeToCamel);

// Initialize mock collections in localStorage if they don't exist
if (isMockSupabase) {
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
  if (isMockSupabase) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    return users.find(u => u.uid === uid) || null;
  } else {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return toCamel(data);
  }
};

export const getUsersDb = async () => {
  if (isMockSupabase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('mock_users') || '[]');
  } else {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return toCamel(data);
  }
};

export const createUserProfileDb = async (uid, profileData) => {
  if (isMockSupabase) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const newProfile = { uid, ...profileData, createdAt: new Date().toISOString() };
    users.push(newProfile);
    localStorage.setItem('mock_users', JSON.stringify(users));
    return newProfile;
  } else {
    const profile = toSnake({ uid, ...profileData, createdAt: new Date().toISOString() });
    const { data, error } = await supabase
      .from('users')
      .insert([profile])
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

// ---------------- PRODUCTS CRUD ----------------
export const getProductsDb = async () => {
  if (isMockSupabase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('mock_products') || '[]');
  } else {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw error;
    return toCamel(data);
  }
};

export const getProductByIdDb = async (id) => {
  if (isMockSupabase) {
    const products = JSON.parse(localStorage.getItem('mock_products') || '[]');
    return products.find(p => p.id === id) || null;
  } else {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return toCamel(data);
  }
};

export const createProductDb = async (productData) => {
  if (isMockSupabase) {
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
    const product = toSnake(productData);
    if (!product.id) {
      product.id = 'p_' + Math.random().toString(36).substr(2, 9);
    }
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

export const updateProductDb = async (id, updatedData) => {
  if (isMockSupabase) {
    const products = JSON.parse(localStorage.getItem('mock_products') || '[]');
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData };
      localStorage.setItem('mock_products', JSON.stringify(products));
      return products[index];
    }
    throw new Error('Product not found.');
  } else {
    const updates = toSnake(updatedData);
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

export const deleteProductDb = async (id) => {
  if (isMockSupabase) {
    const products = JSON.parse(localStorage.getItem('mock_products') || '[]');
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('mock_products', JSON.stringify(filtered));
    return true;
  } else {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};

// ---------------- CATEGORIES CRUD ----------------
export const getCategoriesDb = async () => {
  if (isMockSupabase) {
    return JSON.parse(localStorage.getItem('mock_categories') || '[]');
  } else {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) throw error;
    return toCamel(data);
  }
};

// ---------------- ORDERS CRUD ----------------
export const getOrdersDb = async () => {
  if (isMockSupabase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('mock_orders') || '[]');
  } else {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return toCamel(data);
  }
};

export const createOrderDb = async (orderData) => {
  if (isMockSupabase) {
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
    const orderId = 'ord_' + Math.random().toString(36).substr(2, 9);
    const order = toSnake({
      id: orderId,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

export const updateOrderStatusDb = async (id, status, riderId = null) => {
  if (isMockSupabase) {
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
    const updates = toSnake({ status, riderId });
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

export const updateOrderFieldsDb = async (id, fields) => {
  if (isMockSupabase) {
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...fields };
      localStorage.setItem('mock_orders', JSON.stringify(orders));
      return orders[index];
    }
    throw new Error('Order not found.');
  } else {
    const updates = toSnake(fields);
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

// ---------------- ADDRESSES CRUD ----------------
export const getAddressesDb = async (userId) => {
  if (isMockSupabase) {
    const userKey = `addresses_${userId}`;
    return JSON.parse(localStorage.getItem(userKey) || '[]');
  } else {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return toCamel(data);
  }
};

export const createAddressDb = async (userId, addressData) => {
  if (isMockSupabase) {
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
    const id = 'addr_' + Math.random().toString(36).substr(2, 9);
    const address = toSnake({ id, ...addressData, userId });
    const { data, error } = await supabase
      .from('addresses')
      .insert([address])
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

// ---------------- RIDERS CRUD ----------------
export const getRidersDb = async () => {
  if (isMockSupabase) {
    return JSON.parse(localStorage.getItem('mock_riders') || '[]');
  } else {
    const { data, error } = await supabase
      .from('riders')
      .select('*');
    if (error) throw error;
    return toCamel(data);
  }
};

export const updateRiderLocationDb = async (riderId, lat, lng, status = 'idle') => {
  if (isMockSupabase) {
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
    const rider = toSnake({
      id: riderId,
      status,
      currentLatitude: lat,
      currentLongitude: lng,
      updatedAt: new Date().toISOString()
    });
    const { data, error } = await supabase
      .from('riders')
      .upsert(rider)
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

// ---------------- TRACKING CRUD ----------------
export const updateOrderTrackingDb = async (orderId, lat, lng, status) => {
  if (isMockSupabase) {
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
    window.dispatchEvent(new Event('storage'));
    return update;
  } else {
    // In real mode, retrieve the order's assigned rider, and update that rider's location coordinates
    const { data: order } = await supabase
      .from('orders')
      .select('rider_id')
      .eq('id', orderId)
      .single();
      
    if (order?.rider_id) {
      await updateRiderLocationDb(
        order.rider_id,
        lat,
        lng,
        status === 'delivered' ? 'idle' : 'delivering'
      );
    }
    return { orderId, status, coordinates: { latitude: lat, longitude: lng } };
  }
};

export const subscribeToOrderTrackingDb = (orderId, callback) => {
  if (isMockSupabase) {
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
    let channel = null;
    let isActive = true;

    const setup = async () => {
      const { data: order } = await supabase
        .from('orders')
        .select('rider_id')
        .eq('id', orderId)
        .single();
        
      if (!isActive) return;

      if (order?.rider_id) {
        // Fetch initial rider coordinate
        const { data: rider } = await supabase
          .from('riders')
          .select('*')
          .eq('id', order.rider_id)
          .single();
          
        if (rider && isActive) {
          callback({
            orderId,
            status: rider.status,
            coordinates: { latitude: rider.current_latitude, longitude: rider.current_longitude },
            updatedAt: rider.updated_at
          });
        }

        // Listen for Postgres realtime updates
        channel = supabase
          .channel(`rider-tracking-${order.rider_id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'riders',
            filter: `id=eq.${order.rider_id}`
          }, (payload) => {
            if (isActive) {
              const riderData = payload.new;
              callback({
                orderId,
                status: riderData.status,
                coordinates: { latitude: riderData.current_latitude, longitude: riderData.current_longitude },
                updatedAt: riderData.updated_at
              });
            }
          })
          .subscribe();
      }
    };

    setup();

    return () => {
      isActive = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }
};

// ---------------- NOTIFICATIONS CRUD ----------------
export const getNotificationsDb = async (userId) => {
  if (isMockSupabase) {
    const notifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    return notifs.filter(n => n.userId === userId);
  } else {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return toCamel(data);
  }
};

export const createNotificationDb = async (userId, title, message) => {
  if (isMockSupabase) {
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
    const notif = toSnake({
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    });
    const { data, error } = await supabase
      .from('notifications')
      .insert([notif])
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
};

export const markNotificationReadDb = async (notifId) => {
  if (isMockSupabase) {
    const notifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    const index = notifs.findIndex(n => n.id === notifId);
    if (index !== -1) {
      notifs[index].read = true;
      localStorage.setItem('mock_notifications', JSON.stringify(notifs));
    }
  } else {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notifId);
    if (error) throw error;
  }
};

export const subscribeToOrdersDb = (callback) => {
  if (isMockSupabase) {
    const handleStorageChange = (e) => {
      if (e.key === 'mock_orders' || !e.key) {
        const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        callback(toCamel(orders));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Initial load
    const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    callback(toCamel(orders));
    
    return () => window.removeEventListener('storage', handleStorageChange);
  } else {
    // Initial load
    getOrdersDb().then(callback).catch(console.error);

    // Subscribe to realtime changes
    const channel = supabase
      .channel('realtime-orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, async () => {
        const orders = await getOrdersDb();
        callback(orders);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
};
