// backend/debug-db.js
const pool = require('./src/db/pool');  // 👈 Use the same pool as the app

(async () => {
  try {
    const res = await pool.query(`
      SELECT
        current_database(),
        current_schema(),
        current_setting('search_path') AS search_path,
        to_regclass('public.students') AS students_regclass;
    `);

    console.log('DB PROBE RESULT:');
    console.log(res.rows);
  } catch (err) {
    console.error('DB PROBE ERROR:', err);
  } finally {
    await pool.end();
    process.exit();
  }
})();
