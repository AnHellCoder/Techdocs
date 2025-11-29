import React, { useEffect } from "react";
import "../styles/TextPageStyle.css";

function Description({id}) {
  useEffect(() => {
    // Увеличиваем visits при заходе на страницу
    fetch("http://localhost:8000/kpi/visit/" + id, { method: "POST" });

    // Засекаем время входа
    const enterTime = Date.now();

    // Функция для отправки времени на сервер
    const sendTime = () => {
      const timeSpent = (Date.now() - enterTime) / 1000; // секунды
      fetch("http://localhost:8000/kpi/time/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: Number(id), time_spent: timeSpent })
      });
    };

    window.addEventListener("beforeunload", sendTime);
    return () => {
      sendTime();
      window.removeEventListener("beforeunload", sendTime);
    };
  }, [id]);

  return (
    <div className="text-page-container">
      <h1>Описание</h1>
      <h2>Датасеты:</h2>
      <div>
        В качестве датасета для современного русского языка предполагается
        взять таблицу соответствий древних лемм современным словам.
      </div>
      <div>
        Для датасета праславянской лексики предполагается распарсить словарь
        славянских корней Трубачёва.
      </div>
      <h2>Используемые модели нейронных сетей:</h2>
      <div>
        Для разных задач ВКР будут использованы разные модели нейронных сетей.
        Среди следующих задач рассматриваются:
        <ol>
            <li>Парсинг электронной форма словаря славянских корней Трубачёва в формате PDF; Qwen3-VL-30B</li>
            <li>Бинарная классификация происхождения слова (заимствованное/наследованное); LSTM</li>
            <li>Если слово наследованное, попытка восстановить его праформу в праславянском язык; XLMRoBerta</li>
        </ol>
      </div>
      <h2>Определение заимствования для ВКР:</h2>
      <div>
        Для данной выпускной квалификационной работы предполагается работать исключительно с прямыми заимствованиями
        (то есть словами, формы которых были напрямую взяты из языка-донора, а не например кальки, что являются буквальными
        переводами заимствованных слов в языке-реципиенте). Предполагается в качестве заимствований рассматривать слова, заимствованные
        в определённом историческом периоде.
      </div>
    </div>
  );
}

export default Description