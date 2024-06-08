using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Attraction, Attraction>();
        CreateMap<Attraction, AttractionDto>()
            .ForMember(d => d.AttractionType, o => o.MapFrom(s => s.AttractionType.Name))
            .ForMember(d => d.Country, o => o.MapFrom(s => s.Country.Name));
        CreateMap<AttractionType, AttractionType>();
    }
}