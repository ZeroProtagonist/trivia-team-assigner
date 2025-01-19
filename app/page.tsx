import dynamic from 'next/dynamic'
const TeamAssigner = dynamic(() => import('@/components/TeamAssigner'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <TeamAssigner />
    </main>
  )
}