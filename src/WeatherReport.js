import React, { useEffect, useState } from "react";

const WeatherReport = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const response = await fetch(
          "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=31.71.01.1001"
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  if (loading) return <p>Memuat data dari BMKG...</p>;
  if (!weather) return <p>Gagal memuat data.</p>;

  const lokasi = weather.lokasi;
  const prakiraan = weather.data?.[0]?.cuaca ?? [];

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-3">🌤️ Prakiraan Cuaca BMKG</h1>

      {lokasi ? (
        <div className="mb-4 bg-gray-100 p-3 rounded-lg">
          <h2 className="font-semibold text-lg mb-1">{lokasi.desa}</h2>
          <p>
            {lokasi.kecamatan}, {lokasi.kotkab}, {lokasi.provinsi}
          </p>
          <p>
            Koordinat: {lokasi.lat}, {lokasi.lon} — Zona Waktu:{" "}
            {lokasi.timezone}
          </p>
        </div>
      ) : (
        <p>Data lokasi tidak ditemukan.</p>
      )}

      <h3 className="text-xl font-semibold mb-2">Detail Prakiraan:</h3>

      {prakiraan.map((hari, index) => (
        <div key={index} className="mb-6">
          <h4 className="font-bold text-lg mb-2">Hari ke-{index + 1}</h4>
          <ul className="space-y-2">
            {hari.map((item, i) => (
              <li
                key={i}
                className="border-b pb-2 flex items-center gap-3 text-sm"
              >
                <div className="flex-1">
                  <p>
                    <strong>Jam:</strong> {item.local_datetime} <br />
                    <strong>Cuaca:</strong> {item.weather_desc}
                  </p>
                  <p>
                    🌡️ <strong>Suhu:</strong> {item.t}°C | 💧{" "}
                    <strong>Kelembapan:</strong> {item.hu}% | 🌬️{" "}
                    <strong>Angin:</strong> {item.ws} km/j dari {item.wd} | 👁️{" "}
                    <strong>Jarak Pandang:</strong> {item.vs_text}
                  </p>
                </div>
                {item.image && (
                  <img
                    src={item.image.replace(" ", "%20")}
                    alt={item.weather_desc}
                    title={item.weather_desc}
                    className="w-10 h-10"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WeatherReport;
