/*
 * Configuração pública do Supabase para o frontend do Gabarita.
 * Preencha os dois campos no painel do Supabase.
 * A publishable key (ou a antiga anon key) pode ficar no frontend COM RLS habilitado.
 * Nunca coloque aqui service_role, secret key ou senha do banco.
 */
window.GABARITA_SUPABASE_CONFIG = {
  url: 'https://ataklomxnpepcqxbuahs.supabase.co/auth/v1/callback',       // Ex.: https://abcdefghijk.supabase.co
  anonKey: 'sb_publishable_OTjpu7GI6jhUDiUILwc9VQ_LCD_ffsz'    // Ex.: sb_publishable_... (ou a chave anon legada)
};
