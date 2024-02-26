import { Id, Room, User } from 'utils/commands-types';

const availableRooms = new Map<Id, Room>();
const usersInRooms = new Set<Id>();
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
  usersInRooms.add(user.index);
  availableRooms.set(roomId, room);
  return true;
}

export function getRooms(): Room[] {
  return [...availableRooms.values()];
}
