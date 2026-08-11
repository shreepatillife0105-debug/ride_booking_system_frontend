import { Component, OnDestroy, OnInit, TestabilityRegistry } from '@angular/core';
import { RideNotification } from 'src/app/interfaces/ride-notification.interface';
import { Ride } from 'src/app/interfaces/ride.interface';
import { RideService } from 'src/app/services/ride.service';
import { SseService } from 'src/app/services/sse.service';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit, OnDestroy {

  driverId = 1;

  currentRide: RideNotification | null = null;

  rideQueue: RideNotification[] = [];

  acceptingRide = false;
  startingRide = false;
  completingRide = false;
  rejectingRide = false;

  acceptedRide = false;

  message = '';

  constructor(
    private sseService: SseService,
    private rideService: RideService
  ) { }

  ngOnInit(): void {
    this.connectToSse();
  }


  connectToSse(): void {

    this.sseService.connect(

      this.driverId,

      // NEW_RIDE
      (ride: RideNotification) => {

        console.log(
          'New ride received:',
          ride
        );

        // Show only one ride at a time
        if (this.currentRide === null) {

          this.currentRide = ride;

        } else {

          // Store next ride in queue
          this.rideQueue.push(ride);
        }

        this.message = '';
      },


      // RIDE_UNAVAILABLE
      (data: any) => {

        const unavailableRideId =
          Number(data.rideId);

        console.log(
          '===================================='
        );

        console.log(
          'RIDE_UNAVAILABLE RECEIVED'
        );

        console.log(
          'Unavailable ride ID:',
          unavailableRideId
        );

        console.log(
          'Queue BEFORE removal:',
          this.rideQueue
        );


        /*
         * Remove from queue.
         */
        this.rideQueue =
          this.rideQueue.filter(
            ride =>
              Number(ride.rideId) !==
              unavailableRideId
          );


        console.log(
          'Queue AFTER removal:',
          this.rideQueue
        );


        /*
         * If currently displayed ride is
         * the unavailable ride.
         */
        if (
          this.currentRide &&
          Number(this.currentRide.rideId) ===
          unavailableRideId
        ) {

          console.log(
            'Current ride became unavailable.'
          );

          this.currentRide = null;

          this.acceptedRide = false;

          this.message =
            'This ride has already been accepted by another driver.';

          this.showNextRide();
        }


        console.log(
          '===================================='
        );

      }
    );
  }


  showNextRide(): void {

    console.log(
      'Checking next available ride from queue...'
    );

    this.currentRide = null;

    this.acceptedRide = false;

    this.checkNextRide();
  }

  private checkNextRide(): void {

  if (this.rideQueue.length === 0) {
    this.currentRide = null;
    return;
  }

  const nextRide = this.rideQueue.shift();

  if (!nextRide) {
    this.currentRide = null;
    return;
  }

  console.log('Checking queued ride:', nextRide);

  /*
   * Get the latest ride from backend
   */
  this.rideService
    .getRideById(nextRide.rideId)
    .subscribe({

      next: (response: any) => {

        const latestRide = response.data;

        console.log(
          'Latest ride from backend:',
          latestRide
        );

        /*
         * Only show the ride if it is still PENDING.
         */
        if (
          latestRide &&
          latestRide.rideStatus === 'PENDING' &&
          latestRide.driverId == null
        ) {

          this.currentRide = {
            ...nextRide,
            ...latestRide
          };

          this.acceptedRide = false;

          this.message = '';

          console.log(
            'Showing valid queued ride:',
            this.currentRide
          );

          return;
        }

        /*
         * Ride is stale / already accepted /
         * started / completed / cancelled.
         */
        console.log(
          'Skipping stale ride:',
          nextRide.rideId,
          latestRide?.rideStatus
        );

        /*
         * Check the next ride in queue.
         */
        this.checkNextRide();
      },

      error: (error: any) => {

        console.error(
          'Failed to validate queued ride:',
          error
        );

        /*
         * If the ride no longer exists,
         * simply skip it.
         */
        this.checkNextRide();
      }
    });
}


  acceptRide(): void {

    if (!this.currentRide || this.acceptingRide) {
      return;
    }

    this.acceptingRide = true;
    this.message = '';

    this.rideService
      .acceptRide(
        this.currentRide.rideId,
        this.driverId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Ride accepted:',
            response
          );

          this.currentRide = {
            ...this.currentRide!,
            rideStatus: 'ACCEPTED'
          };

          this.message =
            'Ride accepted successfully!';

          this.acceptedRide = true;

          this.acceptingRide = false;
        },

        error: (error: any) => {

          console.error(
            'Accept ride error:',
            error
          );

          this.message =
            error.error?.message ||
            'Failed to accept ride.';

          this.acceptingRide = false;
        }
      });
  }


  rejectRide(): void {

    if (!this.currentRide || this.rejectingRide) {
      return;
    }

    const rejectedRideId =
      this.currentRide.rideId;

    this.rejectingRide = true;
    this.message = '';

    this.rideService
      .rejectRide(
        rejectedRideId,
        this.driverId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Ride rejected:',
            response
          );

          // Remove current ride
          this.currentRide = null;

          this.acceptedRide = false;

          this.rejectingRide = false;

          // Automatically show next ride
          this.showNextRide();
        },

        error: (error: any) => {

          console.error(
            'Reject ride error:',
            error
          );

          this.message =
            error.error?.message ||
            'Failed to reject ride.';

          this.rejectingRide = false;
        }
      });
  }


  startRide(): void {

    if (!this.currentRide || this.startingRide) {
      return;
    }

    this.startingRide = true;
    this.message = '';

    this.rideService
      .startRide(
        this.currentRide.rideId,
        this.driverId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Ride started:',
            response
          );

          this.currentRide = {
            ...this.currentRide!,
            rideStatus: 'ON_TRIP'
          };

          this.message =
            'Ride started successfully!';

          this.startingRide = false;
        },

        error: (error) => {

          console.error(
            'Start ride error:',
            error
          );

          this.message =
            error.error?.message ||
            'Failed to start ride.';

          this.startingRide = false;
        }
      });
  }


  completeRide(): void {

    if (!this.currentRide || this.completingRide) {
      return;
    }

    this.completingRide = true;
    this.message = '';

    const completedRideId =
      this.currentRide.rideId;

    this.rideService
      .completeRide(
        completedRideId,
        this.driverId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Ride completed:',
            response
          );

          this.message =
            'Ride completed successfully!';

          this.currentRide = null;

          this.acceptedRide = false;

          this.completingRide = false;

          /*
           * IMPORTANT:
           *
           * Before showing another ride,
           * remove rides that are no longer
           * available.
           */
            this.showNextRide();
        },

        error: (error: any) => {

          console.error(
            'Complete ride error:',
            error
          );

          this.message =
            error.error?.message ||
            'Failed to complete ride.';

          this.completingRide = false;
        }

      });
  }



  ngOnDestroy(): void {

    this.sseService.disconnect();
  }


}
