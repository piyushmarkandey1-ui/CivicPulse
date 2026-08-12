import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, className, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 py-12 md:py-16",
        "glass border border-white/[0.07] rounded-2xl",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-6 text-2xl border border-white/[0.08]">
        {icon || "📭"}
      </div>
      <h3 className="text-h3 text-white mb-2">{title}</h3>
      <p className="text-body-sm text-text-muted max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
