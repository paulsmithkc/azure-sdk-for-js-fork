/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import "@azure/core-paging";
import { PagedAsyncIterableIterator } from "@azure/core-paging";
import {
  Location,
  SubscriptionsListLocationsOptionalParams,
  Subscription,
  SubscriptionsListOptionalParams,
  SubscriptionsGetOptionalParams,
  SubscriptionsGetResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Subscriptions. */
export interface Subscriptions {
  /**
   * This operation provides all the locations that are available for resource providers; however, each
   * resource provider may support a subset of this list.
   * @param subscriptionId The ID of the target subscription.
   * @param options The options parameters.
   */
  listLocations(
    subscriptionId: string,
    options?: SubscriptionsListLocationsOptionalParams
  ): PagedAsyncIterableIterator<Location>;
  /**
   * Gets all subscriptions for a tenant.
   * @param options The options parameters.
   */
  list(
    options?: SubscriptionsListOptionalParams
  ): PagedAsyncIterableIterator<Subscription>;
  /**
   * Gets details about a specified subscription.
   * @param subscriptionId The ID of the target subscription.
   * @param options The options parameters.
   */
  get(
    subscriptionId: string,
    options?: SubscriptionsGetOptionalParams
  ): Promise<SubscriptionsGetResponse>;
}
