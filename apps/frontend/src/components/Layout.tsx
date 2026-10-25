import { ReactNode, createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import Sidebar from './Sidebar'

export const LayoutContext = createContext<boolean>(false)

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const isInsideLayout = useContext(LayoutContext)

  // If already inside a persistent root Layout (from _app.tsx), pass children directly
  // to avoid remounting Sidebar and to preserve seamless 60fps page transitions
  if (isInsideLayout) {
    return <>{children}</>
  }

  return (
    <LayoutContext.Provider value={true}>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-200">
        <Sidebar />
        <main className="lg:ml-72 min-h-screen">
          <div key={router.pathname} className="animate-fade-in-smooth">
            {children}
          </div>
        </main>
      </div>
    </LayoutContext.Provider>
  )
}
