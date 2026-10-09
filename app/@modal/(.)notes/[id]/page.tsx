'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NotePreviewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
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
    </Modal>
  );
}