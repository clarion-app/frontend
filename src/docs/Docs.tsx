import { backendUrl } from "../build/backendUrl";
import { getAndThen } from "../fetchAndThen";
import { useState, useEffect } from "react";
import APISpecDisplay, { APISpecType } from "./APISpecDisplay";

export const Docs = () => {
  const [spec, setSpec] = useState<APISpecType>({ paths: {}, components: {} });

  const url = `${backendUrl}/docs/api.json`;

  useEffect(() => {
    getAndThen(url, (data: any) => {
      if (data) {
        setSpec({ paths: data.paths, components: data.components });
      }
    });
  }, [url]);

  return (
    <div>
      <h1>Docs</h1>
      <APISpecDisplay apiSpec={spec} />
    </div>
  );
};
