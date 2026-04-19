// test-db.js
const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:FusionBowl%40321@db.eeuplzaqmyetmzgajhlu.supabase.co:5432/postgres?sslmode=require",
});

client.connect()
  .then(() => {
    console.log("Connected!");
    return client.end();
  })
  .catch(err => console.error("Error:", err));