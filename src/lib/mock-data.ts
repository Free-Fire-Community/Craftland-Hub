import { Map, Category } from './types';
import {
  Car,
  Crosshair,
  Ghost,
  Swords,
  Brain,
  Palette,
  TowerControl,
  Zap,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

export const categories: Category[] = [
  { id: 'zombie-hunt', name: 'Zombie Hunt', icon: Ghost, mapCount: 0 },
  { id: 'racing', name: 'Racing', icon: Car, mapCount: 0 },
  { id: 'parkour', name: 'Parkour', icon: Zap, mapCount: 0 },
  { id: 'deathmatch', name: 'Deathmatch', icon: Swords, mapCount: 0 },
  { id: 'puzzle', name: 'Puzzle', icon: Brain, mapCount: 0 },
  { id: 'creative', name: 'Creative', icon: Palette, mapCount: 0 },
  { id: 'tower-defense', name: 'Tower Defense', icon: TowerControl, mapCount: 0 },
  { id: 'aim-training', name: 'Aim Training', icon: Crosshair, mapCount: 0 },
];

const mapNames = [
  'Zombie Outbreak',
  'Neon Rush Raceway',
  'Sky High Parkour',
  'Arena of Warriors',
  'The Mystic Maze',
  'Prop Hunt Palace',
  'Mountain King',
  'Chill Zone Hangout',
  'Corridor of Doom',
  'Sniper\'s Nest',
  'Naval Warfare',
  'The Enigma Box',
  'Apocalypse Survival',
  'Drift Kings',
  'Cityscape Leap',
];

const authors = [
  'NightmareDev',
  'Speedster',
  'LeaperZ',
  'BladeMaster',
  'MindBender',
  'HideNSeekPro',
  'Highlander',
  'VibeCreator',
  'TrollGod',
  'EagleEye',
  'CaptainJack',
  'ProfessorPuzzle',
  'SurvivorX',
  'RacerX',
  'UrbanNinja',
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const maps: Map[] = Array.from({ length: 15 }, (_, i) => {
  const category = getRandomItem(categories);
  const placeholderImage = PlaceHolderImages[i % PlaceHolderImages.length] || PlaceHolderImages[0];
  return {
    id: `map-${i + 1}`,
    mapCode: `#${getRandomNumber(100000, 999999)}`,
    region: getRandomItem(['IND', 'BR', 'US', 'EU', 'SEA']),
    name: mapNames[i] || `Map ${i + 1}`,
    description: `This is a great ${category.name.toLowerCase()} map called ${mapNames[i] || `Map ${i + 1}`} created by ${authors[i] || 'Unknown'}.`,
    author: authors[i] || 'Unknown',
    coverImageUrl: placeholderImage.imageUrl,
    gameMode: getRandomItem(['Clash Squad', 'Battle Royale', 'Team Deathmatch']),
    teamSize: getRandomItem(['Solo', 'Duo', 'Squad']),
    playTimeEstimate: getRandomItem(['< 5 min', '5-15 min', '> 15 min']),
    subscribeCount: getRandomNumber(100, 50000),
    likeCount: getRandomNumber(50, 25000),
    views: getRandomNumber(1000, 200000),
    netVotes: getRandomNumber(-50, 1000),
    voteScore: Math.random(),
    createdAt: new Date(Date.now() - getRandomNumber(0, 30) * 24 * 60 * 60 * 1000),
    submitterName: 'CommunityUser',
    tags: [category.name, 'Fun', 'Challenging'],
    category: category.name,
    difficulty: getRandomItem(['Easy', 'Medium', 'Hard']),
  };
});
