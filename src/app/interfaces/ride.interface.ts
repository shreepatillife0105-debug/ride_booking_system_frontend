export interface Ride {
    id?: number;
    customerId: number;
    driverId?: number | null;
    pickupLocation: string;
    dropLocation: string
    pickupLatitude: number;
    pickupLongitude: number;
    dropLatitude: number;
    dropLongitude: number
    rideStatus?: string
}