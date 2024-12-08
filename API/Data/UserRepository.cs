using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<MemberDto> GetMemberAsync(string username)
    {
        return await _context.Users.Where(u => u.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge-1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        var query = _context.Users.AsQueryable()
            .Where(x => x.UserName != userParams.CurrentUserName && 
                        (userParams.Gender == null || userParams.Gender == x.Gender) &&
                        x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        var orderedQuery = ApplyOrdering(query, userParams.OrderBy);

        var projectedQuery = orderedQuery.ProjectTo<MemberDto>(_mapper.ConfigurationProvider);

        return await PagedList<MemberDto>.CreateAsync(projectedQuery, userParams.PageNumber, userParams.PageSize);
    }

    private static IOrderedQueryable<AppUser> ApplyOrdering(IQueryable<AppUser> query, string orderBy)
    {
        return orderBy switch
        {
            "created" => query.OrderByDescending(u => u.Created),
            "lastActive" => query.OrderByDescending(u => u.LastActive),
            _ => query.OrderByDescending(u => u.LastActive)
        };        
    }    

    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Photos)
            .SingleOrDefaultAsync(u => u.Id == id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(u => u.Photos)
            .SingleOrDefaultAsync(u => u.UserName == username);
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await _context.Users
            .Include(u => u.Photos)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }
}
