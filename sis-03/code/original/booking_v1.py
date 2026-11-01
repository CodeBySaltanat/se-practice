def can_book(start, end, now, blocked, existing):
    if blocked:                              # AC3
        return False
    if not (0 <= start < end <= 1440):       # AC1 range
        return False
    if not start > now:                      # AC1 future start
        return False
    if end - start > 120:                    # AC2
        return False
    for s, e in existing:                    # AC4, half-open overlap
        if start < e and s < end:
            return False
    return True
