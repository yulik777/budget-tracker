import styles from "./DailyPulseCard.module.css";
import { DailyPulse } from "@/lib/pulseInsights";

import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";

interface DailyPulseCardProps {
  pulse: DailyPulse;
}

export default function DailyPulseCard({ pulse }: DailyPulseCardProps) {
  const trendIcon =
    pulse.weeklyTrend === "up" ? (
      <TrendingUp size={18} />
    ) : pulse.weeklyTrend === "down" ? (
      <TrendingDown size={18} />
    ) : (
      <Sparkles size={18} />
    );

  const trendLabel =
    pulse.weeklyTrend === "up"
      ? "Spending up from last week"
      : pulse.weeklyTrend === "down"
        ? "Spending down from last week"
        : "Spending stable";

  return (
    <section className={styles.pulseCard}>
      <div className={styles.pulseHeader}>
        <div>
          <h2 className={styles.pulseTitle}>Daily Pulse</h2>
          <p className={styles.pulseSubtitle}>
            A quick view of your current money momentum.
          </p>
        </div>
        <div className={styles.daysTracked}>
          {pulse.daysTracked} days tracked
        </div>
      </div>

      <div className={styles.pulseContent}>
        <div className={styles.trendRow}>
          <div className={styles.trendIndicator}>{trendIcon}</div>
          <span className={styles.trendText}>{trendLabel}</span>
        </div>

        <div className={styles.recommendationBox}>
          <div className={styles.recommendationHeader}>
            <Sparkles size={16} />
            <span>Todays insight</span>
          </div>
          <p className={styles.recommendationText}>
            {pulse.dailyRecommendation}
          </p>
        </div>
      </div>
    </section>
  );
}
