import { getActivitiesBySet, Activity } from "./activitiesAPI";
import { getPageSets, SetInterface } from "./setsAPI";

export interface PageSetActivity {
    setInfo: SetInterface,
    eventList: Activity[]
}

export async function getPageActivities(pageName: string): Promise<PageSetActivity[]> {
    // const result: Array<PageSetActivity> = [];
    const pageSets = await getPageSets(pageName);
    const activities = pageSets.map(
        async function (set) {
            const acts = await getActivitiesBySet(set.id);
            const testobj: PageSetActivity = {
                setInfo: set,
                eventList: acts
            };
            console.log("pushed");
            return testobj;
        }
    );
    return Promise.all(activities);
}