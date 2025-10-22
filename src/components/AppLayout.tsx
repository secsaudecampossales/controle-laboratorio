import Navigation from './Navigation'
import AuthGuard from './AuthGuard'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Navigation />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}