import { NextResponse } from "next/server"

// Sử dụng cùng mock data với file route.ts
const MOCK_LOCATIONS = [
  {
    _id: '1',
    name: 'Nhà hàng Hải Sản Tươi Sống',
    description: 'Nhà hàng chuyên phục vụ các món hải sản tươi sống, đặc biệt là tôm hùm và cua hoàng đế.',
    address: '123 Đường Hải Sản, Quận 1, TP.HCM',
    coordinates: { lat: 10.772, lng: 106.698 },
    tags: ['ăn uống', 'hải sản', 'nhà hàng'],
    rating: 4.5,
    images: ['/food1.jpg'],
    distance: 0.5
  },
  {
    _id: '2',
    name: 'Công viên 23/9',
    description: 'Công viên trung tâm thành phố với không gian xanh mát, lý tưởng cho các hoạt động thể thao và dã ngoại.',
    address: 'Đường Lê Lai, Quận 1, TP.HCM',
    coordinates: { lat: 10.771, lng: 106.695 },
    tags: ['thể thao', 'dã ngoại', 'công viên'],
    rating: 4.2,
    images: ['/park1.jpg'],
    distance: 0.8
  },
  {
    _id: '3',
    name: 'Bảo tàng Mỹ thuật TP.HCM',
    description: 'Nơi trưng bày các tác phẩm nghệ thuật đương đại và cổ điển của Việt Nam.',
    address: '97 Phó Đức Chính, Quận 1, TP.HCM',
    coordinates: { lat: 10.791, lng: 106.705 },
    tags: ['bảo tàng', 'nghệ thuật', 'văn hóa'],
    rating: 4.3,
    images: ['/museum1.jpg'],
    distance: 1.5
  },
  {
    _id: '4',
    name: 'Rạp chiếu phim CGV',
    description: 'Hệ thống rạp chiếu phim hiện đại với nhiều phòng chiếu và dịch vụ cao cấp.',
    address: 'Tầng 5, Vincom Center, 72 Lê Thánh Tôn, Quận 1, TP.HCM',
    coordinates: { lat: 10.775, lng: 106.702 },
    tags: ['phim ảnh', 'giải trí'],
    rating: 4.6,
    images: ['/cinema1.jpg'],
    distance: 1.2
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() || ''
    const preferences = searchParams.get('preferences')?.split(',') || []
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" }, 
        { status: 400 }
      )
    }

    // Lọc địa điểm dựa trên từ khóa tìm kiếm
    let filteredLocations = MOCK_LOCATIONS.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.description.toLowerCase().includes(query) ||
      location.tags.some(tag => tag.toLowerCase().includes(query))
    )

    // Lọc thêm theo sở thích nếu có
    if (preferences.length > 0) {
      filteredLocations = filteredLocations.filter(location => 
        preferences.some(pref => 
          location.tags.some(tag => tag.toLowerCase().includes(pref.toLowerCase()))
        )
      )
    }

    // Sắp xếp theo đánh giá cao nhất
    filteredLocations.sort((a, b) => b.rating - a.rating)

    // Giới hạn số lượng kết quả
    const result = filteredLocations.slice(0, limit)

    // Thêm thời gian phản hồi giả lập
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error searching locations:", error)
    return NextResponse.json(
      { error: "Failed to search locations" }, 
      { status: 500 }
    )
  }
}
