export type TruncatePosition = 'start' | 'middle' | 'end';

export function truncateFileName(
  filename: string,
  maxLength: number = 20,
  position: 'middle' | 'end' = 'end'
): string {
  if (filename.length <= maxLength) return filename;

  if (position === 'end') {
    // Original 'end' truncation logic, simplified to always truncate at the end
    // if the position is explicitly 'end'.
    // The original function's default behavior (which was effectively 'end')
    // had more nuanced handling for extensions.
    // This new 'end' case is a simple truncation.
    return filename.slice(0, maxLength - 3) + '...';
  }

  // Middle truncation logic (position === 'middle')
  const extensionIndex = filename.lastIndexOf('.');

  // If no extension or extension is the whole string (hidden file), do generic middle truncation
  if (extensionIndex === -1 || extensionIndex === 0) {
    const preserveLength = Math.floor((maxLength - 3) / 2);
    // If preserveLength is too small, we can't even show 1 char from start and 1 from end
    // so just truncate from the end as a fallback.
    if (preserveLength < 1) {
      return filename.slice(0, maxLength - 3) + '...';
    }
    return (
      filename.slice(0, preserveLength) +
      '...' +
      filename.slice(filename.length - preserveLength)
    );
  }

  const extension = filename.slice(extensionIndex);
  const name = filename.slice(0, extensionIndex);

  const extensionLen = extension.length;
  // Calculate how many characters of the name part we can show
  // (maxLength - 3 for '...' - length of extension)
  const charsToShow = maxLength - 3 - extensionLen;

  // If not enough space to show at least 1 char of name + extension,
  // fallback to generic middle truncation of the whole string
  if (charsToShow < 1) {
    const preserveLength = Math.floor((maxLength - 3) / 2);
    // If preserveLength is too small, we can't even show 1 char from start and 1 from end
    // so just truncate from the end as a fallback.
    if (preserveLength < 1) {
      return filename.slice(0, maxLength - 3) + '...';
    }
    return (
      filename.slice(0, preserveLength) +
      '...' +
      filename.slice(filename.length - preserveLength)
    );
  }

  // If there's enough space, truncate the name part from the middle
  // and keep the extension at the end.
  // We need to show `charsToShow` characters from the name.
  // We'll split `charsToShow` into a start and end part of the name.
  const nameStartLen = Math.ceil(charsToShow / 2);
  const nameEndLen = Math.floor(charsToShow / 2);

  return (
    name.slice(0, nameStartLen) +
    '...' +
    name.slice(name.length - nameEndLen) +
    extension
  );
}
