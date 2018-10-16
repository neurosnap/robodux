interface Hash {
  [key: string]: any;
}

export function createSelector<State extends Hash, SliceState>(
  slice: string,
): (state: State) => SliceState | State {
  if (!slice) {
    return (state: State) => state;
  }
  return (state: State) => state[slice];
}

export function createSelectorName(slice: string) {
  if (!slice) {
    return 'getState';
  }

  return camelize(`get ${slice}`);
}

// https://stackoverflow.com/a/2970667/1713216
function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}
