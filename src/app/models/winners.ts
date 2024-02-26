import { ResponseCommands, User } from 'utils/commands-types';

const wins: Record<string, number> = {};

export function addWin({ name }: User) {
  wins[name] = (wins[name] || 0) + 1;
}

export function getWinners(): ResponseCommands['update_winners'] {
  return Object.entries(wins).map(([name, wins]) => ({ name, wins }));
}
