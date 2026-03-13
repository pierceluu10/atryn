import { Resource, ResourceCategory } from "./types";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

export function searchResources(
  resources: Resource[],
  query: string,
  category?: ResourceCategory,
  limit = 5
): Resource[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return resources.slice(0, limit);

  let pool = resources;
  if (category) {
    pool = pool.filter((r) => r.category === category);
  }

  const scored = pool.map((resource) => {
    let score = 0;
    const searchable = normalize(
      [
        resource.name,
        resource.shortDescription,
        resource.fullDescription,
        resource.category,
        resource.department || "",
        resource.professorName || "",
        resource.audience || "",
        ...resource.topics,
        ...resource.tags,
      ].join(" ")
    );

    for (const token of tokens) {
      // Exact topic/tag match (high value)
      if (resource.topics.some((t) => normalize(t).includes(token))) score += 3;
      if (resource.tags.some((t) => normalize(t).includes(token))) score += 3;
      // Category match
      if (normalize(resource.category).includes(token)) score += 2;
      // Name match
      if (normalize(resource.name).includes(token)) score += 2;
      // General text match
      if (searchable.includes(token)) score += 1;
    }

    return { resource, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.resource);
}
