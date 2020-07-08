/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Container } from "react-bootstrap";
import Head from "next/head";

// custom components
import { Set } from "../../common/Set";
import { Navbar } from "../../common/Navbar";
import PropTypes from "prop-types";
import { useActiveUser, UserCurrentStatus } from "../../common/UserProvider";
import { set2Info } from "../../libs";
import {
  CustomHeader,
  EventsBlueWrapper,
  ColorSpan,
  NavPillsContainer,
  NavPills,
  NavItem,
} from "../../common/Misc";

import { getActivityByName, getAllActivities, Activity } from "../../libs/activitiesAPI";
import { getPageSets, getAllSets, SetInterface } from "../../libs/setsAPI";
import { getPageActivities, PageSetActivity } from "../../libs/pageActivitiesAPI";
import { GetStaticProps, GetStaticPaths } from "next";
import { getAllPages, getPageByName, Page } from "../../libs/pagesAPI";

interface IndexPageProps {
  page?: Page;
  allPages?: Page[];
  allSets?: PageSetActivity[];
}

/**
 * This page is for any of the tabs on the main page
 */
const TabPage: React.FC<IndexPageProps> = ({ page, allPages, allSets }) => {
  const { user, status } = useActiveUser();
  return (
    <>
      <Head>
        <title>Events - TAMU Datathon</title>
      </Head>
      <Navbar></Navbar>
      <Container className="pt-5">
        <CustomHeader>
          <ColorSpan>Events and Workshops</ColorSpan>
        </CustomHeader>
      </Container>

      <NavPillsContainer>
        <NavPills activeKey={`/events/${page?.id}`}>
          {allPages?.map((p) => (
            <NavItem href="/events/[tabId]" as={`/events/${p.id}`} key={p.id}>
              {p.name}
            </NavItem>
          ))}
        </NavPills>
      </NavPillsContainer>

      <EventsBlueWrapper>
        {allSets?.map((p) => (
          <Container className="pt-4">
            <Set info={p}></Set>
          </Container>
        ))}
      </EventsBlueWrapper>

      <Container className="pt-5">
        <p>User Status: {status}</p>
        <p>Returned User:</p>
        <pre>{JSON.stringify(user, null, 4)}</pre>
        {status == UserCurrentStatus.LoggedOut && (
          <p>
            Looks like you are not logged in.{" "}
            <a href="/auth/login?r=/events">Click here to login</a>
          </p>
        )}
      </Container>
    </>
  );
};

TabPage.propTypes = {
  page: PropTypes.any,
  allPages: PropTypes.arrayOf(PropTypes.any),
  allSets: PropTypes.arrayOf(PropTypes.any),
};

export default TabPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tabId = (params ? params.tabId : "") as string;
  const page = await getPageByName(tabId);
  const allPages = await getAllPages();
  const allSets = await getPageActivities(tabId);
  console.log("finished call");
  return {
    props: {
      page,
      allPages,
      allSets,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tabs = await getAllPages();

  return {
    paths: tabs.map((tab) => ({
      params: {
        tabId: tab.id,
      },
    })),
    fallback: false,
  };
};
