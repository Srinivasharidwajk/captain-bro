import { supabase, isMockSupabase } from './supabaseClient';

// Helper to convert snake_case to camelCase for user profile mapping
const snakeToCamel = (str) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
const convertKeysToCamel = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToCamel);
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = snakeToCamel(key);
      acc[newKey] = typeof obj[key] === 'object' ? convertKeysToCamel(obj[key]) : obj[key];
      return acc;
    }, {});
  }
  return obj;
};

// Seed default mock users if not present in localStorage
const getMockUsers = () => JSON.parse(localStorage.getItem('mock_users') || '[]');
const saveMockUsers = (users) => localStorage.setItem('mock_users', JSON.stringify(users));

export const registerUser = async (email, password, fullName, phone, role = 'customer') => {
  if (isMockSupabase) {
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
    
    localStorage.setItem('active_mock_user', JSON.stringify(newUser));
    window.dispatchEvent(new Event('storage'));
    return newUser;
  } else {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    if (!data.user) throw new Error('Signup failed.');

    // Save profile in public.users table
    const profile = {
      uid: data.user.id,
      email,
      full_name: fullName,
      phone,
      role,
      created_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('users')
      .insert([profile]);

    if (profileError) throw profileError;

    return convertKeysToCamel(profile);
  }
};

export const loginUser = async (email, password) => {
  if (isMockSupabase) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getMockUsers();
    
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed.');

    // Fetch user profile from the database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', data.user.id)
      .single();

    if (profileError || !profile) {
      return { uid: data.user.id, email: data.user.email, role: 'customer' };
    }

    return convertKeysToCamel(profile);
  }
};

export const sendPhoneOtp = async (phone) => {
  if (isMockSupabase) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, message: 'Mock OTP sent' };
  } else {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone
    });
    if (error) throw error;
    return { success: true, data };
  }
};

export const verifyPhoneOtp = async (phone, otp) => {
  if (isMockSupabase) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getMockUsers();
    
    // Look for matching user profile or create one
    let user = users.find(u => u.phone === phone);
    if (!user) {
      if (phone === '9876543210') {
        user = { uid: 'mock_admin', email: 'admin@wfoods.com', fullName: 'System Admin', phone: '9876543210', role: 'admin' };
      } else if (phone === '9876543211') {
        user = { uid: 'mock_rider', email: 'rider@wfoods.com', fullName: 'Super Rider', phone: '9876543211', role: 'rider' };
      } else {
        user = {
          uid: 'u_' + Math.random().toString(36).substr(2, 9),
          email: `${phone}@captainbro.com`,
          fullName: 'Customer ' + phone.slice(-4),
          phone,
          role: 'customer',
          createdAt: new Date().toISOString()
        };
      }
      users.push(user);
      saveMockUsers(users);
    }
    
    localStorage.setItem('active_mock_user', JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
    return user;
  } else {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: 'sms'
    });
    if (error) throw error;
    if (!data.user) throw new Error('Verification failed.');

    // Fetch or create user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', data.user.id)
      .single();

    if (profileError || !profile) {
      const newProfile = {
        uid: data.user.id,
        email: data.user.email || `${phone}@captainbro.com`,
        full_name: 'Customer ' + phone.slice(-4),
        phone,
        role: 'customer',
        created_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([newProfile]);
        
      if (insertError) console.error('Error inserting user profile:', insertError);
      return convertKeysToCamel(newProfile);
    }

    return convertKeysToCamel(profile);
  }
};

// Legacy compatibility wrapper
export const loginWithPhone = async (phone) => {
  return await verifyPhoneOtp(phone, '123456');
};

export const logoutUser = async () => {
  if (isMockSupabase) {
    localStorage.removeItem('active_mock_user');
    window.dispatchEvent(new Event('storage'));
  } else {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

export const resetPassword = async (email) => {
  if (isMockSupabase) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } else {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  }
};

export const subscribeToAuth = (callback) => {
  if (isMockSupabase) {
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
    // Initial fetch of current session user if exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('uid', session.user.id)
          .single()
          .then(({ data: profile }) => {
            callback(profile ? convertKeysToCamel(profile) : { uid: session.user.id, email: session.user.email, role: 'customer' });
          });
      } else {
        callback(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('uid', session.user.id)
          .single();
        callback(profile ? convertKeysToCamel(profile) : { uid: session.user.id, email: session.user.email, role: 'customer' });
      } else {
        callback(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }
};
