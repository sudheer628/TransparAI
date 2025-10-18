// AI Concept Calculator Lambda Function for TransparAI
// Node.js 22.x Runtime
// Compatible with Amazon Bedrock Agent Action Groups

export const handler = async (event) => {
  console.log(
    "🧮 AI Calculator Event received:",
    JSON.stringify(event, null, 2)
  );

  try {
    // Extract parameters from Bedrock Agent event format
    let operation = "";
    let parameters = {};

    console.log("🔍 Parameters array:", event.parameters);

    if (event.parameters && Array.isArray(event.parameters)) {
      // Extract operation type
      const operationParam = event.parameters.find(
        (p) => p.name === "operation"
      );
      operation = operationParam?.value?.toLowerCase().trim();

      // Extract all other parameters dynamically
      event.parameters.forEach((param) => {
        if (param.name !== "operation") {
          let value = param.value;

          // Try to parse as JSON array first (for arrays like "[784, 128, 64, 10]")
          if (
            typeof value === "string" &&
            value.startsWith("[") &&
            value.endsWith("]")
          ) {
            try {
              value = JSON.parse(value);
              console.log(`✅ Parsed array parameter ${param.name}:`, value);
            } catch (e) {
              console.log(
                `⚠️ Failed to parse array ${param.name}, using as string`
              );
            }
          }
          // Try to parse as number if it's not an array
          else if (!isNaN(parseFloat(value))) {
            value = parseFloat(value);
          }

          parameters[param.name] = value;
        }
      });

      console.log("✅ Extracted operation:", operation);
      console.log("✅ Extracted parameters:", parameters);
    }

    if (!operation) {
      throw new Error("Missing required parameter: operation");
    }

    // Perform AI/ML calculations based on operation
    const result = await performAICalculation(operation, parameters);

    console.log("✅ Calculation result:", result);

    // Return in Bedrock Agent expected format
    return {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup || "ai_calculator",
        function: event.function || "calculateAIConcept",
        functionResponse: {
          responseBody: {
            TEXT: {
              body: result,
            },
          },
        },
      },
    };
  } catch (error) {
    console.error("❌ AI Calculator execution error:", error);

    return {
      messageVersion: "1.0",
      response: {
        actionGroup: event.actionGroup || "ai_calculator",
        function: event.function || "calculateAIConcept",
        functionResponse: {
          responseBody: {
            TEXT: {
              body: `Error in AI calculation: ${error.message}`,
            },
          },
        },
      },
    };
  }
};

// Main calculation function
async function performAICalculation(operation, params) {
  switch (operation) {
    case "accuracy":
      return calculateAccuracy(params);

    case "precision":
      return calculatePrecision(params);

    case "recall":
    case "sensitivity":
      return calculateRecall(params);

    case "f1_score":
    case "f1":
      return calculateF1Score(params);

    case "specificity":
      return calculateSpecificity(params);

    case "confusion_matrix_metrics":
      return calculateConfusionMatrixMetrics(params);

    case "neural_network_parameters":
    case "nn_parameters":
      return calculateNeuralNetworkParameters(params);

    case "learning_rate_decay":
      return calculateLearningRateDecay(params);

    case "cross_entropy_loss":
      return calculateCrossEntropyLoss(params);

    case "mean_squared_error":
    case "mse":
      return calculateMSE(params);

    case "r_squared":
    case "coefficient_of_determination":
      return calculateRSquared(params);

    case "gradient_descent_step":
      return calculateGradientDescentStep(params);

    case "sigmoid":
      return calculateSigmoid(params);

    case "relu":
      return calculateReLU(params);

    case "softmax":
      return calculateSoftmax(params);

    default:
      throw new Error(
        `Unknown operation: ${operation}. Available operations: accuracy, precision, recall, f1_score, specificity, confusion_matrix_metrics, neural_network_parameters, learning_rate_decay, cross_entropy_loss, mse, r_squared, gradient_descent_step, sigmoid, relu, softmax`
      );
  }
}

// Classification Metrics
function calculateAccuracy(params) {
  const {
    correct,
    total,
    true_positive,
    true_negative,
    false_positive,
    false_negative,
  } = params;

  let accuracy;
  let explanation;

  if (correct !== undefined && total !== undefined) {
    accuracy = (correct / total) * 100;
    explanation = `Accuracy = Correct Predictions / Total Predictions = ${correct} / ${total} = ${accuracy.toFixed(
      2
    )}%`;
  } else if (
    true_positive !== undefined &&
    true_negative !== undefined &&
    false_positive !== undefined &&
    false_negative !== undefined
  ) {
    const totalPredictions =
      true_positive + true_negative + false_positive + false_negative;
    accuracy = ((true_positive + true_negative) / totalPredictions) * 100;
    explanation = `Accuracy = (TP + TN) / (TP + TN + FP + FN) = (${true_positive} + ${true_negative}) / (${true_positive} + ${true_negative} + ${false_positive} + ${false_negative}) = ${accuracy.toFixed(
      2
    )}%`;
  } else {
    throw new Error(
      "For accuracy calculation, provide either (correct, total) or (true_positive, true_negative, false_positive, false_negative)"
    );
  }

  return `📊 Accuracy Calculation:
${explanation}

📚 Educational Note: Accuracy measures the overall correctness of the model. It's the ratio of correct predictions to total predictions. However, accuracy can be misleading with imbalanced datasets.`;
}

function calculatePrecision(params) {
  const { true_positive, false_positive } = params;

  if (true_positive === undefined || false_positive === undefined) {
    throw new Error(
      "For precision calculation, provide: true_positive, false_positive"
    );
  }

  if (true_positive + false_positive === 0) {
    return "📊 Precision Calculation: Undefined (no positive predictions made)";
  }

  const precision = true_positive / (true_positive + false_positive);

  return `📊 Precision Calculation:
Precision = TP / (TP + FP) = ${true_positive} / (${true_positive} + ${false_positive}) = ${precision.toFixed(
    4
  )} (${(precision * 100).toFixed(2)}%)

📚 Educational Note: Precision answers "Of all positive predictions, how many were actually correct?" High precision means low false positive rate. Important when false positives are costly.`;
}

function calculateRecall(params) {
  const { true_positive, false_negative } = params;

  if (true_positive === undefined || false_negative === undefined) {
    throw new Error(
      "For recall calculation, provide: true_positive, false_negative"
    );
  }

  if (true_positive + false_negative === 0) {
    return "📊 Recall Calculation: Undefined (no actual positive cases)";
  }

  const recall = true_positive / (true_positive + false_negative);

  return `📊 Recall (Sensitivity) Calculation:
Recall = TP / (TP + FN) = ${true_positive} / (${true_positive} + ${false_negative}) = ${recall.toFixed(
    4
  )} (${(recall * 100).toFixed(2)}%)

📚 Educational Note: Recall answers "Of all actual positive cases, how many did we correctly identify?" High recall means low false negative rate. Important when missing positives is costly (e.g., medical diagnosis).`;
}

function calculateF1Score(params) {
  const { precision, recall, true_positive, false_positive, false_negative } =
    params;

  let precisionValue, recallValue;

  if (precision !== undefined && recall !== undefined) {
    precisionValue = precision;
    recallValue = recall;
  } else if (
    true_positive !== undefined &&
    false_positive !== undefined &&
    false_negative !== undefined
  ) {
    precisionValue = true_positive / (true_positive + false_positive);
    recallValue = true_positive / (true_positive + false_negative);
  } else {
    throw new Error(
      "For F1 score calculation, provide either (precision, recall) or (true_positive, false_positive, false_negative)"
    );
  }

  if (precisionValue + recallValue === 0) {
    return "📊 F1 Score Calculation: Undefined (both precision and recall are 0)";
  }

  const f1Score =
    (2 * (precisionValue * recallValue)) / (precisionValue + recallValue);

  return `📊 F1 Score Calculation:
F1 = 2 × (Precision × Recall) / (Precision + Recall)
F1 = 2 × (${precisionValue.toFixed(4)} × ${recallValue.toFixed(
    4
  )}) / (${precisionValue.toFixed(4)} + ${recallValue.toFixed(4)})
F1 = ${f1Score.toFixed(4)} (${(f1Score * 100).toFixed(2)}%)

📚 Educational Note: F1 Score is the harmonic mean of precision and recall. It provides a single metric that balances both precision and recall. Useful when you need to balance false positives and false negatives.`;
}

function calculateSpecificity(params) {
  const { true_negative, false_positive } = params;

  if (true_negative === undefined || false_positive === undefined) {
    throw new Error(
      "For specificity calculation, provide: true_negative, false_positive"
    );
  }

  if (true_negative + false_positive === 0) {
    return "📊 Specificity Calculation: Undefined (no actual negative cases)";
  }

  const specificity = true_negative / (true_negative + false_positive);

  return `📊 Specificity Calculation:
Specificity = TN / (TN + FP) = ${true_negative} / (${true_negative} + ${false_positive}) = ${specificity.toFixed(
    4
  )} (${(specificity * 100).toFixed(2)}%)

📚 Educational Note: Specificity answers "Of all actual negative cases, how many did we correctly identify?" High specificity means low false positive rate. Also called True Negative Rate.`;
}

function calculateConfusionMatrixMetrics(params) {
  const { true_positive, true_negative, false_positive, false_negative } =
    params;

  if (
    true_positive === undefined ||
    true_negative === undefined ||
    false_positive === undefined ||
    false_negative === undefined
  ) {
    throw new Error(
      "For confusion matrix metrics, provide: true_positive, true_negative, false_positive, false_negative"
    );
  }

  const total = true_positive + true_negative + false_positive + false_negative;
  const accuracy = (true_positive + true_negative) / total;
  const precision = true_positive / (true_positive + false_positive);
  const recall = true_positive / (true_positive + false_negative);
  const specificity = true_negative / (true_negative + false_positive);
  const f1Score = (2 * (precision * recall)) / (precision + recall);

  return `📊 Complete Confusion Matrix Analysis:

Confusion Matrix:
                 Predicted
                 Pos    Neg
Actual   Pos    ${true_positive.toString().padStart(3)}    ${false_negative
    .toString()
    .padStart(3)}
         Neg    ${false_positive.toString().padStart(3)}    ${true_negative
    .toString()
    .padStart(3)}

📈 Calculated Metrics:
• Accuracy:    ${(accuracy * 100).toFixed(
    2
  )}% = (${true_positive} + ${true_negative}) / ${total}
• Precision:   ${(precision * 100).toFixed(
    2
  )}% = ${true_positive} / (${true_positive} + ${false_positive})
• Recall:      ${(recall * 100).toFixed(
    2
  )}% = ${true_positive} / (${true_positive} + ${false_negative})
• Specificity: ${(specificity * 100).toFixed(
    2
  )}% = ${true_negative} / (${true_negative} + ${false_positive})
• F1 Score:    ${(f1Score * 100).toFixed(
    2
  )}% = 2 × (Precision × Recall) / (Precision + Recall)

📚 Educational Note: This complete analysis shows all key classification metrics from your confusion matrix. Each metric tells a different story about your model's performance.`;
}

// Neural Network Calculations
function calculateNeuralNetworkParameters(params) {
  const { layers } = params;

  if (!layers || !Array.isArray(layers)) {
    throw new Error(
      "For neural network parameters, provide layers as array: [input_size, hidden1_size, hidden2_size, ..., output_size]"
    );
  }

  if (layers.length < 2) {
    throw new Error(
      "Neural network must have at least 2 layers (input and output)"
    );
  }

  let totalParameters = 0;
  let layerDetails = [];

  for (let i = 0; i < layers.length - 1; i++) {
    const currentLayer = layers[i];
    const nextLayer = layers[i + 1];

    // Weights: current_layer_size × next_layer_size
    const weights = currentLayer * nextLayer;
    // Biases: next_layer_size
    const biases = nextLayer;
    const layerParams = weights + biases;

    totalParameters += layerParams;
    layerDetails.push(
      `Layer ${i + 1} → ${
        i + 2
      }: ${currentLayer} × ${nextLayer} + ${nextLayer} = ${layerParams} parameters`
    );
  }

  return `🧠 Neural Network Parameter Calculation:

Network Architecture: ${layers.join(" → ")}

📊 Layer-by-layer breakdown:
${layerDetails.join("\n")}

🔢 Total Parameters: ${totalParameters.toLocaleString()}

📚 Educational Note: Each connection between neurons has a weight parameter, and each neuron (except input) has a bias parameter. Formula: (input_size × output_size) + output_size for each layer transition.`;
}

// Loss Functions
function calculateCrossEntropyLoss(params) {
  let { predicted_probabilities, true_labels } = params;

  // Parse arrays if they come as strings
  if (typeof predicted_probabilities === "string") {
    predicted_probabilities = JSON.parse(predicted_probabilities);
  }
  if (typeof true_labels === "string") {
    true_labels = JSON.parse(true_labels);
  }

  if (!predicted_probabilities || !true_labels) {
    throw new Error(
      "For cross-entropy loss, provide: predicted_probabilities (array), true_labels (array)"
    );
  }

  if (predicted_probabilities.length !== true_labels.length) {
    throw new Error(
      "Predicted probabilities and true labels must have the same length"
    );
  }

  let loss = 0;
  const n = predicted_probabilities.length;

  for (let i = 0; i < n; i++) {
    const pred = Math.max(predicted_probabilities[i], 1e-15); // Avoid log(0)
    loss += -true_labels[i] * Math.log(pred);
  }

  const avgLoss = loss / n;

  return `📉 Cross-Entropy Loss Calculation:

Loss = -Σ(y_true × log(y_pred)) / n
Loss = ${avgLoss.toFixed(6)}

📊 Sample-by-sample breakdown:
${predicted_probabilities
  .map(
    (pred, i) =>
      `Sample ${i + 1}: -${true_labels[i]} × log(${pred.toFixed(4)}) = ${(
        -true_labels[i] * Math.log(Math.max(pred, 1e-15))
      ).toFixed(6)}`
  )
  .join("\n")}

📚 Educational Note: Cross-entropy loss measures the difference between predicted probability distribution and true distribution. Lower values indicate better predictions. Commonly used for classification tasks.`;
}

function calculateMSE(params) {
  let { predicted_values, true_values } = params;

  // Parse arrays if they come as strings
  if (typeof predicted_values === "string") {
    predicted_values = JSON.parse(predicted_values);
  }
  if (typeof true_values === "string") {
    true_values = JSON.parse(true_values);
  }

  if (!predicted_values || !true_values) {
    throw new Error(
      "For MSE calculation, provide: predicted_values (array), true_values (array)"
    );
  }

  if (predicted_values.length !== true_values.length) {
    throw new Error(
      "Predicted values and true values must have the same length"
    );
  }

  let sumSquaredErrors = 0;
  const n = predicted_values.length;

  for (let i = 0; i < n; i++) {
    const error = predicted_values[i] - true_values[i];
    sumSquaredErrors += error * error;
  }

  const mse = sumSquaredErrors / n;
  const rmse = Math.sqrt(mse);

  return `📉 Mean Squared Error (MSE) Calculation:

MSE = Σ(y_pred - y_true)² / n
MSE = ${mse.toFixed(6)}
RMSE = √MSE = ${rmse.toFixed(6)}

📊 Sample-by-sample breakdown:
${predicted_values
  .map(
    (pred, i) =>
      `Sample ${i + 1}: (${pred} - ${true_values[i]})² = ${Math.pow(
        pred - true_values[i],
        2
      ).toFixed(6)}`
  )
  .join("\n")}

📚 Educational Note: MSE measures average squared differences between predictions and actual values. RMSE is in the same units as your target variable. Lower values indicate better predictions.`;
}

// Activation Functions
function calculateSigmoid(params) {
  let { x } = params;

  // Parse array if it comes as string
  if (typeof x === "string" && x.startsWith("[") && x.endsWith("]")) {
    x = JSON.parse(x);
  }

  if (x === undefined) {
    throw new Error("For sigmoid calculation, provide: x (number or array)");
  }

  if (Array.isArray(x)) {
    const results = x.map((val) => 1 / (1 + Math.exp(-val)));
    return `🔢 Sigmoid Function Calculation:

σ(x) = 1 / (1 + e^(-x))

Results:
${x
  .map(
    (val, i) => `σ(${val}) = 1 / (1 + e^(-${val})) = ${results[i].toFixed(6)}`
  )
  .join("\n")}

📚 Educational Note: Sigmoid function maps any real number to (0,1), making it useful for binary classification. It's smooth and differentiable, but can suffer from vanishing gradients.`;
  } else {
    const result = 1 / (1 + Math.exp(-x));
    return `🔢 Sigmoid Function Calculation:

σ(${x}) = 1 / (1 + e^(-${x})) = ${result.toFixed(6)}

📚 Educational Note: Sigmoid function maps any real number to (0,1), making it useful for binary classification and as an activation function in neural networks.`;
  }
}

function calculateReLU(params) {
  let { x } = params;

  // Parse array if it comes as string
  if (typeof x === "string" && x.startsWith("[") && x.endsWith("]")) {
    x = JSON.parse(x);
  }

  if (x === undefined) {
    throw new Error("For ReLU calculation, provide: x (number or array)");
  }

  if (Array.isArray(x)) {
    const results = x.map((val) => Math.max(0, val));
    return `🔢 ReLU (Rectified Linear Unit) Calculation:

ReLU(x) = max(0, x)

Results:
${x.map((val, i) => `ReLU(${val}) = max(0, ${val}) = ${results[i]}`).join("\n")}

📚 Educational Note: ReLU is the most popular activation function in deep learning. It's computationally efficient and helps mitigate vanishing gradient problems, but can suffer from "dying ReLU" problem.`;
  } else {
    const result = Math.max(0, x);
    return `🔢 ReLU (Rectified Linear Unit) Calculation:

ReLU(${x}) = max(0, ${x}) = ${result}

📚 Educational Note: ReLU activation function outputs the input if positive, otherwise zero. Simple, efficient, and widely used in deep learning.`;
  }
}

function calculateSoftmax(params) {
  let { x } = params;

  // Parse array if it comes as string
  if (typeof x === "string" && x.startsWith("[") && x.endsWith("]")) {
    x = JSON.parse(x);
  }

  if (!Array.isArray(x)) {
    throw new Error("For softmax calculation, provide: x (array of numbers)");
  }

  // Subtract max for numerical stability
  const maxVal = Math.max(...x);
  const expValues = x.map((val) => Math.exp(val - maxVal));
  const sumExp = expValues.reduce((sum, val) => sum + val, 0);
  const softmaxValues = expValues.map((val) => val / sumExp);

  return `🔢 Softmax Function Calculation:

Softmax(x_i) = e^(x_i - max(x)) / Σe^(x_j - max(x))

Input: [${x.join(", ")}]
Max value: ${maxVal}

Step-by-step:
${x
  .map(
    (val, i) =>
      `e^(${val} - ${maxVal}) = e^${(val - maxVal).toFixed(2)} = ${expValues[
        i
      ].toFixed(6)}`
  )
  .join("\n")}

Sum of exponentials: ${sumExp.toFixed(6)}

Final probabilities:
${softmaxValues
  .map(
    (val, i) => `P(class_${i}) = ${val.toFixed(6)} (${(val * 100).toFixed(2)}%)`
  )
  .join("\n")}

Sum check: ${softmaxValues.reduce((sum, val) => sum + val, 0).toFixed(6)} ≈ 1.0

📚 Educational Note: Softmax converts a vector of real numbers into a probability distribution. Each output is between 0 and 1, and all outputs sum to 1. Commonly used in multi-class classification.`;
}

// Learning Rate and Optimization
function calculateLearningRateDecay(params) {
  const { initial_lr, decay_rate, epoch, decay_type = "exponential" } = params;

  if (
    initial_lr === undefined ||
    decay_rate === undefined ||
    epoch === undefined
  ) {
    throw new Error(
      "For learning rate decay, provide: initial_lr, decay_rate, epoch"
    );
  }

  let currentLR;
  let formula;

  switch (decay_type.toLowerCase()) {
    case "exponential":
      currentLR = initial_lr * Math.pow(decay_rate, epoch);
      formula = `LR = initial_lr × decay_rate^epoch = ${initial_lr} × ${decay_rate}^${epoch}`;
      break;
    case "linear":
      currentLR = initial_lr * (1 - decay_rate * epoch);
      formula = `LR = initial_lr × (1 - decay_rate × epoch) = ${initial_lr} × (1 - ${decay_rate} × ${epoch})`;
      break;
    case "step":
      const step_size = params.step_size || 10;
      currentLR =
        initial_lr * Math.pow(decay_rate, Math.floor(epoch / step_size));
      formula = `LR = initial_lr × decay_rate^floor(epoch/step_size) = ${initial_lr} × ${decay_rate}^${Math.floor(
        epoch / step_size
      )}`;
      break;
    default:
      throw new Error("Decay type must be: exponential, linear, or step");
  }

  return `📉 Learning Rate Decay Calculation:

Decay Type: ${decay_type}
${formula} = ${currentLR.toFixed(8)}

📊 Learning Rate Schedule:
Initial LR: ${initial_lr}
Current LR (epoch ${epoch}): ${currentLR.toFixed(8)}
Reduction: ${((1 - currentLR / initial_lr) * 100).toFixed(2)}%

📚 Educational Note: Learning rate decay helps models converge better by reducing the learning rate over time. This allows for larger steps early in training and fine-tuning later.`;
}

function calculateGradientDescentStep(params) {
  const { current_weight, gradient, learning_rate } = params;

  if (
    current_weight === undefined ||
    gradient === undefined ||
    learning_rate === undefined
  ) {
    throw new Error(
      "For gradient descent step, provide: current_weight, gradient, learning_rate"
    );
  }

  const newWeight = current_weight - learning_rate * gradient;
  const weightChange = newWeight - current_weight;

  return `⬇️ Gradient Descent Step Calculation:

Formula: w_new = w_current - learning_rate × gradient

Current weight: ${current_weight}
Gradient: ${gradient}
Learning rate: ${learning_rate}

New weight: ${current_weight} - ${learning_rate} × ${gradient} = ${newWeight.toFixed(
    6
  )}
Weight change: ${weightChange.toFixed(6)}

📚 Educational Note: Gradient descent updates weights in the opposite direction of the gradient to minimize the loss function. The learning rate controls the step size.`;
}

function calculateRSquared(params) {
  let { predicted_values, true_values } = params;

  // Parse arrays if they come as strings
  if (typeof predicted_values === "string") {
    predicted_values = JSON.parse(predicted_values);
  }
  if (typeof true_values === "string") {
    true_values = JSON.parse(true_values);
  }

  if (!predicted_values || !true_values) {
    throw new Error(
      "For R² calculation, provide: predicted_values (array), true_values (array)"
    );
  }

  if (predicted_values.length !== true_values.length) {
    throw new Error(
      "Predicted values and true values must have the same length"
    );
  }

  const n = true_values.length;
  const meanTrue = true_values.reduce((sum, val) => sum + val, 0) / n;

  let ssRes = 0; // Sum of squares of residuals
  let ssTot = 0; // Total sum of squares

  for (let i = 0; i < n; i++) {
    ssRes += Math.pow(true_values[i] - predicted_values[i], 2);
    ssTot += Math.pow(true_values[i] - meanTrue, 2);
  }

  const rSquared = 1 - ssRes / ssTot;

  return `📊 R² (Coefficient of Determination) Calculation:

R² = 1 - (SS_res / SS_tot)
R² = 1 - (${ssRes.toFixed(6)} / ${ssTot.toFixed(6)}) = ${rSquared.toFixed(6)}

📈 Interpretation:
• R² = ${rSquared.toFixed(4)} means ${(rSquared * 100).toFixed(
    2
  )}% of variance is explained by the model
• Mean of true values: ${meanTrue.toFixed(4)}
• Sum of squared residuals: ${ssRes.toFixed(6)}
• Total sum of squares: ${ssTot.toFixed(6)}

📚 Educational Note: R² measures how well the model explains the variability in the data. Values closer to 1 indicate better fit. R² = 1 means perfect prediction, R² = 0 means the model is no better than predicting the mean.`;
}
