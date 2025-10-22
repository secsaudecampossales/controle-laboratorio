import Navigation from './Navigation'
import AuthGuard from './AuthGuard'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">
        <Navigation />
        <main className="flex-1 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 overflow-x-auto lg:ml-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}