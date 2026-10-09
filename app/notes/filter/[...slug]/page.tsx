import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function NotesFilterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || ['all'];
  const currentTag = slugArray[0];
  const tagFilter = currentTag === 'all' ? undefined : currentTag;

  const queryClient = new QueryClient();

  // Префетчимо дані з урахуванням тегу
  await queryClient.prefetchQuery({
    queryKey: ['notes', { tag: tagFilter, page: 1, perPage: 12, search: '' }],
    queryFn: () => getNotes({ tag: tagFilter, page: 1, perPage: 12, search: '' }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Передаємо tagFilter у пропси так, як вимагає тест */}
      <NotesClient tag={tagFilter} />
    </HydrationBoundary>
  );
}