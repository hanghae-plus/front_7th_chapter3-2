import { useRouter } from '@/shared/contexts';

export const PageLayout = () => {
  const { PageComponent } = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageComponent />
    </div>
  );
};
