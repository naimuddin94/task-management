import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { SummarizeRoutes } from '../modules/Summarize/summarize.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { HistoryRoutes } from '../modules/History/history.route';

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/summarize',
    route: SummarizeRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/history',
    route: HistoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
