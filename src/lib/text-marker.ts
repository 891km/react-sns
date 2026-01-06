const MARK = "¦";

type Marker = {
  text: string;
  start: number;
  end: number;
};

/**
 * 특정 위치가 마킹 구간에 포함되는지 확인하고, 해당 구간의 정보를 반환
 */
const getOverlappingMarker = ({ text, start, end }: Marker) => {
  const regex = new RegExp(`${MARK}(.*?)${MARK}`, "g");
  let match;

  while ((match = regex.exec(text)) !== null) {
    const mStart = match.index;
    const mEnd = match.index + match[0].length;

    // 겹치는지 확인 (시작이나 끝이 범위 내에 있거나, 범위를 포함할 때)
    const isOverlapping =
      (start >= mStart && start < mEnd) ||
      (end > mStart && end <= mEnd) ||
      (start <= mStart && end >= mEnd);

    if (isOverlapping) {
      return {
        isMarked: true,
        fullStart: mStart,
        fullEnd: mEnd,
        contentStart: mStart + 1,
        contentEnd: mEnd - 1,
      };
    }
  }
  return { isMarked: false };
};

export const textMarker = {
  check: ({ text, start, end }: Marker) =>
    getOverlappingMarker({ text, start, end }).isMarked,

  toggle: ({ text, start, end }: Marker) => {
    if (start === end) return text;

    const overlap = getOverlappingMarker({ text, start, end });

    if (overlap.isMarked) {
      return (
        text.slice(0, overlap.fullStart) +
        text.slice(overlap.contentStart, overlap.contentEnd) +
        text.slice(overlap.fullEnd)
      );
    }

    return (
      text.slice(0, start) +
      MARK +
      text.slice(start, end) +
      MARK +
      text.slice(end)
    );
  },
};
