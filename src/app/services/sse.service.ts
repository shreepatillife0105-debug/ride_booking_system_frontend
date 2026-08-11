import { Injectable } from '@angular/core';
import { RideNotification } from '../interfaces/ride-notification.interface';

@Injectable({
  providedIn: 'root'
})
export class SseService {


  private eventSource?: EventSource;

 connect(
  driverId: number,
  onNewRide: (data: RideNotification) => void,
  onRideUnavailable: (data: any) => void
): void {

  this.disconnect();

  const url =
    `http://localhost:8080/sse/connect/${driverId}`;

  this.eventSource =
    new EventSource(url);

  this.eventSource.addEventListener(
    'CONNECTED',
    (event: MessageEvent) => {

      console.log(
        'SSE connected:',
        JSON.parse(event.data)
      );
    }
  );

  this.eventSource.addEventListener(
    'NEW_RIDE',
    (event: MessageEvent) => {

      const ride: RideNotification =
        JSON.parse(event.data);

      console.log(
        'NEW_RIDE received:',
        ride
      );

      onNewRide(ride);
    }
  );

  this.eventSource.addEventListener(
    'RIDE_UNAVAILABLE',
    (event: MessageEvent) => {

      const data = JSON.parse(event.data);

      console.log(
        'RIDE_UNAVAILABLE received:',
        data
      );

      onRideUnavailable(data);
    }
  );

  this.eventSource.onerror = (error) => {

    console.warn(
      'SSE connection interrupted.',
      error
    );
  };
}

  disconnect(): void {

    if (this.eventSource) {

      this.eventSource.close();

      this.eventSource = undefined;

      console.log(
        'SSE disconnected'
      );
    }
  }

}
