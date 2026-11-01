namespace Store_App.Data.Repositories;

using Store_App.Core.Entities;

/// <summary>
/// User repository for data access operations
/// </summary>
public class UserRepository : IRepository<User>
{
    private readonly InMemoryDatabase _database;

    public UserRepository(InMemoryDatabase database)
    {
        _database = database;
    }

    public Task<User?> GetByIdAsync(int id)
    {
        var user = _database.Users.FirstOrDefault(u => u.Id == id);
        return Task.FromResult(user);
    }

    public Task<IEnumerable<User>> GetAllAsync()
    {
        var users = _database.Users.AsEnumerable();
        return Task.FromResult(users);
    }

    public Task<User> AddAsync(User entity)
    {
        entity.Id = _database.GetNextUserId();
        entity.CreatedAt = DateTime.UtcNow;
        _database.Users.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<User> UpdateAsync(User entity)
    {
        var existingUser = _database.Users.FirstOrDefault(u => u.Id == entity.Id);
        if (existingUser != null)
        {
            existingUser.Name = entity.Name;
            existingUser.Email = entity.Email;
            existingUser.PhoneNumber = entity.PhoneNumber;
        }
        return Task.FromResult(entity);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var user = _database.Users.FirstOrDefault(u => u.Id == id);
        if (user != null)
        {
            _database.Users.Remove(user);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<bool> ExistsAsync(int id)
    {
        return Task.FromResult(_database.Users.Any(u => u.Id == id));
    }

    /// <summary>
    /// Find user by email
    /// </summary>
    public Task<User?> FindByEmailAsync(string email)
    {
        var user = _database.Users.FirstOrDefault(u => u.Email == email);
        return Task.FromResult(user);
    }
}
