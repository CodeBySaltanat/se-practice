# Acceptance criteria — three selected stories

## Assumptions
- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because touching bookings do not share time.
- **Duration:** a booking of exactly two hours is allowed under R2, because "at most" implies inclusive boundaries.

---

## US-02 — Book a Room

### AC-01
- **Given** a room is free and the requested time slot starts in the future and lasts exactly two hours
- **When** the student submits the booking
- **Then** the system creates the reservation and marks the room as booked

### AC-02
- **Given** the student selects a start time in the past
- **When** they submit the booking
- **Then** the system rejects the request and indicates bookings must start in the future

### AC-03
- **Given** the requested time slot ends exactly when an existing booking begins
- **When** the student submits the booking
- **Then** the system accepts the request as they do not overlap

### AC-04
- **Given** the selected room is currently blocked
- **When** the student submits the booking
- **Then** the system rejects the request per R4

---

## US-03 — Cancel a Booking

### AC-05
- **Given** a student has an active future booking they created
- **When** they request to cancel it
- **Then** the system releases the room and marks the time slot as free

### AC-06
- **Given** a student attempts to cancel a booking belonging to someone else
- **When** they submit the cancellation request
- **Then** the system rejects the action

### AC-07
- **Given** a booking has already passed its start time
- **When** they submit the cancellation request
- **Then** the system rejects the action

---

## US-04 — Block or Unblock a Room

### AC-08
- **Given** a room is currently available
- **When** an administrator blocks it
- **Then** the room status changes to blocked and accepts no new bookings

### AC-09
- **Given** a room is currently blocked
- **When** an administrator unblocks it
- **Then** the room status changes to available

### AC-10
- **Given** a room is blocked
- **When** a student attempts to book it
- **Then** the system rejects the request