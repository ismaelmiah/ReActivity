using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(d => d.Username, opt => opt.MapFrom( src => src.AppUser.UserName))
                .ForMember(d => d.DisplayName, opt => opt.MapFrom( src => src.AppUser.DisplayName));
        }
    }
}