export interface Event {
    id: string
    title: string
    description: string
    location: string
    startTime: string
    endTime: string
    capacity: number
    currentCapacity: number
    remainingCapacity: number | null
    eventLat: number | null
    eventLong: number | null
    isArchived: boolean
    userId: string
}

