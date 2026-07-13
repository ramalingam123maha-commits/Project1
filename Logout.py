import time


# Simulated session store
_active_sessions = {}


def login(username, password):
    """Simulate a user login and return a session token."""
    # Dummy credentials for demonstration
    valid_users = {
        "admin": "admin123",
        "user1": "pass1",
    }

    if valid_users.get(username) == password:
        token = f"TOKEN-{username.upper()}-{int(time.time())}"
        _active_sessions[token] = username
        print(f"\nLogin successful! Welcome, {username}.")
        print(f"Session token: {token}")
        return token
    else:
        print("\nError: Invalid username or password.")
        return None


def logout(token):
    """Log out a user by invalidating their session token."""
    print("\n==========================================")
    print("               Logout Page               ")
    print("==========================================")

    if not token:
        print("Error: No active session token provided.")
        return False

    if token in _active_sessions:
        username = _active_sessions.pop(token)
        print(f"Logging out user: {username}")
        print("Session invalidated successfully.")
        print(f"\nGoodbye, {username}! You have been securely logged out.")
        print("==========================================\n")
        return True
    else:
        print("Error: Session not found or already logged out.")
        print("==========================================\n")
        return False


def is_logged_in(token):
    """Check whether a session token is still active."""
    return token in _active_sessions


def main():
    print("==========================================")
    print("         User Session Management         ")
    print("==========================================")

    while True:
        print("\n-------- MENU --------")
        print("  1. Login")
        print("  2. Logout")
        print("  3. Check Session Status")
        print("  4. Exit")
        print("----------------------")

        choice = input("Select an option (1-4): ").strip()

        if choice == "1":
            username = input("Enter username: ").strip()
            password = input("Enter password: ").strip()
            token = login(username, password)
            if token:
                # Store the most recent token for subsequent menu actions
                current_token = token

        elif choice == "2":
            token_input = input("Enter your session token to logout: ").strip()
            logout(token_input)

        elif choice == "3":
            token_input = input("Enter your session token to check: ").strip()
            if is_logged_in(token_input):
                user = _active_sessions[token_input]
                print(f"\nStatus: ACTIVE  —  Logged in as '{user}'.")
            else:
                print("\nStatus: INACTIVE  —  No active session found.")

        elif choice == "4":
            print("\nExiting. Goodbye!")
            break

        else:
            print("Invalid option. Please choose between 1 and 4.")


if __name__ == "__main__":
    main()
