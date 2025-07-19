import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Page() {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedTasks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [newTask, setNewTask] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompleted = localStorage.getItem('completedTasks');
    console.log(savedTasks, savedCompleted);
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim() }]);
      setNewTask('');
    }
  };

  const completeTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setCompletedTasks([...completedTasks, task]);
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Todo List</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a new task..."
            />
            <Button onClick={addTask}>Add</Button>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">Incomplete Tasks</h2>
              <Badge variant="secondary">{tasks.length}</Badge>
            </div>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No tasks yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <span>{task.text}</span>
                    <Button
                      onClick={() => completeTask(task.id)}
                      size="sm"
                      variant="default"
                    >
                      Complete
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Separator />

          <div className="text-center">
            <Button
              onClick={() => router.push('/completed')}
              variant="outline"
              className="flex items-center gap-2"
            >
              View Completed Tasks
              <Badge variant="secondary">{completedTasks.length}</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
