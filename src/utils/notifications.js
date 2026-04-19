const STORAGE_KEY = 'notifications'

const createNotificationId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `N${crypto.randomUUID()}`
  }

  return `N${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const getNotificationSignature = (notif) => (
  [
    notif.type ?? '',
    notif.title ?? '',
    notif.message ?? '',
    notif.orderId ?? '',
    notif.meta?.from ?? '',
    notif.meta?.to ?? ''
  ].join('|')
)

export const normalizeNotifications = (items = []) => {
  const seenIds = new Set()
  const seenSignatures = new Set()

  return items.reduce((acc, item) => {
    if (!item || typeof item !== 'object') return acc

    const normalized = {
      ...item,
      id: item.id && !seenIds.has(item.id) ? item.id : createNotificationId(),
      createdAt: item.createdAt || new Date().toISOString(),
      read: Boolean(item.read)
    }

    const signature = getNotificationSignature(normalized)
    if (seenSignatures.has(signature)) return acc

    seenIds.add(normalized.id)
    seenSignatures.add(signature)
    acc.push(normalized)
    return acc
  }, [])
}

export const readNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const normalized = normalizeNotifications(parsed)

    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    }

    return normalized
  } catch (e) {
    return []
  }
}

export const writeNotifications = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeNotifications(items)))
  window.dispatchEvent(new Event('storage'))
}

export const addNotification = (notif) => {
  try {
    const items = readNotifications()
    const newNotif = {
      id: createNotificationId(),
      createdAt: new Date().toISOString(),
      read: false,
      ...notif
    }

    writeNotifications([newNotif, ...items])
  } catch (e) {
    console.error('Failed to add notification', e)
  }
}
