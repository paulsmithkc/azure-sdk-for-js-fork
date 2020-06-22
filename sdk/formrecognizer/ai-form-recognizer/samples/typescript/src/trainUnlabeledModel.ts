// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This sample demonstrates how to train a custom model with unlabeled data.
 * See recognizeForm.ts to recognize forms using a custom model.
 */

import { FormTrainingClient, AzureKeyCredential, BeginTrainingPollState } from "@azure/ai-form-recognizer";

// Load the .env file if it exists
require("dotenv").config();

export async function main() {
  // You will need to set these environment variables or edit the following values
  const endpoint = process.env["FORM_RECOGNIZER_ENDPOINT"] || "<cognitive services endpoint>";
  const apiKey = process.env["FORM_RECOGNIZER_API_KEY"] || "<api key>";
  const containerSasUrl =
    process.env["UNLABELED_CONTAINER_SAS_URL"] ||
    "<url to Azure blob container storing the training documents>";

  const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));

  const poller = await trainingClient.beginTraining(containerSasUrl, false, {
    onProgress: (state: BeginTrainingPollState) => {
      console.log(`training status: ${state.status}`);
    }
  });
  const model = await poller.pollUntilDone();

  if (!model) {
    throw new Error("Expecting valid response!");
  }

  console.log(`Model ID: ${model.modelId}`);
  console.log(`Status: ${model.status}`);
  console.log(`Requested on: ${model.requestedOn}`);
  console.log(`Completed on: ${model.completedOn}`);

  if (model.submodels) {
    for (const submodel of model.submodels) {
      // since the training data is unlabeled, we are unable to return the accuracy of this model
      console.log("We have recognized the following fields");
      for (const key in submodel.fields) {
        const field = submodel.fields[key];
        console.log(`The model found field '${field.name}'`);
      }
    }
  }
  // Training document information
  if (model.trainingDocuments) {
    for (const doc of model.trainingDocuments) {
      console.log(`Document name: ${doc.documentName}`);
      console.log(`Document status: ${doc.status}`);
      console.log(`Document page count: ${doc.pageCount}`);
      console.log(`Document errors: ${(doc.errors).map(e => `error code ${e.code} '${e.message}'`).join("\n")}`);
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
