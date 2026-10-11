import copy
import unittest

from booking import can_book

# Base input from the handout: now=540, blocked=False, existing=[(600, 660)]
NOW = 540
BASE = [(600, 660)]


class TestCanBook(unittest.TestCase):

    # ---- the six cases from the handout ----
    def test_touching_end_is_allowed(self):  # AC4
        self.assertIs(can_book(660, 720, NOW, False, [(600, 660)]), True)

    def test_overlap_is_rejected(self):  # AC4
        self.assertIs(can_book(630, 690, NOW, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):  # AC3
        self.assertIs(can_book(660, 720, NOW, True, [(600, 660)]), False)

    def test_exactly_two_hours_is_allowed(self):  # AC2
        self.assertIs(can_book(720, 840, NOW, False, [(600, 660)]), True)

    def test_over_two_hours_is_rejected(self):  # AC2
        self.assertIs(can_book(720, 841, NOW, False, [(600, 660)]), False)

    def test_start_equal_to_now_is_rejected(self):  # AC1
        self.assertIs(can_book(540, 570, NOW, False, [(600, 660)]), False)

    # ---- zero-length and reversed times ----
    def test_zero_length_is_rejected(self):  # AC1: start < end
        self.assertIs(can_book(700, 700, NOW, False, []), False)

    def test_reversed_times_are_rejected(self):  # AC1: start < end
        self.assertIs(can_book(720, 700, NOW, False, []), False)

    # ---- day bounds ----
    def test_end_after_day_is_rejected(self):  # AC1: end <= 1440 (61 min, so AC2 is not the reason)
        self.assertIs(can_book(1380, 1441, NOW, False, []), False)

    def test_booking_ending_exactly_at_day_end_is_allowed(self):  # AC1
        self.assertIs(can_book(1380, 1440, NOW, False, []), True)

    def test_last_minute_slot_is_allowed(self):  # AC1
        self.assertIs(can_book(1439, 1440, NOW, False, []), True)

    def test_start_just_after_now_is_allowed(self):  # AC1: start > now
        self.assertIs(can_book(541, 600, NOW, False, []), True)

    # ---- empty list and several bookings ----
    def test_empty_existing_allows_valid_request(self):  # AC4, AC5
        self.assertIs(can_book(700, 760, NOW, False, []), True)

    def test_conflict_with_last_of_several_bookings(self):  # AC4
        existing = [(600, 660), (700, 760), (800, 860)]
        self.assertIs(can_book(820, 880, NOW, False, existing), False)

    def test_conflict_with_middle_of_several_bookings(self):  # AC4
        existing = [(600, 660), (700, 760), (800, 860)]
        self.assertIs(can_book(710, 750, NOW, False, existing), False)

    def test_exact_gap_between_several_bookings_is_allowed(self):  # AC4
        existing = [(540, 600), (660, 720)]
        self.assertIs(can_book(600, 660, 500, False, existing), True)

    # ---- the other overlap relationships ----
    def test_new_inside_existing_is_rejected(self):  # AC4
        self.assertIs(can_book(615, 645, NOW, False, [(600, 660)]), False)

    def test_new_contains_existing_is_rejected(self):  # AC4
        self.assertIs(can_book(570, 690, NOW, False, [(600, 660)]), False)

    def test_identical_interval_is_rejected(self):  # AC4
        self.assertIs(can_book(600, 660, NOW, False, [(600, 660)]), False)

    def test_touching_start_is_allowed(self):  # AC4 (now=500 so AC1 does not decide)
        self.assertIs(can_book(540, 600, 500, False, [(600, 660)]), True)

    def test_one_minute_overlap_at_start_is_rejected(self):  # AC4
        self.assertIs(can_book(599, 601, NOW, False, [(600, 660)]), False)

    def test_one_minute_overlap_at_end_is_rejected(self):  # AC4
        self.assertIs(can_book(659, 700, NOW, False, [(600, 660)]), False)

    # ---- unchanged input ----
    def test_existing_unchanged_after_true(self):  # AC5
        existing = [(700, 760), (600, 660)]
        before = copy.deepcopy(existing)
        self.assertIs(can_book(660, 700, NOW, False, existing), True)
        self.assertEqual(existing, before)

    def test_existing_unchanged_after_false(self):  # AC5
        existing = [(700, 760), (600, 660)]
        before = copy.deepcopy(existing)
        self.assertIs(can_book(630, 690, NOW, False, existing), False)
        self.assertEqual(existing, before)


if __name__ == "__main__":
    unittest.main()
