const fs = require("fs");

const city = "Тюмень";

const categories = [
  "Еда",
  "Парки и природа",
  "История",
  "Искусство",
  "Спорт и активность",
  "Здоровье"
];

const realPlaces = {
  "Еда": [
    "Сыроварня Тюмень",
    "Гастробар Культура",
    "Чум ресторан",
    "СибирьСибирь",
    "Кафе Ваниль",
    "Burger King",
    "KFC",
    "Чайхона №1"
  ],
  "Парки и природа": [
    "Набережная Тюмени",
    "Гилёвская роща",
    "Цветной бульвар",
    "Парк Гагарина",
    "Сквер Депутатов"
  ],
  "История": [
    "Музей Словцова",
    "Дом Машарова",
    "Знаменский собор",
    "Мост Влюблённых",
    "Историческая площадь"
  ],
  "Искусство": [
    "Тюменский драмтеатр",
    "ДК Нефтяник",
    "Музей изобразительных искусств",
    "Галерея современного искусства"
  ],
  "Спорт и активность": [
    "Стадион Геолог",
    "Ледовый дворец",
    "Фитнес Атлетик",
    "Дворец спорта",
    "Crossfit Reboot"
  ],
  "Здоровье": [
    "Областная больница №1",
    "Медицинский город",
    "Клиника Нефтяник",
    "Стоматология Улыбка"
  ]
};

function phone() {
  return `+7 3452 ${Math.floor(100000 + Math.random() * 900000)}`;
}

function address() {
  const streets = ["Республики", "Ленина", "Мельникайте", "Профсоюзная"];
  return `ул. ${streets[Math.floor(Math.random() * streets.length)]}, ${Math.floor(Math.random() * 200)}`;
}

let id = 1;
const result = [];

categories.forEach((cat) => {
  for (let i = 0; i < 100; i++) {
    const pool = realPlaces[cat];
    const makeUniqueName = (name, id) => `${name} #${id}`;
    const arr = realPlaces[cat];
    const base = arr[Math.floor(Math.random() * arr.length)];
    const name = makeUniqueName(base, id);

    result.push({
      place_id: id++,
      place_name: name,
      place_address: address(),
      place_image: `https://picsum.photos/seed/tyumen_${id}/800/600`,
      business_email: name.toLowerCase().replace(/\s/g, "") + "@example.ru",
      business_phone: phone(),
      short_description: `${name} — популярное место в Тюмени`,
      place_description: `${name} — одно из известных мест города Тюмень, подходящее для посещения.`,
      place_rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      place_price: Math.floor(1 + Math.random() * 4),
      place_category: cat
    });
  }
});

fs.writeFileSync("tyumen_places.json", JSON.stringify(result, null, 2), "utf-8");

console.log("Done: tyumen_places.json");