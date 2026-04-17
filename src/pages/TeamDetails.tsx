import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Mail, 
  Briefcase, 
  Building2, 
  Heart, 
  Zap, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Plus,
  X,
  Code2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function TeamDetails() {
  const { users, tasks } = useData();
  const { userProfile } = useAuth();
  const [newSkill, setNewSkill] = useState<{ [userId: string]: string }>({});

  const handleAddSkill = async (userId: string) => {
    const skill = newSkill[userId]?.trim();
    if (!skill) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        skills: arrayUnion(skill)
      });
      setNewSkill(prev => ({ ...prev, [userId]: '' }));
    } catch (e) {
      console.error("Error adding skill:", e);
    }
  };

  const handleRemoveSkill = async (userId: string, skill: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        skills: arrayRemove(skill)
      });
    } catch (e) {
      console.error("Error removing skill:", e);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Team Details</h1>
          <p className="text-slate-500 dark:text-slate-400">Comprehensive overview of your team members and their performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const userTasks = tasks.filter(t => t.assignees.includes(user.id));
          const completedTasks = userTasks.filter(t => t.status === 'done').length;
          const isMe = user.id === userProfile?.uid;
          
          return (
            <Card key={user.id} className="group hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
                <div className="absolute -bottom-10 left-6">
                  <Avatar 
                    src={user.avatar} 
                    fallback={user.name.charAt(0)} 
                    size="lg" 
                    className="h-20 w-20 border-4 border-white dark:border-[#1A1C20] shadow-xl" 
                  />
                </div>
              </div>
              
              <CardContent className="pt-12 pb-6 px-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                      {user.name} {isMe && "(You)"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-1">
                      <Mail className="h-3 w-3" />
                      {user.email || 'No email provided'}
                    </div>
                  </div>
                  <Badge variant={user.role === 'Team Lead' ? 'default' : 'secondary'} className="rounded-lg">
                    {user.role}
                  </Badge>
                </div>

                {/* Skills Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Code2 className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Expertise & Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-blue-500/5 text-blue-500 border-blue-500/20 text-[10px] py-0 px-2 flex items-center gap-1"
                      >
                        {skill}
                        {isMe && (
                          <button onClick={() => handleRemoveSkill(user.id, skill)} className="hover:text-rose-500">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isMe && (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newSkill[user.id] || ''}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, [user.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(user.id)}
                          placeholder="Add skill..."
                          className="text-[10px] bg-transparent border-b border-slate-200 dark:border-white/10 outline-none w-20 focus:border-blue-500 transition-colors"
                        />
                        <button onClick={() => handleAddSkill(user.id)} className="text-blue-500 hover:bg-blue-500/10 rounded-full p-0.5">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Department</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.department}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Tasks Done</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{completedTasks} / {userTasks.length}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Heart className="h-3.5 w-3.5 text-rose-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Health Score</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{user.healthScore}%</span>
                    </div>
                    <Progress value={user.healthScore} indicatorClassName="bg-rose-500" className="h-1.5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Productivity</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{user.productivityScore}%</span>
                    </div>
                    <Progress value={user.productivityScore} indicatorClassName="bg-amber-500" className="h-1.5" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Punctuality</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user.punctuality}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Engagement</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user.engagement}%</span>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-blue-500 transition-all">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
