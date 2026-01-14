import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { gigsApi, Gig } from '@/api/gigs.api';
import { bidsApi, Bid } from '@/api/bids.api';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, ChevronRight, Briefcase, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await gigsApi.getMyGigs();
        setGigs(data);
      } catch (error) {
        console.error('Failed to fetch gigs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const handleSelectGig = async (gig: Gig) => {
    setSelectedGig(gig);
    setBidsLoading(true);
    try {
      const bidsData = await bidsApi.getByGigId(gig._id);
      setBids(bidsData);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
    } finally {
      setBidsLoading(false);
    }
  };

  const handleHire = async (bidId: string) => {
    if (!selectedGig) return;
    
    try {
      await bidsApi.hire(bidId);
      // Refresh data
      const gigData = await gigsApi.getById(selectedGig._id);
      setSelectedGig(gigData);
      const bidsData = await bidsApi.getByGigId(selectedGig._id);
      setBids(bidsData);
      // Also refresh gigs list
      const allGigs = await gigsApi.getMyGigs();
      setGigs(allGigs);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to hire');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        <Link to="/create-gig">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Post a Gig
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gigs List */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Your Gigs ({gigs.length})
          </h2>

          {gigs.length === 0 ? (
            <div className="form-container text-center py-12">
              <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No gigs yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Post your first gig to start receiving bids
              </p>
              <Link to="/create-gig">
                <Button size="sm">Create Gig</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {gigs.map((gig) => (
                <button
                  key={gig._id}
                  onClick={() => handleSelectGig(gig)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedGig?._id === gig._id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`status-badge ${gig.status === 'open' ? 'status-open' : 'status-assigned'}`}>
                          {gig.status === 'open' ? 'Open' : 'Assigned'}
                        </span>
                      </div>
                      <h3 className="font-medium text-foreground truncate">{gig.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-primary mt-1">
                        <DollarSign className="h-3 w-3" />
                        {gig.budget.toLocaleString()}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bids Panel */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Bids {selectedGig && `for "${selectedGig.title}"`}
          </h2>

          {!selectedGig ? (
            <div className="form-container text-center py-12">
              <p className="text-muted-foreground">Select a gig to view bids</p>
            </div>
          ) : bidsLoading ? (
            <div className="form-container flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : bids.length === 0 ? (
            <div className="form-container text-center py-12">
              <p className="text-muted-foreground">No bids for this gig yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => (
                <div key={bid._id} className="form-container">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">{bid.freelancerId.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </span>
                        {bid.status === 'hired' && (
                          <span className="status-badge status-open">Hired</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{bid.message}</p>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {bid.price.toLocaleString()}
                      </div>
                    </div>
                    {selectedGig.status === 'open' && bid.status !== 'hired' && (
                      <Button size="sm" onClick={() => handleHire(bid._id)}>
                        Hire
                      </Button>
                    )}
                    {bid.status === 'hired' && (
                      <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
