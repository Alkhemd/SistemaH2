require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('orden_trabajo').select('*').limit(1);
    if (error) {
        console.error("Error querying table:", error);
    } else {
        console.log('Fields in orden_trabajo:', Object.keys(data[0] || {}));
    }
}
check();
