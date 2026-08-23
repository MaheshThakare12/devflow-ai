import { Card } from '../ui/Card';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <Card className="p-6 flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-4xl font-bold mb-1">{count}</h3>
        <p className="text-slate-400 font-medium">{title}</p>
      </div>
    </Card>
  );
}
