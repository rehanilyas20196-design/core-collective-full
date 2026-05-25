import React, { useState } from 'react';
import { Star, Heart, ChevronRight, Users, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';

const projectsData = [];

const Projects = ({ setPage }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const categories = ['All', 'Sustainability', 'Technology', 'Beauty', 'Sports', 'Education', 'Pets', 'Food'];

  const filteredProjects = filterCategory === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === filterCategory);

  return (
    <div className="container py-6">
      {/* Back Button */}
      <button
        onClick={() => setPage('home')}
        className="flex items-center gap-2 text-[#8B96A5] hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-normal">Projects</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal to-teal-light rounded-lg p-8 mb-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-white/80">Support innovative products and ideas</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              filterCategory === cat 
                ? 'bg-teal text-white' 
                : 'bg-white border border-shade-border text-dark hover:bg-shade'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Count */}
      <div className="mb-4">
        <span className="text-dark font-semibold">{filteredProjects.length} projects found</span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProjects.map((project) => {
          const progress = Math.min(100, Math.floor(Math.random() * 100));
          return (
            <div
              key={project.id}
              className="bg-white border border-[#DEE2E7] rounded-lg p-4 hover:shadow-lg transition-shadow group cursor-pointer"
              onClick={() => setPage('details', project)}
            >
              {/* Days Left Badge */}
              <div className="absolute top-2 left-2 bg-[#00B517] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <Calendar size={12} />
                {project.daysLeft} days left
              </div>

              {/* Wishlist Button */}
              <button 
                className="absolute top-2 right-2 w-8 h-8 bg-white border border-[#DEE2E7] rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart size={16} />
              </button>

              {/* Project Image */}
              <div className="aspect-square flex items-center justify-center mb-4 bg-[#F7F7F7] rounded-lg p-4">
                <img 
                  src={project.image_url} 
                  alt={project.name} 
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                />
              </div>

              {/* Project Info */}
              <div className="space-y-2">
                <span className="text-xs text-secondary">{project.category}</span>
                <h3 className="font-medium text-dark line-clamp-2">{project.name}</h3>
                <p className="text-sm text-secondary line-clamp-2">{project.description}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={12} className={i < Math.floor(project.rating) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                    ))}
                  </div>
                  <span className="text-xs text-secondary">({project.reviews_count})</span>
                </div>

                {/* Backers */}
                <div className="flex items-center gap-1 text-sm text-secondary">
                  <Users size={14} />
                  {project.backers} backers
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="text-xs text-secondary">{progress}% funded</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#1C1C1C]">Rs. {project.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;