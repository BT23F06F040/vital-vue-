import React from 'react';

const Prototype: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Prototype</h1>
        <p className="text-gray-600">Video demo and screenshots</p>
      </div>

      <div className="aspect-w-16 aspect-h-9 mb-8">
        <iframe
          className="w-full h-64 md:h-[420px] rounded-lg shadow"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Prototype Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 h-48 flex items-center justify-center text-gray-500">
            Screenshot {i}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prototype;


