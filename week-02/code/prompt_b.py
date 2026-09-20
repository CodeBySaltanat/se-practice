def analyze_marks(marks, pass_mark=50):
    """Analyze a list of marks and return summary statistics.

    Args:
        marks: A non-empty list of numeric marks, each between 0 and 100 inclusive.
        pass_mark: Minimum mark counted as a pass (default 50).

    Returns:
        dict with keys 'average', 'highest', 'lowest', 'pass_rate'
        (pass_rate is a percentage from 0 to 100).

    Raises:
        ValueError: If marks is empty, contains non-numeric values,
                    or contains values outside 0-100.
    """
    if not marks:
        raise ValueError("marks must not be empty")

    for m in marks:
        # bool is a subclass of int, so reject it explicitly
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric mark: {m!r}")
        if m != m:  # NaN check
            raise ValueError("marks must not contain NaN")
        if not 0 <= m <= 100:
            raise ValueError(f"mark out of range (0-100): {m}")

    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": passed / len(marks) * 100,
    }