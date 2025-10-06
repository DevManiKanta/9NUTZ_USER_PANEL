"use client";

const categories = [
  {
    name: "Paan Corner",
    image: "https://images.pexels.com/photos/7129717/pexels-photo-7129717.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Dairy, Bread & Eggs",
    image: "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Fruits & Vegetables",
    image: "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Cold Drinks & Juices",
    image: "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Snacks & Munchies",
    image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Breakfast & Instant Food",
    image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Sweet Tooth",
    image: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Bakery & Biscuits",
    image: "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Tea, Coffee & Health Drink",
    image: "https://images.pexels.com/photos/324203/pexels-photo-324203.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Atta, Rice & Dal",
    image: "https://images.pexels.com/photos/1625653/pexels-photo-1625653.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Masala, Oil & More",
    image: "https://images.pexels.com/photos/4198936/pexels-photo-4198936.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Sauces & Spreads",
    image: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Chicken, Meat & Fish",
    image: "https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Organic & Healthy Living",
    image: "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Baby Care",
    image: "https://images.pexels.com/photos/339616/pexels-photo-339616.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Pharma & Wellness",
    image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Cleaning Essentials",
    image: "https://images.pexels.com/photos/4099123/pexels-photo-4099123.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Home & Office",
    image: "https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Personal Care",
    image: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  },
  {
    name: "Pet Care",
    image: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  }
];

export default function CategoryGrid() {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 md:gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className="group flex flex-col items-center p-3 md:p-4 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-lg overflow-hidden mb-2 md:mb-3 bg-gray-100 flex-shrink-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-center text-gray-700 leading-tight">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}