import Link from "next/link";

export default function HowTo(): JSX.Element {
  return (
    <main className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          How to Use the Team Assigner
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Adding Players
            </h2>
            <p className="text-gray-800 mb-2">
              1. Enter each player&apos;s name in the input field
            </p>
            <p className="text-gray-800">
              2. Click the plus button or press Enter to add them to the list
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Linking Players
            </h2>
            <p className="text-gray-800 mb-2">
              1. Click on two or more player names to select them
            </p>
            <p className="text-gray-800 mb-2">
              2. Click the link button (chain icon) to keep them on the same
              team
            </p>
            <p className="text-gray-800">
              3. Linked players will always be assigned to the same team
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Setting Team Count
            </h2>
            <p className="text-gray-800 mb-2">
              1. Use the number input to set how many teams you want
            </p>
            <p className="text-gray-800">2. Minimum is 2 teams</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Generating Teams
            </h2>
            <p className="text-gray-800 mb-2">
              1. Click &quot;Assign Teams&quot; to create random balanced teams
            </p>
            <p className="text-gray-800 mb-2">
              2. Teams will be as evenly sized as possible
            </p>
            <p className="text-gray-800">
              3. Click again to get different random combinations
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Tips</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              <li>You can link any number of players together</li>
              <li>Remove players by clicking the X next to their name</li>
              <li>Remove links by clicking the X next to the linked group</li>
              <li>Teams will automatically get fun random names</li>
            </ul>
          </section>

          <div className="pt-4">
            <Link href="/">
              <button className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300">
                Back to Team Assigner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}



