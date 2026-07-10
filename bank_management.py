class BankAccount:
    def __init__(self, account_holder, initial_balance=0.0):
        self.account_holder = account_holder
        self.balance = initial_balance
        self.transaction_history = []

    def deposit(self, amount):
        if amount <= 0:
            print("Error: Deposit amount must be greater than zero.")
            return False
        self.balance += amount
        self.transaction_history.append(f"Deposited: ${amount:.2f}")
        print(f"Successfully deposited ${amount:.2f}. New balance: ${self.balance:.2f}")
        return True

    def get_balance(self):
        print(f"Account Holder : {self.account_holder}")
        print(f"Current Balance: ${self.balance:.2f}")

    def show_transaction_history(self):
        print(f"\n--- Transaction History for {self.account_holder} ---")
        if not self.transaction_history:
            print("No transactions found.")
        else:
            for i, record in enumerate(self.transaction_history, 1):
                print(f"  {i}. {record}")
        print("--------------------------------------------------")


def main():
    print("==========================================")
    print("      Simple Bank Management System      ")
    print("==========================================")

    name = input("Enter account holder name: ").strip()
    if not name:
        name = "Customer"

    try:
        initial = float(input("Enter initial balance (0 if none): $"))
    except ValueError:
        initial = 0.0

    account = BankAccount(name, initial)
    print(f"\nAccount created for '{account.account_holder}' with balance ${account.balance:.2f}.\n")

    while True:
        print("\n-------- MENU --------")
        print("  1. Deposit")
        print("  2. View Balance")
        print("  3. Transaction History")
        print("  4. Exit")
        print("----------------------")

        choice = input("Select an option (1-4): ").strip()

        if choice == "1":
            try:
                amount = float(input("Enter deposit amount: $"))
                account.deposit(amount)
            except ValueError:
                print("Error: Please enter a valid numeric amount.")

        elif choice == "2":
            account.get_balance()

        elif choice == "3":
            account.show_transaction_history()

        elif choice == "4":
            print("\nThank you for using the Bank Management System. Goodbye!")
            break

        else:
            print("Invalid option. Please choose between 1 and 4.")


if __name__ == "__main__":
    main()
