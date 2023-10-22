import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { fetchEndpoint } from '@/utils/fetch';

import { TaskCard } from '@/components/Task/TaskCard';

type Task = {
  "category": string;
  "completed": boolean;
  "completed_at": number;
  "created_at": number;
  "deadline": number;
  "desc": string;
  "emoji": string;
  "failed": boolean;
  "friend_id": string;
  "habit_frequency": number;
  "id": number;
  "incentive_max": number,
  "incentive_min": number,
  "name": string,
  "owner_id": number,
  "pinned": boolean,
  "charge": number,
}

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentMisses, setRecentMisses] = useState<Task[]>([]);

  useEffect(() => {
    fetchEndpoint('overdue-reminders?id=0', 'GET').then((data) => {

      console.log(data);
      if (data.overdue_reminders.length > 0) {
        setRecentMisses(data.overdue_reminders);
        toast.error(
          <div>
            You missed <b>{data.overdue_reminders.length}</b> tasks,
            losing {data.charge.toFixed(2) * .001} ETH in total. 😢
          </div>
        );
      }

      fetchEndpoint('reminders?id=0', 'GET').then((data) => {
        setTasks(data.sort((a: Task, b: Task) => {
          if (a.deadline > b.deadline) {
            return -1;
          } else if (a.deadline < b.deadline) {
            return 1;
          } else {
            return 0;
          }
        }));
        console.log(data);
      });

    }).catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h1>Tasks</h1>

      {recentMisses.length > 0 ?
        <>
          <h2>Just Missed 😢</h2>
          <ul>
            {recentMisses.map((task) => (
              <li key={task.id}>
                {task.emoji} {task.name}
              </li>
            ))}
          </ul>
        </>
        : <></>
      }

      <h2>To-Do</h2>
      <ul>
        {tasks.slice().reverse().map((task) => (
          task.completed || !task.pinned || Date.now() > task.deadline * 1000 ? <></>
            :
            <TaskCard task={task} />
          // <li key={task.id}>
          //   📌{task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Do by {formatDate(task.deadline)}
          //   {task.habit_frequency > 0 ? <><br />Habit: {formatInterval(task.habit_frequency)}</> : <></>}
          // </li>
        ))}
      </ul>

      <ul>
        {tasks.slice().reverse().map((task) => (
          task.completed || task.pinned || Date.now() > task.deadline * 1000 ? <></>
            :
            <TaskCard task={task} />
          // <li key={task.id}>
          //   {task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Do by {formatDate(task.deadline)}
          //   {task.habit_frequency > 0 ? <><br />Habit: {formatInterval(task.habit_frequency)}</> : <></>}
          // </li>
        ))}
      </ul>

      <h2>Completed</h2>
      <ul>
        {tasks.map((task) => (
          task.completed &&
          <TaskCard task={task} />
          // <li key={task.id}>
          //   {task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Finished {formatDate(task.completed_at, false)}
          // </li>
          // :
          // <></>
        ))
        }
      </ul>

      <h2>Missed</h2>
      <ul>
        {tasks.map((task) => (
          task.completed || Date.now() < task.deadline * 1000 ? <></>
            :
            <TaskCard task={{ ...task, failed: true }} />

          // <li key={task.id}>
          //   {task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Supposed to do by {formatDate(task.deadline, false)}
          // </li>
        ))}
      </ul>
    </>
  );
};
