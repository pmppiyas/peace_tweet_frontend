export interface FeelingItem {
  id: string;
  label: string;
  emoji: string;
}

export const FEELINGS: FeelingItem[] = [
  { id: 'blessed', label: 'blessed', emoji: '😇' },
  { id: 'grateful', label: 'grateful', emoji: '🤲' },
  { id: 'peaceful', label: 'peaceful', emoji: '🕊️' },
  { id: 'happy', label: 'happy', emoji: '😊' },
  { id: 'thankful', label: 'thankful', emoji: '💖' },
  { id: 'loved', label: 'loved', emoji: '🥰' },
  { id: 'hopeful', label: 'hopeful', emoji: '🌟' },
  { id: 'thoughtful', label: 'thoughtful', emoji: '🤔' },
  { id: 'relieved', label: 'relieved', emoji: '😌' },
  { id: 'motivated', label: 'motivated', emoji: '💪' },
  { id: 'patient', label: 'patient', emoji: '⏳' },
  { id: 'sad', label: 'sad', emoji: '😔' },
];

export const getFeelingById = (id?: string | null): FeelingItem | undefined => {
  if (!id) return undefined;
  return FEELINGS.find((f) => f.id.toLowerCase() === id.toLowerCase());
};
