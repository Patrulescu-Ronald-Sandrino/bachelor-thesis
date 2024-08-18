using Application.DTOs;
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
        CreateMap<AttractionComment, CommentDto>()
            .ForMember(d => d.AuthorUsername, o => o.MapFrom(s => s.Author.UserName))
            .ForMember(d => d.AuthorPhoto, o => o.MapFrom(s => s.Author.Photo));

        CreateMap<AttractionsCollectionItem, AttractionsCollectionItemDto>()
            .ForMember(d => d.AttractionId, o => o.MapFrom(s => s.Attraction.Id))
            .ForMember(d => d.AttractionName, o => o.MapFrom(s => s.Attraction.Name))
            .ForMember(d => d.AttractionPhoto, o => o.MapFrom(s => s.Attraction.Photos.FirstOrDefault()))
            .ForMember(d => d.Note, o => o.MapFrom(s => s.Note ?? ""));
        CreateMap<AttractionsCollection, AttractionsCollectionDto>()
            .ForMember(d => d.Items, o => o.MapFrom(s => s.CollectionItems.OrderBy(ci => ci.Index)));


        CreateMap<AttractionsCollectionItemDto, AttractionsCollectionItem>()
            .ForMember(d => d.CollectionId, o => o.Ignore())
            .ForMember(d => d.Index, o => o.Ignore())
            .ForMember(d => d.Attraction, o => o.Ignore())
            .ForMember(d => d.Collection, o => o.Ignore());
        CreateMap<AttractionsCollectionDto, AttractionsCollection>()
            .ForMember(d => d.Index, o => o.Ignore())
            .ForMember(d => d.OwnerId, o => o.MapFrom(_ => currentUserId))
            .ForMember(d => d.Owner, o => o.Ignore())
            .ForMember(d => d.CollectionItems,
                o => o.MapFrom((src, dest, d, context) =>
                    src.Items.Select((ci, i) =>
                    {
                        var collectionItem = context.Mapper.Map<AttractionsCollectionItem>(ci);
                        collectionItem.Index = Convert.ToUInt32(i);
                        return collectionItem;
                    })))
            ;
    }
}
