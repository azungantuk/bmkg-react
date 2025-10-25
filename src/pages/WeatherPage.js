import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./WeatherPage.css";

function WeatherPage() {
  const { adm4 } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`
        );
        if (!res.ok) throw new Error("Gagal memuat data cuaca BMKG");
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [adm4]);

  if (loading)
    return <p style={{ textAlign: "center" }}>⏳ Memuat data...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>❌ {error}</p>;

  // 🧭 Fungsi bantu: ubah hari ke-n jadi label natural
  const getHariLabel = (index) => {
    if (index === 0) return "Hari Ini";
    if (index === 1) return "Besok";
    if (index === 2) return "Besok Lusa";
    return `Hari ke-${index + 1}`;
  };

  // 🕒 Fungsi bantu: ubah local_datetime jadi hanya jam:menit
  const formatTime = (datetime) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    const jam = date.getHours().toString().padStart(2, "0");
    const menit = date.getMinutes().toString().padStart(2, "0");
    return `${jam}:${menit}`;
  };

  return (
    <div className="container">
      <div>
      <h1>Cuaca di {weather?.lokasi?.desa}</h1>
      <p>
        {weather?.lokasi?.kecamatan}, {weather?.lokasi?.kotkab},{" "}
        {weather?.lokasi?.provinsi}
      </p>
      </div>

      <p></p><p></p>
      <Link to="/" className="back-link">
        ← Ganti lokasi
      </Link>
      
{weather?.data?.[0]?.cuaca?.map((hari, i) => (
  <div
    key={i}
    className={`day ${i === 0 ? "day-today" : "day-next"}`} // 👈 tambahkan class berbeda
  >
    <h2>{getHariLabel(i)}</h2>
    <div className={`forecast-grid ${i === 0 ? "single-row" : "multi-row"}`}>
      {hari.map((jam, j) => (
        <div key={j} className="forecast-card">
          <p className="time">{formatTime(jam.local_datetime)}</p>
          {jam.image && <img src={jam.image} alt={jam.weather_desc} />}
          <p className="desc">{jam.weather_desc}</p>
          <p>🌡️ {jam.t}°C | 💧 {jam.hu}% | 🌬️ {jam.ws} km/j</p>
        </div>
      ))}
    </div>
  </div>
))}

    </div>
  );
}

export default WeatherPage;
