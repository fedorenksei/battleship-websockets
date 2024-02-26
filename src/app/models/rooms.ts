import { Id, RequestCommands, Room, User } from 'utils/commands-types';
import { AlreadyInRoomError, RoomNotFoundError } from 'utils/errors';

const availableRooms = new Map<Id, Room>();
const usersInRooms = new Map<Id, Room>();
let roomsCount = 0;

export function createRoom(user: User): void {
  if (usersInRooms.has(user.index)) {
    throw new AlreadyInRoomError();
  }
  const roomId = roomsCount++;
  const room: Room = {
    roomId: roomId,
    roomUsers: [user],
  };
  usersInRooms.set(user.index, room);
  availableRooms.set(roomId, room);
}

export function joinRoom({
  data: { indexRoom: roomId },
  user,
}: {
  data: RequestCommands['add_user_to_room'];
  user: User;
}): void {
  const room = availableRooms.get(roomId);
  if (!room) throw new RoomNotFoundError();
  availableRooms.delete(roomId);
  room.roomUsers.push(user);
  usersInRooms.set(user.index, room);
}

export function getRooms(): Room[] {
  return [...availableRooms.values()];
}
