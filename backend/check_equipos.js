const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('equipo').select('id, nombre, estado_equipo');
    console.log("Equipos:");
    console.table(data);
    console.log("Error:", error);
}

check();
