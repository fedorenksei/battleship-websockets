export function handleError(err: unknown) {
  console.error(
    err instanceof Error ? err.message : 'Oops! Sorry, unknown error occured',
  );
}

export class UnregisteredUserError extends Error {
  constructor() {
    super('User is not registered');
  }
}

export class AlreadyInRoomError extends Error {
  constructor() {
    super('User is already in a room');
  }
}

export class UserNotInGameError extends Error {
  constructor() {
    super('User is not in this game');
  }
}

export class RoomNotFoundError extends Error {
  constructor() {
    super('There is no room with this id');
  }
}

export class WrongUsersAmountInRoomError extends Error {
  constructor() {
    super('There are less or more than 1 player in the room');
  }
}
