import { useEffect, useState } from 'react';
import Prayer from "./Component/Prayer";

function App() {
  const cities = [
    { name: "القاهرة", value: "Cairo" },
    { name: "الإسكندرية", value: "Alexandria" },
    { name: "الجيزة", value: "Giza" },
    { name: "المنصورة", value: "Mansoura" },
    { name: "أسوان", value: "Aswan" },
    { name: "الأقصر", value: "Luxor" }
  ];

  const [prayerTimes, setPrayerTimes] = useState({});
  const [dateTime, setDateTime] = useState("");
  const [city, setCity] = useState("Cairo");

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${today}?city=${city}&country=EG`);
        const data = await response.json();
        setPrayerTimes(data.data.timings);
        setDateTime(data.data.date.gregorian.date);
        console.log(data.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchPrayerTimes();
  }, [city]);

  const formatTime = (time) => {
    if (!time) return "N/A"; 
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  };

  return (
    <section>
      <div className="container">
        <div className="top-sec">
          <div className="city">
            <h3>المدينة</h3>
            <select name="city" onChange={(e) => setCity(e.target.value)} value={city}>
              {cities.map((city_obj) => (
                <option key={city_obj.value} value={city_obj.value}>
                  {city_obj.name}
                </option>
              ))}
            </select>
          </div>
          <div className="date">
            <h3>التاريخ</h3>
            <h4>{dateTime}</h4>
          </div>
        </div>

        {prayerTimes && (
          <>
            <Prayer name="الفجر" time={formatTime(prayerTimes.Fajr)} />
            <Prayer name="الظهر" time={formatTime(prayerTimes.Dhuhr)} />
            <Prayer name="العصر" time={formatTime(prayerTimes.Asr)} />
            <Prayer name="المغرب" time={formatTime(prayerTimes.Maghrib)} />
            <Prayer name="العشاء" time={formatTime(prayerTimes.Isha)} />
            <Prayer name="امساك" time={formatTime(prayerTimes.Imsak)} />
            <Prayer name="شروق الشمس " time={formatTime(prayerTimes.Sunrise)} />
            <Prayer name="غروب الشمس " time={formatTime(prayerTimes.Sunset)} />
            <Prayer name="الثلث الاخير  " time={formatTime(prayerTimes.Lastthird)} />

            


          </>
        )}
      </div>
    </section>
  );
}

export default App;
