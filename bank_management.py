# Simple Bank Management System - Check Balance

accounts = {
    "101": {"name": "Alice Johnson", "balance": 5420.75},
    "102": {"name": "Bob Smith",     "balance": 12300.00},
    "103": {"name": "Carol White",   "balance": 890.50},
}

def check_balance(account_number):
    account = accounts.get(account_number)
    if account:
        print(f"\n  Account Number : {account_number}")
        print(f"  Account Holder : {account['name']}")
        print(f"  Balance        : ${account['balance']:,.2f}")
    else:
        print("\n  [!] Account not found. Please check the account number.")

def main():
    print("=" * 40)
    print("     SIMPLE BANK MANAGEMENT SYSTEM")
    print("=" * 40)

    while True:
        print("\n  MENU")
        print("  1. Check Balance")
        print("  2. Exit")
        print("-" * 40)

        choice = input("  Enter your choice (1/2): ").strip()

        if choice == "1":
            account_number = input("  Enter Account Number: ").strip()
            check_balance(account_number)

        elif choice == "2":
            print("\n  Thank you for using our banking system. Goodbye!")
            break

        else:
            print("\n  [!] Invalid choice. Please enter 1 or 2.")

if __name__ == "__main__":
    main()
