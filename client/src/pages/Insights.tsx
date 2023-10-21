import { useState, useEffect } from "react";
import { fetchEndpoint } from "@/utils/fetch";
import { Chart, ChartConfiguration } from 'chart.js/auto';

type Metric = {
  tasksCompleted: number;
  habitsKept: number;
  completion: number[];
}

export const Insights = () => {
  const user_id = 0;

  const [metrics, setMetrics] = useState<Metric>({
    tasksCompleted: 0, habitsKept: 0, completion: []
  });
  useEffect(() => {
    fetchEndpoint(`/api/metrics?id=${user_id}`, 'GET').then((data) => {
      setMetrics(data);
      drawTasksCompletedGraph();
    });
  }, []);

  const drawTasksCompletedGraph = () => {
    let min_month = 0;
    let max_month = Infinity;
    for (let i = 0; i < metrics.completion.length; i++) {
      const d = new Date(metrics.completion[i]);
      const month = d.getFullYear()*12 + d.getMonth();
      if (month < min_month) {
        min_month = month;
      }
      if (month > max_month) {
        max_month = month;
      }
    }
    if (min_month == 0 || max_month == Infinity) {
      const d = new Date();
      min_month = d.getFullYear()*12 + d.getMonth();
      max_month = d.getFullYear()*12 + d.getMonth();
    }

    const labels = [];
    const per_month = [];
    for (let i = min_month; i <= max_month; i++) {
      const year = Math.floor(i/12);
      const month = i % 12;
      const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      labels.push(`${MONTHS[month]} ${year}`);
      per_month.push(0);
    }

    for (let i = 0; i < metrics.completion.length; i++) {
      const d = new Date(metrics.completion[i]);
      const month = d.getFullYear()*12 + d.getMonth();
      per_month[month-min_month]++;
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Tasks Completed',
          data: per_month,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      }
    };

    const ctx = document.getElementById('tasksCompletedGraph') as HTMLCanvasElement;
    return new Chart(ctx, config);
  }


  return (
    <>
      <h1>Insights</h1>

      <div>
        <h2>Tasks Completed</h2>
        <p>{metrics.tasksCompleted}</p>
        <canvas id="tasksCompletedGraph" width="500" height="200"></canvas>
      </div>
      <div>
        <h2>Habits Kept</h2>
        <p>{metrics.habitsKept}</p>
      </div>
    </>
  );
};
