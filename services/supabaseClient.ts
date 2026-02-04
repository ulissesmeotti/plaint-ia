import { createClient } from '@supabase/supabase-js';

// Using the credentials provided by the user
const supabaseUrl = 'https://bnerpruusmkmjyqhfyps.supabase.co';
// Note: The user provided a key formatted as 'sb_publishable_...'. 
// In a standard setup, this is usually the 'anon' key (starting with eyJ...). 
// We will use the provided string, assuming it is the correct public key for this specific instance.
const supabaseKey = 'sb_publishable_OF_Z318DXetiugEUYKVfEQ_yFCP5Z27';

export const supabase = createClient(supabaseUrl, supabaseKey);
