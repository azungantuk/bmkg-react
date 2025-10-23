import './App.css';
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom"; // ✅ Tambahan untuk routing

function Home() {
  const [provinsi, setProvinsi] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [desa, setDesa] = useState([]);

  const [selectedProv, setSelectedProv] = useState("");
  const [selectedKab, setSelectedKab] = useState("");
  const [selectedKec, setSelectedKec] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [errorWeather, setErrorWeather] = useState(null);

  const baseURL = process.env.PUBLIC_URL + "/data/";

  const urls = {
    prov: baseURL + "daerah_provinsi.csv",
    kab: baseURL + "daerah_kabupaten.csv",
    kec: baseURL + "daerah_kecamatan.csv",
    desa: baseURL + "daerah_desa.csv",
  };

  const navigate = useNavigate(); // ✅ Untuk redirect ke halaman lain

  // Load data lokasi
  useEffect(() => {
    Papa.parse(urls.prov, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => setProvinsi(result.data),
    });
  }, []);

  useEffect(() => {
    if (selectedProv) {
      Papa.parse(urls.kab, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const filtered = result.data.filter(
            (row) => row.kode_provinsi === selectedProv
          );
          setKabupaten(filtered);
        },
      });
    } else setKabupaten([]);
    setSelectedKab("");
    setSelectedKec("");
    setSelectedDesa("");
    setWeather(null);
  }, [selectedProv]);

  useEffect(() => {
    if (selectedKab) {
      Papa.parse(urls.kec, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const filtered = result.data.filter(
            (row) =>
              row.kode_provinsi === selectedProv &&
              row.kode_kabupaten === selectedKab
          );
          setKecamatan(filtered);
        },
      });
    } else setKecamatan([]);
    setSelectedKec("");
    setSelectedDesa("");
    setWeather(null);
  }, [selectedKab]);

  useEffect(() => {
    if (selectedKec) {
      Papa.parse(urls.desa, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const filtered = result.data.filter(
            (row) =>
              row.kode_provinsi === selectedProv &&
              row.kode_kabupaten === selectedKab &&
              row.kode_kecamatan === selectedKec
          );
          setDesa(filtered);
        },
      });
    } else setDesa([]);
    setSelectedDesa("");
    setWeather(null);
  }, [selectedKec]);

  // ✅ Tombol redirect ke /kode
  const handleConfirm = () => {
    const desaRow = desa.find((d) => d.kode_desa === selectedDesa);
    if (!desaRow) {
      alert("Pilih lokasi hingga kelurahan terlebih dahulu!");
      return;
    }

    // Gabungkan kode sesuai format BMKG
    const adm4 = `${desaRow.kode_provinsi.padStart(2, "0")}.${desaRow.kode_kabupaten.padStart(2, "0")}.${desaRow.kode_kecamatan.padStart(2, "0")}.${desaRow.kode_desa.padStart(4, "0")}`;

    console.log("Redirect ke:", adm4);
    navigate(`/${adm4}`); // 🚀 Redirect ke halaman kode
  };

  return (
    <div className="container">
      <h1>Prakiraan Cuaca BMKG</h1>
      <p className="subtitle">Pilih lokasi untuk melihat prakiraan cuaca 3 hari ke depan</p>

      <div className="dropdowns">
        <select value={selectedProv} onChange={(e) => setSelectedProv(e.target.value)}>
          <option value="">Pilih Provinsi</option>
          {provinsi.map((p) => (
            <option key={p.kode_provinsi} value={p.kode_provinsi}>{p.nama_provinsi}</option>
          ))}
        </select>

        {kabupaten.length > 0 && (
          <select value={selectedKab} onChange={(e) => setSelectedKab(e.target.value)}>
            <option value="">Pilih Kabupaten/Kota</option>
            {kabupaten.map((k) => (
              <option key={k.kode_kabupaten} value={k.kode_kabupaten}>{k.nama_kabupaten}</option>
            ))}
          </select>
        )}

        {kecamatan.length > 0 && (
          <select value={selectedKec} onChange={(e) => setSelectedKec(e.target.value)}>
            <option value="">Pilih Kecamatan</option>
            {kecamatan.map((kc) => (
              <option key={kc.kode_kecamatan} value={kc.kode_kecamatan}>{kc.nama_kecamatan}</option>
            ))}
          </select>
        )}

        {desa.length > 0 && (
          <select value={selectedDesa} onChange={(e) => setSelectedDesa(e.target.value)}>
            <option value="">Pilih Desa/Kelurahan</option>
            {desa.map((d) => (
              <option key={d.kode_desa} value={d.kode_desa}>{d.nama_desa}</option>
            ))}
          </select>
        )}
      </div>

      {/* ✅ Tombol konfirmasi muncul setelah kelurahan dipilih */}
      {selectedDesa && (
        <button
          onClick={handleConfirm}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Lihat Cuaca
        </button>
      )}
    </div>
  );
}

export default Home;
