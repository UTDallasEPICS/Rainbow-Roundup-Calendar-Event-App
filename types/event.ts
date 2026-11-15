export interface Event {
    type: "event"
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

    EventImages?: EventImage[]
    SignUps: SignUp[]
}

export interface EventImage {
    id: string
    url: string
    eventId: string
    createdAt: string
}

export interface SignUp {
    id: string
    userId: string
    eventId: string
    Notifications: boolean
    plusOneAdults: number
    plusOneKids: number
    User: User
}

export interface User {
    id: string
    firstname: string
    profilePic: string
    email: string
    emailNotif: boolean
    nativeNotif: boolean
    isArchived: boolean
    isBanned: boolean
}
