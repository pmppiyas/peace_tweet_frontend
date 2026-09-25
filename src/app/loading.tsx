import { Container } from '@/components/layout/Container';
import { FeedSkeleton } from '@/features/feed/components/FeedSkeleton';

export default function Loading() {
  return (
    <Container className="py-8">
      <FeedSkeleton />
    </Container>
  );
}
