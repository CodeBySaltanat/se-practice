def process_marks(marks_string):
    items = marks_string.split(',')
    valid_marks = []
    
    for item in items:
        item = item.strip()
        try:
            mark = float(item)
            if 0 <= mark <= 100:
                valid_marks.append(mark)
        except ValueError:
            continue

    if len(valid_marks) == 0:
        print("Clear message: No valid marks provided, cannot calculate statistics.")
        return

    avg = sum(valid_marks) / len(valid_marks)
    highest = max(valid_marks)
    lowest = min(valid_marks)
    passes = sum(1 for m in valid_marks if m >= 50)
    pass_rate = (passes / len(valid_marks)) * 100

    print(f"Valid marks: {len(valid_marks)}")
    print(f"Average: {avg:.2f}")
    # Выводим как целое число, если нет дробной части, иначе оставляем как есть
    print(f"Highest: {int(highest) if highest.is_integer() else highest}")
    print(f"Lowest: {int(lowest) if lowest.is_integer() else lowest}")
    print(f"Pass rate: {pass_rate:.1f}%")

print("--- Case A ---")
process_marks("85, 23, 45, 90, 92")

print("\n--- Case B ---")
process_marks("88, 47, -5, 101, abc, 73, 50, , 100")

print("\n--- Case C ---")
process_marks("10, 20, 30")

print("\n--- Case D ---")
process_marks("abc, , xyz")