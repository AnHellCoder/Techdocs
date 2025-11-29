import SwaggerUI from "swagger-ui-react";
import { useEffect } from "react";
import "swagger-ui-react/swagger-ui.css";

function APITab({id}) {
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
    <div>
      <h1>API документация</h1>
      <SwaggerUI url="http://127.0.0.1:8000/openapi.json" />
    </div>
  );
}

export default APITab;