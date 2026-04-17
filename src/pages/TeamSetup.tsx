import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, getDocs, query, where, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Button } from '../components/ui/Button';
import { Users, LogIn, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { JoinRequest } from '../types';
import { cn } from '../lib/utils';

export function TeamSetup() {
  const { userProfile, currentUser, logout } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingRequest, setPendingRequest] = useState<JoinRequest | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'joinRequests'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const request = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as JoinRequest;
        setPendingRequest(request);
      } else {
        setPendingRequest(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'joinRequests');
    });

    return () => unsubscribe();
  }, [currentUser, userProfile?.teamId]);

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !currentUser || !userProfile) return;

    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'teams'), where('joinCode', '==', joinCode.toUpperCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('Invalid join code. Please check with your Team Lead.');
        setLoading(false);
        return;
      }

      const teamDoc = querySnapshot.docs[0];
      const teamData = teamDoc.data();

      await setDoc(doc(db, 'joinRequests', currentUser.uid), {
        userId: currentUser.uid,
        userName: userProfile.name,
        userEmail: userProfile.email,
        teamId: teamDoc.id,
        teamName: teamData.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

    } catch (err: any) {
      console.error('Error sending join request:', err);
      setError(err.message || 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!pendingRequest) return;
    setLoading(true);
    try {
      // We don't actually delete, maybe just update status or let user send new one
      // For simplicity, let's allow deleting pending requests
      const requestRef = doc(db, 'joinRequests', pendingRequest.id);
      // deleteDoc(requestRef); // Need to import deleteDoc
    } catch (err) {
      console.error('Error cancelling request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] transition-colors duration-300" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 dark:bg-cyan-600/20 blur-[120px] transition-colors duration-300" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl transition-colors duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Join a Team</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center">
              {pendingRequest 
                ? 'Your request is being reviewed.' 
                : 'Enter a join code to request access to a team.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {pendingRequest ? (
            <div className="space-y-6">
              <div className={cn(
                "p-6 rounded-2xl border flex flex-col items-center text-center gap-4",
                pendingRequest.status === 'pending' ? "bg-amber-500/5 border-amber-500/20" :
                pendingRequest.status === 'approved' ? "bg-emerald-500/5 border-emerald-500/20" :
                "bg-red-500/5 border-red-500/20"
              )}>
                {pendingRequest.status === 'pending' && <Clock className="h-12 w-12 text-amber-500 animate-pulse" />}
                {pendingRequest.status === 'approved' && <CheckCircle className="h-12 w-12 text-emerald-500" />}
                {pendingRequest.status === 'rejected' && <XCircle className="h-12 w-12 text-red-500" />}
                
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">
                    {pendingRequest.status === 'pending' && 'Request Pending'}
                    {pendingRequest.status === 'approved' && 'Request Approved!'}
                    {pendingRequest.status === 'rejected' && 'Request Rejected'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Team: <span className="font-semibold text-slate-700 dark:text-slate-300">{pendingRequest.teamName}</span>
                  </p>
                </div>

                {pendingRequest.status === 'rejected' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setPendingRequest(null)}
                    className="w-full mt-2"
                  >
                    Try Another Code
                  </Button>
                )}
              </div>

              <button 
                type="button"
                onClick={() => logout()}
                className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Switch Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleJoinRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Join Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" disabled={loading || !joinCode.trim()} className="w-full h-12 flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                Send Request
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                Ask your Team Lead for the 6-character join code. They will need to approve your request.
              </p>
              <button 
                type="button"
                onClick={() => logout()}
                className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-2 mt-4"
              >
                <ArrowLeft className="h-4 w-4" /> Switch Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
