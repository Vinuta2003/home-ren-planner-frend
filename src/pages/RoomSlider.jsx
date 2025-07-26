// src/components/RoomSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import RoomCard from './RoomCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function RoomSlider({ rooms, onEdit, onDelete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  
  // Calculate slide width based on container width and slides per view
  const slideWidth = containerWidth > 0 
    ? (containerWidth - (slidesPerView - 1) * 30) / slidesPerView 
    : 300;
  
  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        
        // Update slides per view based on screen size
        if (width < 640) {
          setSlidesPerView(1);
        } else if (width < 1024) {
          setSlidesPerView(2);
        } else {
          setSlidesPerView(3);
        }
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Calculate total groups of slides
  const totalGroups = Math.ceil(rooms.length / slidesPerView);
  
  // Navigation functions
  const goToSlide = (index) => {
    if (index >= 0 && index < totalGroups) {
      setCurrentIndex(index);
    }
  };
  
  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };
  
  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };
  
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No rooms yet. Add your first room!</p>
      </div>
    );
  }
  
  // Calculate visible rooms for current group
  const startIndex = currentIndex * slidesPerView;
  const endIndex = Math.min(startIndex + slidesPerView, rooms.length);
  const visibleRooms = rooms.slice(startIndex, endIndex);

  return (
    <div className="w-full" ref={containerRef}>
      {/* Navigation and counter */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
            aria-label="Previous rooms"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <div className="mx-2 text-sm text-gray-600">
            {currentIndex + 1} / {totalGroups}
          </div>
          
          <button
            onClick={goToNext}
            disabled={currentIndex >= totalGroups - 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
            aria-label="Next rooms"
          >
            <FiChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Slides container */}
      <div className="flex gap-[30px] overflow-x-hidden">
        {visibleRooms.map((room) => (
          <div 
            key={room.exposedId} 
            className="transition-all duration-300"
            style={{ width: `${slideWidth}px` }}
          >
            <RoomCard 
              room={room}
              onEdit={() => onEdit(room)}
              onDelete={() => onDelete(room.exposedId)}
            />
          </div>
        ))}
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalGroups }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-blue-600' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}