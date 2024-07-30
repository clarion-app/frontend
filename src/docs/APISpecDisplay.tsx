import RequestBody from "./RequestBody";
import ComponentSchema from "./ComponentSchema";

interface ResponseType {
  description: string;
  content?: {
    [contentType: string]: {
      schema: object;
    };
  };
}

export interface RequestBodyType {
  content: {
    [contentType: string]: {
      schema: object;
    };
  };
}

interface MethodDetailsType {
  operationId?: string;
  summary?: string;
  tags?: string[];
  requestBody?: RequestBodyType;
  responses?: {
    [statusCode: string]: ResponseType;
  };
}

interface PathMethodsType {
  [method: string]: MethodDetailsType;
}

export interface APISpecType {
  paths: {
    [path: string]: PathMethodsType;
  };
  components: {
    [component: string]: object;
  };
  server: string;
}

interface APISpecDisplayPropsType {
  apiSpec: APISpecType;
}

function APISpecDisplay({ apiSpec }: APISpecDisplayPropsType) {
  return (
    <div className="box">
      <a href="#component-schemas">Component Schemas</a>
      <h2 className="title">API Endpoints</h2>
      <div className="content">
        {Object.entries(apiSpec.paths).map(([path, methods]) => (
          <div key={path}>
            <p className="is-size-5 has-text-weight-semibold">{apiSpec.server}{path}</p>
            <ul>
              {Object.entries(methods).map(([method, details]) => (
                <li key={method}>
                  <p className="is-size-6 has-text-weight-bold">
                    {method.toUpperCase()}
                  </p>
                  <ul>
                    {details.operationId && (
                      <li>
                        <strong>Operation ID:</strong> {details.operationId}
                      </li>
                    )}
                    {details.summary && (
                      <li>
                        <strong>Summary:</strong> {details.summary}
                      </li>
                    )}
                    {details.tags && (
                      <li>
                        <strong>Tags:</strong> {details.tags.join(", ")}
                      </li>
                    )}
                    {details.requestBody && (
                      <li>
                        <strong>Request Body:</strong>
                        <RequestBody requestBody={details.requestBody} />
                      </li>
                    )}
                    {details.responses &&
                      Object.entries(details.responses).map(
                        ([statusCode, response]) => (
                          <li key={statusCode}>
                            <strong>Response {statusCode}:</strong>
                            <pre>{JSON.stringify(response, null, 2)}</pre>
                          </li>
                        )
                      )}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <h2 className="title" id="component-schemas">
        Component Schemas
      </h2>
      <div className="content">
        {apiSpec.components.schemas &&
          Object.entries(apiSpec.components.schemas).map(
            ([component, schema]) => (
              <div key={component}>
                <p className="is-size-5 has-text-weight-semibold mt-5">
                  {component}
                </p>
                <ComponentSchema component={schema} />
              </div>
            )
          )}
      </div>
    </div>
  );
}

export default APISpecDisplay;
