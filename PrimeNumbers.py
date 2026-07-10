# Array program to print prime numbers from 1 to 100

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

# Store prime numbers in an array
primes = [num for num in range(1, 101) if is_prime(num)]

print("Prime numbers from 1 to 100:")
print(primes)
