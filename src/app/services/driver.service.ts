import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Driver } from '../interfaces/driver.interface';
import { ApiResponse } from '../interfaces/api-response.interface';
import { DriverStatusRequest } from '../interfaces/driver-status.interface';

@Injectable({
  providedIn: 'root'
})
export class DriverService extends ApiService{

   addDriver(driver: Driver) {
    return this.post<ApiResponse<Driver>>(
      '/drivers',
      driver
    );
  }

  getAllDrivers() {
    return this.get<ApiResponse<Driver[]>>(
      '/drivers'
    );
  }

  getDriverById(id: number) {
    return this.get<ApiResponse<Driver>>(
      `/drivers/${id}`
    );
  }

  updateDriver(id: number, driver: Driver) {
    return this.put<ApiResponse<Driver>>(
      `/drivers/${id}`,
      driver
    );
  }

  deleteDriver(id: number) {
    return this.delete<ApiResponse<null>>(
      `/drivers/${id}`
    );
  }

  updateDriverStatus(
    driverId: number,
    status: DriverStatusRequest
  ) {
    return this.put<ApiResponse<Driver>>(
      `/drivers/${driverId}/status`,
      status
    );
  }

  heartbeat(driverId: number) {
    return this.post<ApiResponse<null>>(
      `/drivers/${driverId}/heartbeat`,
      {}
    );
  }
}
