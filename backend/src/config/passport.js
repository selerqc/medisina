import { Strategy as LocalStrategy } from 'passport-local';
import User from '#modules/auth/auth.model.js';
import passport from 'passport';

export function initializePassport() {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email, isDeleted: false });
      if (!user) {
        return done(null, false, { message: 'Account not found, please sign up.' });
      }
      if (user.isAccountLocked()) {
        return done(null, false, {
          message: 'Account temporarily for 15 minutes, locked due to multiple failed login attempts. Please try again later or reset your password.'
        });
      }
      const isMatch = await user.isPasswordMatch(password);
      if (!isMatch) {
        await user.incrementFailedLogins();
        return done(null, false, { message: 'Password Incorrect' });
      }
     

      if (user.status === 'Pending') {
        return done(null, false, {
          message: 'Your account is pending approval. Please contact administration.'
        });
      }
      else if (user.status === 'Rejected' || user.isDeleted) {
        return done(null, false, {
          message: 'Your account has been deactivated. Please contact administration.'
        });
      }



      await user.resetFailedLogins();

      user.lastLoginAt = Date.now();
      await user.save();
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  passport.use('local', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (err) {
      return done(err);
    }
  });
};

