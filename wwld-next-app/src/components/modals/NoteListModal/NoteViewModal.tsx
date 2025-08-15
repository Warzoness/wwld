"use client";

import styles from "./NoteViewModal.module.css";

export interface NoteData {
    id: number;
    noteName: string;
    noteContent: string;
    storyId: number;
    description: string;
    image: string;
}

interface NoteViewModalProps {
    open: boolean;
    note: NoteData | null;
    onClose: () => void;
}


export default function NoteViewModal({ open, note, onClose }: NoteViewModalProps) {
    if (!open || !note) return null;

    return (
        <div className={styles.backdrop} role="dialog" aria-modal="true">
            <div className={styles.stage}>
                <button className={styles.close} onClick={onClose} aria-label="Đóng">✕</button>

                {/* Scroll container */}
                <div className={styles.scrollWrap}>
                    <div className={styles.rodLeft} />
                    <div className={styles.paper}>
                        <div className={styles.paperInner}>
                            <h2 className={styles.title}>{note.noteName}</h2>
                            <div className={styles.content}>
                                {note.noteContent ? (
                                    <p className={styles.text}>{note.noteContent}</p>
                                ) : (
                                    <p className={styles.muted}>Không có nội dung.</p>
                                )}
                                {note.image && (
                                    <div className={styles.imageWrap}>
                                        {/* eslint-disable @next/next/no-img-element */}
                                        <img src={note.image} alt={note.noteName} className={styles.image} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.rodRight} />
                </div>
            </div>
        </div>
    );
}
