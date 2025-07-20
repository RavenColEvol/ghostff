import { FeatureFlag, fetchFeatureFlags as fetchFeatureFlagsInternal, FetchFeatureFlagsConfig, initializeFeatureFlags, isFeatureEnabled } from "@ghostff/core";
import React from "react";
import { create } from "zustand";

const useStore = create<{
  flags: FeatureFlag[];
  setFlags: (flags: FeatureFlag[]) => void;
}>((set) => ({
  flags: [],
  setFlags: (flags: FeatureFlag[]) => set({ flags }),
}));

export const setDefaultFlags = (flags: FeatureFlag[]) => {
  initializeFeatureFlags(flags);
  useStore.setState({ flags });
}

interface FeatureEnabledProps {
  uid: string;
  children: React.ReactNode;
}
export const FeatureEnabled = ({
  uid,
  children,
}: FeatureEnabledProps) => {
  useStore((state) => state.flags); // This will trigger a re-render when the flags change
  const isEnabled = isFeatureEnabled(uid); 
  return isEnabled ? children : null;
}


export const fetchFeatureFlags = async (config: FetchFeatureFlagsConfig) => {
  try {
    const flags = await fetchFeatureFlagsInternal(config);
    initializeFeatureFlags(flags);
    useStore.setState({ flags });
  } catch (error) {
    console.error('Error fetching feature flags', error);
  }
}