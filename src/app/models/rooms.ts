import { Id, RequestCommands, Room, User } from 'utils/commands-types';

const availableRooms = new Map<Id, Room>();
const usersInRooms = new Map<Id, Room>();
let roomsCount = 0;

export function createRoom(user: User): boolean {
  if (usersInRooms.has(user.index)) {
    return false;
  }
  const roomId = roomsCount++;
  const room: Room = {
    roomId: roomId,
    roomUsers: [user],
  };
  usersInRooms.set(user.index, room);
  availableRooms.set(roomId, room);
  return true;
}

export function joinRoom({
  data: { indexRoom: roomId },
  user,
}: {
  data: RequestCommands['add_user_to_room'];
  user: User;
}): boolean {
  const room = availableRooms.get(roomId);
  if (!room) return false;

  availableRooms.delete(roomId);
  room.roomUsers.push(user);
  usersInRooms.set(user.index, room);
  return true;
}

export function getRooms(): Room[] {
  return [...availableRooms.values()];
}
