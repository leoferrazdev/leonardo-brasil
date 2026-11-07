import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://juvwfxnlusrnvcarkrmc.supabase.co";
const supabaseAnonKey = "sb_publishable_yHgMqSz5KFAAPpWUht81vA_Rrjy36VF";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const { data, error } = await supabase.auth.getSession();

if (error) {
  console.error("Erro na conexão Supabase:", error.message);
  process.exit(1);
} else {
  console.log("Conexão com Supabase validada com sucesso!");
}
