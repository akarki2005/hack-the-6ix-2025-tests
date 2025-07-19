import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function Page() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('completedTasks');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  const priorityStyles = {
    High: 'bg-red-500 text-white',
    Medium: 'bg-yellow-500 text-white',
    Low: 'bg-green-500 text-white',
  };

  const priorityWeight = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const sortedCompleted = [...completedTasks].sort(
    (a, b) =>
      priorityWeight[a.priority ?? 'Low'] - priorityWeight[b.priority ?? 'Low'],
  );

  const filteredCompleted = sortedCompleted.filter((task) =>
    task.text.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Completed Tasks</h1>
            <Button onClick={() => router.push('/')} variant="outline">
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Completed</h2>
            <Badge variant="secondary">{filteredCompleted.length}</Badge>
          </div>

          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search completed tasks..."
          />

          <Separator />

          {completedTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No completed tasks yet.
            </p>
          ) : filteredCompleted.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No completed tasks match your search.
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredCompleted.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-md border-l-4 border-green-500"
                >
                  <Badge className={priorityStyles[task.priority ?? 'Low']}>
                    {task.priority ?? 'Low'}
                  </Badge>
                  <span className="line-through">{task.text}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
