'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ModalItem.module.css';
import {
    type ItemData,
    createItemData,
    updateItemData,
    deleteItemData,
} from '@/lib/services/itemService';
import { handleImageUpload } from '@/lib/services/uploadService';

type Mode = 'create' | 'edit' | 'delete';

interface ModalItemProps {
    open: boolean;
    mode: Mode;
    initial?: ItemData | null;
    onClose: () => void;
    onSuccess: () => void;
}

const emptyItem: ItemData = {
    id: 0,
    itemName: '',
    itemdescription: '',
    type: '',
    slug: '',
    itemImage: '',
    itemIcon: '',
    itemFullInfor: ''
};

export default function ModalItem({
    open,
    mode,
    initial,
    onClose,
    onSuccess,
}: ModalItemProps) {
    const [form, setForm] = useState<ItemData>(initial ?? emptyItem);
    const [submitting, setSubmitting] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    // --- state cho upload ảnh lớn + icon ---
    const [imageUrl, setImageUrl] = useState<string>(initial?.itemImage ?? '');
    const [imagePreview, setImagePreview] = useState<string>(initial?.itemImage ?? '');
    const [iconUrl, setIconUrl] = useState<string>(initial?.itemIcon ?? '');
    const [iconPreview, setIconPreview] = useState<string>(initial?.itemIcon ?? '');
    const [uploadErr, setUploadErr] = useState<string>('');

    // khi đổi initial -> sync lại preview
    useEffect(() => {
        setImageUrl(initial?.itemImage ?? '');
        setImagePreview(initial?.itemImage ?? '');
        setIconUrl(initial?.itemIcon ?? '');
        setIconPreview(initial?.itemIcon ?? '');
    }, [initial, open]);

    // dùng cho cả ảnh lớn lẫn icon
    const processFile = async (file: File, kind: 'image' | 'icon') => {
        setUploadErr('');
        // preview local trước
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = String(reader.result ?? '');
            if (kind === 'image') setImagePreview(dataUrl);
            else setIconPreview(dataUrl);
        };
        reader.readAsDataURL(file);

        try {
            const uploadedUrl = await handleImageUpload(file);
            if (uploadedUrl) {
                if (kind === 'image') {
                    setImageUrl(uploadedUrl);
                    setForm((f) => ({ ...f, itemImage: uploadedUrl }));
                } else {
                    setIconUrl(uploadedUrl);
                    setForm((f) => ({ ...f, itemIcon: uploadedUrl }));
                }
            } else {
                setUploadErr('Tải ảnh thất bại');
            }
        } catch (err: unknown) {
            setUploadErr(err instanceof Error ? err.message : 'Tải ảnh thất bại');
        }
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        kind: 'image' | 'icon',
    ) => {
        const file = e.target.files?.[0];
        if (file) await processFile(file, kind);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, kind: 'image' | 'icon') => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) await processFile(file, kind);
    };

    const preventDefault = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const clearImage = (kind: 'image' | 'icon') => {
        if (kind === 'image') {
            setImageUrl('');
            setImagePreview('');
            setForm((f) => ({ ...f, itemImage: '' }));
        } else {
            setIconUrl('');
            setIconPreview('');
            setForm((f) => ({ ...f, itemIcon: '' }));
        }
    };



    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        setForm(initial ?? emptyItem);
    }, [initial, open]);

    const title = useMemo(() => {
        if (mode === 'create') return 'Thêm vật phẩm';
        if (mode === 'edit') return 'Sửa vật phẩm';
        return 'Xóa vật phẩm';
    }, [mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'delete') return;

        if (!form.itemName?.trim()) {
            alert('Vui lòng nhập tên vật phẩm');
            return;
        }
        setSubmitting(true);
        try {
            if (mode === 'create') {
                await createItemData({
                    itemName: form.itemName?.trim(),
                    itemdescription: form.itemdescription ?? '',
                    type: form.type ?? '',
                    slug: form.slug ?? '',
                    itemImage: form.itemImage ?? '',
                    itemIcon: form.itemIcon ?? '',
                });
            } else if (mode === 'edit') {
                await updateItemData({
                    id: form.id,
                    itemName: form.itemName?.trim(),
                    itemdescription: form.itemdescription ?? '',
                    type: form.type ?? '',
                    slug: form.slug ?? '',
                    itemImage: form.itemImage ?? '',
                    itemIcon: form.itemIcon ?? '',
                });
            }
            onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert('Thao tác thất bại');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!form?.id) {
            alert('Không xác định được vật phẩm để xóa');
            return;
        }
        if (!confirm(`Xóa "${form.itemName}"?`)) return;
        setSubmitting(true);
        try {
            await deleteItemData({
                id: form.id,
                itemName: form.itemName,
                type: form.type,
                slug: form.slug,
            });
            onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert('Xóa thất bại');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!open) return null;

    return (
        <div className="wapper">
            <div className={styles.backdrop} onMouseDown={onBackdrop}>
                <div className={styles.modal} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className={styles.header}>
                        <h3 id="modal-title" className={styles.title}>{title}</h3>
                        <button className={styles.iconBtn} onClick={onClose} aria-label="Đóng">✕</button>
                    </div>

                    {mode === 'delete' ? (
                        <div className={styles.body}>
                            <p>Bạn có chắc chắn muốn xóa vật phẩm sau?</p>
                            <ul className={styles.infoList}>
                                <li><b>Tên:</b> {initial?.itemName}</li>
                                <li><b>Loại:</b> {initial?.type || '—'}</li>
                                <li><b>Slug:</b> {initial?.slug || '—'}</li>
                            </ul>
                        </div>
                    ) : (
                        <form className={styles.body} onSubmit={handleSubmit}>
                            <div className={styles.grid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tên vật phẩm<span className={styles.req}>*</span></label>
                                    <input
                                        className={styles.input}
                                        value={form.itemName ?? ''}
                                        onChange={(e) => setForm((f) => ({ ...f, itemName: e.target.value }))}
                                        placeholder="Ví dụ: Ancient Sword"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Loại</label>
                                    <input
                                        className={styles.input}
                                        value={form.type ?? ''}
                                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                                        placeholder="weapon / armor / material / …"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Slug</label>
                                    <input
                                        className={styles.input}
                                        value={form.slug ?? ''}
                                        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                        placeholder="ancient-sword"
                                    />
                                </div>

                                <div className={styles.formGroupFull}>
                                    <label className={styles.label}>Mô tả</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={form.itemdescription ?? ''}
                                        onChange={(e) => setForm((f) => ({ ...f, itemdescription: e.target.value }))}
                                        rows={4}
                                        placeholder="Mô tả ngắn về vật phẩm…"
                                    />
                                </div>

                                {/* Row gồm 2 uploader */}
                                <div className={styles.formGroupRow}>
                                    {/* Ảnh lớn */}
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Ảnh lớn</label>
                                        <div
                                            className={styles.dropzone}
                                            onDragOver={preventDefault}
                                            onDragEnter={preventDefault}
                                            onDrop={(e) => handleDrop(e, 'image')}
                                        >
                                            {imagePreview ? (
                                                <div className={styles.previewWrap}>
                                                    <img className={styles.preview} src={imagePreview} alt="Preview image" />
                                                    <div className={styles.previewActions}>
                                                        <button type="button" className={styles.btnGhost} onClick={() => clearImage('image')}>Xoá</button>
                                                        {imageUrl && (
                                                            <a className={styles.btnGhost} href={imageUrl} target="_blank" rel="noreferrer">Mở URL</a>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.dropInner}>
                                                    <p>Kéo & thả ảnh vào đây</p>
                                                    <p className={styles.muted}>hoặc</p>
                                                    <label className={styles.fileBtn}>
                                                        Chọn ảnh
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, 'image')}
                                                            hidden
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Icon</label>
                                        <div
                                            className={styles.dropzone}
                                            onDragOver={preventDefault}
                                            onDragEnter={preventDefault}
                                            onDrop={(e) => handleDrop(e, 'icon')}
                                        >
                                            {iconPreview ? (
                                                <div className={styles.previewRow}>
                                                    <img className={styles.previewSmall} src={iconPreview} alt="Preview icon" />
                                                    <div className={styles.previewActions}>
                                                        <button type="button" className={styles.btnGhost} onClick={() => clearImage('icon')}>Xoá</button>
                                                        {iconUrl && (
                                                            <a className={styles.btnGhost} href={iconUrl} target="_blank" rel="noreferrer">Mở URL</a>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.dropInnerInline}>
                                                    <span>Kéo & thả</span>
                                                    <span className={styles.muted}>&nbsp;hoặc&nbsp;</span>
                                                    <label className={styles.fileBtn}>
                                                        Chọn ảnh
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, 'icon')}
                                                            hidden
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>


                                {uploadErr && <div className={styles.error}>{uploadErr}</div>}


                                {(form.itemImage || form.itemIcon) && (
                                    <div className={styles.previewWrap}>
                                        {form.itemImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img className={styles.preview} src={form.itemImage} alt="Preview image" />
                                        ) : null}
                                        {form.itemIcon ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img className={styles.previewSmall} src={form.itemIcon} alt="Preview icon" />
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            <div className={styles.footer}>
                                <button type="button" className={styles.btnGhost} onClick={onClose}>Hủy</button>
                                <button type="submit" className={styles.btnPrimary} disabled={submitting} style={{color : "white"}}>
                                    {submitting ? 'Đang lưu…' : mode === 'create' ? 'Thêm' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    )}

                    {mode === 'delete' && (
                        <div className={styles.footer}>
                            <button type="button" className={styles.btnGhost} onClick={onClose} disabled={submitting}>Hủy</button>
                            <button type="button" className={styles.btnDanger} onClick={handleDelete} disabled={submitting}>
                                {submitting ? 'Đang xóa…' : 'Xóa'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
