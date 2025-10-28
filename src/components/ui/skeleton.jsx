import { cn } from "./utils";
import '../../styles/skeleton.css';

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton };