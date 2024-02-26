import { RequestCommands, ResponseCommands } from 'app/utils/commands-types';

const userNamesSet = new Set<string>();

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
