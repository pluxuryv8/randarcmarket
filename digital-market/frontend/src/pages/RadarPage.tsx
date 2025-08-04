import React from 'react';

const RadarPage: React.FC = () => {
  const demo = [
    { id:1, name:'AK-47 | Redline', price:12000, discount:15, image:'ak_redline.png' },
    { id:2, name:'AWP | Dragon Lore', price:150000, discount:5, image:'awp_dlore.png' },
    // …
  ];

  return (
    <div className="p-6 flex">
      {/* Фильтры */}
      <aside className="w-64 pr-4 hidden lg:block">
        <h3 className="text-white mb-2">Фильтры</h3>
        {/* вставь сюда чекбоксы/поля фильтров */}
      </aside>

      {/* Сетка карточек */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demo.map(it => (
          <div key={it.id} className="bg-[var(--color-bg-panel)] rounded-lg overflow-hidden hover:ring-2 hover:ring-[var(--color-accent)]">
            <img src={it.image} alt={it.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h4 className="text-white mb-1">{it.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-red-500">${it.price}</span>
                {it.discount > 0 && <span className="text-green-400">-{it.discount}%</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarPage;
