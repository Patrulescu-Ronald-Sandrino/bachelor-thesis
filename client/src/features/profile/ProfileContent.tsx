import { useSearchParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import { AboutTab } from './tabs/AboutTab.tsx';
import { FriendsTab } from './tabs/FriendsTab.tsx';
import { CollectionsTab } from './tabs/CollectionsTab.tsx';
import CreatedAttractionsTab from './tabs/CreatedAttractionsTab.tsx';

const TAB_TYPES = [
  'about',
  'friends',
  'collections',
  'created-attractions',
] as const;
type TAB_TYPE = (typeof TAB_TYPES)[number];

const tabs: {
  [key in TAB_TYPE]: { name: string; component: React.JSX.Element };
} = {
  about: { name: 'About', component: <AboutTab /> },
  friends: { name: 'Friends', component: <FriendsTab /> },
  collections: { name: 'Collections', component: <CollectionsTab /> },
  'created-attractions': {
    name: 'Created attractions',
    component: <CreatedAttractionsTab />,
  },
};
const defaultTab = 'about' as TAB_TYPE;

const tabParamName = 'tab';

export default function ProfileContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the current tab from query params
  const currentTab = (searchParams.get(tabParamName) || defaultTab) as TAB_TYPE;

  // Handle tab change
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue });
  };

  useEffect(() => {
    // Update the URL if no tab is present
    if (!searchParams.get(tabParamName)) {
      setSearchParams({ tab: defaultTab });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Paper>
      <Tabs value={currentTab} onChange={handleChange} role="navigation">
        {TAB_TYPES.map((tabType) => (
          <Tab label={tabs[tabType].name} value={tabType} key={tabType} />
        ))}
      </Tabs>

      <Box sx={{ p: 2 }}>{tabs[currentTab].component}</Box>
    </Paper>
  );
}
