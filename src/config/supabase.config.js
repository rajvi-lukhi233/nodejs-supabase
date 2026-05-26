const { createClient } = require("@supabase/supabase-js");

exports.supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_KEY,
);
