import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[rgb(var(--bg-tertiary))] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[rgb(var(--accent-primary))]" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[rgb(var(--text-muted))] max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
