import type { LiveClass } from "@/lib/types";

type LiveClassLinkInput = Pick<LiveClass, "id" | "title" | "startsAt" | "durationMinutes" | "provider">;

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function internalClassroomUrl(input: LiveClassLinkInput) {
  const params = input.provider === "webrtc" ? "" : `?provider=${input.provider}`;
  return `/classroom/${input.id}${params}`;
}

async function fetchZoomJoinUrl(input: LiveClassLinkInput) {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    return internalClassroomUrl(input);
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenResponse = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
    method: "POST",
    headers: {
      authorization: `Basic ${credentials}`,
    },
  });

  if (!tokenResponse.ok) {
    throw new Error(`Zoom OAuth failed: ${await tokenResponse.text()}`);
  }

  const tokenData = (await tokenResponse.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error("Zoom OAuth did not return an access token");
  }

  const meetingResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokenData.access_token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      topic: input.title,
      type: 2,
      start_time: input.startsAt,
      duration: input.durationMinutes,
      settings: {
        join_before_host: false,
        waiting_room: true,
      },
    }),
  });

  if (!meetingResponse.ok) {
    throw new Error(`Zoom meeting creation failed: ${await meetingResponse.text()}`);
  }

  const meeting = (await meetingResponse.json()) as { join_url?: string };
  if (!meeting.join_url) {
    throw new Error("Zoom meeting creation did not return a join URL");
  }

  return meeting.join_url;
}

async function fetchGoogleMeetJoinUrl(input: LiveClassLinkInput) {
  const clientId = process.env.GOOGLE_MEET_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_MEET_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_MEET_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return internalClassroomUrl(input);
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Google OAuth failed: ${await tokenResponse.text()}`);
  }

  const tokenData = (await tokenResponse.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error("Google OAuth did not return an access token");
  }

  const startsAt = new Date(input.startsAt);
  const calendarId = encodeURIComponent(process.env.GOOGLE_MEET_CALENDAR_ID ?? "primary");
  const eventResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokenData.access_token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      summary: input.title,
      start: { dateTime: startsAt.toISOString() },
      end: { dateTime: addMinutes(startsAt, input.durationMinutes).toISOString() },
      conferenceData: {
        createRequest: {
          requestId: input.id,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  });

  if (!eventResponse.ok) {
    throw new Error(`Google Meet event creation failed: ${await eventResponse.text()}`);
  }

  const event = (await eventResponse.json()) as { hangoutLink?: string };
  if (!event.hangoutLink) {
    throw new Error("Google Calendar did not return a Meet link");
  }

  return event.hangoutLink;
}

export async function createLiveClassJoinUrl(input: LiveClassLinkInput) {
  if (input.provider === "zoom") return fetchZoomJoinUrl(input);
  if (input.provider === "google-meet") return fetchGoogleMeetJoinUrl(input);
  return internalClassroomUrl(input);
}
