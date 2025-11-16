import { ProcessList } from '@/components/processes/ProcessList';

export default function ProcessesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Process Management</h1>
        <p className="text-muted-foreground">View and manage running processes</p>
      </div>
      <ProcessList />
    </div>
  );
}

