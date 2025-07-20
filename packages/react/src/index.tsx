import React from "react";
import { 
  FeatureFlag, 
  fetchFeatureFlags as fetchFeatureFlagsInternal, 
  FetchFeatureFlagsConfig, 
  initializeFeatureFlags, 
  isFeatureEnabled 
} from "@lamkoti/ghostff-core";
import { create } from "zustand";

const useStore = create<{
  flags: FeatureFlag[];
}>((set) => ({
  flags: [],
}));

const setDefaultFlags = (flags: FeatureFlag[]) => {
  initializeFeatureFlags(flags);
  useStore.setState({ flags });
}

interface FeatureEnabledProps {
  uid: string;
  children: React.ReactNode;
}
const FeatureEnabled = ({
  uid,
  children,
}: FeatureEnabledProps) => {
  useStore((state) => state.flags); // This will trigger a re-render when the flags change
  const isEnabled = isFeatureEnabled(uid); 
  return isEnabled ? children : null;
}


const fetchFeatureFlags = async (config: FetchFeatureFlagsConfig) => {
  try {
    const flags = await fetchFeatureFlagsInternal(config);
    initializeFeatureFlags(flags);
    useStore.setState({ flags });
  } catch (error) {
    console.error('Error fetching feature flags', error);
  }
}

export {
  FeatureEnabled,
  fetchFeatureFlags,
  setDefaultFlags,
  isFeatureEnabled,
}