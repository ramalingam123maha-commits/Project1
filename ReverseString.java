public class ReverseString {
    public static void main(String[] args) {
        String word = "Web application";
        String reversed = new StringBuilder(word).reverse().toString();
        System.out.println("Original : " + word);
        System.out.println("Reversed : " + reversed);
    }
}
