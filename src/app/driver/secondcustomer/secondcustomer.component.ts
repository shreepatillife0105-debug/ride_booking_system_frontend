import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ride } from 'src/app/interfaces/ride.interface';
import { CustomerSseService } from 'src/app/services/customer-sse.service';
import { RideService } from 'src/app/services/ride.service';

@Component({
  selector: 'app-secondcustomer',
  templateUrl: './secondcustomer.component.html',
  styleUrls: ['./secondcustomer.component.css']
})
export class SecondcustomerComponent implements OnInit, OnDestroy {

  rideForm!: FormGroup;

  currentRide: any = null;

  customerId = 3;

  /*
   * IMPORTANT
   * This stores the exact ride created by this customer.
   */
  activeRideId: number | null = null;

  message: string = '';

  lastRideRequest: Ride | null = null;

  rideExpired = false;

  expiredMessage = '';


  constructor(
    private fb: FormBuilder,
    private rideService: RideService,
    private customerSseService: CustomerSseService
  ) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {

    this.bindData();

    this.connectCustomerSse();
  }


  // ============================================================
  // CUSTOMER SSE
  // ============================================================

  connectCustomerSse(): void {
    debugger
    this.customerSseService.connect(

      this.customerId,


      // ========================================================
      // RIDE_ACCEPTED
      // ========================================================

      (data: any) => {

        const incomingRideId =
          this.getRideId(data);

        console.log(
          'Customer received RIDE_ACCEPTED:',
          data
        );

        console.log(
          'Customer active ride ID:',
          this.activeRideId
        );

        console.log(
          'Incoming ride ID:',
          incomingRideId
        );


        /*
         * If customer has no active ride,
         * ignore the event.
         */
        if (this.activeRideId === null) {

          console.log(
            'Ignoring RIDE_ACCEPTED because no active ride exists.'
          );

          return;
        }


        /*
         * VERY IMPORTANT
         *
         * If incoming ride belongs to another ride,
         * DO NOT update currentRide.
         */
        if (
          incomingRideId === null ||
          Number(incomingRideId) !==
          Number(this.activeRideId)
        ) {

          console.log(
            'Ignoring RIDE_ACCEPTED for another ride.'
          );

          return;
        }


        /*
         * Correct ride.
         */
        this.currentRide = {
          ...this.currentRide,
          ...data
        };

        this.rideExpired = false;

        this.message =
          'Your ride has been accepted by a driver.';

      },


      // ========================================================
      // RIDE_STARTED
      // ========================================================

      (data: any) => {

        const incomingRideId =
          this.getRideId(data);

        console.log(
          'Customer received RIDE_STARTED:',
          data
        );

        console.log(
          'Customer active ride ID:',
          this.activeRideId
        );

        console.log(
          'Incoming ride ID:',
          incomingRideId
        );


        /*
         * Ignore another customer's ride.
         */
        if (
          this.activeRideId === null ||
          incomingRideId === null ||
          Number(incomingRideId) !==
          Number(this.activeRideId)
        ) {

          console.log(
            'Ignoring RIDE_STARTED for another ride.'
          );

          return;
        }


        this.currentRide = {
          ...this.currentRide,
          ...data,
          rideStatus: 'ON_TRIP'
        };

        this.message =
          'Your ride has started.';

      },


      // ========================================================
      // RIDE_COMPLETED
      // ========================================================

      (data: any) => {

        const incomingRideId =
          this.getRideId(data);

        console.log(
          'Customer received RIDE_COMPLETED:',
          data
        );

        console.log(
          'Customer active ride ID:',
          this.activeRideId
        );

        console.log(
          'Incoming ride ID:',
          incomingRideId
        );


        /*
         * Ignore another customer's ride.
         */
        if (
          this.activeRideId === null ||
          incomingRideId === null ||
          Number(incomingRideId) !==
          Number(this.activeRideId)
        ) {

          console.log(
            'Ignoring RIDE_COMPLETED for another ride.'
          );

          return;
        }


        /*
         * Correct ride completed.
         */
        this.currentRide = {
          ...this.currentRide,
          ...data,
          rideStatus: 'COMPLETED'
        };

        this.message =
          'Your ride has been completed successfully.';


        console.log(
          'Correct ride completed:',
          incomingRideId
        );


        /*
         * Clear after showing completed message.
         */
        setTimeout(() => {

          this.currentRide = null;

          this.lastRideRequest = null;

          this.activeRideId = null;

        }, 3000);

      },


      // ========================================================
      // RIDE_EXPIRED
      // ========================================================

      (data: any) => {

        const incomingRideId =
          this.getRideId(data);

        console.log(
          'Customer received RIDE_EXPIRED:',
          data
        );

        console.log(
          'Customer active ride ID:',
          this.activeRideId
        );

        console.log(
          'Incoming ride ID:',
          incomingRideId
        );


        /*
         * Ignore another customer's expired ride.
         */
        if (
          this.activeRideId === null ||
          incomingRideId === null ||
          Number(incomingRideId) !==
          Number(this.activeRideId)
        ) {

          console.log(
            'Ignoring RIDE_EXPIRED for another ride.'
          );

          return;
        }


        this.rideExpired = true;

        this.expiredMessage =
          data.message ||
          'No driver accepted your ride request.';

        this.currentRide = null;

        this.message = '';

      }

    );

  }


  // ============================================================
  // GET RIDE ID
  // ============================================================

  private getRideId(
    ride: any
  ): number | null {

    if (!ride) {
      return null;
    }

    return ride.id ?? ride.rideId ?? null;
  }


  // ============================================================
  // FORM
  // ============================================================

  bindData(): void {

    this.rideForm = this.fb.group({

      customerId: [
        3,
        Validators.required
      ],

      pickupLocation: [
        '',
        Validators.required
      ],

      dropLocation: [
        '',
        Validators.required
      ],

      pickupLatitude: [
        '',
        Validators.required
      ],

      pickupLongitude: [
        '',
        Validators.required
      ],

      dropLatitude: [
        '',
        Validators.required
      ],

      dropLongitude: [
        '',
        Validators.required
      ]

    });

  }


  // ============================================================
  // CREATE RIDE
  // ============================================================

  createRide(): void {

    if (this.rideForm.invalid) {

      this.rideForm.markAllAsTouched();

      return;
    }


    const formValue =
      this.rideForm.value;


    const ride: Ride = {

      customerId:
        Number(formValue.customerId),

      driverId:
        null,

      pickupLocation:
        formValue.pickupLocation,

      dropLocation:
        formValue.dropLocation,

      pickupLatitude:
        Number(formValue.pickupLatitude),

      pickupLongitude:
        Number(formValue.pickupLongitude),

      dropLatitude:
        Number(formValue.dropLatitude),

      dropLongitude:
        Number(formValue.dropLongitude),

      rideStatus:
        'PENDING'
    };


    /*
     * Save original request for Try Again.
     */
    this.lastRideRequest = {
      ...ride
    };


    this.rideExpired = false;

    this.expiredMessage = '';


    console.log(
      'Sending ride:',
      ride
    );


    this.rideService
      .createRide(ride)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Ride created:',
            response
          );


          /*
           * Store current ride.
           */
          this.currentRide =
            response.data;


          /*
           * IMPORTANT
           *
           * Store the ID of the ride created
           * by THIS customer.
           */
          this.activeRideId =
            this.getRideId(response.data);


          console.log(
            'Customer active ride ID:',
            this.activeRideId
          );


          this.message =
            'Ride created successfully. Waiting for a driver...';


          alert(
            response.message
          );


          this.rideForm.reset({

            customerId: 1

          });

        },


        error: (error: any) => {

          console.error(
            error
          );

          alert(
            error.error?.message ||
            'Failed to create ride'
          );

        }

      });

  }


  // ============================================================
  // TRY AGAIN
  // ============================================================

  tryAgain(): void {

    if (!this.lastRideRequest) {

      this.message =
        'Previous ride details are not available.';

      return;
    }


    this.rideExpired = false;

    this.expiredMessage = '';

    this.message =
      'Trying to find a driver again...';


    const ride: Ride = {

      ...this.lastRideRequest,

      driverId: null,

      rideStatus: 'PENDING'
    };


    this.rideService
      .createRide(ride)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Ride created again:',
            response
          );


          /*
           * Store new ride.
           */
          this.currentRide =
            response.data;


          /*
           * IMPORTANT
           *
           * Replace old ride ID with the
           * newly created ride ID.
           */
          this.activeRideId =
            this.getRideId(response.data);


          console.log(
            'New active ride ID:',
            this.activeRideId
          );


          /*
           * Save request for another Try Again.
           */
          this.lastRideRequest = {
            ...ride
          };


          this.message =
            'New ride request created. Waiting for a driver.';

        },


        error: (error: any) => {

          console.error(
            'Try again error:',
            error
          );

          this.message =
            error.error?.message ||
            'Failed to create ride again.';

        }

      });

  }


}
