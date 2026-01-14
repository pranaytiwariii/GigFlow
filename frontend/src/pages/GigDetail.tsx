import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { gigsApi, Gig } from '@/api/gigs.api';
import { bidsApi, Bid } from '@/api/bids.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign, User, Clock, CheckCircle } from 'lucide-react';

const GigDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Bid form state
  const [bidMessage, setBidMessage] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);

  const isOwner = user && gig && user.id === gig.ownerId._id;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const gigData = await gigsApi.getById(id);
        setGig(gigData);
        
        // Fetch bids if user is the owner
        if (user && gigData.ownerId._id === user.id) {
          const bidsData = await bidsApi.getByGigId(id);
          setBids(bidsData);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load gig');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setBidError('');
    setSubmitting(true);

    try {
      await bidsApi.create({
        gigId: id,
        message: bidMessage,
        price: parseFloat(bidPrice),
      });
      setBidSuccess(true);
      setBidMessage('');
      setBidPrice('');
    } catch (err: any) {
      setBidError(err.response?.data?.message || 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHire = async (bidId: string) => {
    try {
      await bidsApi.hire(bidId);
      // Refresh the page data
      if (id) {
        const gigData = await gigsApi.getById(id);
        setGig(gigData);
        const bidsData = await bidsApi.getByGigId(id);
        setBids(bidsData);
      }
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

  if (error || !gig) {
    return (
      <div className="page-container">
        <div className="text-center py-20">
          <h3 className="text-lg font-medium text-foreground mb-2">Gig not found</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="form-container">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className={`status-badge ${gig.status === 'open' ? 'status-open' : 'status-assigned'} mb-3`}>
                  {gig.status === 'open' ? 'Open' : 'Assigned'}
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-2">{gig.title}</h1>
              </div>
              <div className="flex items-center gap-1 text-primary font-bold text-xl shrink-0">
                <DollarSign className="h-5 w-5" />
                {gig.budget.toLocaleString()}
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-foreground mb-6">
              <p className="whitespace-pre-wrap">{gig.description}</p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {gig.ownerId.name}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(gig.createdAt).toLocaleDateString()}
              </div>
            </div>

            {gig.status === 'assigned' && gig.assignedTo && (
              <div className="mt-4 p-4 bg-success/10 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm">
                  Assigned to <strong>{gig.assignedTo.name}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Bids Section (for owner) */}
          {isOwner && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Bids ({bids.length})
              </h2>
              
              {bids.length === 0 ? (
                <div className="form-container text-center py-8">
                  <p className="text-muted-foreground">No bids yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid._id} className="form-container">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-foreground">{bid.freelancerId.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(bid.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{bid.message}</p>
                          <div className="flex items-center gap-1 text-primary font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {bid.price.toLocaleString()}
                          </div>
                        </div>
                        {gig.status === 'open' && (
                          <Button
                            size="sm"
                            onClick={() => handleHire(bid._id)}
                          >
                            Hire
                          </Button>
                        )}
                        {bid.status === 'hired' && (
                          <span className="status-badge status-open">Hired</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Bid Form */}
        <div className="lg:col-span-1">
          {!user ? (
            <div className="form-container text-center">
              <p className="text-muted-foreground mb-4">Sign in to place a bid</p>
              <Button onClick={() => navigate('/login')}>Sign In</Button>
            </div>
          ) : isOwner ? (
            <div className="form-container text-center">
              <p className="text-muted-foreground">This is your gig. View bids below.</p>
            </div>
          ) : gig.status === 'assigned' ? (
            <div className="form-container text-center">
              <p className="text-muted-foreground">This gig has been assigned.</p>
            </div>
          ) : bidSuccess ? (
            <div className="form-container text-center">
              <CheckCircle className="h-10 w-10 text-success mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Bid Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                The gig owner will review your bid soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBidSubmit} className="form-container space-y-4">
              <h3 className="font-semibold text-foreground">Place a Bid</h3>
              
              {bidError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {bidError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bidPrice">Your Price ($)</Label>
                <Input
                  id="bidPrice"
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  required
                  min="1"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bidMessage">Message</Label>
                <Textarea
                  id="bidMessage"
                  placeholder="Why are you the right fit for this gig?"
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Bid'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
