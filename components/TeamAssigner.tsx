echo "// Team Assigner component for trivia teams" > temp.txt
cat temp.txt components/TeamAssigner.tsx > temp2.txt
mv temp2.txt components/TeamAssigner.tsx
rm temp.txt

"use client"

import React, { useState } from 'react';
import { X, Plus, Link as LinkIcon, Shuffle } from 'lucide-react';

const TeamAssigner = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [links, setLinks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [numTeams, setNumTeams] = useState(2);

  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayer.trim()) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const removePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    setLinks(links.filter(link => !link.includes(players[index])));
  };

  const togglePlayerSelection = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== player));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const createLink = () => {
    if (selectedPlayers.length >= 2) {
      setLinks([...links, selectedPlayers]);
      setSelectedPlayers([]);
    }
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const generateTeamName = () => {
    const adjectives = ['Mighty', 'Clever', 'Witty', 'Blazing', 'Quantum', 'Epic', 'Cosmic'];
    const nouns = ['Minds', 'Wizards', 'Dragons', 'Legends', 'Phoenixes', 'Titans', 'Scholars'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
      nouns[Math.floor(Math.random() * nouns.length)]
    }`;
  };

  const assignTeams = () => {
    if (players.length === 0) return;

    // Calculate ideal team sizes
    const totalPlayers = players.length;
    const baseTeamSize = Math.floor(totalPlayers / numTeams);
    const extraPlayers = totalPlayers % numTeams;

    // Initialize teams with names and empty member arrays
    const newTeams = Array.from({ length: numTeams }, (_, index) => ({
      name: generateTeamName(),
      members: [],
      targetSize: index < extraPlayers ? baseTeamSize + 1 : baseTeamSize
    }));

    // Create groups starting with linked players and unlinked players
    const linkedPlayers = new Set(links.flat());
    const unlinkedPlayers = players.filter(player => !linkedPlayers.has(player));
    const unlinkedGroups = unlinkedPlayers.map(player => [player]);
    
    // Combine and shuffle all groups
    const shuffledGroups = [...links, ...unlinkedGroups]
      .sort(() => Math.random() - 0.5)
      .sort((a, b) => b.length - a.length);

    // Assign groups to teams
    shuffledGroups.forEach(group => {
      // Find the team that's furthest from its target size and can accommodate this group
      const bestTeam = newTeams
        .filter(team => team.members.length + group.length <= team.targetSize)
        .sort((a, b) => {
          const aDiff = a.targetSize - a.members.length;
          const bDiff = b.targetSize - b.members.length;
          return bDiff - aDiff;
        })[0];

      if (bestTeam) {
        // If we found a suitable team, add the group to it
        bestTeam.members.push(...group);
      } else {
        // If no team can accommodate the group while maintaining even sizes,
        // add it to the team with the fewest members
        const teamWithFewestMembers = newTeams
          .sort((a, b) => a.members.length - b.members.length)[0];
        teamWithFewestMembers.members.push(...group);
      }
    });

    setTeams(newTeams);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Trivia Team Assigner</h2>
        
        <form onSubmit={addPlayer} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Players ({players.length})</h3>
          <div className="flex flex-wrap gap-2">
            {players.map((player, index) => (
              <div
                key={index}
                className={`p-2 rounded flex items-center gap-2 cursor-pointer ${
                  selectedPlayers.includes(player)
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-100'
                }`}
                onClick={() => togglePlayerSelection(player)}
              >
                {player}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlayer(index);
                  }}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">Links</h3>
            <button
              onClick={createLink}
              disabled={selectedPlayers.length < 2}
              className={`p-1 rounded ${
                selectedPlayers.length >= 2
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              {selectedPlayers.length > 0 
                ? `Selected: ${selectedPlayers.length} players`
                : 'Select 2+ players to link'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {links.map((link, index) => (
              <div key={index} className="p-2 bg-blue-100 rounded flex items-center gap-2">
                {link.join(' + ')}
                <button
                  onClick={() => removeLink(index)}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <label className="font-semibold">
              Number of Teams:
              <input
                type="number"
                min="2"
                value={numTeams}
                onChange={(e) => setNumTeams(Math.max(2, parseInt(e.target.value) || 2))}
                className="ml-2 p-1 w-16 border rounded"
              />
            </label>
            <button
              onClick={assignTeams}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              Assign Teams
            </button>
          </div>
        </div>

        {teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">{team.name}</h3>
                <ul className="list-disc list-inside">
                  {team.members.map((member, mIndex) => (
                    <li key={mIndex}>{member}</li>
                  ))}
                </ul>
                <div className="mt-2 text-sm text-gray-600">
                  Team Size: {team.members.length}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamAssigner;