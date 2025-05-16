export const paths = {
  auth: {
    signup: {
      path: '/signup',
      getHref: (redirectTo?: string | null | undefined) =>
        `/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
    },
    login: {
      path: '/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
    }
  },
  app: {
    dashboard: {
      path: '/dashboard',
      getHref: () => '/dashboard'
    },
    income: {
      path: '/income',
      category: '/category/income',
      getHref: () => '/income'
    },
    expense: {
      path: '/expense',
      category: '/category/expense',
      getHref: () => '/expense'
    },
    budget: {
      path: '/budget',
      getHref: () => '/budget'
    }
  }
} as const;
