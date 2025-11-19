import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function APITab() {
  return (
    <div>
      <h1>API документация</h1>
      <SwaggerUI url="http://127.0.0.1:8000/openapi.json" />
    </div>
  );
}

export default APITab;