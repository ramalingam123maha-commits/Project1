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

    public static double modulo(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Error: Modulo by zero is not allowed.");
        }
        return a % b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=============================");
        System.out.println("      Java Calculator        ");
        System.out.println("=============================");

        while (true) {
            System.out.println("\nOperations:");
            System.out.println("  1. Addition       (+)");
            System.out.println("  2. Subtraction    (-)");
            System.out.println("  3. Multiplication (*)");
            System.out.println("  4. Division       (/)");
            System.out.println("  5. Modulo         (%)");
            System.out.println("  6. Exit");
            System.out.print("\nEnter choice (1-6): ");

            int choice;
            try {
                choice = Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number between 1 and 6.");
                continue;
            }

            if (choice == 6) {
                System.out.println("Goodbye!");
                break;
            }

            if (choice < 1 || choice > 5) {
                System.out.println("Invalid choice. Please select a number between 1 and 6.");
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
                        result = modulo(num1, num2);
                        operation = "%";
                        break;
                    default:
                        continue;
                }

                // Format: remove trailing .0 for whole numbers
                String num1Str = (num1 == Math.floor(num1)) ? String.valueOf((long) num1) : String.valueOf(num1);
                String num2Str = (num2 == Math.floor(num2)) ? String.valueOf((long) num2) : String.valueOf(num2);
                String resultStr = (result == Math.floor(result)) ? String.valueOf((long) result) : String.valueOf(result);

                System.out.println("-----------------------------");
                System.out.println("  " + num1Str + " " + operation + " " + num2Str + " = " + resultStr);
                System.out.println("-----------------------------");

            } catch (ArithmeticException e) {
                System.out.println(e.getMessage());
            }
        }

        scanner.close();
    }
}
