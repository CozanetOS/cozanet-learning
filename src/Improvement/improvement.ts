import pino from "pino";

const logger = pino({ name: "ImprovementTracker" });

export interface OutcomeRecord {
  task: string;
  success: boolean;
  notes: string;
  timestamp: Date;
}

export interface ImprovementMetrics {
  totalTasks: number;
  successRate: number;
  failureRate: number;
  recentTrends: string;
}

export class ImprovementTracker {
  public readonly id = "learning:improvement";
  private records: OutcomeRecord[] = [];

  recordOutcome(task: string, success: boolean, notes: string): void {
    const record: OutcomeRecord = {
      task,
      success,
      notes,
      timestamp: new Date()
    };
    this.records.push(record);
    logger.info({ task, success }, "Outcome successfully recorded");
  }

  getSuggestions(): string[] {
    if (this.records.length === 0) {
      return ["No historical data available yet. Execute tasks to generate feedback metrics."];
    }

    const failureTasks = this.records.filter(r => !r.success);
    const suggestions: string[] = [];

    if (failureTasks.length > 0) {
      suggestions.push(`Address persistent failure modes in your last ${failureTasks.length} failed runs.`);
      const keyFailures = failureTasks.slice(-3).map(f => `"${f.task}": ${f.notes}`);
      suggestions.push(`Recent failures to debug: ${keyFailures.join(" | ")}`);
    } else {
      suggestions.push("All systems green. Keep executing standard operating routines.");
    }

    const successRate = this.records.filter(r => r.success).length / this.records.length;
    if (successRate < 0.8) {
      suggestions.push("Overall success rate is below threshold (80%). Conduct a meta-reflection cycle immediately.");
    }

    return suggestions;
  }

  getMetrics(): ImprovementMetrics {
    const total = this.records.length;
    if (total === 0) {
      return {
        totalTasks: 0,
        successRate: 0,
        failureRate: 0,
        recentTrends: "No data available."
      };
    }

    const successCount = this.records.filter(r => r.success).length;
    const successRate = successCount / total;
    const failureRate = 1 - successRate;

    let recentTrends = "Stable execution patterns.";
    const recent = this.records.slice(-5);
    const recentSuccessCount = recent.filter(r => r.success).length;
    if (recent.length > 0) {
      const ratio = recentSuccessCount / recent.length;
      if (ratio === 1) {
        recentTrends = "Optimal progress. Recent 5 tasks fully succeeded.";
      } else if (ratio < 0.5) {
        recentTrends = "Deteriorating operational safety. High recent failure rates detected.";
      } else {
        recentTrends = "Marginal or fluctuating success rates recently.";
      }
    }

    return {
      totalTasks: total,
      successRate,
      failureRate,
      recentTrends
    };
  }
}
