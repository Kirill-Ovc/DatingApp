﻿using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
    {
        _context = context;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExist(registerDto.Username)) return BadRequest("UserName is taken");

        var user = _mapper.Map<AppUser>(registerDto);
        
        using var hmac = new HMACSHA512();
        user.UserName = registerDto.Username.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        user.PasswordSalt = hmac.Key;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender  
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _context.Users
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(u => u.UserName == loginDto.Username.ToLowerInvariant());

        if (user is null)
        {
            return Unauthorized("Invalid username");
        }

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) 
            {
                return Unauthorized("Invalid password");
            }
        }

        return new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    [HttpDelete("delete")]
    public async Task<ActionResult> DeleteUser([FromQuery, Required] string userName)
    {
        var user = await _context.Users
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(u => u.UserName == userName.ToLowerInvariant());

        if (user is null)
        {
            return BadRequest("Invalid username");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }


    private async Task<bool> UserExist(string username)
    {
        return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
    }
}