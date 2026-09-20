def analyze_marks(marks, pass_mark=50):
    """Return average, highest, lowest and pass_rate (%) for a list of marks."""

    def _is_number(x):
        return isinstance(x, (int, float)) and not isinstance(x, bool)

    if not _is_number(pass_mark) or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be a number between 0 and 100")

    try:
        values = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable of numbers")

    if not values:
        raise ValueError("marks must not be empty")

    for m in values:
        if not _is_number(m):
            raise ValueError(f"non-numeric mark: {m!r}")
        if not 0 <= m <= 100:  # also rejects NaN
            raise ValueError(f"mark out of range 0-100: {m!r}")

    passed = sum(1 for m in values if m >= pass_mark)
    return {
        "average": round(sum(values) / len(values), 2),
        "highest": max(values),
        "lowest": min(values),
        "pass_rate": round(passed / len(values) * 100, 2),
    }


# ---------------------------- Tests ----------------------------
import unittest


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75.0, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )

    def test_decimals(self):
        r = analyze_marks([49.5, 50.5, 72.25])
        self.assertEqual(r["average"], 57.42)
        self.assertEqual(r["highest"], 72.25)
        self.assertEqual(r["lowest"], 49.5)
        self.assertEqual(r["pass_rate"], 66.67)

    def test_custom_pass_mark(self):
        r = analyze_marks([40, 60, 80], pass_mark=70)
        self.assertEqual(r["pass_rate"], 33.33)
        self.assertEqual(analyze_marks([50, 60], pass_mark=50)["pass_rate"], 100.0)

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc", 70])
        with self.assertRaises(ValueError):
            analyze_marks([50, "60"])  # numeric-looking strings are rejected too

    def test_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([-1, 50])

    def test_above_hundred(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 100.1])

    def test_boundaries_accepted(self):
        r = analyze_marks([0, 100])
        self.assertEqual((r["lowest"], r["highest"]), (0, 100))


if __name__ == "__main__":
    unittest.main()