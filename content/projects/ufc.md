# MLexperiment: UFC Fight Outcome Prediction with ML.NET

A machine learning system that predicts UFC fight outcomes (Red corner vs Blue corner) using binary classification on differential fighter statistics. Built with [ML.NET](https://dotnet.microsoft.com/en-us/apps/machinelearning-ai/ml-dotnet) and .NET 8.0.

## Table of Contents

- [Data Source](#data-source)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [ML Pipeline](#ml-pipeline)
- [EloBuilder Tool](#elobuilder-tool)
- [Adding a New Trainer](#adding-a-new-trainer)
- [Example Output](#example-output)
- [License](#license)

## Data Source

[UFC Complete Dataset (1996-2024) on Kaggle](https://www.kaggle.com/datasets/maksbasher/ufc-complete-dataset-all-events-1996-2024)

Download the CSV and place it at `src/Data/large_dataset.csv`. This path is gitignored.

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- The Kaggle dataset CSV (see above)

## Getting Started

```bash
# Restore dependencies
dotnet restore src/MLexperiment.sln

# Build the full solution (main project + EloBuilder tool)
dotnet build src/MLexperiment.sln

# Run training and prediction (uses src/Data/large_dataset.csv by default)
dotnet run --project src/MLexperiment.csproj

# Or specify a custom dataset path
dotnet run --project src/MLexperiment.csproj -- /path/to/dataset.csv
```

## Project Structure

```
UFC_Match_Prediction/
├── src/
│   ├── Common/
│   │   ├── ITrainerBase.cs          # Trainer interface (Fit, Evaluate, Save)
│   │   └── TrainerBase.cs           # Abstract base: pipeline, feature engineering, metrics
│   ├── Data/                        # CSV datasets (gitignored)
│   ├── DataModels/
│   │   ├── UFCMatchData.cs          # Input schema — maps CSV columns via [LoadColumn]
│   │   └── UFCMatchPredictions.cs   # Output schema — PredictedLabel (bool)
│   ├── Predictors/
│   │   └── Predictor.cs             # Loads a saved .mdl file and runs inference
│   ├── Trainers/
│   │   └── RandomForestTrainer.cs   # FastForest with configurable leaves/trees
│   ├── MLexperiment.csproj          # Main project (Microsoft.ML 4.0.2)
│   ├── MLexperiment.sln
│   └── Program.cs                   # Entry point: configure trainers, train, evaluate, predict
└── tools/
    └── EloBuilder/
        ├── EloBuilder.csproj        # CLI tool (CsvHelper 33.1.0)
        └── Program.cs               # Computes per-fighter Elo ratings from fight history
```

## Architecture

The project uses a **Strategy + Template Method** pattern to keep ML algorithm implementations minimal while centralizing the shared pipeline logic.

```
ITrainerBase (interface)
  │  Fit(), Evaluate(), Save(), PrintModelMetrics(), Name, ModelPath
  │
  └── TrainerBase<TParameters> (abstract)
        │  Owns: MLContext, data split, pipeline construction, model I/O
        │  Subclasses only set Name and _model in their constructor
        │
        └── RandomForestTrainer (concrete)
              Sets _model = FastForest(numberOfLeaves, numberOfTrees)
```

**Predictor** is a separate class that loads a saved `.mdl` file by path and exposes a `Predict(UFCMatchData)` method. It does not retrain.

**Model files** are saved with trainer-specific names derived from the trainer's `Name` property. For example, `RandomForestTrainer(32, 200)` saves to `rf_32_leaves_200_trees.mdl`. This means multiple trainer configurations can be compared side-by-side without overwriting each other.

## ML Pipeline

The pipeline executes inside `TrainerBase.Fit()` and proceeds through these stages:

1. **Load** -- Read CSV via `LoadFromTextFile<UFCMatchData>` with column mappings defined by `[LoadColumn]` attributes
2. **Split** -- 70/30 train/test split
3. **Feature engineering:**
   - One-hot encode `Weight_Class` and `Gender`
   - Map `Winner` ("Red"/"Blue") to boolean `Label`
   - Convert `Is_Title_Bout` (bool) to float
4. **Concatenate** all features into a single `Features` vector
5. **Normalize** with MinMax scaling
6. **Cache** the processed data
7. **Train** by appending the trainer estimator and calling `Fit` on the training set

### Features Used

The model uses **differential statistics** (Red minus Blue) to avoid encoding absolute values:

| Feature | Description |
|---------|-------------|
| `Weight_Class` | One-hot encoded weight division |
| `Gender` | One-hot encoded (Male/Female) |
| `Is_Title_Bout` | Whether the fight is a title bout |
| `Wins_Total_Diff` | Win count difference |
| `Losses_Total_Diff` | Loss count difference |
| `Age_Diff` | Age difference |
| `Height_Diff` | Height difference |
| `Weight_Diff` | Weight difference |
| `Reach_Diff` | Reach difference |
| `TD_Def_Diff` | Takedown defense difference |
| `Sub_Diff` | Submission average difference |
| `TD_Diff` | Takedown average difference |

### Evaluation Metrics

After training, the system prints binary classification metrics:

- **F1 Score** -- Harmonic mean of precision and recall
- **Accuracy** -- Overall correct prediction rate
- **Positive/Negative Precision** -- Precision per class (Red/Blue)
- **Positive/Negative Recall** -- Recall per class
- **AUPRC** -- Area Under Precision-Recall Curve

All training uses `MLContext(seed: 42)` for reproducibility.

## EloBuilder Tool

A standalone CLI tool that computes [Elo ratings](https://en.wikipedia.org/wiki/Elo_rating_system) for every fighter in the dataset. It reads the CSV in chronological order, tracks per-fighter ratings, and outputs a new CSV with three appended columns.

```bash
# Basic usage (outputs large_dataset_with_elo.csv alongside the input)
dotnet run --project tools/EloBuilder/EloBuilder.csproj -- src/Data/large_dataset.csv

# Specify output path
dotnet run --project tools/EloBuilder/EloBuilder.csproj -- input.csv output.csv
```

**Output columns:**

| Column | Description |
|--------|-------------|
| `r_elo` | Red corner's Elo rating *before* the fight |
| `b_elo` | Blue corner's Elo rating *before* the fight |
| `elo_diff` | `r_elo - b_elo` |

**Algorithm details:**
- Starting Elo: 1500
- K-factor: 32
- Formula: `E = 1 / (1 + 10^((Rb - Ra) / 400))`
- Wins score 1.0, losses 0.0, draws 0.5

Ratings are recorded *before* the fight to avoid data leakage, making the output safe to use as training features.

## Adding a New Trainer

The architecture is designed so that new ML algorithms require minimal code:

1. Create a new file in `src/Trainers/` (e.g., `LightGbmTrainer.cs`)
2. Extend `TrainerBase<TParameters>` with the appropriate parameter type
3. In the constructor, set `Name` and assign `_model` to an ML.NET trainer estimator

```csharp
using Microsoft.ML.Trainers.LightGbm;
using MLexperiment.Common;

namespace MLexperiment.Trainers
{
    public class LightGbmTrainer : TrainerBase<LightGbmBinaryModelParameters>
    {
        public LightGbmTrainer(int numberOfLeaves, int numberOfIterations) : base()
        {
            Name = $"LightGBM ({numberOfLeaves} leaves, {numberOfIterations} iterations)";
            _model = _mlContext.BinaryClassification.Trainers.LightGbm(
                numberOfLeaves: numberOfLeaves,
                numberOfIterations: numberOfIterations);
        }
    }
}
```

That's it. `Fit()`, `Evaluate()`, `Save()`, and `PrintModelMetrics()` are all inherited. The model file will be saved with a unique name derived from `Name`.

