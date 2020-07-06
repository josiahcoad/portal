import { NextApiRequest, NextApiResponse } from "next";
import { authenticatedRoute } from "../../../libs/middleware";
import { User } from "../../../common/UserProvider";
import { getBaseUrl, authenticatedFetch } from "../../../libs";
import { getActivityByName } from "../../../libs/activitiesAPI";

const joinEventHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
): Promise<void> => {
  const { eventId, mediaLink } = await getActivityByName(
    req.query.activityId as string
  );

  const payload = {
    eventId,
    userAuthId: user.authId,
  };

  await authenticatedFetch(`${getBaseUrl(req)}/auth/attended`, req, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Gatekeeper-Integration": process.env
        .GATEKEEPER_INTEGRATION_SECRET as string,
      "Content-Type": "application/json",
    },
  });

  return res
    .writeHead(302, {
      Location: mediaLink,
    })
    .end();
};

export default authenticatedRoute(joinEventHandler);
