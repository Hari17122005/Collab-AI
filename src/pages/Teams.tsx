import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { useData } from "../hooks/useData";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import {
  Plus,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { cn } from "../lib/utils";
export default function Teams() {
  const { managedTeams, loading } = useData();
  const { userProfile } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !userProfile?.uid) return;
    setStatus(null);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const teamRef = await addDoc(collection(db, "teams"), {
        name: newTeamName,
        leadId: userProfile.uid,
        joinCode: code,
        createdAt: new Date().toISOString(),
      });
      /* Optionally switch to the new team immediately */ await updateDoc(
        doc(db, "users", userProfile.uid),
        { teamId: teamRef.id },
      );
      setNewTeamName("");
      setIsCreating(false);
      setStatus({
        type: "success",
        message: `Team "${newTeamName}" created successfully and set as active!`,
      });
    } catch (err: any) {
      console.error("Error creating team:", err);
      setStatus({
        type: "error",
        message: err.message || "Failed to create team.",
      });
    }
  };
  const handleSwitchTeam = async (teamId: string) => {
    if (!userProfile?.uid) return;
    try {
      await updateDoc(doc(db, "users", userProfile.uid), { teamId: teamId });
      setStatus({
        type: "success",
        message: "Switched active team successfully!",
      });
    } catch (err: any) {
      console.error("Error switching team:", err);
      setStatus({ type: "error", message: "Failed to switch team." });
    }
  };
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        {" "}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>{" "}
      </div>
    );
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {" "}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Managed Teams
          </h1>{" "}
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage, create, and switch between your leadership workspaces.
          </p>{" "}
        </div>{" "}
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 translate-y-0 hover:-translate-y-0.5 transition-all"
        >
          {" "}
          <Plus className="h-5 w-5" /> Create New Team{" "}
        </Button>{" "}
      </div>{" "}
      {status && (
        <div
          className={cn(
            "p-4 rounded-2xl border text-sm animate-in slide-in-from-top-2",
            status.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
          )}
        >
          {" "}
          {status.message}{" "}
        </div>
      )}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {" "}
        {managedTeams.map((team) => {
          const isActive = team.id === userProfile?.teamId;
          return (
            <Card
              key={team.id}
              className={cn(
                "group transition-all duration-300",
                isActive
                  ? "ring-2 ring-blue-500 bg-blue-500/[0.02]"
                  : "hover:bg-slate-50 dark:hover:bg-white/[0.02]",
              )}
            >
              {" "}
              <CardContent className="p-8 space-y-6">
                {" "}
                <div className="flex items-start justify-between">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                        isActive
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                          : "bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-500",
                      )}
                    >
                      {" "}
                      <Users className="h-7 w-7" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {team.name}
                      </h3>{" "}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Join Code:
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5">
                          <code className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {team.joinCode}
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(team.joinCode, team.id)
                            }
                            className="text-slate-400 hover:text-blue-500 transition-colors"
                          >
                            {copiedId === team.id ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  {isActive && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                      {" "}
                      <CheckCircle2 className="h-3 w-3" /> Active{" "}
                    </div>
                  )}{" "}
                </div>{" "}
                <div className="pt-4 flex items-center gap-3">
                  {" "}
                  <Button
                    variant={isActive ? "secondary" : "default"}
                    onClick={() => handleSwitchTeam(team.id)}
                    disabled={isActive}
                    className="flex-1 rounded-xl h-11 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {" "}
                    {isActive ? "Currently Viewing" : "Switch To Team"}{" "}
                  </Button>{" "}
                  <Button
                    variant="outline"
                    className="px-3 rounded-xl h-11 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    {" "}
                    <Shield className="h-4 w-4" />{" "}
                  </Button>{" "}
                </div>{" "}
              </CardContent>{" "}
            </Card>
          );
        })}{" "}
        {managedTeams.length === 0 && !isCreating && (
          <div className="md:col-span-2 text-center py-20 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] space-y-4">
            {" "}
            <div className="h-16 w-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-300">
              {" "}
              <Users className="h-8 w-8" />{" "}
            </div>{" "}
            <p className="text-slate-500 font-medium">
              You haven't created any teams yet.
            </p>{" "}
            <Button
              onClick={() => setIsCreating(true)}
              variant="outline"
              className="rounded-xl"
            >
              {" "}
              Create your first team{" "}
            </Button>{" "}
          </div>
        )}{" "}
      </div>{" "}
      {isCreating && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
          {" "}
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            {" "}
            <CardHeader>
              {" "}
              <CardTitle className="text-2xl font-bold">
                New Leadership Workspace
              </CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent className="space-y-6">
              {" "}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter a name for your new team. You'll get a unique join code to
                invite members.
              </p>{" "}
              <form onSubmit={handleCreateTeam} className="space-y-4">
                {" "}
                <input
                  autoFocus
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Team Name (e.g. Engineering Alpha)"
                  className="w-full bg-slate-50 dark:bg-slate-800/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />{" "}
                <div className="flex items-center gap-3 pt-2">
                  {" "}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 rounded-xl h-12"
                  >
                    {" "}
                    Cancel{" "}
                  </Button>{" "}
                  <Button
                    type="submit"
                    disabled={!newTeamName.trim()}
                    className="flex-1 rounded-xl h-12 shadow-lg shadow-blue-500/20"
                  >
                    {" "}
                    Create Team{" "}
                  </Button>{" "}
                </div>{" "}
              </form>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>
      )}{" "}
    </div>
  );
}
