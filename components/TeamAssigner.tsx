"use client"

import React, { useState, FormEvent, MouseEvent } from 'react';
import { X, Plus, Link as LinkIcon, Shuffle } from 'lucide-react';

interface Team {
  name: string;
  members: string[];
  targetSize: number;
}

const TeamAssigner = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [links, setLinks] = useState<string[][]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [numTeams, setNumTeams] = useState(2);

  const addPlayer = (e: FormEvent) => {
    e.preventDefault();
    if (newPlayer.trim()) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    setLinks(links.filter(link => !link.includes(players[index])));
  };

  const togglePlayerSelection = (player: string) => {
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

  const removeLink = (index: number) => {
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

    const totalPlayers = players.length;
    const baseTeamSize = Math.floor(totalPlayers / numTeams);
    const extraPlayers = totalPlayers % numTeams;

    const newTeams: Team[] = Array.from({ length: numTeams }, (_, index) => ({
      name: generateTeamName(),
      members: [] as string[],
      targetSize: index < extraPlayers ? baseTeamSize + 1 : baseTeamSize
    }));

    const linkedPlayers = new Set(links.flat());
    const unlinkedPlayers = players.filter(player => !linkedPlayers.has(player));
    const unlinkedGroups = unlinkedPlayers.map(player => [player]);
    
    const shuffledGroups = [...links, ...unlinkedGroups]
      .sort(() => Math.random() - 0.5)
      .sort((a, b) => b.length - a.length);

    shuffledGroups.forEach(group => {
      const bestTeam = newTeams
        .filter(team => team.members.length + group.length <= team.targetSize)
        .sort((a, b) => {
          const aDiff = a.targetSize - a.members.length;
          const bDiff = b.targetSize - b.members.length;
          return bDiff - aDiff;
        })[0];

      if (bestTeam) {
        bestTeam.members = [...bestTeam.members, ...group];
      } else {
        const teamWithFewestMembers = newTeams
          .sort((a, b) => a.members.length - b.members.length)[0];
        teamWithFewestMembers.members = [...teamWithFewestMembers.members, ...group];
      }
    });

    setTeams(newTeams);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Trivia Team Assigner</h1>
        
        <form onSubmit={addPlayer} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newPlayer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPlayer(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
            aria-label="Player name input"
          />
          <button 
            type="submit" 
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 flex items-center shadow-sm"
            aria-label="Add player"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Players ({players.length})</h2>
          <div className="flex flex-wrap gap-2">
            {players.map((player, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer border-2 shadow-sm ${
                  selectedPlayers.includes(player)
                    ? 'bg-blue-100 border-blue-500 text-blue-900'
                    : 'bg-gray-100 border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
                onClick={() => togglePlayerSelection(player)}
                role="button"
                aria-pressed={selectedPlayers.includes(player)}
              >
                {player}
                <button
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    removePlayer(index);
                  }}
                  className="hover:text-red-600 focus:text-red-600 p-1"
                  aria-label={`Remove ${player}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Links</h2>
            <button
              onClick={createLink}
              disabled={selectedPlayers.length < 2}
              className={`p-2 rounded-lg focus:ring-2 ${
                selectedPlayers.length >= 2
                  ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              aria-label="Create link between selected players"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600" aria-live="polite">
              {selectedPlayers.length > 0 
                ? `Selected: ${selectedPlayers.length} players`
                : 'Select 2+ players to link'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {links.map((link, index) => (
              <div key={index} className="p-3 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="text-blue-900">{link.join(' + ')}</span>
                <button
                  onClick={() => removeLink(index)}
                  className="hover:text-red-600 focus:text-red-600 p-1"
                  aria-label="Remove link"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <label className="font-semibold text-gray-900">
              Number of Teams:
              <input
                type="number"
                min="2"
                value={numTeams}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNumTeams(Math.max(2, parseInt(e.target.value) || 2))
                }
                className="ml-2 p-2 w-20 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                aria-label="Number of teams"
              />
            </label>
            <button
              onClick={assignTeams}
              className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-300 flex items-center gap-2 shadow-sm"
              aria-label="Assign teams"
            >
              <Shuffle className="w-5 h-5" />
              <span>Assign Teams</span>
            </button>
          </div>
        </div>

        {teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team, index) => (
              <div 
                key={index} 
                className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg shadow-sm"
                role="region"
                aria-label={`Team ${index + 1}`}
              >
                <h3 className="font-bold mb-3 text-lg text-gray-900">{team.name}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {team.members.map((member, mIndex) => (
                    <li key={mIndex} className="text-gray-800">{member}</li>
                  ))}
                </ul>
                <div className="mt-3 text-sm font-medium text-gray-600">
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