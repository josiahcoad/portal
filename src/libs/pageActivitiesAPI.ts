import { getActivitiesBySet, Activity } from "./activitiesAPI";
import { getPageSets, SetInterface } from "./setsAPI";

export interface PageSetActivity {
    eventList: { event: Activity }[],
    sectionTitle: string,
    sectionDescription: string,
    defaultShowMoreState: boolean
}

export async function getPageActivities(pageName: string): Promise<PageSetActivity[]> {
    const pageSets = await getPageSets(pageName);
    const activities = pageSets.map(
        async function (set) {
            const acts = await getActivitiesBySet(set.id);
            const actsList = acts.map(function (sett) {
                return { event: sett };
            });
            const testobj: PageSetActivity = {
                eventList: actsList,
                sectionTitle: set.name,
                sectionDescription: set.description,
                defaultShowMoreState: set.showMoreState
            };
            return testobj;
        }
    );
    return Promise.all(activities);
}