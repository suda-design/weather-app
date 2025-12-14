const weatherApiBase =
  "https://api.open-meteo.com/v1/forecast?current_weather=true";
const geoApiBase =
  "https://geocoding-api.open-meteo.com/v1/search?count=1&language=ja&format=json";

const cityInputElement = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const tempElement = document.getElementById("temp");
const windElement = document.getElementById("wind");
const codeElement = document.getElementById("code");
const loadingElement = document.getElementById("loading");
const weatherInfo = document.getElementById("weather-info");

// スペル修正: trenslate -> translate
function translateWeatherCode(code) {
  const weatherCodes = {
    // 修正: 色コードの前に # を追加
    0: { name: "快晴", icon: "☀️", color: "#ffecb3" },
    1: { name: "晴れ", icon: "☀️", color: "#ffecb3" },
    2: { name: "一部曇", icon: "⛅", color: "#cfd8dc" },
    3: { name: "曇り", icon: "☁️", color: "#cfd8dc" },
    45: { name: "霧", icon: "🌫️", color: "#eceff1" }, // l -> 1 に修正
    51: { name: "霧雨", icon: "☔️", color: "#b3e5fc" },
    61: { name: "雨", icon: "☔️", color: "#b3e5fc" },
    63: { name: "雨", icon: "☔️", color: "#b3e5fc" },
    71: { name: "雪", icon: "❄️", color: "#ffffff" },
    95: { name: "雷雨", icon: "⚡️", color: "#d1c4e9" }, // l -> 1 に修正
  };
  return weatherCodes[code] || { name: "不明", icon: "❓", color: "#ffffff" };
}

async function getCoordinates(cityname) {
  const url = `${geoApiBase}&name=${cityname}`; // 余分なスペースを削除
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results) {
    throw new Error("都市が見つかりません");
  }
  // 修正: if文の外に出しました。これで正しくデータが返ります。
  return data.results[0];
} // ★重要: ここで関数を閉じる！

async function getWeather(latitude, longitude, displayname) {
  loadingElement.style.display = "block";
  weatherInfo.classList.add("hidden");
  try {
    // 修正: URLの途中に改行が入らないように修正
    const url = `${weatherApiBase}&latitude=${latitude}&longitude=${longitude}`;
    const response = await fetch(url);
    const data = await response.json();

    const current = data.current_weather;
    const weather = translateWeatherCode(current.weathercode);

    document.querySelector("h1").textContent = `☀️${displayname}の天気☀️`;

    // 修正: temparature -> temperature
    tempElement.textContent = current.temperature;
    windElement.textContent = current.windspeed;
    codeElement.textContent = `${weather.icon} ${weather.name}`;

    // 修正: weatherdata -> weather
    document.body.style.backgroundColor = weather.color;

    loadingElement.style.display = "none";
    weatherInfo.classList.remove("hidden");
  } catch (error) {
    console.error("エラー", error);
    // 修正: ドットを追加 (.textContent)
    loadingElement.textContent = "天気情報の取得に失敗しました。";
  }
}

searchBtn.addEventListener("click", async () => {
  const cityname = cityInputElement.value;
  if (!cityname) return;
  try {
    loadingElement.textContent = "都市情報を取得中...";
    loadingElement.style.display = "block";
    weatherInfo.classList.add("hidden");
    const locationData = await getCoordinates(cityname);
    await getWeather(
      locationData.latitude,
      locationData.longitude,
      locationData.name
    );
  } catch (error) {
    alert(
      "都市情報の取得に失敗しました。ローマ字で入力してください。（例：kyoto）"
    );
    loadingElement.style.display = "none";
  }
});

// 初期表示
getWeather(35.6895, 139.6917, "tokyo");
