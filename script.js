const url =
  "https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true";
const tempElement = document.getElementById("temp");
const windElement = document.getElementById("wind");
const codeElement = document.getElementById("code");
const loadingElement = document.getElementById("loading");
const weatherInfo = document.getElementById("weather-info");
const updateBtn = document.getElementById("update-btn");
// 天気コードを通訳する関数
function translateWeatherCode(code) {
  // 辞書（オブジェクト）を作る
  const weatherCodes = {
    0: { name: "快晴", icon: "☀️", color: "#ffecb3" },
    1: { name: "晴れ", icon: "☀️", color: "#ffecb3" },
    2: { name: "一部曇", icon: "⛅️", color: "#cfd8dc" },
    3: { name: "曇り", icon: "☁️", color: "#cfd8dc" },
    45: { name: "霧", icon: "🌫", color: "#eceff1" },
    51: { name: "霧雨", icon: "☔️", color: "#b3e5fc" },
    61: { name: "雨", icon: "☔️", color: "#b3e5fc" },
    63: { name: "雨", icon: "☔️", color: "#b3e5fc" },
    71: { name: "雪", icon: "☃️", color: "#ffffff" },
    95: { name: "雷雨", icon: "⚡️", color: "#d1c4e9" },
  };

  // 辞書に載っているコードならそれを返す
  if (weatherCodes[code]) {
    return weatherCodes[code];
  } else {
    // 載っていないコード（激しい雨など）が来た場合の保険
    return { name: "不明", icon: "❓", color: "#ffffff" };
  }
}
async function getweather() {
  loadingElement.style.display = "block";
  weatherInfo.classList.add("hidden");
  try {
    const response = await fetch(url);
    const data = await response.json();
    const current = data.current_weather;
    console.log("取れたデータ:");
    const weatherData = translateWeatherCode(current.weathercode);
    tempElement.textContent = current.temperature;
    windElement.textContent = current.windspeed;
    codeElement.textContent = `${weatherData.icon} ${weatherData.name}`;
    document.body.style.backgroundColor = weatherData.color;
    loadingElement.style.display = "none";
    weatherInfo.classList.remove("hidden");
  } catch (error) {
    console.error("エラー", error);
    loadingElement.textContent = "エラーが発生しました";
  }
}

updateBtn.addEventListener("click", getweather);
getweather();
