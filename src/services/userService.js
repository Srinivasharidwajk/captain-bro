import { getUsersDb } from '../supabase/database';

export const getUsers = async () => {
  return await getUsersDb();
};
