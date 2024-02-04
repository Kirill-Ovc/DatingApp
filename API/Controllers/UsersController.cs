using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var members = await _userRepository.GetMembersAsync();
        return Ok(members);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MemberDto>> GetUser(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        var member = _mapper.Map<MemberDto>(user);
        return member;
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        return await _userRepository.GetMemberAsync(username);;
    }

    [AllowAnonymous]
    [HttpGet("server-error")]
    public async Task<ActionResult<string>> GetServerError()
    {
        var thing = await _userRepository.GetUserByIdAsync(-1);

        var result = thing.ToString();

        return result;
    }
}
