import { GrammarLevelId, GrammarUnitDefinition, GrammarTopic } from '../../types';
import { GRAMMAR_LEVEL_1_UNITS } from './grammarLevel1';
import { GRAMMAR_LEVEL_2_UNITS } from './grammarLevel2';
import { GRAMMAR_LEVEL_3_UNITS } from './grammarLevel3';

export const GRAMMAR_LEVEL_META: Record<GrammarLevelId, {
  id: GrammarLevelId;
  name: string;
  nameUz: string;
  color: string;
  description: string;
  examId: string;
}> = {
  level_1: {
    id: 'level_1',
    name: 'Beginner',
    nameUz: 'Boshlangʻich',
    color: '#10B981', // Emerald
    description: 'Pronouns, Verb BE, Present Simple, Continuous, Past Simple, Future, and Modals.',
    examId: 'l1_u12_t1',
  },
  level_2: {
    id: 'level_2',
    name: 'Elementary',
    nameUz: 'Quyi-Oʻrta',
    color: '#6366F1', // Indigo
    description: 'Past Continuous, Present Perfect, Conditionals, and Passive Voice.',
    examId: 'l2_u12_t1',
  },
  level_3: {
    id: 'level_3',
    name: 'Intermediate',
    nameUz: 'Oʻrta va Yuqori',
    color: '#8B5CF6', // Purple
    description: 'Advanced Perfect Tenses, Conditionals, Deduction Modals, and Inversion.',
    examId: 'l3_u12_t1',
  },
};

export const GRAMMAR_CURRICULUM: Record<GrammarLevelId, GrammarUnitDefinition[]> = {
  level_1: GRAMMAR_LEVEL_1_UNITS,
  level_2: GRAMMAR_LEVEL_2_UNITS,
  level_3: GRAMMAR_LEVEL_3_UNITS,
};

export const getGrammarTopicsByLevel = (levelId: GrammarLevelId): GrammarTopic[] => {
  const units = GRAMMAR_CURRICULUM[levelId] || [];
  const topics: GrammarTopic[] = [];
  units.forEach(u => topics.push(...u.topics));
  return topics;
};

export const getAllGrammarTopics = (): GrammarTopic[] => {
  const all: GrammarTopic[] = [];
  Object.values(GRAMMAR_CURRICULUM).forEach(units => {
    units.forEach(u => {
      all.push(...u.topics);
    });
  });
  return all;
};

export const getGrammarTopicById = (topicId: string): GrammarTopic | undefined => {
  return getAllGrammarTopics().find(t => t.id === topicId);
};

export const getGrammarUnitById = (unitId: string): GrammarUnitDefinition | undefined => {
  for (const level of Object.values(GRAMMAR_CURRICULUM)) {
    const found = level.find(u => u.id === unitId);
    if (found) return found;
  }
  return undefined;
};

export const checkPrerequisitesMet = (
  topicId: string,
  completedTopicIds: string[]
): { met: boolean; missingPrerequisites: GrammarTopic[] } => {
  const topic = getGrammarTopicById(topicId);
  if (!topic || !topic.prerequisites || topic.prerequisites.length === 0) {
    return { met: true, missingPrerequisites: [] };
  }

  const missing: GrammarTopic[] = [];
  topic.prerequisites.forEach(prereqId => {
    if (!completedTopicIds.includes(prereqId)) {
      const prereqTopic = getGrammarTopicById(prereqId);
      if (prereqTopic) missing.push(prereqTopic);
    }
  });

  return {
    met: missing.length === 0,
    missingPrerequisites: missing,
  };
};

export const getRecommendedNextTopic = (
  completedTopicIds: string[],
  levelId: GrammarLevelId
): GrammarTopic => {
  const units = GRAMMAR_CURRICULUM[levelId] || GRAMMAR_CURRICULUM['level_1'];
  for (const unit of units) {
    for (const topic of unit.topics) {
      if (!completedTopicIds.includes(topic.id)) {
        return topic;
      }
    }
  }
  return units[0].topics[0];
};
