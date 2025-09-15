'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './GachaSimulator.module.css'
import m from '@/components/modals/ModalGacha/ModalGacha.module.css'
import { fetchCharacters } from '@/lib/services/characterService'
import { fetchItems } from '@/lib/services/itemService'
import { addBanner, updateBanner, fetchBanners, deleteBanner } from '@/lib/services/gachaSimulator'

/* ================= Types ================= */
export type Rarity = 3 | 4 | 5
export type ItemType = 'character' | 'weapon'
export type BannerType = 'CHARACTER' | 'WEAPON'

export interface PoolItem {
  id: string
  name: string
  rarity: Rarity
  type: ItemType
  rateUp?: boolean
  icon: string
}

interface RollRecord {
  time: number
  result: PoolItem
  multi: boolean
}

interface SavedState {
  pity5: number
  pity4: number
  fiftyFiftyLost: boolean
  astrikes: number
  history: RollRecord[]
}

/* ===== Banner DTO (UI) ===== */
export interface BannerRateUpDTO {
  id: number
  bannerName: string
  bannerType: BannerType
  startAt: string | null
  endAt: string | null
  rateup5starId: number
  rateup4starIds: string
  createdAt: string
  updatedAt: string
}

/* ===== External raw types (no any) ===== */
type RawCharacter = Partial<{
  id: number | string
  name: string
  characterName: string
  avatar: string
  imgFull: string
  isLimited: boolean | string
  characterRank: number
  itemRank: number
  star: number
  rank: number
}>
type RawItem = Partial<{
  id: number | string
  itemName: string
  name: string
  itemIcon: string
  itemImage: string
  itemRank: number | string
  itemType: string
  type: string
}>
type RawBanner = Partial<{
  id: number | string
  bannerId: number | string
  bannerName: string
  bannerType: string
  startAt: string | null
  endAt: string | null
  rateup5starId: number | string
  rateup4starIds: string
  createdAt: string
  updatedAt: string
}>

/* ================= Rates & Pity ================= */
const BASE_RATE_5 = 0.006 // 0.6%
const BASE_RATE_4 = 0.051 // 5.1%
const HARD_PITY_5 = 80
const SOFT_PITY_START_5 = 65
const HARD_PITY_4 = 10

/** Compute current chance for 5★ at a given pity value. */
function fiveStarChanceAt(pity5: number): number {
  if (pity5 >= HARD_PITY_5 - 1) return 1
  if (pity5 < SOFT_PITY_START_5) return BASE_RATE_5
  const steps = HARD_PITY_5 - 1 - SOFT_PITY_START_5
  const progress = Math.max(0, pity5 - SOFT_PITY_START_5)
  const extra = (1 - BASE_RATE_5) * (progress / steps)
  return Math.min(1, BASE_RATE_5 + extra)
}

/* ================= Storage ================= */
const LS_KEY = 'ww_gacha_state_v9'

/** Load simulator persistent state from localStorage (safe). */
function loadState(): SavedState {
  if (typeof window === 'undefined')
    return { pity5: 0, pity4: 0, fiftyFiftyLost: false, astrikes: 1600, history: [] }
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { pity5: 0, pity4: 0, fiftyFiftyLost: false, astrikes: 1600, history: [] }
    const parsed = JSON.parse(raw) as Partial<SavedState>
    return { pity5: 0, pity4: 0, fiftyFiftyLost: false, astrikes: 1600, history: [], ...parsed }
  } catch {
    return { pity5: 0, pity4: 0, fiftyFiftyLost: false, astrikes: 1600, history: [] }
  }
}

/** Save simulator state to localStorage (safe). */
function saveState(s: SavedState) {
  if (typeof window !== 'undefined') localStorage.setItem(LS_KEY, JSON.stringify(s))
}

/* ================= RNG helpers ================= */
/** Pick a random element from a non-empty array. */
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

/** Roll rarity outcome based on pity counters. */
function rollRarity(pity5: number, pity4: number): Rarity {
  if (pity5 >= HARD_PITY_5 - 1) return 5
  if (pity4 >= HARD_PITY_4 - 1) {
    return Math.random() < fiveStarChanceAt(pity5) ? 5 : 4
  }
  const r = Math.random()
  const p5 = fiveStarChanceAt(pity5)
  if (r < p5) return 5
  if (r < p5 + BASE_RATE_4) return 4
  return 3
}

/* ================= Helpers ================= */
/** Format date string (ISO-ish) to dd/MM/yy; return '-' if falsy/invalid. */
function fmtDDMMYY(s: string | null | undefined): string {
  if (!s) return '-'
  const d = new Date(s)
  if (isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}
/** Strictly coerce unknown numeric-like value to number (or default). */
function toNum(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : fallback
}
/** Strictly coerce unknown string-like value to string (or empty). */
function toStr(v: unknown, fallback = ''): string {
  return (typeof v === 'string' ? v : String(v ?? fallback))
}

/* ================= Component ================= */
export default function GachaPage() {
  const [state, setState] = useState<SavedState>(() => loadState())
  const [results, setResults] = useState<PoolItem[]>([])
  const [rolling, setRolling] = useState(false)

  // reveal + skip
  const [revealIndex, setRevealIndex] = useState<number>(0)
  const revealTimerRef = useRef<number | null>(null)

  // mobile orientation guard
  const [portraitLock, setPortraitLock] = useState<boolean>(false)

  // history pagination
  const [historyPage, setHistoryPage] = useState<number>(1)
  const HISTORY_PAGE_SIZE = 20

  // ======= Data sources =======
  type CharacterRow = {
    id: number
    name: string
    avatar?: string
    imgFull?: string
    isLimited?: boolean
    rank?: number | null
    itemRank?: number | null
  }
  type ItemRow = {
    id: number
    itemName: string
    itemIcon?: string
    itemImage?: string
    itemRank?: number
    itemType: string
  }

  const [characters, setCharacters] = useState<CharacterRow[]>([])
  const [weapons, setWeapons] = useState<ItemRow[]>([])

  // ======= pools (động theo banner) =======
  const [poolFiveUp, setPoolFiveUp] = useState<PoolItem[]>([])
  const [poolFiveStd, setPoolFiveStd] = useState<PoolItem[]>([])
  const [poolFour, setPoolFour] = useState<PoolItem[]>([])
  const [poolThree, setPoolThree] = useState<PoolItem[]>([])

  // ======= banner picker state =======
  const [bannerType, setBannerType] = useState<BannerType>('CHARACTER')
  const [rate5Id, setRate5Id] = useState<number | null>(null)
  const [rate4Ids, setRate4Ids] = useState<number[]>([])

  // current banner (đang soạn) + id đã lưu (để biết create/update)
  const [savedBannerId, setSavedBannerId] = useState<number | null>(null)
  const [currentBanner, setCurrentBanner] = useState<BannerRateUpDTO | null>(null)

  // danh sách banner ở dưới
  const [banners, setBanners] = useState<BannerRateUpDTO[]>([])
  const [loadingBanners, setLoadingBanners] = useState<boolean>(false)

  // edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BannerRateUpDTO | null>(null)
  const [editName, setEditName] = useState('')
  const [editStart, setEditStart] = useState('')
  const [editEnd, setEditEnd] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)

  useEffect(() => { saveState(state) }, [state])

  // detect portrait on handhelds
  useEffect(() => {
    /** Check and toggle portrait lock state for small screens. */
    function check() {
      const isPortrait = window.innerHeight > window.innerWidth
      const isNarrow = Math.max(window.innerWidth, window.innerHeight) < 1000
      setPortraitLock(isPortrait && isNarrow)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // fetch characters + weapons once
  useEffect(() => {
    /** Fetch and normalize characters & weapons from backend once. */
    (async () => {
      try {
        const listCharsUnknown = await fetchCharacters()
        const listCharsRaw: unknown[] = Array.isArray(listCharsUnknown) ? listCharsUnknown as unknown[] : []
        const mappedChars: CharacterRow[] = listCharsRaw.map((rc) => {
          const c = rc as RawCharacter
          const id = toNum(c.id)
          return {
            id,
            name: toStr(c.name ?? c.characterName),
            avatar: toStr(c.avatar ?? c.imgFull),
            imgFull: toStr(c.imgFull),
            isLimited: c.isLimited === true || c.isLimited === 'true',
            rank: (typeof c.characterRank === 'number' ? c.characterRank : (typeof c.star === 'number' ? c.star : null)),
            itemRank: (typeof c.itemRank === 'number' ? c.itemRank : (typeof c.rank === 'number' ? c.rank : null)),
          }
        })
        setCharacters(mappedChars)

        const listItemsUnknown = await fetchItems()
        const listItemsRaw: unknown[] = Array.isArray(listItemsUnknown) ? listItemsUnknown as unknown[] : []
        const mappedWeapons: ItemRow[] = listItemsRaw
          .map((ri) => {
            const it = ri as RawItem
            return {
              id: toNum(it.id),
              itemName: toStr(it.itemName ?? it.name),
              itemIcon: toStr(it.itemIcon ?? it.itemImage),
              itemImage: toStr(it.itemImage),
              itemRank: Number.isFinite(Number(it.itemRank)) ? Number(it.itemRank) : undefined,
              itemType: toStr(it.itemType ?? it.type ?? 'WEAPON'),
            }
          })
          .filter((it) => it.itemType === 'WEAPON')
        setWeapons(mappedWeapons)

        // init picker mặc định
        const first5 = mappedChars.find(c => (c.rank ?? c.itemRank) === 5 && !c.isLimited)
        setRate5Id(first5?.id ?? null)
        const fourCandidates = mappedChars
          .filter(c => (c.rank ?? c.itemRank) === 4 && !c.isLimited)
          .slice(0, 3)
        setRate4Ids(fourCandidates.map(c => c.id))
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  // fetch banners list once
  useEffect(() => {
    /** Fetch banners list and normalize to DTO. */
    (async () => {
      try {
        setLoadingBanners(true)
        const listUnknown = await fetchBanners()
        const raw: unknown[] = Array.isArray(listUnknown) ? listUnknown as unknown[] : []
        const norm: BannerRateUpDTO[] = raw.map((rb) => {
          const b = rb as RawBanner
          const id = toNum(b.id ?? b.bannerId, Date.now())
          const nowIso = new Date().toISOString()
          return {
            id,
            bannerName: toStr(b.bannerName),
            bannerType: (toStr(b.bannerType, 'CHARACTER') as BannerType),
            startAt: b.startAt ?? null,
            endAt: b.endAt ?? null,
            rateup5starId: toNum(b.rateup5starId),
            rateup4starIds: toStr(b.rateup4starIds),
            createdAt: toStr(b.createdAt ?? nowIso),
            updatedAt: toStr(b.updatedAt ?? nowIso),
          }
        })
        setBanners(norm)
      } catch (e) {
        console.error('fetchBanners failed', e)
      } finally {
        setLoadingBanners(false)
      }
    })()
  }, [])

  // Khi đổi loại banner → reset lựa chọn hợp lý
  useEffect(() => {
    /** Reset picks when switching banner type. */
    if (bannerType === 'CHARACTER') {
      const first5 = characters.find(c => (c.rank ?? c.itemRank) === 5)
      setRate5Id(first5?.id ?? null)
      const four = characters
        .filter(c => (c.rank ?? c.itemRank) === 4 && !c.isLimited)
        .slice(0, 3)
        .map(c => c.id)
      setRate4Ids(four)
    } else {
      const first5W = weapons.find(w => (w.itemRank ?? 0) === 5)
      setRate5Id(first5W?.id ?? null)
      const fourW = weapons.filter(w => (w.itemRank ?? 0) === 4).slice(0, 3).map(w => w.id)
      setRate4Ids(fourW)
    }
  }, [bannerType, characters, weapons])

  const canRollOne = state.astrikes >= 160 && !portraitLock && !rolling
  const canRollTen = state.astrikes >= 1600 && !portraitLock && !rolling

  /** Consume astrikes balance safely. */
  function consume(amount: number) { setState(p => ({ ...p, astrikes: Math.max(0, p.astrikes - amount) })) }
  /** Increase astrikes balance. */
  function topUp(amount: number) { setState(p => ({ ...p, astrikes: p.astrikes + amount })) }
  /** Append a record to history. */
  function record(result: PoolItem, multi: boolean) {
    const rec: RollRecord = { time: Date.now(), result, multi }
    setState(p => ({ ...p, history: [rec, ...p.history].slice(0, 1500) }))
  }

  /* ======= RNG: dùng pools động ======= */
  /** Roll a 5★ with 50/50 rule and update guarantee state. */
  function rollFiveStar(fiftyFiftyLost: boolean): { item: PoolItem; newFiftyLost: boolean } {
    if (poolFiveUp.length === 0 && poolFiveStd.length === 0) {
      return { item: { id: 'fallback', name: '???', rarity: 5, type: 'character', icon: '' }, newFiftyLost: false }
    }
    if (fiftyFiftyLost) return { item: pick(poolFiveUp), newFiftyLost: false }
    if (Math.random() < 0.5 && poolFiveUp.length > 0) return { item: pick(poolFiveUp), newFiftyLost: false }
    return { item: pick(poolFiveStd), newFiftyLost: true }
  }
  /** Roll a 4★ (fallback to 3★ if pool empty). */
  function rollFourStar(): PoolItem {
    if (poolFour.length === 0) return rollThreeStar()
    return pick(poolFour)
  }
  /** Roll a 3★ (static weapon pool). */
  function rollThreeStar(): PoolItem {
    if (poolThree.length === 0) return { id: 'iron', name: 'Iron', rarity: 3, type: 'weapon', icon: '/images/Weapon_Originite_Type_IV.webp' }
    return pick(poolThree)
  }

  /** Simulate one single pull and compute updated pity values. */
  function doSingleRollLocal(pity5: number, pity4: number, fiftyFiftyLost: boolean) {
    const rarity = rollRarity(pity5, pity4)
    let item: PoolItem
    let newFifty = fiftyFiftyLost
    let newPity5 = pity5
    let newPity4 = pity4

    if (rarity === 5) {
      const r = rollFiveStar(fiftyFiftyLost)
      item = r.item
      newFifty = r.newFiftyLost
      newPity5 = 0
      newPity4 = 0
    } else if (rarity === 4) {
      item = rollFourStar()
      newPity5 = pity5 + 1
      newPity4 = 0
    } else {
      item = rollThreeStar()
      newPity5 = pity5 + 1
      newPity4 = pity4 + 1
    }
    return { item, newPity5, newPity4, newFifty }
  }

  /** Start reveal animation for the given number of results. */
  function startReveal(total: number) {
    if (revealTimerRef.current !== null) window.clearInterval(revealTimerRef.current)
    setRevealIndex(0)
    const id = window.setInterval(() => {
      setRevealIndex(i => {
        if (i + 1 >= total) {
          window.clearInterval(id)
          return total
        }
        return i + 1
      })
    }, 140)
    revealTimerRef.current = id
  }
  /** Skip reveal animation and show all results. */
  function skipReveal() {
    if (revealTimerRef.current !== null) window.clearInterval(revealTimerRef.current)
    setRevealIndex(results.length)
  }

  /** Perform 1x or 10x roll and update state, results, and history. */
  async function roll(count: 1 | 10) {
    if (rolling || portraitLock) return
    const cost = count === 10 ? 1600 : 160
    if (state.astrikes < cost) return

    setRolling(true)
    try {
      consume(cost)
      setResults([])
      await new Promise(r => setTimeout(r, 200))
      let pity5 = state.pity5
      let pity4 = state.pity4
      let fifty = state.fiftyFiftyLost
      const pulls: PoolItem[] = []

      if (count === 1) {
        const r = doSingleRollLocal(pity5, pity4, fifty)
        pulls.push(r.item)
        pity5 = r.newPity5; pity4 = r.newPity4; fifty = r.newFifty
      } else {
        for (let i = 0; i < 10; i++) {
          const r = doSingleRollLocal(pity5, pity4, fifty)
          pulls.push(r.item)
          pity5 = r.newPity5; pity4 = r.newPity4; fifty = r.newFifty
        }
        // x10 safety (đảm bảo ≥4★)
        if (!pulls.some(p => p.rarity >= 4)) {
          const forced = rollFourStar()
          pulls[pulls.length - 1] = forced
          pity5 = Math.max(0, pity5 - 1) + 1
          pity4 = 0
        }
      }

      const hi = pulls.filter(p => p.rarity >= 4)
      const rest = pulls.filter(p => p.rarity < 4)
      const ordered = [...hi, ...rest]

      setState(prev => ({ ...prev, pity5, pity4, fiftyFiftyLost: fifty }))
      ordered.forEach(it => record(it, count === 10))

      setResults(ordered)
      startReveal(ordered.length)
      setHistoryPage(1)
    } finally {
      setRolling(false)
    }
  }

  /** Reset simulator entirely. */
  function resetAll() {
    setState({ pity5: 0, pity4: 0, fiftyFiftyLost: false, astrikes: 1600, history: [] })
    setResults([])
    setRevealIndex(0)
    setHistoryPage(1)
  }

  /* ======= Derived stats ======= */
  const totalRolls = state.history.length

  /** Compute average pity to 5★ across history; null if none. */
  const avgPityToFive = useMemo(() => {
    let since = 0
    const buckets: number[] = []
    for (let i = state.history.length - 1; i >= 0; i--) {
      const r = state.history[i].result
      since++
      if (r.rarity === 5) { buckets.push(since); since = 0 }
    }
    if (buckets.length === 0) return null
    const sum = buckets.reduce((a, b) => a + b, 0)
    return Math.round((sum / buckets.length) * 100) / 100
  }, [state.history])

  /** Compute tally of pulled 4★/5★ characters. */
  const charStats = useMemo(() => {
    const map = new Map<string, { name: string; icon: string; rarity: Rarity; count: number }>()
    for (const h of state.history) {
      const it = h.result
      if (it.type !== 'character' || it.rarity < 4) continue
      const prev = map.get(it.id)
      if (prev) prev.count += 1
      else map.set(it.id, { name: it.name, icon: it.icon, rarity: it.rarity, count: 1 })
    }
    return Array.from(map.values()).sort((a, b) => (b.rarity - a.rarity) || (b.count - a.count))
  }, [state.history])

  // history pagination
  const totalPages = Math.max(1, Math.ceil(state.history.length / HISTORY_PAGE_SIZE))
  const safePage = Math.min(historyPage, totalPages)
  const pageSlice = state.history.slice((safePage - 1) * HISTORY_PAGE_SIZE, safePage * HISTORY_PAGE_SIZE)

  /* ======= Build pool theo banner + Quy tắc ======= */
  /** Build rolling pools from current banner selections. */
  function buildPoolsFromBanner(btype: BannerType, fiveId: number | null, fourIds: number[]) {
    const toPoolItemChar5 = (c: CharacterRow): PoolItem => ({
      id: String(c.id),
      name: c.name,
      rarity: 5,
      type: 'character',
      icon: c.avatar || c.imgFull || '',
    })
    const toPoolItemChar4 = (c: CharacterRow): PoolItem => ({
      id: String(c.id),
      name: c.name,
      rarity: 4,
      type: 'character',
      icon: c.avatar || c.imgFull || '',
    })
    const toPoolItemWeapon = (w: ItemRow): PoolItem => ({
      id: String(w.id),
      name: w.itemName,
      rarity: (w.itemRank ?? 3) as Rarity,
      type: 'weapon',
      icon: w.itemIcon || w.itemImage || '',
    })

    if (btype === 'CHARACTER') {
      const fiveUpChar = characters.find(c => c.id === fiveId && (c.rank ?? c.itemRank) === 5) || null
      const std5 = characters.filter(c => !c.isLimited && (c.rank ?? c.itemRank) === 5 && c.id !== (fiveUpChar?.id ?? -1))
      const rate4Chars = characters.filter(c => !c.isLimited && fourIds.includes(c.id) && (c.rank ?? c.itemRank) === 4)
      const other4Chars = characters.filter(c => !c.isLimited && (c.rank ?? c.itemRank) === 4 && !fourIds.includes(c.id))
      const threeWeapons = weapons.filter(w => (w.itemRank ?? 3) === 3)

      setPoolFiveUp(fiveUpChar ? [{ ...toPoolItemChar5(fiveUpChar), rateUp: true }] : [])
      setPoolFiveStd(std5.map(c => toPoolItemChar5(c)))
      setPoolFour([
        ...rate4Chars.map(c => ({ ...toPoolItemChar4(c), rateUp: true })),
        ...other4Chars.map(c => toPoolItemChar4(c)),
      ])
      setPoolThree(threeWeapons.map(w => toPoolItemWeapon(w)))
    } else {
      const fiveUpW = weapons.find(w => w.id === fiveId && (w.itemRank ?? 0) === 5) || null
      const std5W = weapons.filter(w => (w.itemRank ?? 0) === 5 && w.id !== (fiveUpW?.id ?? -1))
      const rate4W = weapons.filter(w => fourIds.includes(w.id) && (w.itemRank ?? 0) === 4)
      const other4W = weapons.filter(w => (w.itemRank ?? 0) === 4 && !fourIds.includes(w.id))
      const threeW = weapons.filter(w => (w.itemRank ?? 0) === 3)

      setPoolFiveUp(fiveUpW ? [{ ...toPoolItemWeapon(fiveUpW), rateUp: true }] : [])
      setPoolFiveStd(std5W.map(w => toPoolItemWeapon(w)))
      setPoolFour([
        ...rate4W.map(w => ({ ...toPoolItemWeapon(w), rateUp: true })),
        ...other4W.map(w => toPoolItemWeapon(w)),
      ])
      setPoolThree(threeW.map(w => toPoolItemWeapon(w)))
    }
  }

  /* ======= Set banner: build pool + save DB + hiển thị ở dưới ======= */
  /** Apply current picks as a banner, persist to backend, and show below. */
  async function applyCurrentBanner() {
    if (!rate5Id || rate4Ids.length === 0) return

    // 1) Build pool to roll immediately
    buildPoolsFromBanner(bannerType, rate5Id, rate4Ids)

    // 2) Prepare payload for API
    const nowIso = new Date().toISOString()
    const payload = {
      id: savedBannerId ?? 0,
      bannerName: bannerType === 'CHARACTER' ? 'Resonator Rate‑Up' : 'Weapon Rate‑Up',
      bannerType,
      startAt: nowIso,
      endAt: '',
      rateup5starId: Number(rate5Id),
      rateup4starIds: rate4Ids.map(Number).join(','),
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    try {
      if (!savedBannerId) {
        // CREATE
        const created = await addBanner(payload as never)
        const newIdMaybe = (created as unknown as { id?: number; bannerId?: number } | number)
        let fixedId: number
        if (typeof newIdMaybe === 'number') fixedId = newIdMaybe
        else fixedId = toNum((newIdMaybe?.id ?? newIdMaybe?.bannerId), Date.now())

        setSavedBannerId(fixedId)

        const newDTO: BannerRateUpDTO = {
          id: fixedId,
          bannerName: payload.bannerName,
          bannerType: payload.bannerType,
          startAt: nowIso,
          endAt: null,
          rateup5starId: payload.rateup5starId,
          rateup4starIds: payload.rateup4starIds,
          createdAt: nowIso,
          updatedAt: nowIso,
        }
        setCurrentBanner(newDTO)
        setBanners(prev => [newDTO, ...prev])
      } else {
        // UPDATE
        await updateBanner({ ...payload, id: savedBannerId } as never)
        const updatedDTO: BannerRateUpDTO = {
          id: savedBannerId,
          bannerName: payload.bannerName,
          bannerType: payload.bannerType,
          startAt: nowIso,
          endAt: null,
          rateup5starId: payload.rateup5starId,
          rateup4starIds: payload.rateup4starIds,
          createdAt: currentBanner?.createdAt ?? nowIso,
          updatedAt: nowIso,
        }
        setCurrentBanner(updatedDTO)
        setBanners(prev => prev.map(b => (b.id === savedBannerId ? updatedDTO : b)))
      }
    } catch (e) {
      console.error('Save banner failed:', e)
      const fallbackId = savedBannerId ?? Date.now()
      const dto: BannerRateUpDTO = {
        id: fallbackId,
        bannerName: payload.bannerName,
        bannerType: payload.bannerType,
        startAt: nowIso,
        endAt: null,
        rateup5starId: payload.rateup5starId,
        rateup4starIds: payload.rateup4starIds,
        createdAt: nowIso,
        updatedAt: nowIso,
      }
      setSavedBannerId(fallbackId)
      setCurrentBanner(dto)
      setBanners(prev => prev.some(b => b.id === fallbackId) ? prev : [dto, ...prev])
    }
  }

  /** Delete a banner and remove from UI list. */
  async function handleDelete(b: BannerRateUpDTO) {
    try {
      const nowIso = new Date().toISOString()
      const payload = {
        id: b.id,
        bannerName: b.bannerName,
        bannerType: b.bannerType,
        startAt: b.startAt ?? nowIso,
        endAt: b.endAt ?? '',
        rateup5starId: b.rateup5starId,
        rateup4starIds: b.rateup4starIds,
        createdAt: nowIso,
        updatedAt: nowIso,
      }
      await deleteBanner(payload as never)
    } catch (e) {
      console.error('deleteBanner failed', e)
    } finally {
      setBanners(prev => prev.filter(x => x.id !== b.id))
      if (savedBannerId === b.id) {
        setSavedBannerId(null)
        setCurrentBanner(null)
      }
    }
  }

  /* ======= Edit modal helpers (YÊU CẦU #4) ======= */
  /** Open edit modal for a banner (only name/start/end). */
  function openEdit(b: BannerRateUpDTO) {
    setEditTarget(b)
    setEditName(b.bannerName)
    setEditStart(b.startAt ?? '')
    setEditEnd(b.endAt ?? '')
    setEditOpen(true)
  }
  /** Close edit modal and reset fields. */
  function closeEdit() {
    setEditOpen(false)
    setEditTarget(null)
    setEditName('')
    setEditStart('')
    setEditEnd('')
    setSubmittingEdit(false)
  }
  /** Submit edit changes to backend and update UI. */
  async function submitEdit() {
    if (!editTarget) return
    setSubmittingEdit(true)
    try {
      const nowIso = new Date().toISOString()
      const payload = {
        id: editTarget.id,
        bannerName: editName.trim() || editTarget.bannerName,
        bannerType: editTarget.bannerType,
        startAt: editStart || '',
        endAt: editEnd || '',
        rateup5starId: editTarget.rateup5starId,
        rateup4starIds: editTarget.rateup4starIds,
        createdAt: editTarget.createdAt,
        updatedAt: nowIso,
      }
      await updateBanner(payload as never)
      const updated: BannerRateUpDTO = { ...editTarget, ...payload }
      setBanners(prev => prev.map(x => x.id === updated.id ? updated : x))
      if (currentBanner?.id === updated.id) setCurrentBanner(updated)
      closeEdit()
    } catch (e) {
      console.error('update failed', e)
      setSubmittingEdit(false)
    }
  }

  /* ======= Icon helpers for banner table (YÊU CẦU #3) ======= */
  /** Get character by id. */
  function getChar(id: number) { return characters.find(c => c.id === id) }
  /** Get weapon by id. */
  function getWeapon(id: number) { return weapons.find(w => w.id === id) }
  /** Get icon URL+name for entity id according to banner type. */
  function getIconAndNameById(btype: BannerType, id: number): { icon: string; name: string } | null {
    if (btype === 'CHARACTER') {
      const c = getChar(id); if (!c) return null
      return { icon: c.avatar || c.imgFull || '', name: c.name }
    } else {
      const w = getWeapon(id); if (!w) return null
      return { icon: w.itemIcon || w.itemImage || '', name: w.itemName }
    }
  }
  /** Parse CSV ids to icons for given banner type. */
  function csvIcons(btype: BannerType, csv: string): { icon: string; name: string; id: number }[] {
    return csv.split(',').map(s => s.trim()).filter(Boolean)
      .map(s => toNum(s))
      .map(id => ({ id, data: getIconAndNameById(btype, id) }))
      .filter(x => !!x.data)
      .map(x => ({ id: x.id, icon: (x.data as {icon:string;name:string}).icon, name: (x.data as {icon:string;name:string}).name }))
  }

  /* ================= Render ================= */
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* ===== Admin: Banner Picker ===== */}
        <section className={styles.admin}>
          <div className={styles.adminHead}>
            <h2>Banner Rate‑Up</h2>
          </div>

          {/* Tabs: Character / Weapon */}
          <div className={styles.tabRow}>
            <button
              className={`${styles.btn} ${bannerType === 'CHARACTER' ? styles.btnPrimary : ''}`}
              onClick={() => setBannerType('CHARACTER')}
            >
              Character Banner
            </button>
            <button
              className={`${styles.btn} ${bannerType === 'WEAPON' ? styles.btnPrimary : ''}`}
              onClick={() => setBannerType('WEAPON')}
            >
              Weapon Banner
            </button>
            <div style={{ flex: 1 }} />
            {currentBanner && (
              <div className={styles.currInfo}>
                <b>Current:</b> {currentBanner.bannerName} • 5★: {getIconAndNameById(currentBanner.bannerType, currentBanner.rateup5starId)?.name ?? '—'} • 4★: {csvIcons(currentBanner.bannerType, currentBanner.rateup4starIds).map(x => x.name).join(', ') || '-'}
              </div>
            )}
          </div>

          {/* Pick 5★ (click again to deselect) */}
          <div className={styles.pickerBlock}>
            <div className={styles.pickerHead}><b>Chọn 5★ rate‑up</b></div>
            <div className={styles.iconGrid}>
              {bannerType === 'CHARACTER' ? (
                characters.filter(c => (c.rank ?? c.itemRank) === 5).map(row => {
                  const id = row.id
                  const name = row.name
                  const icon = row.avatar || row.imgFull || ''
                  const selected = rate5Id === id
                  return (
                    <button
                      key={`pick5c-${id}`}
                      className={`${styles.iconBtn} ${selected ? styles.iconBtnSelected : ''}`}
                      onClick={() => setRate5Id(prev => (prev === id ? null : id))}
                    >
                      <img src={icon || '/noimg.png'} alt={name} />
                      <span className={styles.iconCaption}>{name}</span>
                    </button>
                  )
                })
              ) : (
                weapons.filter(w => (w.itemRank ?? 0) === 5).map(row => {
                  const id = row.id
                  const name = row.itemName
                  const icon = row.itemIcon || row.itemImage || ''
                  const selected = rate5Id === id
                  return (
                    <button
                      key={`pick5w-${id}`}
                      className={`${styles.iconBtn} ${selected ? styles.iconBtnSelected : ''}`}
                      onClick={() => setRate5Id(prev => (prev === id ? null : id))}
                    >
                      <img src={icon || '/noimg.png'} alt={name} />
                      <span className={styles.iconCaption}>{name}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Pick 4★ (toggle) */}
          <div className={styles.pickerBlock}>
            <div className={styles.pickerHead}><b>Chọn 4★ rate‑up</b> <small>(bấm để bật/tắt; chọn ≥ 1)</small></div>
            <div className={styles.iconGrid}>
              {bannerType === 'CHARACTER' ? (
                characters.filter(c => (c.rank ?? c.itemRank) === 4 && !c.isLimited).map(row => {
                  const id = row.id
                  const name = row.name
                  const icon = row.avatar || row.imgFull || ''
                  const selected = rate4Ids.includes(id)
                  return (
                    <button
                      key={`pick4c-${id}`}
                      className={`${styles.iconBtn} ${selected ? styles.iconBtnSelected : ''}`}
                      onClick={() => {
                        setRate4Ids(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
                      }}
                    >
                      <img src={icon || '/noimg.png'} alt={name} />
                      <span className={styles.iconCaption}>{name}</span>
                    </button>
                  )
                })
              ) : (
                weapons.filter(w => (w.itemRank ?? 0) === 4).map(row => {
                  const id = row.id
                  const name = row.itemName
                  const icon = row.itemIcon || row.itemImage || ''
                  const selected = rate4Ids.includes(id)
                  return (
                    <button
                      key={`pick4w-${id}`}
                      className={`${styles.iconBtn} ${selected ? styles.iconBtnSelected : ''}`}
                      onClick={() => {
                        setRate4Ids(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
                      }}
                    >
                      <img src={icon || '/noimg.png'} alt={name} />
                      <span className={styles.iconCaption}>{name}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Set banner */}
          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={!rate5Id || rate4Ids.length === 0}
              onClick={applyCurrentBanner}
            >
              Set banner (Save)
            </button>
          </div>
        </section>

        {/* ===== Roll Board ===== */}
        <section className={styles.board}>
          <div className={styles.walletRow}>
            <span className={styles.currency}>{state.astrikes.toLocaleString()} Astrikes</span>
            <div className={styles.walletBtns}>
              <button className={styles.btn} onClick={() => topUp(1600)}>+1600</button>
              <button className={`${styles.btn} ${styles.btnSubtle}`} onClick={resetAll}>Reset</button>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}><span>Pity 5★</span><b>{state.pity5}</b></div>
            <div className={styles.stat}><span>Pity 4★</span><b>{state.pity4}</b></div>
            <div className={styles.stat}><span>Featured</span><b>{state.fiftyFiftyLost ? 'Guaranteed next 5★' : '50/50'}</b></div>
            <div className={styles.stat}><span>Tổng rolls</span><b>{totalRolls}</b></div>
            <div className={styles.stat}><span>Pity TB → 5★</span><b>{avgPityToFive ?? 'N/A'}</b></div>
          </div>

          <div className={styles.stage}>
            {results.length === 0 ? (
              <div className={styles.empty}><div className={styles.orb} /><p className={styles.muted}>Tap to begin the convene</p></div>
            ) : (
              <>
                <div className={styles.cards}>
                  {results.map((it, idx) => (
                    <ResultCard key={idx + '-' + it.id} item={it} revealed={idx < revealIndex} />
                  ))}
                </div>
                {revealIndex < results.length && (
                  <button className={styles.skipBtn} onClick={skipReveal}>Skip</button>
                )}
              </>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.btn} disabled={!canRollOne} onClick={() => roll(1)}>Convene ×1 <small>(160)</small></button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} disabled={!canRollTen} onClick={() => roll(10)}>Convene ×10 <small>(1600)</small></button>
          </div>
        </section>

        {/* Character 4★/5★ tally */}
        <section className={styles.tally}>
          <h2>Thống kê nhân vật 4★ / 5★</h2>
          <div className={styles.tallyGrid}>
            {charStats.length === 0 && <div className={styles.muted}>Chưa có</div>}
            {charStats.map((c) => (
              <div key={c.name} className={`${styles.tallyCard} ${styles['r' + c.rarity]}`}>
                <img src={c.icon} alt={c.name} />
                <div className={styles.tallyInfo}>
                  <div className={styles.tallyName}>{c.name}</div>
                  <div className={styles.tallyCount}>×{c.count}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Saved Banners list (show below, can edit/delete) ===== */}
        <section className={styles.history}>
          <div className={styles.historyHead}>
            <h2>Banner đã lưu</h2>
            {loadingBanners && <span className={styles.muted}>Đang tải…</span>}
          </div>

          <div className={styles.bannerTable}>
            <div className={`${styles.row} ${styles.head}`}>
              <div className={styles.col}>Tên</div>
              <div className={styles.col}>Loại</div>
              <div className={styles.col}>Thời gian</div>
              <div className={styles.col}>5★</div>
              <div className={styles.col}>4★</div>
              <div className={styles.col}>Hành động</div>
            </div>

            {banners.map(b => {
              const r5 = getIconAndNameById(b.bannerType, b.rateup5starId)
              const r4s = csvIcons(b.bannerType, b.rateup4starIds)
              return (
                <div key={b.id} className={styles.row}>
                  <div className={styles.col}>{b.bannerName}</div>
                  <div className={styles.col}>{b.bannerType}</div>
                  <div className={styles.col}>{fmtDDMMYY(b.startAt)} → {fmtDDMMYY(b.endAt)}</div>
                  <div className={styles.col}>
                    {r5 ? <img className={styles.iconSmall} src={r5.icon} alt={r5.name} title={r5.name} /> : <span className={styles.muted}>-</span>}
                  </div>
                  <div className={styles.col}>
                    <div className={styles.iconList}>
                      {r4s.length === 0 && <span className={styles.muted}>-</span>}
                      {r4s.map(x => (
                        <img key={x.id} className={styles.iconSmall} src={x.icon} alt={x.name} title={x.name} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.col}>
                    <div className={styles.actions}>
                      <button className={styles.btn} onClick={() => {
                        setBannerType(b.bannerType)
                        setRate5Id(b.rateup5starId)
                        setRate4Ids(b.rateup4starIds.split(',').filter(Boolean).map(s => toNum(s)))
                        setSavedBannerId(b.id)
                        setCurrentBanner(b)
                        buildPoolsFromBanner(b.bannerType, b.rateup5starId, b.rateup4starIds.split(',').filter(Boolean).map(s => toNum(s)))
                      }}>Dùng</button>

                      {/* YÊU CẦU #3: thêm nút Sửa */}
                      <button className={styles.btn} onClick={() => openEdit(b)}>Sửa</button>

                      <button className={styles.btn} onClick={() => handleDelete(b)}>Xoá</button>
                    </div>
                  </div>
                </div>
              )
            })}

            {banners.length === 0 && (
              <div className={styles.muted} style={{ padding: 8 }}>Chưa có banner nào.</div>
            )}
          </div>
        </section>

        {/* History with pagination (top pager) */}
        <section className={styles.history}>
          <div className={styles.historyHead}>
            <h2>Lịch sử roll</h2>
            <div className={styles.pager}>
              <button className={styles.btn} disabled={safePage <= 1} onClick={() => setHistoryPage(p => Math.max(1, p - 1))}>Prev</button>
              <span className={styles.pageInfo}>{safePage}/{totalPages}</span>
              <button className={styles.btn} disabled={safePage >= totalPages} onClick={() => setHistoryPage(p => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </div>
          <ul className={styles.historyList}>
            {pageSlice.map((h, i) => (
              <li key={i} className={`${styles.hline} ${styles['r' + h.result.rarity]}`}>
                <img src={h.result.icon} alt="" />
                <div>
                  <div className={styles.hname}>{h.result.name} <span className={`${styles.badge} ${styles['r' + h.result.rarity]}`}>{h.result.rarity}★</span></div>
                  <div className={styles.hmeta}>{new Date(h.time).toLocaleString()} • {h.result.type}</div>
                </div>
              </li>
            ))}
            {state.history.length === 0 && <li className={styles.muted}>No pulls yet.</li>}
          </ul>
          {/* Bottom pager */}
          <div className={styles.historyHead} style={{ marginTop: 8 }}>
            <div className={styles.pager}>
              <button className={styles.btn} disabled={safePage <= 1} onClick={() => setHistoryPage(p => Math.max(1, p - 1))}>Prev</button>
              <span className={styles.pageInfo}>{safePage}/{totalPages}</span>
              <button className={styles.btn} disabled={safePage >= totalPages} onClick={() => setHistoryPage(p => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </div>
        </section>
      </div>

      {/* ===== Edit Modal (only name, start, end) ===== */}
      {editOpen && (
        <div className={m.overlay} role="dialog" aria-modal="true" onClick={closeEdit}>
          <div className={m.modal} onClick={e => e.stopPropagation()}>
            <div className={m.head}>
              <h3>Sửa banner</h3>
              <button className={m.iconbtn} onClick={closeEdit} aria-label="Close">✕</button>
            </div>
            <div className={m.body}>
              <div className={m.grid}>
                <label className={m.field}>
                  <span>Tên banner</span>
                  <input value={editName} onChange={e => setEditName(e.target.value)} />
                </label>
                <div />
                <label className={m.field}>
                  <span>Start at (YYYY-MM-DD)</span>
                  <input value={editStart} onChange={e => setEditStart(e.target.value)} placeholder="2025-08-01" />
                </label>
                <label className={m.field}>
                  <span>End at (YYYY-MM-DD)</span>
                  <input value={editEnd} onChange={e => setEditEnd(e.target.value)} placeholder="2025-08-21" />
                </label>
              </div>
              <div className={m.actions}>
                <button className={m.btn} onClick={closeEdit}>Huỷ</button>
                <button className={`${m.btn} ${m.btnPrimary}`} onClick={submitEdit} disabled={submittingEdit}>
                  {submittingEdit ? 'Đang lưu…' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================= Result Card ================= */
/** Present a single rolled result card with reveal animation & glow effects. */
function ResultCard({ item, revealed }: { item: PoolItem; revealed: boolean }) {
  const stars = Array.from({ length: item.rarity }, (_, i) => i)
  return (
    <div className={`${styles.card} ${styles['r' + item.rarity]} ${revealed ? styles.revealed : styles.hidden}`}>
      <img className={styles.cardImg} src={item.icon} alt={item.name} />
      <div className={styles.cardFooter}>
        <div className={`${styles.stars} ${styles['r' + item.rarity]}`}>{stars.map(i => <span key={i}>★</span>)}</div>
        <div className={styles.cname}>{item.name}</div>
      </div>
      {revealed && item.rarity === 5 && <div className={styles.glowGold} />}
      {revealed && item.rarity === 4 && <div className={styles.glowPurple} />}
    </div>
  )
}
