import { Wrench } from 'lucide-react';

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="animate-bounce mb-4">
        <Wrench className="h-16 w-16 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Under Construction
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        We're working hard to bring you this feature. Please check back soon!
      </p>
    </div>
  );
};

export default UnderConstruction; 