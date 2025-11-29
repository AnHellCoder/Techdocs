import React, { useEffect, useState } from "react";
import "../styles/Statistics.css";

const PAGE_NAMES = {
  1: "Введение",
  2: "Описание",
  3: "Статистика",
  4: "API"
};

function Statistics({id}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/kpi/")
      .then(r => r.json())
      .then(setData);
  }, []);

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

  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  }

  function nameForId(id) {
    return PAGE_NAMES[id] || `ID ${id}`;
  }

  return (
    <div className="stats-container">
      <h1 className="stats-title">Статистика посещений страниц</h1>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Название страницы</th>
            <th>Количество посещений</th>
            <th>Проведённое время</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? (<tr><td colSpan={3} className="empty-row">Нет данных</td></tr>)
            : data.map(row =>
                <tr key={row.page_id}>
                  <td>{nameForId(row.page_id)}</td>
                  <td>{row.visits}</td>
                  <td>{formatDuration(row.time_spent)}</td>
                </tr>
              )
          }
        </tbody>
      </table>
    </div>
  );
}

export default Statistics;