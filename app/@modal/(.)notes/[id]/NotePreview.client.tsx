'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={css.backdrop} onClick={handleBack}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.previewContainer}>
          {isLoading && <p>Loading note details...</p>}
          {isError && <p>Failed to load note details.</p>}
          
          {note && (
            <>
              <h2 className={css.title}>{note.title}</h2>
              <p className={css.content}>{note.content}</p>
              {note.tag && <span className={css.tag}>#{note.tag}</span>}
              {note.createdAt && (
                <span className={css.date}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}