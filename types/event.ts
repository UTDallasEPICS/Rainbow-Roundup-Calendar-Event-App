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

    SignUps: SignUp[]
}

export interface SignUp {
    id: string
    userId: string
    eventId: string
    Notifications: boolean
    plusOneAdults: number
    plusOneKids: number

    User: {
        id: string
        firstname: string
        profilePic: string
        email: string
        emailNotif: boolean
        nativeNotif: boolean
        isArchived: boolean
        isBanned: boolean
    }
}

