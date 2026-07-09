import React from 'react';
import { BadgeCheck, MapPin, Briefcase } from 'lucide-react';
import { Artisan } from '../data/mockArtisanData';
import { StarRating } from './StarRating';

interface ArtisanCardProps {
  artisan: Artisan;
  onViewProfile: (artisanId: string) => void;
  onHire: (artisanId: string) => void;
}

/**
 * Compact artisan profile card for use in job listings and browse views.
 */
export const ArtisanCard: React.FC<ArtisanCardProps> = ({ artisan, onViewProfile, onHire }) => {
  const successRate = artisan.totalJobs > 0
    ? Math.round((artisan.completedJobs / artisan.totalJobs) * 100)
    : 0;

  return (
    <article className="artisan-card" aria-label={`Artisan: ${artisan.name}`}>
      <div className="artisan-card-header">
        <div
          className="artisan-avatar"
          style={{ background: artisan.avatarColor }}
          aria-hidden="true"
        >
          {artisan.avatarInitials}
        </div>
        <div className="artisan-card-identity">
          <div className="artisan-name-row">
            <h3>{artisan.name}</h3>
            {artisan.isVerified && (
              <BadgeCheck
                size={16}
                className="verified-icon"
                aria-label="Verified artisan"
              />
            )}
          </div>
          <p className="artisan-card-location">
            <MapPin size={13} />
            {artisan.location}
          </p>
        </div>
      </div>

      <div className="artisan-card-trades">
        {artisan.specializations.map((spec) => (
          <span key={spec} className="trade-tag">{spec}</span>
        ))}
      </div>

      <div className="artisan-card-stats">
        <div className="artisan-stat">
          <StarRating rating={artisan.averageRating} size={14} />
          <span className="stat-value">{artisan.averageRating.toFixed(1)}</span>
        </div>
        <div className="artisan-stat-divider" aria-hidden="true" />
        <div className="artisan-stat">
          <Briefcase size={13} />
          <span className="stat-value">{artisan.completedJobs} jobs</span>
        </div>
        <div className="artisan-stat-divider" aria-hidden="true" />
        <div className="artisan-stat">
          <span className="stat-value success-rate">{successRate}%</span>
          <span className="stat-label">success</span>
        </div>
      </div>

      <div className="artisan-card-actions">
        <button
          className="ghost-action artisan-card-btn"
          onClick={() => onViewProfile(artisan.id)}
          aria-label={`View ${artisan.name}'s profile`}
        >
          View profile
        </button>
        <button
          className="primary-action artisan-card-btn"
          onClick={() => onHire(artisan.id)}
          aria-label={`Hire ${artisan.name}`}
        >
          Hire
        </button>
      </div>
    </article>
  );
};

export default ArtisanCard;
