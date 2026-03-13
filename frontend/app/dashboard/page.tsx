"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { FlaskConical, Clock, VideoIcon } from "lucide-react";
import type { Submission } from "@/types";

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
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/student/submissions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <PageTransition className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl text-primary mb-2">My Submissions</h1>
      <p className="text-gray-500 mb-8">Track the status of your lab applications</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No submissions yet.</p>
          <p className="text-sm mt-1">Browse labs and submit your interest to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FlaskConical className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">{sub.labName || `Lab #${sub.labId}`}</h3>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                          {sub.videoUrl && (
                            <span className="flex items-center gap-1">
                              <VideoIcon className="w-3 h-3" />
                              Video attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusVariant(sub.status)}>
                      {sub.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <DashboardContent />
    </ProtectedRoute>
  );
}
