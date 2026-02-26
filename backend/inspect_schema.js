require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log("Checking orden_trabajo...");
    const { data: ordenes, error: err1 } = await supabase.from('orden_trabajo').select('*').limit(1);
    if (err1) console.error(err1);
    else if (ordenes && ordenes.length > 0) console.log(Object.keys(ordenes[0]));
    else console.log("No orders found to inspect");

    console.log("\nChecking equipo...");
    const { data: equipos, error: err2 } = await supabase.from('equipo').select('*').limit(1);
    if (err2) console.error(err2);
    else if (equipos && equipos.length > 0) console.log(Object.keys(equipos[0]));
    else console.log("No equipment found to inspect");

    console.log("\nChecking actividad...");
    const { data: acts, error: err3 } = await supabase.from('actividad').select('*').limit(1);
    if (err3) console.error(err3);
    else if (acts && acts.length > 0) console.log(Object.keys(acts[0]));
    else console.log("No activities found to inspect");
}

inspectSchema();
