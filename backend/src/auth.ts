import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import session from 'express-session';
import express, { Request, Response } from 'express';

export function configureAuth(app: express.Application) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: true
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done: (err: any, obj?: any) => void) => done(null, user));
  passport.deserializeUser((obj: any, done: (err: any, user?: any) => void) => done(null, obj));

  passport.use(
    new SteamStrategy(
      {
        returnURL:
          process.env.STEAM_RETURN_URL || 'http://localhost:4000/auth/steam/return',
        realm: process.env.STEAM_REALM || 'http://localhost:4000/',
        apiKey: process.env.STEAM_API_KEY!
      },
      (_identifier: string, profile: any, done: (err: any, user?: any) => void) => {
        return done(null, profile);
      }
    )
  );

  const router = express.Router();

  router.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }));

  router.get(
    '/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req: Request, res: Response) => {
      const steamId = (req.user as any).id;
      res.redirect(`${process.env.FRONTEND_URL}/?steam=${steamId}`);
    }
  );

  router.get('/logout', (req: Request, res: Response) => {
    req.logout(() => {});
    res.redirect(process.env.FRONTEND_URL!);
  });

  app.use(router);
}