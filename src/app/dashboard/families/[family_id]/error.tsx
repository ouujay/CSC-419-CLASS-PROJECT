"use client"

export default function error() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <h2 className="text-2xl text-destructive">Something went wrong!</h2>
      <p className="text-muted-foreground">We encountered an error while loading the family data.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
}
