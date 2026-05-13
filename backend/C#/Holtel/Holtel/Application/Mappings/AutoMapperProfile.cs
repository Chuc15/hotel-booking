using AutoMapper;
using Holtel.Application.DTOs;
using Holtel.Application.DTOs.Booking;
using Holtel.Application.DTOs.Room;
using Holtel.Application.DTOs.RoomType;
using Holtel.Model;

namespace Holtel.Application.Mappings
{
	public class AutoMapperProfile:Profile
	{
		public AutoMapperProfile()
		{
			CreateMap<User, UserDto>()
				.ForMember(dest => dest.Role,
					opt => opt.MapFrom(src => src.Role.ToString()));

			CreateMap<Booking, BookingDto>();
			CreateMap<Room, RoomDto>()
			.ForMember(dest => dest.RoomTypeName,
				opt => opt.MapFrom(src => src.RoomType != null ? src.RoomType.Name : ""))
			.ForMember(dest => dest.Amenities,
				opt => opt.MapFrom(src =>
					string.IsNullOrWhiteSpace(src.Amenities)
						? new List<string>()
						: src.Amenities.Split(',', StringSplitOptions.TrimEntries).ToList()));
			CreateMap<CreateRoomDto, Room>();
			CreateMap<UpdateRoomDto, Room>();
		
			// AutoMapperProfile.cs — thêm vào
			CreateMap<RoomType, RoomTypeDto>()
				.ForMember(dest => dest.Amenities,
					opt => opt.MapFrom(src =>
						string.IsNullOrWhiteSpace(src.Amenities)
							? new List<string>()
							: src.Amenities.Split(',', StringSplitOptions.TrimEntries).ToList()));

			CreateMap<CreateRoomTypeDto, RoomType>();
			CreateMap<UpdateRoomTypeDto, RoomType>()
				.ForAllMembers(opt => opt.Condition(
					(src, dest, srcMember) => srcMember != null));
		}
	}
}
