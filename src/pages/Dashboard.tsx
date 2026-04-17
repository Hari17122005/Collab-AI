import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Activity, CheckCircle2, Clock, AlertTriangle, TrendingUp, Users, Megaphone } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { useData } from '../hooks/useData';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useAuth } from '../contexts/AuthContext';
import { Copy, Check, Plus, LogIn, UserPlus, X, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export function Dashboard() {
  const { tasks, users, joinRequests, securityLogs, loading } = useData();
  const { userProfile, teamData } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [teamName, setTeamName] = React.useState('');
  const [creatingTeam, setCreatingTeam] = React.useState(false);
  const [processingRequest, setProcessingRequest] = React.useState<string | null>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !userProfile?.uid) return;

    setCreatingTeam(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const teamRef = await addDoc(collection(db, 'teams'), {
        name: teamName,
        leadId: userProfile.uid,
        joinCode: code,
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, 'users', userProfile.uid), {
        teamId: teamRef.id,
        role: 'Team Lead'
      });
      
      setTeamName('');
    } catch (err) {
      console.error('Error creating team:', err);
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleApproveRequest = async (request: any) => {
    setProcessingRequest(request.id);
    try {
      await updateDoc(doc(db, 'joinRequests', request.id), { status: 'approved' });
      await updateDoc(doc(db, 'users', request.userId), { 
        teamId: request.teamId,
        role: 'Team Member'
      });
    } catch (err) {
      console.error('Error approving request:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      await updateDoc(doc(db, 'joinRequests', requestId), { status: 'rejected' });
    } catch (err) {
      console.error('Error rejecting request:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">Loading dashboard...</div>;
  }

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 4);
  const teamMembers = [...users].sort((a, b) => {
    if (a.role === 'Team Lead') return -1;
    if (b.role === 'Team Lead') return 1;
    return 0;
  });

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => isPast(parseISO(t.deadline)) && t.status !== 'done').length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your team today.</p>
        </div>
        
        {userProfile?.role === 'Team Lead' && teamData?.joinCode && (
          <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Join Code</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">{teamData.joinCode}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(teamData.joinCode)}
              className="p-3 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-blue-600"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>

      {userProfile?.role === 'Team Lead' && !userProfile?.teamId && (
        <Card className="border-blue-500/30 bg-blue-500/5 backdrop-blur-xl">
          <CardContent className="p-10">
            <div className="max-w-md mx-auto text-center space-y-8">
              <div className="h-20 w-20 rounded-3xl bg-blue-500/20 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/10">
                <Plus className="h-10 w-10 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Team</h2>
                <p className="text-slate-500 dark:text-slate-400">Start managing your team and tasks by creating a workspace.</p>
              </div>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter Team Name"
                  className="w-full bg-white dark:bg-[#1A1D23] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={creatingTeam || !teamName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
                >
                  {creatingTeam ? 'Creating...' : 'Create Team'}
                </button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: totalTasks, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', progress: (completedTasks / totalTasks) * 100 },
          { label: 'In Progress', value: inProgressTasks, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Overdue', value: overdueTasks, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', urgent: true },
        ].map((stat, i) => (
          <Card key={i} className={cn("border-transparent", stat.urgent && "bg-red-500/5 border-red-500/10")}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className={cn("text-4xl font-bold mt-1", stat.urgent ? "text-red-500" : "text-slate-900 dark:text-white")}>
                  {stat.value}
                </p>
              </div>
              {stat.progress !== undefined && (
                <div className="pt-2">
                  <Progress value={stat.progress} className="h-1.5" indicatorClassName={stat.color.replace('text', 'bg')} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Members */}
        <Card className="lg:col-span-2 border-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              Team Members
            </CardTitle>
            <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-none">
              {teamMembers.length} Members
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all group">
                  <Avatar fallback={user.name?.charAt(0) || '?'} size="md" className="ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{user.department || 'General'} Department</p>
                  </div>
                  <Badge className={cn(
                    "rounded-xl px-3 py-1 border-none font-bold text-[10px] uppercase tracking-wider",
                    user.role === 'Team Lead' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                  )}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel: Requests & Updates */}
        <div className="space-y-8">
          {userProfile?.role === 'Team Lead' && joinRequests.length > 0 && (
            <Card className="border-transparent bg-blue-600/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-500">
                  <UserPlus className="h-5 w-5" />
                  Join Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {joinRequests.map(request => (
                  <div key={request.id} className="p-4 rounded-2xl bg-white dark:bg-[#1A1D23] border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{request.userName}</p>
                      <p className="text-xs text-slate-500 truncate">{request.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveRequest(request)}
                        disabled={!!processingRequest}
                        className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={!!processingRequest}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="border-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-amber-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityLogs.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">No recent activity.</div>
              ) : (
                securityLogs.slice(0, 3).map((log, i) => (
                  <div key={log.id} className={cn(
                    "p-4 rounded-2xl border transition-all",
                    log.type === 'warning' ? "bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-500/10" : "bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/10"
                  )}>
                    <h4 className={cn("text-xs font-bold mb-1 uppercase tracking-wider", log.type === 'warning' ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400")}>
                      {log.type}
                    </h4>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{log.userName} {log.action}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{log.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Tasks</h2>
          <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View all tasks</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentTasks.map(task => {
            const isOverdue = isPast(parseISO(task.deadline)) && task.status !== 'done';
            return (
              <Card key={task.id} className="border-transparent hover:border-blue-500/30 transition-all group cursor-pointer">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={cn(
                      "rounded-xl px-3 py-1 border-none font-bold text-[10px] uppercase tracking-wider",
                      task.status === 'done' ? "bg-emerald-500/10 text-emerald-500" :
                      task.status === 'in-progress' ? "bg-blue-500/10 text-blue-500" :
                      "bg-slate-100 dark:bg-white/5 text-slate-500"
                    )}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <div className={cn("flex items-center gap-1.5 text-xs font-bold", isOverdue ? "text-red-500" : "text-slate-400")}>
                      <Clock className="h-3.5 w-3.5" />
                      {format(parseISO(task.deadline), 'MMM dd')}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {(task.assignees || []).map(id => (
                        <Avatar key={id} fallback={users.find(u => u.id === id)?.name.charAt(0) || '?'} size="sm" className="border-2 border-white dark:border-[#1A1D23]" />
                      ))}
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

