"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Users, Clock, VideoIcon, Eye, GraduationCap } from "lucide-react";
import type { Submission, ProfessorUser } from "@/types";

function statusVariant(status: string) {
  switch (status) {
    case "shortlisted":
      return "success" as const;
    case "rejected":
      return "destructive" as const;
    default:
      return "warning" as const;
  }
}

function DashboardContent() {
  const { user, token } = useAuth();
  const professor = user as ProfessorUser;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!token) return;
    fetch("/api/professor/submissions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const filtered = filter === "all"
    ? submissions
    : submissions.filter((s) => s.status === filter);

  return (
    <PageTransition className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-primary">Professor Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {professor?.labName} - {professor?.department}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-primary">{submissions.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total Applicants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-emerald-600">
              {submissions.filter((s) => s.status === "shortlisted").length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Shortlisted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-amber-600">
              {submissions.filter((s) => s.status === "pending").length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({submissions.filter((s) => s.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            Shortlisted ({submissions.filter((s) => s.status === "shortlisted").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({submissions.filter((s) => s.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No {filter === "all" ? "" : filter} applicants yet.</p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {filtered.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{sub.studentName || "Student"}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                              {sub.studentProgram && <span>{sub.studentProgram}, Year {sub.studentYear}</span>}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(sub.createdAt).toLocaleDateString()}
                              </span>
                              {sub.videoUrl && (
                                <span className="flex items-center gap-1 text-primary">
                                  <VideoIcon className="w-3 h-3" />
                                  Video
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={statusVariant(sub.status)}>
                            {sub.status}
                          </Badge>
                          <Link href={`/professor/applicant/${sub.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1.5">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}

export default function ProfessorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="professor">
      <DashboardContent />
    </ProtectedRoute>
  );
}
