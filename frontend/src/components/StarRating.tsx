import React from 'react';

interface StarRatingProps {
  /** Value between 0 and 5, supports decimals */
  rating: number;
  /** Number of stars to render (default 5) */
  max?: number;
  /** Pixel size of each star (default 18) */
  size?: number;
  /** Show numeric label alongside stars */
  showLabel?: boolean;
  /** Extra class name */
  className?: string;
}

/**
 * Renders a row of stars filled proportionally to `rating`.
 * Supports full, half, and empty states via SVG clip-path.
 */
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 18,
  showLabel = false,
  className = ''
}) => {
  const clampedRating = Math.min(Math.max(rating, 0), max);

  return (
    <span className={`star-rating ${className}`} aria-label={`Rating: ${clampedRating.toFixed(1)} out of ${max}`} role="img">
      {Array.from({ length: max }, (_, i) => {
        const fillRatio = Math.min(Math.max(clampedRating - i, 0), 1);
        return <Star key={i} size={size} fillRatio={fillRatio} />;
      })}
      {showLabel && (
        <span className="star-label">{clampedRating.toFixed(1)}</span>
      )}
    </span>
  );
};

interface StarProps {
  size: number;
  /** 0 = empty, 0.5 = half, 1 = full */
  fillRatio: number;
}

const Star: React.FC<StarProps> = ({ size, fillRatio }) => {
  const uid = React.useId();
  const clipId = `star-clip-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={`${fillRatio * 100}%`} height="100%" />
        </clipPath>
      </defs>
      {/* Empty star outline */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="none"
        stroke="var(--star-empty, #d0c9b3)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Filled portion */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="var(--star-fill, #f4bd2f)"
        stroke="var(--star-fill, #f4bd2f)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
};

export default StarRating;
