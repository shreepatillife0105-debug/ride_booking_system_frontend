import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerSseService {

  private eventSource!: EventSource;

  connect(
    customerId: number,
    onRideAccepted: (data: any) => void,
    onRideStarted: (data: any) => void,
    onRideCompleted: (data: any) => void,
    onRideExpired: (data: any) => void
  ): void {
    this.disconnect();
    const url =
      `http://localhost:8080/sse/customer/connect/${customerId}`;
    this.eventSource = new EventSource(url);

    // CONNECTED
    this.eventSource.addEventListener(
      'CONNECTED',
      (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.log('Customer SSE connected:',data);
      }
    );


    // RIDE_ACCEPTED
    this.eventSource.addEventListener(
      'RIDE_ACCEPTED',
      (event: MessageEvent) => {

        const data = JSON.parse(event.data);

        console.log(
          'Ride accepted:',
          data
        );

        onRideAccepted(data);
      }
    );


    // RIDE_STARTED
    this.eventSource.addEventListener(
      'RIDE_STARTED',
      (event: MessageEvent) => {

        const data = JSON.parse(event.data);

        console.log(
          'Ride started:',
          data
        );

        onRideStarted(data);
      }
    );


    // RIDE_COMPLETED
    this.eventSource.addEventListener(
      'RIDE_COMPLETED',
      (event: MessageEvent) => {

        const data = JSON.parse(event.data);

        console.log(
          'Ride completed:',
          data
        );

        onRideCompleted(data);
      }
    );

    this.eventSource.addEventListener(
    'RIDE_EXPIRED',
    (event: MessageEvent) => {

      const data = JSON.parse(event.data);

      console.log(
        'Ride expired:',
        data
      );

      onRideExpired(data);
    }
  );


    this.eventSource.onerror = (error) => {

      console.warn(
        'Customer SSE connection interrupted:',
        error
      );
    };
  }


  disconnect(): void {

    if (this.eventSource) {

      this.eventSource.close();

      console.log(
        'Customer SSE disconnected.'
      );
    }
  }
}
