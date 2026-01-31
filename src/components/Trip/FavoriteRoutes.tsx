import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/db';
import { Card, CardBody, TransportIcon } from '../common';
import { TRANSPORT_TYPE_INFO } from '../../utils/transportTypes';
import { formatCurrency } from '../../utils/formatters';
import type { FavoriteRoute } from '../../types';

interface FavoriteRoutesProps {
  onSelect: (route: FavoriteRoute) => void;
}

/**
 * Component for displaying and selecting favorite routes for quick trip recording.
 *
 * @param props - FavoriteRoutes props
 * @returns FavoriteRoutes element or null if no favorites
 */
export function FavoriteRoutes({ onSelect }: FavoriteRoutesProps) {
  const favorites = useLiveQuery(
    () => db.favoriteRoutes.orderBy('sortOrder').toArray()
  );

  if (!favorites || favorites.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardBody>
        <h3 className="text-sm font-medium text-gray-700 mb-3">快速新增</h3>
        <div className="grid grid-cols-2 gap-2">
          {favorites.map(route => {
            const info = TRANSPORT_TYPE_INFO[route.transportType];
            return (
              <button
                key={route.id}
                onClick={() => onSelect(route)}
                className="flex items-center gap-2 p-3 border border-white/20 dark:border-white/10 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all text-left"
              >
                <TransportIcon iconType={info.iconType} size={24} color={info.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {route.name}
                  </p>
                  {route.defaultAmount && (
                    <p className="text-xs text-gray-500">
                      {formatCurrency(route.defaultAmount)}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
