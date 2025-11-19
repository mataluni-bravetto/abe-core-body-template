/**
 * Unit Tests for Subscription Service Module
 */

import { testRunner } from './test-runner.js';

const { test, assert, assertEqual, assertNotEqual, assertTrue, assertFalse, assertThrows } =
  testRunner;

/**
 * Test SubscriptionService Class
 */
test('SubscriptionService constructor initializes correctly', () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  assertTrue(subscriptionService.gateway === mockGateway, 'Gateway should be set');
  assertTrue(subscriptionService.cache, 'Cache should be initialized');
  assertEqual(subscriptionService.cache.cacheTTL, 5 * 60 * 1000, 'Cache TTL should be 5 minutes');
});

test('SubscriptionService getDefaultSubscription returns free tier', () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);
  const defaultSub = subscriptionService.getDefaultSubscription();

  assertEqual(defaultSub.tier, 'free', 'Default tier should be free');
  assertEqual(defaultSub.status, 'active', 'Default status should be active');
  assertTrue(defaultSub.billing_period === null, 'Default billing period should be null');
});

test('SubscriptionService getDefaultUsage returns unlimited', () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);
  const defaultUsage = subscriptionService.getDefaultUsage();

  assertEqual(defaultUsage.requests_made, 0, 'Default requests made should be 0');
  assertTrue(
    defaultUsage.requests_limit === null,
    'Default requests limit should be null (unlimited)'
  );
  assertEqual(defaultUsage.usage_percentage, 0, 'Default usage percentage should be 0');
});

test('SubscriptionService getTierDisplayName formats correctly', () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  assertEqual(
    subscriptionService.getTierDisplayName('free'),
    'Free',
    'Free tier should format correctly'
  );
  assertEqual(
    subscriptionService.getTierDisplayName('pro'),
    'Pro',
    'Pro tier should format correctly'
  );
  assertEqual(
    subscriptionService.getTierDisplayName('enterprise'),
    'Enterprise',
    'Enterprise tier should format correctly'
  );
  assertEqual(
    subscriptionService.getTierDisplayName('unknown'),
    'unknown',
    'Unknown tier should return as-is'
  );
});

test('SubscriptionService getStatusDisplayName formats correctly', () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  assertEqual(
    subscriptionService.getStatusDisplayName('active'),
    'Active',
    'Active status should format correctly'
  );
  assertEqual(
    subscriptionService.getStatusDisplayName('cancelled'),
    'Cancelled',
    'Cancelled status should format correctly'
  );
  assertEqual(
    subscriptionService.getStatusDisplayName('expired'),
    'Expired',
    'Expired status should format correctly'
  );
  assertEqual(
    subscriptionService.getStatusDisplayName('trialing'),
    'Trial',
    'Trialing status should format correctly'
  );
});

test('SubscriptionService clearCache resets cache', () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  // Populate cache
  subscriptionService.cache.subscription = { tier: 'pro', status: 'active' };
  subscriptionService.cache.usage = { requests_made: 10 };
  subscriptionService.cache.lastCheck = Date.now();

  // Clear cache
  subscriptionService.clearCache();

  assertTrue(
    subscriptionService.cache.subscription === null,
    'Subscription cache should be cleared'
  );
  assertTrue(subscriptionService.cache.usage === null, 'Usage cache should be cleared');
  assertTrue(subscriptionService.cache.lastCheck === null, 'Last check cache should be cleared');
});

test('SubscriptionService canMakeRequest returns default for free tier', async () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  // Mock getCurrentSubscription to return free tier
  subscriptionService.getCurrentSubscription = async () => ({
    tier: 'free',
    status: 'active',
    billing_period: null,
  });

  // Mock getUsage to return default
  subscriptionService.getUsage = async () => ({
    requests_made: 0,
    requests_limit: null,
    usage_percentage: 0,
    remaining_requests: null,
  });

  const result = await subscriptionService.canMakeRequest();

  assertTrue(result.allowed, 'Free tier should be allowed');
  assertEqual(result.subscription.tier, 'free', 'Subscription tier should be free');
});

test('SubscriptionService canMakeRequest blocks when subscription inactive', async () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  // Mock getCurrentSubscription to return expired subscription
  subscriptionService.getCurrentSubscription = async () => ({
    tier: 'pro',
    status: 'expired',
    billing_period: 'monthly',
  });

  const result = await subscriptionService.canMakeRequest();

  assertFalse(result.allowed, 'Expired subscription should not be allowed');
  assertEqual(result.reason, 'subscription_inactive', 'Reason should be subscription_inactive');
  assertTrue(result.message.includes('expired'), 'Message should mention expired');
});

test('SubscriptionService canMakeRequest blocks when usage limit exceeded', async () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  // Mock getCurrentSubscription to return active pro tier
  subscriptionService.getCurrentSubscription = async () => ({
    tier: 'pro',
    status: 'active',
    billing_period: 'monthly',
  });

  // Mock getUsage to return exceeded limit
  subscriptionService.getUsage = async () => ({
    requests_made: 1000,
    requests_limit: 1000,
    usage_percentage: 100,
    remaining_requests: 0,
  });

  const result = await subscriptionService.canMakeRequest();

  assertFalse(result.allowed, 'Exceeded usage should not be allowed');
  assertEqual(result.reason, 'usage_limit_exceeded', 'Reason should be usage_limit_exceeded');
});

test('SubscriptionService canMakeRequest warns when approaching limit', async () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  // Mock getCurrentSubscription to return active pro tier
  subscriptionService.getCurrentSubscription = async () => ({
    tier: 'pro',
    status: 'active',
    billing_period: 'monthly',
  });

  // Mock getUsage to return 85% usage
  subscriptionService.getUsage = async () => ({
    requests_made: 850,
    requests_limit: 1000,
    usage_percentage: 85,
    remaining_requests: 150,
  });

  const result = await subscriptionService.canMakeRequest();

  assertTrue(result.allowed, 'Approaching limit should still be allowed');
  assertTrue(result.warning, 'Warning flag should be set');
  assertTrue(result.message.includes('85'), 'Message should include usage percentage');
});

test('SubscriptionService canMakeRequest allows enterprise tier', async () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  // Mock getCurrentSubscription to return enterprise tier
  subscriptionService.getCurrentSubscription = async () => ({
    tier: 'enterprise',
    status: 'active',
    billing_period: null,
  });

  const result = await subscriptionService.canMakeRequest();

  assertTrue(result.allowed, 'Enterprise tier should be allowed');
  assertEqual(result.subscription.tier, 'enterprise', 'Subscription tier should be enterprise');
});

test('SubscriptionService canMakeRequest fails open on error', async () => {
  const mockGateway = {
    config: {
      gatewayUrl: 'https://api.test.com',
      apiKey: 'test-key',
    },
  };

  const subscriptionService = new SubscriptionService(mockGateway);

  // Mock getCurrentSubscription to throw error
  subscriptionService.getCurrentSubscription = async () => {
    throw new Error('Network error');
  };

  const result = await subscriptionService.canMakeRequest();

  assertTrue(result.allowed, 'Should fail open and allow request');
  assertTrue(result.error, 'Error flag should be set');
  assertTrue(
    result.message.includes('Unable to verify'),
    'Message should indicate verification failure'
  );
});
