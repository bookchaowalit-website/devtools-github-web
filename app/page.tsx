import { ShelfView } from "@/components/shelf-views";
import { seedRepositories } from "@/lib/github-shelf";

type Search = { q?: string | string[]; lens?: string | string[] };
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function Home({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  return <ShelfView repositories={seedRepositories} query={first(params.q).trim().slice(0, 100)} lens={first(params.lens)} />;
}
