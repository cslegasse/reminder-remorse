import { useState, useEffect } from "react";
import { fetchEndpoint } from "@/utils/fetch";
import { Chart, ChartConfiguration } from 'chart.js/auto';

Chart.defaults.color = '#fff';
Chart.defaults.borderColor = '#fff';

type HabitMetric = {
  from: number,
  to: number
}
type Metric = {
  tasksCompleted: number;
  habitsKept: number;
  completion: number[];
  habits: HabitMetric[];
  startDate: number
}
type Transaction = {
  id: number;
  user_id: number;
  friend_id?: number;
  org_id?: number;
  amt: number;
  user?: string;
  friend?: string;
  org?: string;
}

export const Insights = () => {
  const user_id = 0;

  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [chart, setChart] = useState<Chart|null>(null);
  const [chart2, setChart2] = useState<Chart|null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionSum, setTransactionSum] = useState<number>(0);
  useEffect(() => {
    fetchEndpoint(`metrics?id=${user_id}`, 'GET').then((data) => {
      console.log(data);
      setMetrics(data);
    });
    fetchEndpoint(`transactions?id=${user_id}`, 'GET').then(async (data) => {
      console.log(data);
      let tsum = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].user_id === 0) {
          tsum -= data[i].amt;
        } else if (data[i].friend_id === 0) {
          tsum += data[i].amt;
        }
      }
      setTransactions(data);
      setTransactionSum(tsum);
    });
  }, []);

  useEffect(() => {
    console.log(metrics);
    if (metrics) {
      drawTasksCompletedGraph();
      drawHabitsKeptGraph();
    }
  }, [metrics]);

  const drawTasksCompletedGraph = () => {
    if (!metrics)
      return;
    if (chart) {
      chart.destroy();
    }
    const d_start = new Date(metrics.startDate*1000);
    const d_end = new Date();
    let min_month = d_start.getFullYear()*12 + d_start.getMonth();
    let max_month = d_end.getFullYear()*12 + d_end.getMonth();
    console.log(min_month);
    console.log(max_month);
    if (min_month == Infinity || max_month == 0) {
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
      const d = new Date(metrics.completion[i]*1000);
      const month = d.getFullYear()*12 + d.getMonth();
      per_month[month-min_month] += 1;
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Tasks Completed',
          data: per_month,
          fill: false,
          backgroundColor: 'rgb(156, 60, 231)',
          tension: 0.1,
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        layout: {
          padding: {
            top: 5
          }
        },
        scales: {
          y: {
            min: 0,
            max: Math.max(...per_month)+2
          }
        }
      }
    };

    const ctx = document.getElementById('tasksCompletedGraph') as HTMLCanvasElement;
    const c = new Chart(ctx, config);
    setChart(c);
  }

  const drawHabitsKeptGraph = () => {
    if (!metrics)
      return;
    if (chart2) {
      chart2.destroy();
    }
    const d_start = new Date(metrics.startDate*1000);
    const d_end = new Date();
    const min_week = Math.floor((metrics.startDate + d_start.getTimezoneOffset()*60) / 86400 / 7);
    const max_week = Math.floor((Date.now()/1000 + d_end.getTimezoneOffset()*60) / 86400 / 7);

    const labels: string[] = [];
    const per_week = [];
    for (let i = min_week; i <= max_week; i++) {
      const d = new Date(i * 86400 * 7 * 1000);
      const year = d.getFullYear();
      const month = d.getMonth();
      const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const label = `${MONTHS[month]} ${year}`;
      if (label !== labels[labels.length-1]
        && !(labels.length >= 2 && label == labels[labels.length-2])
        && !(labels.length >= 3 && label == labels[labels.length-3])
        && !(labels.length >= 4 && label == labels[labels.length-4]))
        labels.push(label);
      else
        labels.push('');
      per_week.push(0);
    }
    console.log(min_week);
    console.log(max_week);

    for (let i = 0; i < metrics.habits.length; i++) {
      const d0 = new Date(metrics.habits[i].from*1000);
      const week0 = Math.floor((metrics.habits[i].from + d0.getTimezoneOffset()*60) / 86400 / 7);
      const d1 = new Date(metrics.habits[i].to*1000);
      const week1 = Math.floor((metrics.habits[i].to + d1.getTimezoneOffset()*60) / 86400 / 7);
      for (let j = week0; j <= week1; j++) {
        per_week[j-min_week] += 1;
      }
      console.log(week0, week1);
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Weekly Habit Upkeep',
          data: per_week,
          fill: false,
          backgroundColor: 'rgb(156, 60, 231)',
          borderColor: 'rgb(156, 60, 231)',
          tension: 0.3,
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
        layout: {
          padding: {
            top: 5
          }
        },
        scales: {
          y: {
            min: 0,
            max: Math.max(...per_week)+1,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    const ctx = document.getElementById('habitsKeptGraph') as HTMLCanvasElement;
    const c2 = new Chart(ctx, config);
    setChart2(c2);
  }


  return (
    <>
      <h1>Insights</h1>

      <div>
        <h2>Tasks Completed</h2>
        <p>{metrics?.tasksCompleted || ''}</p>
        <canvas id="tasksCompletedGraph" width="500" height="200"></canvas>
      </div>
      <div>
        <h2>Habits Kept</h2>
        <p>{metrics?.habitsKept || ''}</p>
        <canvas id="habitsKeptGraph" width="500" height="200"></canvas>
      </div>
      <div>
        <h2>Transactions</h2>
        <p>Net amount: <b>${transactionSum}</b></p>
        {
          transactions.map((transaction) => {
            console.log(transaction);
            return (
              <p key={'t'+transaction.id}>
                {transaction.user} paid {transaction.friend || transaction.org} ${transaction.amt.toFixed(2)}
              </p>
            )
          })
        }
      </div>
    </>
  );
};
