import React from "react";
import TabPage from "./[tabId]";
import { GetStaticProps } from "next";
import { getAllPages, Page } from "../../libs/pagesAPI";
import { Activity } from "../../libs/activitiesAPI";
import { SetInterface } from "../../libs/setsAPI";
import { getPageActivities, PageSetActivity } from "../../libs/pageActivitiesAPI";
import PropTypes from "prop-types";

/**
 * Root page (which is essentially the TabPage for the first tab)
 */
const IndexPage: React.FC<{ page?: Page; allPages?: Page[]; allSets?: PageSetActivity[]; }> = ({
  page,
  allPages,
  allSets,
}) => {
  return <TabPage page={page} allPages={allPages} allSets={allSets}></TabPage>;
};
IndexPage.propTypes = {
  page: PropTypes.any,
  allPages: PropTypes.arrayOf(PropTypes.any),
  allSets: PropTypes.arrayOf(PropTypes.any),
};
export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const tabs = await getAllPages();

  return {
    props: {
      page: tabs.length > 0 ? tabs[0] : undefined,
      allPages: tabs,
    },
  };
};
