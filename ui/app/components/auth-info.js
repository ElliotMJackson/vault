import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { computed } from '@ember/object';

export default Component.extend({
  auth: service(),
  wizard: service(),
  router: service(),
  version: service(),

  transitionToRoute: function() {
    this.router.transitionTo(...arguments);
  },

  classNames: 'user-menu auth-info',

  isRenewing: or('fakeRenew', 'auth.isRenewing'),

  canExpire: computed.alias('auth.allowExpiration'),

  isOSS: computed.alias('version.isOSS'),

  actions: {
    restartGuide() {
      this.wizard.restartGuide();
    },
    renewToken() {
      this.set('fakeRenew', true);
      run.later(() => {
        this.set('fakeRenew', false);
        this.auth.renew();
      }, 200);
    },

    revokeToken() {
      this.auth.revokeCurrentToken().then(() => {
        this.transitionToRoute('vault.cluster.logout');
      });
    },
  },
});
