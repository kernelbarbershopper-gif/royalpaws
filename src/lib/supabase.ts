import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vcddxvvcxnjevgamjalv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZGR4dnZjeG5qZXZnYW1qYWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NjQ3NTcsImV4cCI6MjA5OTA0MDc1N30.ZVOoeB_umpEvAeCsftO62ljUfxvsF8z-Le4T5ngl-l4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
