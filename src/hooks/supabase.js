import { createClient } from "@supabase/supabase-js";

let supabaseClient;

export const useSupabase = () => {
  return supabaseClient;
};

export const createSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    supabaseClient = supabase;
  }
};
