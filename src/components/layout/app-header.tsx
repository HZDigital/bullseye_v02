export default function AppHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex items-center px-4 py-2 bg-background w-full">      
      <div className="w-full flex items-center px-2">
        {children}
      </div>
    </header>
  )
}