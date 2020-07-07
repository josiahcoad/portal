import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { getSetByName } from "./setsAPI";

const activityDirectory = join(process.cwd(), "db/activities");

/**
 * @returns {Promise<string[]>} names of files in activityDirectory path
 */
export async function getActivityNames(): Promise<string[]> {
  return fs.promises.readdir(activityDirectory);
}

export interface Activity {
  name: string;
  id: string;
  startTime: Date;
  endTime: Date;
  mediaType: "meeting_url" | "embed_url";
  mediaLink: string;
  thumbnail: string;
  presenter: string;
  priority: number;
  relatedActivities: string[];
  content: string;
}

/**
 * Returns contents of an activity file in activityDirectory as JSON
 * @param {string} page ID of the activity (filename without .md)
 * @returns {Promise<Activity>}
 */
export async function getActivityByName(page: string): Promise<Activity> {
  const realPage = page.replace(/\.md$/, "");
  const fullPath = join(activityDirectory, `${realPage}.md`);
  const fileContents = await fs.promises.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, content } as Activity;
}

/**
 * @returns {Promise<Activity[]>} list of contents of the activitiy files in the activityDirectory path
 */
export async function getAllActivities(): Promise<Activity[]> {
  const activityNames = await getActivityNames();
  const pages = activityNames.map((page) => getActivityByName(page));
  return Promise.all(pages);
}

/**
 * @param {string} setName Name of the set you want the activities for.
 * @returns {Promise<Activity[]>} list of contents of the activities listed in the set yaml
 */
export async function getActivitiesBySet(setName: string): Promise<Activity[]> {
  const setData = await getSetByName(setName);
  const activities = setData.activityList.map((activity) => getActivityByName(activity));

  return Promise.all(activities);
}
