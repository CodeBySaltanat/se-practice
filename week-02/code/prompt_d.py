import math
from numbers import Real


def _is_valid_number(value):
    """True for real numbers that are finite and not booleans."""
    return (
        isinstance(value, Real)
        and not isinstance(value, bool)
        and math.isfinite(value)
    )


def analyze_marks(marks, pass_mark=50):
    """
    Analyze an iterable of student marks.

    Returns a dict with keys 'average', 'highest', 'lowest', 'pass_rate'.
    Raises ValueError for any invalid input.
    """
    # 1. Validate pass_mark
    if not _is_valid_number(pass_mark) or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be a finite number between 0 and 100.")

    # 2. Validate that marks is a non-empty iterable
    try:
        marks_list = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable.") from None

    if not marks_list:
        raise ValueError("marks must not be empty.")

    # 2 & 3. Validate types and range
    for mark in marks_list:
        if not _is_valid_number(mark):
            raise ValueError(f"Invalid mark {mark!r}: must be a finite number (no bools, strings, NaN, or infinity).")
        if not 0 <= mark <= 100:
            raise ValueError(f"Mark {mark!r} is out of range; must be between 0 and 100.")

    # 4 & 5. Compute results
    total = len(marks_list)
    passed = sum(1 for m in marks_list if m >= pass_mark)

    return {
        "average": round(math.fsum(marks_list) / total, 2),
        "highest": max(marks_list),
        "lowest": min(marks_list),
        "pass_rate": round(passed / total * 100, 2),
    }


if __name__ == "__main__":
    print(analyze_marks([40, 60, 80], 50))
    # {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}