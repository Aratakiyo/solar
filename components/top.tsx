import { ArrowCircleUpIcon } from '@heroicons/react/outline';
import Link from 'next/link';

function Top() {
  return (
    <Link href="#">
      <div className="fixed bottom-10 left-10 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-300">
        <ArrowCircleUpIcon className="headerIcon h-8 w-8" />
      </div>
    </Link>
  );
}

export default Top;
