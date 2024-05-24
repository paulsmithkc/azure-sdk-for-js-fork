/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { OracleDatabaseManagementClient } = require("@azure/arm-oracledatabase");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

/**
 * This sample demonstrates how to List Private IP Addresses by the provided filter
 *
 * @summary List Private IP Addresses by the provided filter
 * x-ms-original-file: specification/oracle/resource-manager/Oracle.Database/preview/2023-09-01-preview/examples/vmClusters_listPrivateIpAddresses.json
 */
async function listPrivateIPAddressesForVMCluster() {
  const subscriptionId =
    process.env["ORACLEDATABASE_SUBSCRIPTION_ID"] || "00000000-0000-0000-0000-000000000000";
  const resourceGroupName = process.env["ORACLEDATABASE_RESOURCE_GROUP"] || "rg000";
  const cloudvmclustername = "cluster1";
  const body = {
    subnetId: "ocid1..aaaaaa",
    vnicId: "ocid1..aaaaa",
  };
  const credential = new DefaultAzureCredential();
  const client = new OracleDatabaseManagementClient(credential, subscriptionId);
  const result = await client.cloudVmClusters.listPrivateIpAddresses(
    resourceGroupName,
    cloudvmclustername,
    body,
  );
  console.log(result);
}

async function main() {
  listPrivateIPAddressesForVMCluster();
}

main().catch(console.error);
