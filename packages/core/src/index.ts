import contentstack, { Entry, StackConfig } from "@contentstack/delivery-sdk";
// CORE
export interface FeatureFlag {
  flaguid: string;
  enabled: boolean;
  defaultValue?: string;
}

export interface FeatureFlagEntry extends Entry {
  flags: FeatureFlag[];
}

export const featureFlagsMap: Map<string, FeatureFlag> = new Map();

export const initializeFeatureFlags = (featureFlags: FeatureFlag[]) => {
  featureFlags.forEach((flag) => {
    featureFlagsMap.set(flag.flaguid, flag);
  });
  return featureFlagsMap;
}

export const isFeatureEnabled = (featureFlagUID: string) => {
  const flag = featureFlagsMap.get(featureFlagUID);
  if (!flag) {
    return false;
  }
  return flag.enabled;
}

// FETCH FEATURE FLAGS
export interface FetchFeatureFlagsConfig extends StackConfig {
  contentTypeUid: string;
  variantParam?: string;
}

export const fetchFeatureFlags = async (config: FetchFeatureFlagsConfig) => {
  const stack = contentstack.stack(config);
  const entryQuery = stack.contentType(config.contentTypeUid).entry();
  if (config.variantParam) {
    entryQuery.variants(config.variantParam);
  }
  const { entries } = await entryQuery.query().limit(1).find<FeatureFlagEntry>();
  if (!entries || entries.length === 0) {
    return [];
  }
  return entries[0].flags;
}