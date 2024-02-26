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

export class RoomNotFoundError extends Error {
  constructor() {
    super('There is no room with this id');
  }
}
