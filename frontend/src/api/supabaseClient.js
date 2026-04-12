import { createClient } from '@supabase/supabase-js';

// Mengambil URL dan KEY dari file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Inisialisasi client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);