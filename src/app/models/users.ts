import { RequestCommands, ResponseCommands } from 'utils/commands-types';

const userNamesSet = new Set<string>();

// const userIdWebSocketMap = new Map()

export function register({
  name,
}: RequestCommands['reg']): ResponseCommands['reg'] {
  let index = 0,
    error = false,
    errorText = '';
  if (userNamesSet.has(name)) {
    error = true;
    errorText = 'User with this username already logged in';
  } else {
    userNamesSet.add(name);
    index = userNamesSet.size;
  }
  return { name, index, error, errorText };
}
