import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockArtisans, TradeSpecialization } from '../data/mockArtisanData';
import { ArtisanCard } from './ArtisanCard';
import { ArtisanProfile } from './ArtisanProfile';
import { useToast } from './ToastContext';

const ALL_TRADES: TradeSpecialization[] = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting',
  'Welding', 'Tiling', 'Masonry', 'HVAC', 'General'
];

interface ArtisansViewProps {
  /** artisanId to pre-select (e.g. from "Hire" click on job list) */
  preSelectedArtisanId?: string | null;
  onHireNavigate?: (artisanId: string) => void;
}

export const ArtisansView: React.FC<ArtisansViewProps> = ({
  preSelectedArtisanId = null,
  onHireNavigate
}) => {
  const { addToast } = useToast();
  const [selectedArtisanId, setSelectedArtisanId] = useState<string | null>(preSelectedArtisanId);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState<TradeSpecialization | 'All'>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredArtisans = mockArtisans.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTrade =
      tradeFilter === 'All' || a.specializations.includes(tradeFilter);

    const matchesVerified = !verifiedOnly || a.isVerified;

    return matchesSearch && matchesTrade && matchesVerified;
  });

  const handleHire = (artisanId: string) => {
    const artisan = mockArtisans.find((a) => a.id === artisanId);
    if (onHireNavigate) {
      onHireNavigate(artisanId);
    } else {
      addToast({
        type: 'info',
        message: `Opening job creation with ${artisan?.name ?? 'artisan'} pre-selected.`
      });
    }
  };

  // Show profile page if an artisan is selected
  if (selectedArtisanId) {
    const artisan = mockArtisans.find((a) => a.id === selectedArtisanId);
    if (artisan) {
      return (
        <ArtisanProfile
          artisan={artisan}
          onBack={() => setSelectedArtisanId(null)}
          onHire={handleHire}
        />
      );
    }
  }

  return (
    <div className="artisans-view">
      <header className="artisans-header">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h1>Find an artisan</h1>
        </div>
      </header>

      {/* Filters bar */}
      <div className="artisans-filters" role="search" aria-label="Filter artisans">
        <div className="artisans-search-wrap">
          <Search size={16} className="artisans-search-icon" aria-hidden="true" />
          <input
            className="artisans-search"
            type="search"
            placeholder="Search by name, trade, or location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search artisans"
          />
        </div>

        <div className="artisans-filter-controls">
          <SlidersHorizontal size={15} aria-hidden="true" />
          <select
            className="artisans-select"
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value as TradeSpecialization | 'All')}
            aria-label="Filter by trade"
          >
            <option value="All">All trades</option>
            {ALL_TRADES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label className="artisans-toggle">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              aria-label="Show verified artisans only"
            />
            <span>Verified only</span>
          </label>
        </div>
      </div>

      {/* Results count */}
      <p className="artisans-count" aria-live="polite">
        {filteredArtisans.length} artisan{filteredArtisans.length !== 1 ? 's' : ''} found
      </p>

      {/* Cards grid */}
      {filteredArtisans.length > 0 ? (
        <div className="artisans-grid" role="list">
          {filteredArtisans.map((artisan) => (
            <div role="listitem" key={artisan.id}>
              <ArtisanCard
                artisan={artisan}
                onViewProfile={setSelectedArtisanId}
                onHire={handleHire}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="artisans-empty">
          <Search size={48} />
          <p>No artisans match your filters.</p>
          <button className="ghost-action" onClick={() => { setSearchQuery(''); setTradeFilter('All'); setVerifiedOnly(false); }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtisansView;
