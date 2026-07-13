public class ReverseString {
    public static void main(String[] args) {
        String word = "Digital Design";
        String reversed = new StringBuilder(word).reverse().toString();
        System.out.println("Original : " + word);
        System.out.println("Reversed : " + reversed);
    }
}
