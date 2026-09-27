# User stories — Smart Campus study room booking

### US-01
**Story:** As a Student, I want to view which study rooms are free and when, so that I can find a suitable room and time slot without wasting time.
**Priority:** High
**Assumption:** The availability view relies strictly on current booking data without managing physical attendance.

### US-02
**Story:** As a Student, I want to reserve a free room for a specific future time slot, so that I have a guaranteed space to study.
**Priority:** High
**Assumption:** A booking ending exactly when another begins is allowed (no overlap under R3), and a booking of exactly two hours is allowed under R2.

### US-03
**Story:** As a Student, I want to cancel a booking I previously made, so that I can release the room for others when my plans change.
**Priority:** High
**Assumption:** A student can only cancel bookings they themselves created.

### US-04
**Story:** As an Administrator, I want to take a room out of service and later restore it, so that I can manage room availability effectively.
**Priority:** High
**Assumption:** Blocking a room applies to future availability and does not process financial penalties.

### US-05
**Story:** As an Administrator, I want to review how rooms are being used over a selected period, so that I can understand demand patterns.
**Priority:** Medium
**Assumption:** Usage statistics are derived entirely from booking records without tracking student check-ins.

### US-06
**Story:** As a Student, I want to receive a confirmation message when I book or cancel a room, so that I have proof of my reservation status.
**Priority:** Medium
**Assumption:** The system confirms the action internally without integrating with external SMS gateways. 7 or 8 stories. -->
