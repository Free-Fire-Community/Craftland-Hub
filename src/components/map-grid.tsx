import { MapCard } from './map-card';
import { Map } from '@/lib/types';

interface MapGridProps {
  maps: Map[];
}

export function MapGrid({ maps }: MapGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {maps.map((map) => (
        <MapCard key={map.id} map={map} />
      ))}
    </div>
  );
}
