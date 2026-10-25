'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function NavigationProgressBar() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let timer1: NodeJS.Timeout
    let timer2: NodeJS.Timeout
    let timer3: NodeJS.Timeout
    let timerFinish: NodeJS.Timeout

    const handleStart = (url: string) => {
      // Don't animate if navigating to identical route
      if (url === router.asPath) return

      setIsVisible(true)
      setProgress(35)

      timer1 = setTimeout(() => {
        setProgress(70)
      }, 100)

      timer2 = setTimeout(() => {
        setProgress(88)
      }, 350)

      timer3 = setTimeout(() => {
        setProgress(95)
      }, 800)
    }

    const handleComplete = () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)

      setProgress(100)
      timerFinish = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => setProgress(0), 180)
      }, 180)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timerFinish)
    }
  }, [router])

  if (!isVisible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 nav-progress-glow transition-all duration-180 ease-out shadow-[0_0_12px_rgba(56,189,248,0.8)]"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  )
}
