import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RepositoryView } from "@/components/shelf-views";
import { getRepository, seedRepositories } from "@/lib/github-shelf";

// Every record is prebuilt; any other id is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return seedRepositories.map((repository) => ({ id: repository.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const repository = getRepository((await params).id);
  if (!repository) return {};
  return { title: repository.name, description: repository.description, alternates: { canonical: "/repos/" + repository.id } };
}

export default async function RepositoryPage({ params }: { params: Promise<{ id: string }> }) {
  const repository = getRepository((await params).id);
  if (!repository) notFound();
  return <RepositoryView repository={repository} all={seedRepositories} />;
}
