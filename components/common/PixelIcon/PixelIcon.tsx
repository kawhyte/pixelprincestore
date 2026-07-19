/**
 * PixelIcon — tiny 8×8 pixel-grid icons (PLAN-14 E2).
 *
 * Each icon is an 8-row pattern of "#"/space cells rendered as unit <rect>s on a
 * viewBox="0 0 8 8" with shape-rendering="crispEdges", so it stays crisp at any
 * size and inherits color via fill="currentColor". Kenny-supplied SVGs can
 * replace these patterns file-for-file later.
 */

const PATTERNS = {
  heart: [
    "        ",
    " ##  ## ",
    "########",
    "########",
    " ###### ",
    "  ####  ",
    "   ##   ",
    "        ",
  ],
  star: [
    "   ##   ",
    "  ####  ",
    "########",
    " ###### ",
    "  ####  ",
    " ##  ## ",
    "##    ##",
    "        ",
  ],
  download: [
    "   ##   ",
    "   ##   ",
    "   ##   ",
    "   ##   ",
    "########",
    " ###### ",
    "  ####  ",
    "   ##   ",
  ],
  crown: [
    "#  ##  #",
    "#  ##  #",
    "########",
    "########",
    "########",
    "        ",
    "        ",
    "        ",
  ],
} as const;

export type PixelIconName = keyof typeof PATTERNS;

interface PixelIconProps {
  name: PixelIconName;
  /** rendered pixel size in px (width & height). */
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
  title?: string;
}

export default function PixelIcon({
  name,
  size = 16,
  className,
  title,
  "aria-hidden": ariaHidden = true,
}: PixelIconProps) {
  const rows = PATTERNS[name];
  const rects: React.ReactElement[] = [];

  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "#") {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
      }
    }
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : ariaHidden}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {rects}
    </svg>
  );
}
