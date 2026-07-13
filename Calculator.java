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
            throw new ArithmeticException("Error: Division by zero is not allowed.");
        }
        return a / b;
    }

    public static double modulus(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Error: Modulus by zero is not allowed.");
        }
        return a % b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=============================");
        System.out.println("      Java Calculator        ");
        System.out.println("=============================");

        while (true) {
            System.out.println("\nSelect an operation:");
            System.out.println("  1. Addition       (+)");
            System.out.println("  2. Subtraction    (-)");
            System.out.println("  3. Multiplication (*)");
            System.out.println("  4. Division       (/)");
            System.out.println("  5. Modulus        (%)");
            System.out.println("  6. Exit");
            System.out.print("Enter choice (1-6): ");

            int choice;
            try {
                choice = Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number between 1 and 6.");
                continue;
            }

            if (choice == 6) {
                System.out.println("Exiting calculator. Goodbye!");
                break;
            }

            if (choice < 1 || choice > 5) {
                System.out.println("Invalid choice. Please select between 1 and 6.");
                continue;
            }

            double num1, num2;
            try {
                System.out.print("Enter first number:  ");
                num1 = Double.parseDouble(scanner.nextLine().trim());

                System.out.print("Enter second number: ");
                num2 = Double.parseDouble(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Invalid number. Please enter a valid numeric value.");
                continue;
            }

            try {
                double result;
                String operation;

                switch (choice) {
                    case 1:
                        result = add(num1, num2);
                        operation = "+";
                        break;
                    case 2:
                        result = subtract(num1, num2);
                        operation = "-";
                        break;
                    case 3:
                        result = multiply(num1, num2);
                        operation = "*";
                        break;
                    case 4:
                        result = divide(num1, num2);
                        operation = "/";
                        break;
                    case 5:
                        result = modulus(num1, num2);
                        operation = "%";
                        break;
                    default:
                        continue;
                }

                System.out.printf("%nResult: %.2f %s %.2f = %.2f%n", num1, operation, num2, result);

            } catch (ArithmeticException e) {
                System.out.println(e.getMessage());
            }
        }

        scanner.close();
    }
}
