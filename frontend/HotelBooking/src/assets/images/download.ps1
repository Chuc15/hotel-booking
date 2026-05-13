$dir = "c:\Users\ADMIN\hotel-booking\frontend\HotelBooking\src\assets\images"

$urls = @(
    @{ name = "hero.jpg";               url = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80" },
    @{ name = "room1.jpg";              url = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80" },
    @{ name = "room2.jpg";              url = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80" },
    @{ name = "room3.jpg";              url = "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80" },
    @{ name = "room4.jpg";              url = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80" },
    @{ name = "room5.jpg";              url = "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80" },
    @{ name = "service-pool.jpg";       url = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80" },
    @{ name = "service-spa.jpg";        url = "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80" },
    @{ name = "service-restaurant.jpg"; url = "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&q=80" },
    @{ name = "service-gym.jpg";        url = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
    @{ name = "gallery1.jpg";           url = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" },
    @{ name = "gallery2.jpg";           url = "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80" },
    @{ name = "gallery3.jpg";           url = "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80" },
    @{ name = "gallery4.jpg";           url = "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80" }
)

foreach ($item in $urls) {
    $outPath = Join-Path $dir $item.name
    Write-Host "Downloading $($item.name)..."
    Invoke-WebRequest -Uri $item.url -OutFile $outPath -UseBasicParsing
    Write-Host "  Saved to $outPath"
}

Write-Host "All done!"
