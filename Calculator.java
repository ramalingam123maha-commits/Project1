import java.util.Scanner;

public class Calculator {

    public static double add(double a, double b) {
        return a + b;
    }

    public static double subtract(double a, double b) {
        return a - b;
    }

    public static double multiply(double a, double b) {
        return a * b;
    }

    public static double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero.");
        }
        return a / b;
    }

    public static double modulo(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot modulo by zero.");
        }
        return a % b;
    }

    public static double power(double base, double exponent) {
        return Math.pow(base, exponent);
    }

    public static double squareRoot(double a) {
        if (a < 0) {
            throw new ArithmeticException("Cannot take square root of a negative number.");
        }
        return Math.sqrt(a);
    }

    private static void printMenu() {
        System.out.println("\n===== Java Calculator =====");
        System.out.println("  1. Addition       (+)");
        System.out.println("  2. Subtraction    (-)");
        System.out.println("  3. Multiplication (*)");
        System.out.println("  4. Division       (/)");
        System.out.println("  5. Modulo         (%)");
        System.out.println("  6. Power          (^)");
        System.out.println("  7. Square Root    (sqrt)");
        System.out.println("  0. Exit");
        System.out.println("===========================");
        System.out.print("Choose an option: ");
    }

    private static String formatResult(double result) {
        // Print as integer if the result has no fractional part
        if (result == Math.floor(result) && !Double.isInfinite(result)) {
            return String.valueOf((long) result);
        }
        return String.valueOf(result);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice;

        System.out.println("Welcome to the Java Calculator!");

        do {
            printMenu();

            while (!scanner.hasNextInt()) {
                System.out.print("Invalid input. Enter a number (0-7): ");
                scanner.next();
            }
            choice = scanner.nextInt();

            if (choice == 0) {
                System.out.println("Goodbye!");
                break;
            }

            if (choice < 1 || choice > 7) {
                System.out.println("Invalid option. Please choose between 0 and 7.");
                continue;
            }

            try {
                double a, b, result;

                if (choice == 7) {
                    // Square root only needs one operand
                    System.out.print("Enter number: ");
                    while (!scanner.hasNextDouble()) {
                        System.out.print("Invalid input. Enter a number: ");
                        scanner.next();
                    }
                    a = scanner.nextDouble();
                    result = squareRoot(a);
                    System.out.println("sqrt(" + formatResult(a) + ") = " + formatResult(result));
                } else {
                    System.out.print("Enter first number:  ");
                    while (!scanner.hasNextDouble()) {
                        System.out.print("Invalid input. Enter a number: ");
                        scanner.next();
                    }
                    a = scanner.nextDouble();

                    System.out.print("Enter second number: ");
                    while (!scanner.hasNextDouble()) {
                        System.out.print("Invalid input. Enter a number: ");
                        scanner.next();
                    }
                    b = scanner.nextDouble();

                    String operator;
                    switch (choice) {
                        case 1: result = add(a, b);      operator = "+"; break;
                        case 2: result = subtract(a, b); operator = "-"; break;
                        case 3: result = multiply(a, b); operator = "*"; break;
                        case 4: result = divide(a, b);   operator = "/"; break;
                        case 5: result = modulo(a, b);   operator = "%"; break;
                        case 6: result = power(a, b);    operator = "^"; break;
                        default: continue;
                    }

                    System.out.println(formatResult(a) + " " + operator + " " + formatResult(b)
                            + " = " + formatResult(result));
                }

            } catch (ArithmeticException e) {
                System.out.println("Math error: " + e.getMessage());
            }

        } while (true);

        scanner.close();
    }
}
