"""
Student Marks Analyzer
----------------------
Analyzes student marks per student and per subject.

Usage:
    python analyze_marks.py                # runs on built-in sample data
    python analyze_marks.py marks.csv      # runs on your own CSV file

CSV format (first row is a header; first column is the student name,
remaining columns are subjects):
    Name,Math,Physics,English
    Alice,88,92,79
    Bob,65,58,72
"""

import csv
import statistics
import sys

PASS_MARK = 50

SAMPLE_DATA = {
    "Alice":  {"Math": 88, "Physics": 92, "English": 79, "History": 85},
    "Bob":    {"Math": 65, "Physics": 58, "English": 72, "History": 61},
    "Charlie": {"Math": 45, "Physics": 52, "English": 68, "History": 49},
    "Diana":  {"Math": 95, "Physics": 98, "English": 91, "History": 94},
    "Ethan":  {"Math": 72, "Physics": 66, "English": 80, "History": 75},
    "Fiona":  {"Math": 38, "Physics": 41, "English": 55, "History": 47},
    "George": {"Math": 81, "Physics": 77, "English": 69, "History": 83},
    "Hana":   {"Math": 59, "Physics": 63, "English": 74, "History": 70},
}


def load_csv(path):
    """Load marks from a CSV file into {student: {subject: mark}}."""
    data = {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        subjects = header[1:]
        for row in reader:
            if not row or not row[0].strip():
                continue
            name = row[0].strip()
            data[name] = {}
            for subject, value in zip(subjects, row[1:]):
                try:
                    data[name][subject] = float(value)
                except ValueError:
                    pass  # skip blank / invalid marks
    return data


def grade(mark):
    """Convert a numeric mark to a letter grade."""
    if mark >= 90:
        return "A"
    if mark >= 80:
        return "B"
    if mark >= 70:
        return "C"
    if mark >= 60:
        return "D"
    if mark >= PASS_MARK:
        return "E"
    return "F"


def student_summary(data):
    """Return a list of (name, average, total, grade) sorted by average."""
    rows = []
    for name, marks in data.items():
        if not marks:
            continue
        values = list(marks.values())
        avg = statistics.mean(values)
        rows.append((name, avg, sum(values), grade(avg)))
    return sorted(rows, key=lambda r: r[1], reverse=True)


def subject_summary(data):
    """Return {subject: stats dict} across all students."""
    subjects = {}
    for marks in data.values():
        for subject, mark in marks.items():
            subjects.setdefault(subject, []).append(mark)

    summary = {}
    for subject, values in subjects.items():
        summary[subject] = {
            "mean": statistics.mean(values),
            "median": statistics.median(values),
            "stdev": statistics.stdev(values) if len(values) > 1 else 0.0,
            "min": min(values),
            "max": max(values),
            "pass_rate": 100 * sum(v >= PASS_MARK for v in values) / len(values),
        }
    return summary


def grade_distribution(rows):
    """Count students per letter grade (based on overall average)."""
    dist = {g: 0 for g in "ABCDEF"}
    for _, _, _, g in rows:
        dist[g] += 1
    return dist


def find_at_risk(data):
    """Students who failed at least one subject."""
    return {
        name: [s for s, m in marks.items() if m < PASS_MARK]
        for name, marks in data.items()
        if any(m < PASS_MARK for m in marks.values())
    }


def print_report(data):
    rows = student_summary(data)
    subjects = subject_summary(data)

    print("=" * 62)
    print("STUDENT RANKING")
    print("=" * 62)
    print(f"{'Rank':<6}{'Name':<12}{'Average':>10}{'Total':>10}{'Grade':>8}")
    print("-" * 62)
    for rank, (name, avg, total, g) in enumerate(rows, start=1):
        print(f"{rank:<6}{name:<12}{avg:>10.1f}{total:>10.0f}{g:>8}")

    print("\n" + "=" * 62)
    print("SUBJECT STATISTICS")
    print("=" * 62)
    print(f"{'Subject':<12}{'Mean':>8}{'Median':>9}{'StDev':>8}"
          f"{'Min':>6}{'Max':>6}{'Pass%':>8}")
    print("-" * 62)
    for subject, s in subjects.items():
        print(f"{subject:<12}{s['mean']:>8.1f}{s['median']:>9.1f}{s['stdev']:>8.1f}"
              f"{s['min']:>6.0f}{s['max']:>6.0f}{s['pass_rate']:>8.0f}")

    hardest = min(subjects, key=lambda k: subjects[k]["mean"])
    easiest = max(subjects, key=lambda k: subjects[k]["mean"])
    print(f"\nHighest-scoring subject: {easiest} ({subjects[easiest]['mean']:.1f})")
    print(f"Lowest-scoring subject:  {hardest} ({subjects[hardest]['mean']:.1f})")

    print("\n" + "=" * 62)
    print("GRADE DISTRIBUTION (by overall average)")
    print("=" * 62)
    for g, count in grade_distribution(rows).items():
        print(f"{g}: {'#' * count} ({count})")

    all_averages = [r[1] for r in rows]
    print("\n" + "=" * 62)
    print("CLASS OVERVIEW")
    print("=" * 62)
    print(f"Students:        {len(rows)}")
    print(f"Class average:   {statistics.mean(all_averages):.1f}")
    print(f"Class median:    {statistics.median(all_averages):.1f}")
    print(f"Top student:     {rows[0][0]} ({rows[0][1]:.1f})")
    print(f"Lowest student:  {rows[-1][0]} ({rows[-1][1]:.1f})")

    at_risk = find_at_risk(data)
    print("\n" + "=" * 62)
    print(f"AT-RISK STUDENTS (failed a subject, pass mark = {PASS_MARK})")
    print("=" * 62)
    if at_risk:
        for name, failed in at_risk.items():
            print(f"{name}: {', '.join(failed)}")
    else:
        print("None")


def main():
    if len(sys.argv) > 1:
        data = load_csv(sys.argv[1])
    else:
        print("(No CSV given - using built-in sample data)\n")
        data = SAMPLE_DATA

    if not data:
        print("No data found.")
        return
    print_report(data)


if __name__ == "__main__":
    main()