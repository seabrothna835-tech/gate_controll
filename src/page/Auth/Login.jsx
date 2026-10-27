// src/pages/Login.jsx
import React, { useEffect, useState } from 'react'
import logo from '../../assets/ppap-header-logo.png'
import { useNavigate } from 'react-router-dom'
import { keycloak, initKeycloak } from '../../keyCloak'

const REDIRECT_FLAG = 'kc_redirect_at'

function Login() {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const goToKeycloak = () => {
        sessionStorage.setItem(REDIRECT_FLAG, String(Date.now()))
        keycloak.login({ redirectUri: `${window.location.origin}/dashboard` })

        // keycloak.login({ redirectUri: `${window.location.origin}/select-landGate` })
    }

    useEffect(() => {
        let cancelled = false

        ;(async () => {
            try {
                const authenticated = await initKeycloak() // check-sso
                if (cancelled) return

                // Already signed in: go straight to the dashboard
                if (authenticated) {
                    sessionStorage.removeItem(REDIRECT_FLAG)
                    navigate('/dashboard', { replace: true })
                    return
                }

                // Loop guard: came back from Keycloak without logging in
                const last = Number(sessionStorage.getItem(REDIRECT_FLAG) || 0)
                if (Date.now() - last < 15000) {
                    sessionStorage.removeItem(REDIRECT_FLAG)
                    setError('ការចូលប្រព័ន្ធមិនបានបញ្ចប់ទេ។ សូមព្យាយាមម្ដងទៀត។')
                    return
                }

                // Not signed in: show the Keycloak login page
                goToKeycloak()
            } catch (err) {
                if (cancelled) return
                console.error('Keycloak error', err)
                setError('មិនអាចភ្ជាប់ទៅ SSO បានទេ។')
            }
        })()

        return () => {
            cancelled = true
        }
    }, [navigate])

    return (
        <div className="min-h-screen bg-[#e9e9e9] text-[#3d2d31] font-hanuman">
            <div className="w-96 p-6"><img src={logo} alt="ppap" /></div>
            <div className="flex w-full items-center justify-center p-6">
                <div className="w-full max-w-[380px] rounded-[28px] bg-[#f5f4f4] p-8 text-center shadow-[0_18px_30px_rgba(0,0,0,0.08)]">
                    {error ? (
                        <>
                            <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={goToKeycloak}
                                className="h-10 w-36 rounded-full bg-[#4498d0] text-white shadow-[0_6px_14px_rgba(68,152,208,0.45)] hover:brightness-105"
                            >
                                ចូលប្រព័ន្ធ
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#4498d0]/20 border-t-[#4498d0]" />
                            <p>កំពុងបញ្ជូនទៅកាន់ទំព័រចូលប្រព័ន្ធ...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login