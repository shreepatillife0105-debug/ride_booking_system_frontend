import { Injectable } from '@angular/core';
import { Ride } from '../interfaces/ride.interface';
import { ApiService } from './api.service';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RideService extends ApiService{

  createRide(ride:Ride){
    return this.post<ApiResponse<Ride>>(
      '/rides/',
      ride
    );
  }

  getAllRides() {
    return this.get<ApiResponse<Ride[]>>(
      '/rides'
    );
  }

  getRideById(id: number) {
    return this.get<ApiResponse<Ride>>(
      `/rides/${id}`
    );
  }

  updateRide(id: number, ride: Ride) {
    return this.put<ApiResponse<Ride>>(
      `/rides/${id}`,
      ride
    );
  }

  deleteRide(id: number) {
    return this.delete<ApiResponse<null>>(
      `/rides/${id}`
    );
  }

  acceptRide(rideId: number, driverId: number) {
    return this.put<ApiResponse<Ride>>(
      `/rides/${rideId}/accept?driverId=${driverId}`,
      {}
    );
  }

  startRide(rideId: number, driverId: number) {
    return this.put<ApiResponse<Ride>>(
      `/rides/${rideId}/start?driverId=${driverId}`,
      {}
    );
  }

  completeRide(rideId: number, driverId: number) {
    return this.put<ApiResponse<Ride>>(
      `/rides/${rideId}/complete?driverId=${driverId}`,
      {}
    );
  }

  cancelRide(rideId: number, userId: number) {
    return this.put<ApiResponse<Ride>>(
      `/rides/${rideId}/cancel?userId=${userId}`,
      {}
    );
  }

  rejectRide(rideId: number, driverId: number) {
  return this.put<ApiResponse<Ride>>(
    `/rides/${rideId}/reject?driverId=${driverId}`,
    {}
  );

}

}
