import { Id } from 'app/utils/commands-types';

const games = new Map<Id, [Id, Id]>();
let gamesCount = 0;

export function createGame(usersIds: [Id, Id]) {
  const gameId = gamesCount++;
  games.set(gameId, usersIds);
  return { gameId };
}
