import { useState } from 'react'
import { login, signUp, validatePassword } from '../auth'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [passwordErrors, setPasswordErrors] = useState([])

  const handleSubmit = async () => {
    setMessage('')
    setPasswordErrors([])

    if (!isLogin) {
      const errors = validatePassword(password)
      if (errors.length > 0) {
        setPasswordErrors(errors)
        setMessage('Password does not meet requirements')
        return
      }
    }

    if (isLogin) {
      const { error } = await login(email, password)
      if (error) setMessage(error.message)
      else setMessage('Login successful')
    } else {
      const { error } = await signUp(email, password)
      if (error) setMessage(error.message)
      else setMessage('Signup successful - Check your email')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>

        <input
          className="w-full mb-4 p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && passwordErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-700 mb-1">Password must include:</p>
            <ul className="text-xs text-red-600 space-y-0.5 list-disc list-inside">
              {passwordErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#1D4ED8] transition"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        {message && <p className="mt-4 text-sm text-[#111827]">{message}</p>}

        <div className="mt-6 text-sm text-[#6B7280]">
          {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setMessage(''); setPasswordErrors([]) }}
            className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
