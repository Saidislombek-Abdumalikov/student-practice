import { LevelInfo, CurriculumUnit } from '../types';
import { BEGINNER_UNITS } from './beginnerUnits';
import { ELEMENTARY_UNITS } from './elementaryUnits';
import { PRE_INTERMEDIATE_UNITS } from './preIntermediateUnits';
import { IRREGULAR_VERBS_UNITS } from './irregularVerbsData';

export { BEGINNER_UNITS };

export const LEVELS: LevelInfo[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    code: 'A1',
    description: 'Foundational English for everyday interactions & basic vocabulary',
    color: '#10B981', // Emerald
    totalUnits: 4,
  },
  {
    id: 'elementary',
    name: 'Elementary',
    code: 'A2',
    description: 'Essential phrases, basic tenses, and confident communication (Life Vision A1/A2)',
    color: '#06B6D4', // Cyan
    totalUnits: 8,
  },
  {
    id: 'pre_intermediate',
    name: 'Pre-Intermediate',
    code: 'B1',
    description: 'Express opinions, narrate experiences, and handle diverse conversations (Life Vision B1)',
    color: '#6366F1', // Indigo
    totalUnits: 9,
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    code: 'B2',
    description: 'Fluent expressions, complex grammar, and rich academic vocabulary',
    color: '#8B5CF6', // Purple
    totalUnits: 12,
  },
  {
    id: 'pre_ielts',
    name: 'Pre-IELTS',
    code: 'B2+',
    description: 'Targeted academic vocabulary, collocations, and formal structures',
    color: '#EC4899', // Pink
    totalUnits: 14,
  },
  {
    id: 'ielts',
    name: 'IELTS Mastery',
    code: 'C1',
    description: 'Band 7.5+ vocabulary, idioms, complex arguments, and exam mastery',
    color: '#F59E0B', // Gold
    totalUnits: 16,
  },
];

export const CURRICULUM_UNITS: CurriculumUnit[] = [
  ...BEGINNER_UNITS,
  ...ELEMENTARY_UNITS,
  ...PRE_INTERMEDIATE_UNITS,
  ...IRREGULAR_VERBS_UNITS,
];
