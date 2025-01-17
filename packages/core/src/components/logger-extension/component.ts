﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, ProviderMap} from '@loopback/core';
import {LOGGER} from './keys';
import {LoggerProvider} from './providers/logger.provider';

/* `The LoggerExtensionComponent` class is a component that provides a LoggerProvider */
export class LoggerExtensionComponent implements Component {
  providers: ProviderMap = {};
  constructor() {
    this.providers = {[LOGGER.BINDINGS.LOG_ACTION.key]: LoggerProvider};
  }
}
