﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, inject, Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {
  VerifyFunction,
  AuthenticationBindings,
  EntityWithIdentifier,
  IAuthUser,
} from 'loopback4-authentication';
import moment from 'moment-timezone';
import {ILogger, LOGGER} from '../../logger-extension';
import {IAuthUserWithPermissions} from '../keys';

/* Exporting `ServicesBearerTokenVerifyProvider` provider class 
which implements the `VerifyFunction.BearerFn` interface. */
export class ServicesBearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  /* Constructor is used to inject the logger and user model. */
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthenticationBindings.USER_MODEL, {optional: true})
    public authUserModel?: Constructor<EntityWithIdentifier & IAuthUser>,
  ) {}

  /**
   *  `VerifyFunction.BearerFn` will be called when the token is verified.
   * `user` variable that will be used to store the user information.
   * `verify()` that verifies the token.
   *  */
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      let user: IAuthUserWithPermissions;

      try {
        user = verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
          algorithms: ['HS256'],
        }) as IAuthUserWithPermissions;
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        throw new HttpErrors.Unauthorized('TokenExpired');
      }

      /* This is used to check if the password is expired or not. */
      if (
        user.passwordExpiryTime &&
        moment().isSameOrAfter(moment(user.passwordExpiryTime))
      ) {
        throw new HttpErrors.Unauthorized('PasswordExpiryError');
      }
      /* `this.authUserModel` that checks if the user model is defined or not. If it is defined, then it will
       return the user model. If it is not defined, then it will return the user. */
      if (this.authUserModel) {
        return new this.authUserModel(user);
      } else {
        return user;
      }
    };
  }
}
