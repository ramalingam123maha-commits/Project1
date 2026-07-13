public class ReverseString {
    public static void main(String[] args) {
        String word = "Hello";
        String reversed = new StringBuilder(word).reverse().toString();
        System.out.println("Original word: " + word);
        System.out.println("Reversed word: " + reversed);
    }
}
