export interface RideNotification {
  rideId: number;
  customerId: number;

  pickupLocation: string;
  dropLocation: string;

  pickupLatitude: number;
  pickupLongitude: number;

  rideStatus: string;
}