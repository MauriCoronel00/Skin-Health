import { createClient } from '@supabase/supabase-js';
const s = createClient('https://utiwzektfctdfyhgqode.supabase.co', 'sb_publishable_r25cWAmCVO5PDGKvCqe_VA_5SX0yqhD');

// Try to find the function signature by querying pg_proc
const r1 = await s.rpc('crear_perfil_nuevo_usuario', {p_email:'test@test.com'});
console.log('try p_email:', JSON.stringify(r1));
