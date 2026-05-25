import { supabase } from './supabaseClient'

const PASSWORD_PEPPER = 'BananaSecurePepper2024!'

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function applyPepper(password) {
  return sha256(password + PASSWORD_PEPPER).then(hash => `P${hash}`)
}

export function validatePassword(password) {
  const errors = []
  if (password.length < 8) errors.push('At least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('One number')
  if (!/[!@#$%^&*]/.test(password)) errors.push('One special character (!@#$%^&*)')
  return errors
}

export const signUp = async (email, password) => {
  const pepperedPassword = await applyPepper(password)
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pepperedPassword,
  })
  return { data, error }
}

export const login = async (email, password) => {
  const pepperedPassword = await applyPepper(password)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pepperedPassword,
  })
  return { data, error }
}

export const logout = async () => {
  await supabase.auth.signOut()
}
