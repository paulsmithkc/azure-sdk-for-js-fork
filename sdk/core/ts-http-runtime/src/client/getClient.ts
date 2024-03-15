// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TokenCredential, isTokenCredential } from "../auth/tokenCredential.js";
import { KeyCredential, isKeyCredential } from "../auth/keyCredential.js";
import { HttpClient, HttpMethods } from "../interfaces.js";
import { Pipeline } from "../pipeline.js";
import { createDefaultPipeline } from "./clientHelpers.js";
import {
  Client,
  ClientOptions,
  HttpBrowserStreamResponse,
  HttpNodeStreamResponse,
  RequestParameters,
  StreamableMethod,
} from "./common.js";
import { sendRequest } from "./sendRequest.js";
import { buildRequestUrl } from "./urlHelpers.js";
import { PipelineOptions } from "../createPipelineFromOptions.js";

/**
 * Creates a client with a default pipeline
 * @param endpoint - Base endpoint for the client
 * @param options - Client options
 */
export async function getClient(endpoint: string, options?: ClientOptions): Promise<Client>;
/**
 * Creates a client with a default pipeline
 * @param endpoint - Base endpoint for the client
 * @param credentials - Credentials to authenticate the requests
 * @param options - Client options
 */
export async function getClient(
  endpoint: string,
  credentials?: TokenCredential | KeyCredential,
  options?: ClientOptions,
): Promise<Client>;
export async function getClient(
  endpoint: string,
  credentialsOrPipelineOptions?: (TokenCredential | KeyCredential) | ClientOptions,
  clientOptions: ClientOptions = {},
): Promise<Client> {
  let credentials: TokenCredential | KeyCredential | undefined;
  if (credentialsOrPipelineOptions) {
    if (isCredential(credentialsOrPipelineOptions)) {
      credentials = credentialsOrPipelineOptions;
    } else {
      clientOptions = credentialsOrPipelineOptions ?? {};
    }
  }

  const pipeline = await createDefaultPipeline(endpoint, credentials, clientOptions);
  if (clientOptions.additionalPolicies?.length) {
    for (const { policy, position } of clientOptions.additionalPolicies) {
      // Sign happens after Retry and is commonly needed to occur
      // before policies that intercept post-retry.
      const afterPhase = position === "perRetry" ? "Sign" : undefined;
      pipeline.addPolicy(policy, {
        afterPhase,
      });
    }
  }

  const { allowInsecureConnection, httpClient } = clientOptions;
  const client = (path: string, ...args: Array<any>) => {
    const getUrl = (requestOptions: RequestParameters): string =>
      buildRequestUrl(endpoint, path, args, { allowInsecureConnection, ...requestOptions });

    return {
      get: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "GET",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
      post: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "POST",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
      put: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "PUT",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
      patch: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "PATCH",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
      delete: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "DELETE",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
      head: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "HEAD",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
      options: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "OPTIONS",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
      trace: (requestOptions: RequestParameters = {}): StreamableMethod => {
        return buildOperation(
          "TRACE",
          getUrl(requestOptions),
          pipeline,
          requestOptions,
          allowInsecureConnection,
          httpClient,
        );
      },
    };
  };

  return {
    path: client,
    pathUnchecked: client,
    pipeline,
  };
}

function buildOperation(
  method: HttpMethods,
  url: string,
  pipeline: Pipeline,
  options: RequestParameters,
  allowInsecureConnection?: boolean,
  httpClient?: HttpClient,
): StreamableMethod {
  allowInsecureConnection = options.allowInsecureConnection ?? allowInsecureConnection;
  return {
    then: function (onFulfilled, onrejected) {
      return sendRequest(
        method,
        url,
        pipeline,
        { ...options, allowInsecureConnection },
        httpClient,
      ).then(onFulfilled, onrejected);
    },
    async asBrowserStream() {
      return sendRequest(
        method,
        url,
        pipeline,
        { ...options, allowInsecureConnection, responseAsStream: true },
        httpClient,
      ) as Promise<HttpBrowserStreamResponse>;
    },
    async asNodeStream() {
      return sendRequest(
        method,
        url,
        pipeline,
        { ...options, allowInsecureConnection, responseAsStream: true },
        httpClient,
      ) as Promise<HttpNodeStreamResponse>;
    },
  };
}

function isCredential(
  param: (TokenCredential | KeyCredential) | PipelineOptions,
): param is TokenCredential | KeyCredential {
  return isKeyCredential(param) || isTokenCredential(param);
}
