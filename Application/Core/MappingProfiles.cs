using Application.DTOs.Attraction;
using AutoMapper;
using Domain.Entities;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Attraction, Attraction>();
        Guid? currentUserId = null;
        CreateMap<Attraction, AttractionDto>()
            .ForMember(d => d.Country, o => o.MapFrom(s => s.Country.Name))
            .ForMember(d => d.AttractionType, o => o.MapFrom(s => s.AttractionType.Name))
            .ForMember(d => d.Reaction,
                o => o.MapFrom(s =>
                    s.Reactions.Where(r => r.UserId == currentUserId).Select(r => r.Type).FirstOrDefault()));
        CreateMap<AttractionAddOrEditDto, Attraction>()
            .ForMember(d => d.Photos, o => o.Ignore());
        CreateMap<AttractionDto, Attraction>();
        CreateMap<AttractionType, AttractionType>();
    }
}
