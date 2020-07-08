import fs from "fs";
import { join } from "path";
import yaml from "js-yaml";
import { getPageByName } from "./pagesAPI";

const setDirectory = join(process.cwd(), "db/sets");

/**
 * @returns {Promise<string[]>} names of files in setDirectory path
 */
export async function getSetNames(): Promise<string[]> {
  return fs.promises.readdir(setDirectory);
}

export interface SetInterface {
  name: string;
  id: string;
  description: string;
  showMoreState: boolean;
  orderBy: "alphabetical" | "priority" | "start_time" | "none" | "";
  priority: number;
  activityList: string[];
}

/**
 * Returns contents of a set file in setDirectory as JSON
 * @param {string} set ID of the set (filename without .yaml)
 * @returns {Promise<SetInterface>}
 */
export async function getSetByName(setName: string): Promise<SetInterface> {
  const realSet = setName.replace(/\.yaml$/, "");
  const fullPath = join(setDirectory, `${realSet}.yaml`);
  const fileContents = await fs.promises.readFile(fullPath, "utf8");
  const data = yaml.safeLoad(fileContents);
  
  return data as SetInterface;
}

/**
 * @returns {Promise<SetInterface[]>} list of contents of the set files in setDirectory
 */
export async function getAllSets(): Promise<SetInterface[]> {
  const setNames = await getSetNames();
  const sets = setNames.map((set) => getSetByName(set));
  return Promise.all(sets);
}

/**
 * @param {string} pageName Name of the page you want the sets for.
 * @returns {Promise<SetInterface[]>} list of contents of the sets listed in the page yaml
 */
export async function getPageSets(pageName: string): Promise<SetInterface[]> {
  const pageData = await getPageByName(pageName);
  const sets = pageData.sets.map((set) => getSetByName(set));

  return Promise.all(sets);
}
