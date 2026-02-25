import { withAuth } from 'next-auth/middleware';

// Use withAuth so we can ensure users are redirected to our custom login page
// NextAuth will automatically append a safe callbackUrl back to the originally requested path
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/profile/:path*', '/checkout'],
};
