public class ReverseString {
    public static void main(String[] args) {
        String input = "Data Structure";
        String reversed = new StringBuilder(input).reverse().toString();

        System.out.println("Original : " + input);
        System.out.println("Reversed : " + reversed);
    }
}
