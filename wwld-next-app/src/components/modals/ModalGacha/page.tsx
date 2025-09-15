'use client'

import { useEffect, useMemo, useState } from 'react'
import m from './ModalGacha.module.css'

export type BannerType = 'CHARACTER' | 'WEAPON'

export interface BannerFormValues {
  bannerName: string
  bannerType: BannerType
  startAt: string
  endAt: string
  rateup5starId: string
  rateup4starIds: string
}

export interface BannerModalProps {
  open: boolean
  mode: 'create' | 'edit' | 'delete'
  initial: {
    id: number
    bannerName: string
    bannerType: BannerType
    startAt: string | null
    endAt: string | null
    rateup5starId: number
    rateup4starIds: string
  } | null
  onClose: () => void
  onSubmit: (values: BannerFormValues) => Promise<void> | void
}

export default function BannerModal(props: BannerModalProps) {
  const { open, mode, initial, onClose, onSubmit } = props

  const [vals, setVals] = useState<BannerFormValues>(() => ({
    bannerName: '',
    bannerType: 'CHARACTER',
    startAt: '',
    endAt: '',
    rateup5starId: '',
    rateup4starIds: '',
  }))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    if (initial && (mode === 'edit' || mode === 'delete')) {
      setVals({
        bannerName: initial.bannerName,
        bannerType: initial.bannerType,
        startAt: initial.startAt ?? '',
        endAt: initial.endAt ?? '',
        rateup5starId: String(initial.rateup5starId),
        rateup4starIds: initial.rateup4starIds,
      })
    } else {
      setVals({
        bannerName: '',
        bannerType: 'CHARACTER',
        startAt: '',
        endAt: '',
        rateup5starId: '',
        rateup4starIds: '',
      })
    }
  }, [open, initial, mode])

  const title = useMemo(() => {
    if (mode === 'create') return 'Thêm banner'
    if (mode === 'edit') return 'Sửa banner'
    return 'Xoá banner'
  }, [mode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'delete') {
      setSubmitting(true)
      await onSubmit(vals)
      setSubmitting(false)
      return
    }

    // validation nhẹ
    if (!vals.bannerName.trim()) return alert('Tên banner không được trống')
    if (!vals.rateup5starId.trim()) return alert('Cần nhập 5★ ID')
    const idsOk = /^(\d+)(,\s*\d+){0,}$/.test(vals.rateup4starIds.trim()) || vals.rateup4starIds.trim() === ''
    if (!idsOk) return alert('4★ IDs phải dạng CSV số: "10,11,12"')

    setSubmitting(true)
    await onSubmit(vals)
    setSubmitting(false)
  }

  if (!open) return null

  return (
    <div className={m.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={m.modal} onClick={e => e.stopPropagation()}>
        <div className={m.head}>
          <h3>{title}</h3>
          <button className={m.iconbtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {mode === 'delete' ? (
          <div className={m.body}>
            <p>Bạn có chắc muốn xoá banner <b>{initial?.bannerName}</b>?</p>
            <div className={m.actions}>
              <button className={m.btn} onClick={onClose}>Huỷ</button>
              <button className={`${m.btn} ${m.btnDanger}`} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Đang xoá…' : 'Xoá'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={m.body}>
            <div className={m.grid}>
              <label className={m.field}>
                <span>Tên banner</span>
                <input value={vals.bannerName} onChange={e => setVals(v => ({ ...v, bannerName: e.target.value }))} />
              </label>

              <label className={m.field}>
                <span>Loại</span>
                <select value={vals.bannerType} onChange={e => setVals(v => ({ ...v, bannerType: e.target.value as BannerType }))}>
                  <option value="CHARACTER">CHARACTER</option>
                  <option value="WEAPON">WEAPON</option>
                </select>
              </label>

              <label className={m.field}>
                <span>Start at (string)</span>
                <input placeholder="2025-08-01" value={vals.startAt} onChange={e => setVals(v => ({ ...v, startAt: e.target.value }))} />
              </label>

              <label className={m.field}>
                <span>End at (string)</span>
                <input placeholder="2025-08-21" value={vals.endAt} onChange={e => setVals(v => ({ ...v, endAt: e.target.value }))} />
              </label>

              <label className={m.field}>
                <span>5★ ID</span>
                <input inputMode="numeric" value={vals.rateup5starId} onChange={e => setVals(v => ({ ...v, rateup5starId: e.target.value }))} />
              </label>

              <label className={m.field} style={{ gridColumn: '1 / -1' }}>
                <span>4★ IDs (CSV)</span>
                <input placeholder="2002,2003,2004" value={vals.rateup4starIds} onChange={e => setVals(v => ({ ...v, rateup4starIds: e.target.value }))} />
              </label>
            </div>

            <div className={m.actions}>
              <button type="button" className={m.btn} onClick={onClose}>Huỷ</button>
              <button type="submit" className={`${m.btn} ${m.btnPrimary}`} disabled={submitting}>
                {submitting ? 'Đang lưu…' : 'Lưu'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
