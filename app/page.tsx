import FigmaUrlForm from "./components/FigmaUrlForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Nolan AI</h1>
          <p className="text-lg text-muted-foreground">
            Transform your Figma prototypes into engaging demo videos with smart zoom-ins and professional transitions.
          </p>
          <div className="mt-8">
            <FigmaUrlForm />
          </div>
        </div>
      </div>
    </main>
  )
}

