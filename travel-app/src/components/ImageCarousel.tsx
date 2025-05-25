import { useState } from 'react';

const images = [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhdmVsfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8OHx8dHJhdmVsfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1676139860466-8b8f71c0a737?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D"

]

const ImageCarousel = () => {
    const [current, setCurrent] = useState(0);

    const prevImage = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (images.length === 0) return null;

    return (
        <div className="relative w-full max-w-[500px] mx-auto">
            <img
            src={images[current]}
            alt={`Image ${current + 1}`}
            className="w-full rounded-lg object-cover"
            />
            <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            aria-label="Previous image"
            >
            &#8592;
            </button>
            <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            aria-label="Next image"
            >
            &#8594;
            </button>
            <div className="text-center mt-2">
            {images.map((_, idx) => (
                <span
                key={idx}
                className={`inline-block w-2 h-2 mx-1 rounded-full ${idx === current ? 'bg-gray-800' : 'bg-gray-300'}`}
                />
            ))}
            </div>
        </div>
    );
};

export default ImageCarousel;