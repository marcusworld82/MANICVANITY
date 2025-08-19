import { supabase } from '../lib/supabase';
import type { Address } from '../types/database';

export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }

  return data || [];
};

export const createAddress = async (address: Omit<Address, 'id'>): Promise<Address | null> => {
  // If this is being set as default, unset other defaults first
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', address.user_id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert(address)
    .select()
    .single();

  if (error) {
    console.error('Error creating address:', error);
    return null;
  }

  return data;
};

export const updateAddress = async (id: string, updates: Partial<Address>): Promise<Address | null> => {
  // If this is being set as default, unset other defaults first
  if (updates.is_default && updates.user_id) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', updates.user_id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    return null;
  }

  return data;
};

export const deleteAddress = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting address:', error);
    return false;
  }

  return true;
};