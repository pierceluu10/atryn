"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import { FlaskConical, Search, ArrowRight } from "lucide-react";
import type { Lab } from "@/types";

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/labs")
      .then((r) => r.json())
      .then((data) => {
        setLabs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = labs.filter((lab) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      lab.labName.toLowerCase().includes(s) ||
      lab.topics.toLowerCase().includes(s) ||
      lab.department?.toLowerCase().includes(s) ||
      lab.professorName?.toLowerCase().includes(s)
    );
  });

  return (
    <PageTransition className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-primary">Research Labs</h1>
          <p className="text-gray-500 mt-1">Browse labs and professors at U of T</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search labs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/labs/${lab.id}`}>
                <Card className="h-full hover:shadow-md transition-all group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FlaskConical className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary group-hover:underline">
                          {lab.labName}
                        </h3>
                        {lab.professorName && (
                          <p className="text-sm text-gray-400 mt-0.5">
                            {lab.professorName}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {lab.description?.slice(0, 150)}...
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {lab.topics
                            .split(",")
                            .slice(0, 3)
                            .map((t) => (
                              <Badge key={t} variant="secondary" className="text-xs">
                                {t.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No labs found matching your search.</p>
        </div>
      )}
    </PageTransition>
  );
}
