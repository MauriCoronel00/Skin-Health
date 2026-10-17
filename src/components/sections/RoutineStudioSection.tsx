import { ErrorBoundary } from '../ErrorBoundary';
import { RoutineStudio } from '../RoutineStudio';

export function RoutineStudioSection() {
  return (
    <ErrorBoundary>
      <RoutineStudio />
    </ErrorBoundary>
  );
}
