def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b

def calculator():
    print("=== Python Calculator ===")
    print("Operations: +, -, *, /")
    print("Type 'quit' to exit\n")

    while True:
        user_input = input("Enter expression (e.g. 5 + 3): ").strip()

        if user_input.lower() == 'quit':
            print("Goodbye!")
            break

        for op in ['+', '-', '*', '/']:
            if op in user_input:
                parts = user_input.split(op, 1)
                if len(parts) == 2:
                    try:
                        a = float(parts[0].strip())
                        b = float(parts[1].strip())
                    except ValueError:
                        print("Invalid numbers. Please try again.\n")
                        break

                    try:
                        if op == '+':
                            result = add(a, b)
                        elif op == '-':
                            result = subtract(a, b)
                        elif op == '*':
                            result = multiply(a, b)
                        elif op == '/':
                            result = divide(a, b)

                        # Display as int if result is a whole number
                        if result == int(result):
                            print(f"Result: {int(result)}\n")
                        else:
                            print(f"Result: {result}\n")
                    except ValueError as e:
                        print(f"Error: {e}\n")
                    break
        else:
            print("Invalid expression. Use one of +, -, *, /\n")

if __name__ == "__main__":
    calculator()
