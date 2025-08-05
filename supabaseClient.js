import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bgrnxlvymqaoworjzohn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncm54bHZ5bXFhb3dvcmp6b2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTM4MjEsImV4cCI6MjA2OTk4OTgyMX0.OQDYctOyVp5wgSinY9hXmLkhjslidHIx1UCquszFEdY'

export const supabase = createClient(supabaseUrl, supabaseKey)
