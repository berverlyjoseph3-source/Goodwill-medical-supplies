import toast from "react-hot-toast";
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { AccountLayout } from '../../components/account/AccountLayout';
import { prisma } from '../../lib/prisma';
import { WishlistGrid } from '../../components/account/WishlistGrid';

interface WishlistPageProps {
  wishlist: any[];
}

export default function WishlistPage({ wishlist }: WishlistPageProps) {
  return (
    <ProtectedRoute>
      <AccountLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">My Wishlist</h2>
            <p className="text-sm text-slate-500">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <WishlistGrid items={wishlist} />
        </div>
      </AccountLayout>
    </ProtectedRoute>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const wishlist = await prisma.wishlistItem.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      product: true,
    },
  });

  return {
    props: {
      wishlist: JSON.parse(JSON.stringify(wishlist.map(item => item.product))),
    },
  };
}
