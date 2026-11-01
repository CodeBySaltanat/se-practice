import copy
import unittest

from booking import can_book

# Base data from the brief: now = 540 (09:00), not blocked, one booking 10:00-11:00.
NOW = 540
BASE = [(600, 660)]


def check(start, end, now=NOW, blocked=False, existing=None):
    if existing is None:
        existing = list(BASE)
    return can_book(start, end, now, blocked, existing)


class TestBriefCases(unittest.TestCase):
    # T1-T6: the six cases from the brief
    def test_t1_touching_end_is_available(self):  # AC4
        self.assertIs(check(660, 720), True)

    def test_t2_overlap_is_unavailable(self):  # AC4
        self.assertIs(check(630, 690), False)

    def test_t3_blocked_room_is_unavailable(self):  # AC3
        self.assertIs(check(660, 720, blocked=True), False)

    def test_t4_exactly_120_minutes_is_available(self):  # AC2
        self.assertIs(check(720, 840), True)

    def test_t5_121_minutes_is_unavailable(self):  # AC2
        self.assertIs(check(720, 841), False)

    def test_t6_start_equal_to_now_is_unavailable(self):  # AC1
        self.assertIs(check(540, 570), False)


class TestFurtherKinds(unittest.TestCase):
    # reversed times
    def test_t7_reversed_times_are_unavailable(self):  # AC1
        self.assertIs(check(720, 660), False)

    def test_zero_length_is_unavailable(self):  # AC1
        self.assertIs(check(700, 700), False)

    # day bounds
    def test_t8_ending_at_midnight_is_available(self):  # AC1: end <= 1440
        self.assertIs(check(1380, 1440), True)

    def test_t9_ending_after_midnight_is_unavailable(self):  # AC1
        self.assertIs(check(1380, 1441), False)

    def test_start_one_minute_after_now_is_available(self):  # AC1
        self.assertIs(check(541, 600), True)

    # multiple bookings
    def test_t10_conflict_with_second_booking(self):  # AC4
        self.assertIs(check(720, 780, existing=[(600, 660), (700, 760)]), False)

    def test_exact_gap_between_two_bookings_is_available(self):  # AC4
        self.assertIs(check(660, 700, existing=[(600, 660), (700, 760)]), True)

    def test_new_booking_containing_existing_is_unavailable(self):  # AC4
        self.assertIs(check(590, 670), False)

    def test_touching_start_of_booking_is_available(self):  # AC4 (now 500 so AC1 does not decide)
        self.assertIs(check(560, 600, now=500), True)

    # unchanged inputs
    def test_t11_same_check_twice_and_list_unchanged(self):  # AC5
        existing = [(600, 660)]
        before = copy.deepcopy(existing)
        self.assertIs(can_book(660, 720, NOW, False, existing), True)
        self.assertIs(can_book(660, 720, NOW, False, existing), True)
        self.assertEqual(existing, before)

    def test_list_unchanged_after_rejection(self):  # AC5
        existing = [(700, 760), (600, 660)]
        before = copy.deepcopy(existing)
        self.assertIs(can_book(630, 690, NOW, False, existing), False)
        self.assertEqual(existing, before)


if __name__ == "__main__":
    unittest.main()
