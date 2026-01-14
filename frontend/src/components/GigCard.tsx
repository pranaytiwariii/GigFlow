import { Link } from 'react-router-dom';
import { Gig } from '@/api/gigs.api';
import { DollarSign } from 'lucide-react';

interface GigCardProps {
  gig: Gig;
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <Link to={`/gigs/${gig._id}`} className="block">
      <div className="gig-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`status-badge ${gig.status === 'open' ? 'status-open' : 'status-assigned'}`}>
                {gig.status === 'open' ? 'Open' : 'Assigned'}
              </span>
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-2 truncate">
              {gig.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {gig.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Posted by {gig.ownerId.name}
            </p>
          </div>
          <div className="flex items-center gap-1 text-primary font-semibold shrink-0">
            <DollarSign className="h-4 w-4" />
            {gig.budget.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
