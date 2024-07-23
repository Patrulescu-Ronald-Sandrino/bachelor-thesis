using Application.DTOs.Attraction;
using AutoMapper;
using Domain.Entities;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Attraction, Attraction>();
        CreateMap<Attraction, AttractionDto>()
            .ForMember(d => d.Country, o => o.MapFrom(s => s.Country.Name))
            .ForMember(d => d.AttractionType, o => o.MapFrom(s => s.AttractionType.Name));
        CreateMap<AttractionAddOrEditDto, Attraction>()
            .ForMember(d => d.Photos, o => o.Ignore());
        CreateMap<AttractionDto, Attraction>();
        CreateMap<AttractionType, AttractionType>();
    }
}
